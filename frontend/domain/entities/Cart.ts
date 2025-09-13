// src/domain/entities/Cart.ts
export type CartItem = {
  productId: string;
  quantity: number;
};

export class Cart {
  private items: Map<string, CartItem> = new Map();

  addItem(productId: string, qty = 1) {
    if (qty <= 0)
      throw new Error("Quantity must be positive");
    const existing = this.items.get(productId);
    if (existing) existing.quantity += qty;
    else
      this.items.set(productId, {
        productId,
        quantity: qty,
      });
  }

  getItems() {
    return Array.from(this.items.values());
  }
}
