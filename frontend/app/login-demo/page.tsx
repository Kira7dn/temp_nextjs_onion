import { LoginComponent } from '@presentation/components/LoginComponent';
import { LoginServerComponent } from '@presentation/components/LoginServerComponent';
import { UserListServerComponent } from '@presentation/components/UserListServerComponent';

export default function LoginDemoPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Demo Login Examples</h1>

      <section className="mb-8">
        <h2 className="text-xl mb-2">Login với Hook (Client)</h2>
        <LoginComponent />
      </section>

      <section className="mb-8">
        <h2 className="text-xl mb-2">Login với Server Action (Form)</h2>
        <LoginServerComponent />
        <p className="text-sm text-gray-600 mt-2">
          Test credentials: user@example.com / password or admin@example.com / password
        </p>
      </section>

      <section>
        <UserListServerComponent />
      </section>
    </div>
  );
}
