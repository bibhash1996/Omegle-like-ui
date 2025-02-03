'use client';

import Loading from '@/components/loading';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function JustToRedirect() {
  const { data, status } = useSession();
  const router = useRouter();

  if (status == 'loading') {
    return <Loading />;
  }

  useEffect(() => {
    if (status == 'authenticated') {
      router.push(`/user/${(data.user as any).id}/home`);
    } else if (status == 'unauthenticated') {
      router.push('/login');
      return;
    }
  }, [data]);

  return <Loading />;
}
