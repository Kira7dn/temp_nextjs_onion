// src/presentation/components/AddToCartButton.tsx
'use client';
import { Button } from '@shared/ui/button';
import { useAddToCart } from '@presentation/hooks/useAddToCart';

export function AddToCartButton({ userId, productId }: { userId: string; productId: string }) {
  const { addToCart, loading } = useAddToCart(userId);
  return (
    <Button onClick={() => addToCart(productId)} disabled={loading} variant="default" size="sm">
      {loading ? 'Adding...' : 'Add to cart'}
    </Button>
  );
}
