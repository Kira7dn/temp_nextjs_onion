// src/presentation/hooks/useCart.ts
'use client';
import { useEffect, useOptimistic, useState, useTransition } from 'react';
import { createAddItemToCart, createGetCart } from '@presentation/dependency/cart';
import { CartItem } from '@domain/entities/Cart';

export function useCart(userId: string) {
  const [, startTransition] = useTransition();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [optimisticCart, addOptimistic] = useOptimistic(cart, (currentCart, newItem: CartItem) => {
    const existingIndex = currentCart.findIndex(item => item.productId === newItem.productId);
    if (existingIndex >= 0) {
      const updated = [...currentCart];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + newItem.quantity,
      };
      return updated;
    } else {
      return [...currentCart, newItem];
    }
  });

  // Load initial cart once
  useEffect(() => {
    if (cart.length === 0) {
      const getCartUseCase = createGetCart();
      getCartUseCase.execute(userId).then(setCart);
    }
  }, [userId, cart.length]);

  // Optimistic add to cart
  const addToCart = async (formData: FormData) => {
    const productId = formData.get('productId') as string;
    const qty = parseInt(formData.get('qty') as string) || 1;
    const newItem = { productId, quantity: qty };

    // Update optimistic UI ngay lập tức
    startTransition(() => {
      addOptimistic(newItem);
    });

    try {
      // Execute use case
      const useCase = createAddItemToCart();
      await useCase.execute(userId, productId, qty);

      // Update real state sau khi thành công
      const getCartUseCase = createGetCart();
      const updatedCart = await getCartUseCase.execute(userId);
      setCart(updatedCart);
    } catch (error) {
      // useOptimistic tự động revert về cart cũ
      console.error('❌ Add to cart failed:', error);
      throw error;
    }
  };

  return {
    cart: optimisticCart,
    addToCart,
  };
}
