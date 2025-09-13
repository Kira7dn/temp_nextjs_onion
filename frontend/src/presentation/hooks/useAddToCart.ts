// src/presentation/hooks/useAddToCart.ts
"use client";
import { useState } from "react";
import { AddItemToCart } from "@application/use_cases/AddItemToCart";
import { CartRepoHttp } from "@infrastructure/repositories/CartRepoHttp";

const useCase = new AddItemToCart(new CartRepoHttp());

export function useAddToCart(userId: string) {
  const [loading, setLoading] = useState(false);

  const addToCart = async (productId: string, qty = 1) => {
    setLoading(true);
    try {
      return await useCase.execute(userId, productId, qty);
    } finally {
      setLoading(false);
    }
  };

  return { addToCart, loading };
}
