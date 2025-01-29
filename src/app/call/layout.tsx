'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import Loading from '@/components/loading';
import { useRouter } from 'next/navigation';
import NavigationPanel from '@/components/navigationPanel';

export default function Home(props: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <Loading />;
  }

  if (!session) {
    return router.push('/signup');
  }

  return (
    <div className="flex flex-col h-screen ">
      <NavigationPanel />
      <div className="flex-1  bg-black">{props.children}</div>
    </div>
  );
}
