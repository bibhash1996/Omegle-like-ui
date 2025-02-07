'use client';

import { FormEvent, useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { data: session } = useSession();

  const router = useRouter();

  if (session) {
    /**
     * If session is already present
     */
    router.push(`/user/${(session?.user as any).id}/home`);
  }

  //   useEffect(() => {
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           console.log('Post : ', position);
  //           const { latitude, longitude } = position.coords;
  //           setLocation({ lat: latitude, long: longitude });
  //         },
  //         (error) => {
  //           alert(error.message);
  //         }
  //       );
  //     } else {
  //       alert('Geolocation not supported by this browser');
  //     }
  //   }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const response = await signIn('credentials', {
      email: email,
      password: password,
      redirect: false,
    });
    if (!response?.error) {
      router.push(`/user/${(session?.user as any).id}/home`);
      return;
    }
  };

  useEffect(() => {
    document.title = 'Proximeet | Sign In';
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 flex items-center justify-center h-full bg-black bg-opacity-50">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-md w-80"
          >
            <h2 className="text-2xl font-bold mb-4">Log In</h2>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Your Email
              </label>
              <input
                type="email"
                id="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            >
              Log In
            </button>
            <div className="mt-4 text-center">
              <p className="space-y-2">
                Don't have an account?{' '}
                <Link href={'/signup'} className="text-blue-400 underline">
                  Create one
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
