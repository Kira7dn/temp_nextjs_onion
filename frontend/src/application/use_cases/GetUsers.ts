// src/application/use_cases/GetUsers.ts
import { IUserRepository } from "@application/interfaces/UserRepository";
import { User } from "@domain/entities/User";

export class GetUsers {
  constructor(private repo: IUserRepository) {}

  async execute(): Promise<User[]> {
    // Giả lập get all users (thực tế có method getAll)
    return await Promise.all([
      this.repo.findByEmail('user@example.com'),
      this.repo.findByEmail('admin@example.com')
    ]).then(results => results.filter(Boolean) as User[]);
  }
}
