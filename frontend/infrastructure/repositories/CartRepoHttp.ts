// src/infrastructure/repositories/CartRepoHttp.ts
import { ICartRepository } from "@application/interfaces/CartRepository";
import { Cart } from "@domain/entities/Cart";

export class CartRepoHttp implements ICartRepository {
  async load(userId: string): Promise<Cart | null> {
    const res = await fetch(`/api/cart/${userId}`, {
      cache: "no-store",
    });
    const dto = await res.json();
    const cart = new Cart();
    dto.items.forEach((i: any) =>
      cart.addItem(i.productId, i.quantity)
    );
    return cart;
  }

  async save(userId: string, cart: Cart): Promise<void> {
    await fetch(`/api/cart/${userId}`, {
      method: "POST",
      body: JSON.stringify({ items: cart.getItems() }),
    });
  }
}
