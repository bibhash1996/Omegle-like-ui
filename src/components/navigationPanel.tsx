'use client';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React, { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useRouter } from 'next/navigation';
import { cn, getInitials } from '@/lib/utils';
import Image from 'next/image';
import ConferenceCall from '../../public/images/conference_call.svg';
import Logo from '../../public/images/logo-name-side.png';

/***
 *
 *
 * Start
 *
 *
 */
const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Video Chat',
    href: '/docs/primitives/alert-dialog',
    description: 'Discover the Excitement of Random Video Chatting',
  },
  {
    title: 'Freee',
    href: '/docs/primitives/hover-card',
    description: 'Enjoy Limitless Conversations in Free Random Video Chat',
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description:
      'What makes us stand out among Proximeet video chat platforms?',
  },
  {
    title: 'Social',
    href: '/docs/primitives/scroll-area',
    description:
      "Meeting new people in real life can be tough, but OmeTV's free webcam chat makes it easy and flexible to connect.",
  },
  {
    title: 'Conversations',
    href: '/docs/primitives/tabs',
    description:
      'Change partners anytime, chat freely, and enjoy endless conversations.',
  },
  // {
  //   title: 'Tooltip',
  //   href: '/docs/primitives/tooltip',
  //   description:
  //     'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  // },
];

export function NavigationMenuPanel() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full text-center select-none flex-col justify-between rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <p className="text-sm leading-tight text-muted-foreground">
                      Connect with nearby people who share your interests
                      through engaging video calls using our innovative
                      platform!
                    </p>
                    <Image
                      src={ConferenceCall}
                      alt="Follow us on Twitter"
                      width={200}
                      height={200}
                    />
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="Introduction">
                Explore Free Random Video Chat with people similar interests
              </ListItem>
              <ListItem href="/docs/installation" title="Range">
                Meet New People in Free Random Webcam Chat near you.
              </ListItem>
              <ListItem
                href="/docs/primitives/typography"
                title="Social Network"
              >
                Use Proximeet to talk to strangers, make friends, and stay in
                touch on our platform's social network.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Settings</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

/***
 *
 *
 * END
 *
 */

export default function NavigationPanel(props: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const toggleMenu = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const logout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: '/login',
    });
  };

  return (
    <nav
      className="flex h-30 items-center justify-between p-4 bg-navbar shadow-lg"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="text-xl font-bold cursor-pointer"
        onClick={() => {
          router.push(`/`);
        }}
      >
        <Image src={Logo} alt="Follow us on Twitter" width={100} height={30} />
      </div>
      <NavigationMenuPanel />

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
                  src={
                    (session?.user as any).photo ||
                    'https://github.com/shadcn.png'
                  }
                  alt={(session?.user as any).name || 'Profile Picture'}
                />
                <AvatarFallback>
                  {getInitials((session?.user as any).name || 'BS')}
                </AvatarFallback>
              </Avatar>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-60">
            <ul className="py-1">
              <a
                href={`/user/${props.id}/profile`}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Profile
              </a>

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
