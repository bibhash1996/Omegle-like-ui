'use client';

import { FormEvent, useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [username, setUsername] = useState<string>('');
  const [location, setLocation] = useState({ lat: 0, long: 0 });
  const { data: session } = useSession();

  const router = useRouter();

  console.log(session);
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
          console.log('Post : ', position);
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
        console.log('Post : ', position);
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, long: longitude });
        const response = await signIn('credentials', {
          email: username,
          location: JSON.stringify({
            lat: latitude,
            long: longitude,
          }),
          redirect: false,
        });
        if (!response?.error) {
          router.push('/user/home');
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
                You name
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
