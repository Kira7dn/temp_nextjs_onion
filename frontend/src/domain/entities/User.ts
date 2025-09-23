// src/domain/entities/User.ts
export interface User {
  id: string;
  email: string;
  name: string;
}

export class UserEntity implements User {
  constructor(
    public id: string,
    public email: string,
    public name: string
  ) {}
}
