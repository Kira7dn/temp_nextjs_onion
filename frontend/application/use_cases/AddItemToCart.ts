// src/application/use_cases/AddItemToCart.ts
import { ICartRepository } from "@application/interfaces/CartRepository";
import { Cart } from "@domain/entities/Cart";

export class AddItemToCart {
  constructor(private repo: ICartRepository) {}

  async execute(
    userId: string,
    productId: string,
    qty = 1
  ) {
    const cart =
      (await this.repo.load(userId)) ?? new Cart();
    cart.addItem(productId, qty);
    await this.repo.save(userId, cart);
    return cart.getItems();
  }
}
