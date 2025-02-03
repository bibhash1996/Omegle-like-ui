'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';

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
