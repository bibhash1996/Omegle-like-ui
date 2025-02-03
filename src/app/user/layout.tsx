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
    <div>
      <NavigationPanel id={(session.user as any).id} />
      <div className="body">{props.children}</div>
    </div>
  );
}
