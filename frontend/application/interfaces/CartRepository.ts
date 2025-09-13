// src/application/interfaces/CartRepository.ts
import { Cart } from "@domain/entities/Cart";

export interface ICartRepository {
  load(userId: string): Promise<Cart | null>;
  save(userId: string, cart: Cart): Promise<void>;
}
