'use client';

import { FormEvent, useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState({ lat: 0, long: 0 });
  const { data: session } = useSession();

  const router = useRouter();

  if (session) {
    /**
     * If session is already present
     */
    router.push('/user/home');
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, long: longitude });
        },
        (error) => {
          alert(error.message);
        }
      );
    } else {
      alert('Geolocation not supported by this browser');
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // if (location.lat == 0) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, long: longitude });
        /**
         * handle signup api call here
         */
        const response = await fetch('/api/signup', {
          method: 'POST',
          body: JSON.stringify({
            /**
             * Send answer to the offer guy
             */
            location: JSON.stringify({
              lat: latitude,
              long: longitude,
            }),
            name,
            email,
            password,
          }),
        });
        const res = await response.json();
        if (!res?.error) {
          router.push('/login');
          return;
        }
      },
      (error) => {
        alert(error.message);
      }
    );
    // }
  };

  useEffect(() => {
    document.title = 'Omegle Like | Sign In';
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
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
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
              Sign Up
            </button>
            <div className="mt-4 text-center">
              <p className="space-y-2">
                Have an account?{' '}
                <Link href={'/login'} className="text-blue-400 underline">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
