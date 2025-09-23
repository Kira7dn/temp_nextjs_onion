// src/presentation/hooks/useLogin.ts
"use client";
import { useState } from "react";
import { createAuthenticateUser } from '@presentation/dependency/auth';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const useCase = createAuthenticateUser();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      return await useCase.execute(email, password);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}
