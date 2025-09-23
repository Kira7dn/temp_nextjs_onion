import { createGetUsers } from '@presentation/dependency/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const useCase = createGetUsers();
    const users = await useCase.execute();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
