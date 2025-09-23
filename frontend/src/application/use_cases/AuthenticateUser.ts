// src/application/use_cases/AuthenticateUser.ts
import { IUserRepository } from "@application/interfaces/UserRepository";
import { User } from "@domain/entities/User";

export class AuthenticateUser {
  constructor(private repo: IUserRepository) {}

  async execute(email: string, password: string): Promise<User | null> {
    // Giả lập check password (thực tế hash & compare)
    const user = await this.repo.findByEmail(email);
    if (user && password === "password") { // Hardcoded for demo
      return user;
    }
    return null;
  }
}
