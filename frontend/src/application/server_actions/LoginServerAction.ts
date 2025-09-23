'use server';
import { createAuthenticateUser, createGetUsers } from '@presentation/dependency/auth';

const authenticateUseCase = createAuthenticateUser();
const getUsersUseCase = createGetUsers();

export async function loginServerAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const user = await authenticateUseCase.execute(email, password);
  if (user) {
    console.log('User logged in:', user);
  } else {
    console.log('Login failed');
  }
}

export async function getUsersServerAction() {
  return await getUsersUseCase.execute();
}
