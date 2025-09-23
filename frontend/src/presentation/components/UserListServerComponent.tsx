import { getUsersServerAction } from '@application/server_actions/LoginServerAction';

export async function UserListServerComponent() {
  const users = await getUsersServerAction();

  return (
    <div>
      <h3>Danh sách Users (Server Component với Server Action)</h3>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
