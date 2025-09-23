'use server';
import { createAddItemToCart } from '@presentation/dependency/cart';
import { CartItem } from '@domain/entities/Cart';

export async function addToCartServerAction(formData: FormData): Promise<void> {
  const userId = formData.get('userId') as string;
  const productId = formData.get('productId') as string;
  const qty = parseInt(formData.get('qty') as string) || 1;

  const useCase = createAddItemToCart();
  await useCase.execute(userId, productId, qty);

  // Dispatch custom event để client component biết update optimistic
  // Note: Server actions không thể dispatch DOM events trực tiếp
  // Client component sẽ sync với server state via re-fetch
}

export async function loadCartServerAction(userId: string): Promise<CartItem[]> {
  const useCase = createAddItemToCart();
  // Temporary: access repo directly (better to create GetCart use case)
  const repo = (useCase as any).repo;
  const cart = await repo.load(userId);
  return cart?.getItems() ?? [];
}
