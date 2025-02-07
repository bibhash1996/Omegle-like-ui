'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';

interface User {
  id: string;
  name: string;
  photo: string;
  email: string;
  designation: string;
  bio: string;
}

export async function getUserProfile(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw Error('Unauthorized access');
  }
  //   console.log('session : ', session);
  const user = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/protected/user/${id}`,
    {
      headers: {
        Authorization: `Bearer ${(session as any).accessToken}`,
      },
    }
  );

  return user.json();
}

export async function saveUserProfile(user: User) {
  const session = await getServerSession(authOptions);
  console.log('USER : ', user);
  if (!session) {
    throw Error('Unauthorized access');
  }
  const { id, ..._u } = user;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/protected/user/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        ..._u,
      }),
      headers: {
        Authorization: `Bearer ${(session as any).accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  const data = await response.json();
  return data;
}
