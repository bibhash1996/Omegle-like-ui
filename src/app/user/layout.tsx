'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession, signOut } from 'next-auth/react';
import Loading from '@/components/loading';
import { useRouter } from 'next/navigation';

export default function Home(props: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <Loading />;
  }

  if (!session) {
    return router.push('/signup');
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const logout = async () => {
    await signOut({
      redirect: true,
    });
  };

  return (
    <div>
      <nav className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="text-xl font-bold">Omegle Like</div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Option 1</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>Link</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Option 2
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Option 3
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Profile Section */}
        <div className="flex items-center space-x-4">
          <button onClick={toggleMenu} className="relative">
            <Avatar>
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="Profile Picture"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
                <ul className="py-2">
                  <li onClick={() => {}}>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Profile
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Settings
                    </a>
                  </li>
                  <li onClick={logout}>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </button>
        </div>
      </nav>
      <div className="body">{props.children}</div>
    </div>
  );
}
