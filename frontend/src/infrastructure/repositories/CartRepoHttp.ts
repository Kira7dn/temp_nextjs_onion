// src/infrastructure/repositories/CartRepoHttp.ts
import { ICartRepository } from '@application/interfaces/CartRepository';
import { Cart } from '@domain/entities/Cart';

// Giả lập database với in-memory storage (Map)
class InMemoryCartDB {
  private static data: Map<string, string> = new Map();

  static get(userId: string): Cart | null {
    const json = this.data.get(userId);
    if (!json) return null;
    try {
      const cart = new Cart();
      JSON.parse(json).forEach((i: any) => cart.addItem(i.productId, i.quantity));
      return cart;
    } catch (error) {
      console.error('Error parsing cart data:', error);
      return null;
    }
  }

  static set(userId: string, cart: Cart): void {
    this.data.set(userId, JSON.stringify(cart.getItems()));
  }
}

export class CartRepoHttp implements ICartRepository {
  async load(userId: string): Promise<Cart | null> {
    // Thay fetch bằng direct DB access
    return InMemoryCartDB.get(userId);
  }

  async save(userId: string, cart: Cart): Promise<void> {
    // Thay fetch bằng direct DB access
    InMemoryCartDB.set(userId, cart);
    console.log('Cart saved:', cart.getItems()[cart.getItems().length - 1].productId);
  }
}
