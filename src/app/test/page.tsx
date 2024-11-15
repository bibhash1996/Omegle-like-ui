'use client';

import { useSession } from 'next-auth/react';

const TestLoggedInPage = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading bro .....</p>;
  }

  if (!session) {
    return <p>Login karle</p>;
  }
  return <p>Logged in user . {(session as any).accessToken}</p>;
};

export default TestLoggedInPage;
