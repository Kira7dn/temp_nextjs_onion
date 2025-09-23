// src/presentation/dependency/cart.ts
import { ICartRepository } from '@application/interfaces/CartRepository';
import { AddItemToCart } from '@application/use_cases/AddItemToCart';
import { GetCart } from '@application/use_cases/GetCart';
import { CartRepoHttp } from '@infrastructure/repositories/CartRepoHttp';

// Singleton cart repo
let cartRepo: ICartRepository;

function getCartRepo(): ICartRepository {
  if (!cartRepo) {
    cartRepo = new CartRepoHttp();
  }
  return cartRepo;
}

// Factory functions for cart domain
export function createAddItemToCart(): AddItemToCart {
  return new AddItemToCart(getCartRepo());
}

export function createGetCart(): GetCart {
  return new GetCart(getCartRepo());
}
