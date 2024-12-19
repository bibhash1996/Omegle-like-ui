'use client';

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
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

export default function NavigationPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const logout = async () => {
    await signOut({
      redirect: true,
    });
  };

  return (
    <nav
      className="flex items-center justify-between p-4 bg-navbar shadow-lg"
      onClick={() => setIsOpen(false)}
    >
      <div className="text-xl font-bold ">OMEGLE LIKE</div>
      {/* <NavigationMenu>
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
      </NavigationMenu> */}

      {/* Profile Section */}
      <div className="flex items-center space-x-4">
        <Popover
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
          }}
        >
          <PopoverTrigger asChild>
            <button onClick={toggleMenu} className="relative">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="Profile Picture"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-60">
            <ul className="py-1">
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
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}
