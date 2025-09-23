'use client';
import { loginServerAction } from '@application/server_actions/LoginServerAction';

export function LoginServerComponent() {
  return (
    <form action={loginServerAction}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Login (Server Action)</button>
    </form>
  );
}
