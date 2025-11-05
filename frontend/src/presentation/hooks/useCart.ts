import { useEffect } from 'react';
import { useStore } from 'zustand';
import { useCartStore } from '@application/stores/cartStore';

export function useCart(userId: string) {
  // Use currentCart from store to avoid selector issues
  const cart = useStore(useCartStore, (state) => state.currentCart);
  const {
    loadCart,
    addToCart: storeAddToCart,
    addToCartOptimistic: storeAddToCartOptimistic,
  } = useCartStore();

  // Load initial cart and sync currentCart
  useEffect(() => {
    const loadAndSetCurrent = async () => {
      await loadCart(userId);
    };
    loadAndSetCurrent();
  }, [userId, loadCart]);

  // Wrapper functions to match the old API
  const addToCartOptimistic = (formData: FormData) => storeAddToCartOptimistic(userId, formData);

  return {
    cart,
    addToCart: addToCartOptimistic, // Use optimistic version as default
    addToCartOptimistic,
  };
}
