'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { data, status } = useSession();

  useEffect(() => {
    if (status == 'loading') return;
    if (status == 'authenticated') {
      let userId = (data.user as any).id;
      router.push(`/user/${userId}/home`);
      return;
    }
    if (status == 'unauthenticated') {
      router.push('/login');
    }
  }, [status]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <p>redirect to main</p>
    </div>
  );
}
