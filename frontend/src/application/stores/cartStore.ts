'use client';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { createAddItemToCart, createGetCart } from '@presentation/dependency/cart';
import { CartItem } from '@domain/entities/Cart';

interface CartStore {
  /** Cart storage for all users */
  carts: Record<string, CartItem[]>;
  /** Current user's cart for optimized selectors */
  currentCart: CartItem[];

  // Actions
  loadCart: (userId: string) => Promise<void>;
  addToCartOptimistic: (userId: string, formData: FormData) => Promise<void>;
  addToCart: (userId: string, productId: string, qty?: number) => Promise<void>;
}

// Helper function to ensure cart is always an array
const ensureArray = (cart: unknown): CartItem[] =>
  Array.isArray(cart) ? cart : [];

// Helper function to update cart optimistically
const createOptimisticCart = (currentCart: CartItem[], productId: string, qty: number): CartItem[] => {
  const existingIndex = currentCart.findIndex(item => item.productId === productId);

  if (existingIndex >= 0) {
    const updated = [...currentCart];
    updated[existingIndex] = {
      ...updated[existingIndex],
      quantity: updated[existingIndex].quantity + qty,
    };
    return updated;
  }

  return [...currentCart, { productId, quantity: qty }];
};

export const useCartStore = create<CartStore>()(
  subscribeWithSelector((set, get) => ({
    carts: {},
    currentCart: [],

    loadCart: async (userId: string) => {
      try {
        const getCartUseCase = createGetCart();
        const cart = await getCartUseCase.execute(userId);
        const safeCart = ensureArray(cart);

        set((state) => ({
          carts: { ...state.carts, [userId]: safeCart },
          currentCart: safeCart,
        }));
      } catch (error) {
        console.error('Failed to load cart:', error);
        throw error;
      }
    },

    addToCart: async (userId: string, productId: string, qty = 1) => {
      try {
        const useCase = createAddItemToCart();
        await useCase.execute(userId, productId, qty);

        // Reload and update cart
        const getCartUseCase = createGetCart();
        const updatedCart = await getCartUseCase.execute(userId);
        const safeCart = ensureArray(updatedCart);

        set((state) => ({
          carts: { ...state.carts, [userId]: safeCart },
          currentCart: safeCart,
        }));
      } catch (error) {
        console.error('Failed to add to cart:', error);
        throw error;
      }
    },

    addToCartOptimistic: async (userId: string, formData: FormData) => {
      const productId = formData.get('productId') as string;
      const qty = parseInt(formData.get('qty') as string) || 1;

      const currentCart = get().carts[userId] || [];
      const cartSnapshot = [...currentCart];
      const optimisticCart = createOptimisticCart(currentCart, productId, qty);

      // Apply optimistic update
      set((state) => ({
        carts: { ...state.carts, [userId]: optimisticCart },
        currentCart: optimisticCart,
      }));

      try {
        const useCase = createAddItemToCart();
        await useCase.execute(userId, productId, qty);

        // Confirm with server state
        const getCartUseCase = createGetCart();
        const realCart = await getCartUseCase.execute(userId);
        const safeCart = ensureArray(realCart);

        set((state) => ({
          carts: { ...state.carts, [userId]: safeCart },
          currentCart: safeCart,
        }));
      } catch (error) {
        // Rollback on error
        set((state) => ({
          carts: { ...state.carts, [userId]: cartSnapshot },
          currentCart: cartSnapshot,
        }));
        console.error('❌ Add to cart failed:', error);
        throw error;
      }
    },
  }))
);
