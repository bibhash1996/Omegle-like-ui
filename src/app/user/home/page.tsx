'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import useRTCSocket from '@/hooks/useRTCSocket';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import useSound from 'use-sound';
import { getInitials } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  location: Location;
  geohash: string;
  status: string;
}
interface Location {
  lat: number;
  long: number;
}

const UserStatus = (props: { isOnline: boolean; username: string }) => {
  return (
    <div className="flex mt-2">
      <span
        className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${
          props.isOnline
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {props.isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();
  const { rtcSocket, session, status, signallingMessage } = useRTCSocket();
  const [offer, setOffer] = useState<{
    open: boolean;
    offer: any;
    fromUser: any;
  }>({
    open: false,
    offer: null,
    fromUser: null,
  });
  const [play, { pause, stop }] = useSound(
    'http://localhost:3000/sounds/call-ring.mp3'
  );

  useEffect(() => {
    // Send heartbeat every 10 seconds
    const interval = setInterval(() => {
      rtcSocket.emit('heartbeat', { active: true });
    }, 10000); // 10,000 ms = 10 seconds

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (signallingMessage && signallingMessage.type == 'offer') {
      console.log(
        'Message from backend on signal component in home : ',
        signallingMessage
      );
      const { fromUser, ...offer } = signallingMessage;
      /**
       * Modern browsers don't play
       * sound without user interaction
       */
      play();
      setOffer({
        open: true,
        offer: offer,
        fromUser,
      });
    }
    return () => {};
  }, [signallingMessage]);

  const callUser = async (user: User) => {
    /**
     * Create an offer
     */

    /**
     * Validate this later and avoid users to be able to call again and again
     * one way is whenever a user comes online give hom a random id (Think  . .. . .. )
     */
    // redirect(`/call?to=${user.id}`)
    router.push(`/call?to=${user.id}&mode=offer`);
  };

  const onCallAccept = () => {
    stop();
    localStorage.setItem(
      'signal',
      JSON.stringify({
        ...offer.offer,
        fromUser: offer.fromUser,
      })
    );

    router.push(`/call?mode=answer&from=${offer.fromUser.id}`);
  };

  const onCallReject = () => {
    stop();
    setOffer({
      open: false,
      fromUser: null,
      offer: null,
    });
  };

  useEffect(() => {
    fetch('/api/location', {
      method: 'GET',
    }).then(async (res) => {
      // console.log('Response for location');
      const users = await res.json();
      setUsers(users.users);
    });
  }, []);

  return (
    <div className="w-screen flex flex-row flex-wrap p-10">
      {users.map((user) => (
        <Card className="w-[250px] mr-10 mb-10" key={user.id}>
          <CardHeader className="flex flex-row justify-between bg-red-50 ">
            <div className="flex flex-col justify-center items-center w-full">
              <CardTitle>{user.name}</CardTitle>
              <UserStatus isOnline={true} username="bibhash" />
            </div>
            {/* <Avatar>
              <AvatarImage
                src="https://github.com/shdcn.png"
                alt="Profile Picture"
              />
              <AvatarFallback className=" text-black bg-gray-300 ">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar> */}
          </CardHeader>
          <CardContent className="mt-4 flex flex-row justify-between align-top">
            <Avatar>
              <AvatarImage
                src="https://github.com/shdcn.png"
                alt="Profile Picture"
              />
              <AvatarFallback className=" text-black bg-gray-300 ">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://github.com/shdcn.png"
                alt="Profile Picture"
              />
            </Avatar>
            <Button
              onClick={() => {
                callUser(user);
              }}
              className="bg-green-300 text-black"
            >
              Call
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Received call */}
      <AlertDialog open={offer.open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {offer?.fromUser?.name} calling ☏ ☏
            </AlertDialogTitle>
            <AlertDialogDescription>
              Receiving call from {offer?.fromUser?.name}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-red-700 text-white font-bold hover:bg-red-500 hover:text-white"
              onClick={onCallReject}
            >
              REJECT ❌
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 text-white font-bold hover:bg-green-500 hover:text-white"
              onClick={onCallAccept}
            >
              ACCEPT 📞
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
