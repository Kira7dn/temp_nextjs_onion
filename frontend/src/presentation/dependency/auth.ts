// src/presentation/dependency/auth.ts
import { IUserRepository } from '@application/interfaces/UserRepository';
import { AuthenticateUser } from '@application/use_cases/AuthenticateUser';
import { GetUsers } from '@application/use_cases/GetUsers';
import { UserRepoHttp } from '@infrastructure/repositories/UserRepoHttp';

// Singleton user repo
let userRepo: IUserRepository;

function getUserRepo(): IUserRepository {
  if (!userRepo) {
    userRepo = new UserRepoHttp();
  }
  return userRepo;
}

// Factory functions for auth domain
export function createAuthenticateUser(): AuthenticateUser {
  return new AuthenticateUser(getUserRepo());
}

export function createGetUsers(): GetUsers {
  return new GetUsers(getUserRepo());
}
