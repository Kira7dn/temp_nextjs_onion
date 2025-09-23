// src/infrastructure/repositories/UserRepoHttp.ts
import { IUserRepository } from "@application/interfaces/UserRepository";
import { User, UserEntity } from "@domain/entities/User";

// Giả lập database với in-memory users
class InMemoryUserDB {
  private static users: User[] = [
    new UserEntity("1", "user@example.com", "John Doe"),
    new UserEntity("2", "admin@example.com", "Admin User"),
  ];

  static findByEmail(email: string): User | null {
    return this.users.find(u => u.email === email) || null;
  }

  static save(user: User): void {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      this.users[index] = user;
    } else {
      this.users.push(user);
    }
  }
}

export class UserRepoHttp implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    // Direct DB access
    return InMemoryUserDB.findByEmail(email);
  }

  async save(user: User): Promise<void> {
    InMemoryUserDB.save(user);
  }
}
