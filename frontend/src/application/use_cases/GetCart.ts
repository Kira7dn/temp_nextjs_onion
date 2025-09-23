// src/application/use_cases/GetCart.ts
import { ICartRepository } from '@application/interfaces/CartRepository';
import { CartItem } from '@domain/entities/Cart';

export class GetCart {
  constructor(private cartRepo: ICartRepository) {}

  async execute(userId: string): Promise<CartItem[]> {
    const cart = await this.cartRepo.load(userId);
    return cart?.getItems() ?? [];
  }
}
