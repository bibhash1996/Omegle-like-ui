'use client';

import { API_SERVER_BASE_URL } from '@/app/api/const';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';

const useRTCSocket = () => {
  const { data: session, status } = useSession();
  const [signallingMessage, setSignallingMessage] = useState<{
    [key: string]: any;
  } | null>(null);

  /**
   * Fix this here
   */
  let rtcSocket: Socket = useMemo(
    () =>
      io(`${process.env.NEXT_PUBLIC_BASE_URL}/rtc`, {
        transports: ['polling', 'websocket'],
        withCredentials: true,
        extraHeaders: {
          Authorization: `Bearer ${(session as any)?.accessToken}`,
        },
        transportOptions: {
          polling: {
            extraHeaders: {
              Authorization: `Bearer ${(session as any)?.accessToken}`,
            },
          },
        },
      }),
    []
  );

  useEffect(() => {
    if (typeof window == 'undefined') return;
    if (status == 'loading' || status == 'unauthenticated') return;
    rtcSocket = io(`${process.env.NEXT_PUBLIC_BASE_URL}/rtc`, {
      transports: ['polling', 'websocket'],
      withCredentials: true,
      extraHeaders: {
        Authorization: `Bearer ${(session as any).accessToken}`,
      },
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${(session as any).accessToken}`,
          },
        },
      },
    });

    rtcSocket.on('connect', () => {
      console.log('Connected:', rtcSocket.id);
    });

    rtcSocket.on('message', (message) => {
      console.log('Message from backend  : ', message);
    });

    rtcSocket.on('signal', (message) => {
      // console.log('Message from backend on signal channel main : ', message);
      setSignallingMessage(message);
    });

    rtcSocket.on('disconnect', (rea) => {
      console.log(`Socket disconnected with reason ${rea}`);
    });

    rtcSocket.on('connect_error', (err) => {
      console.error(`Connection error due to ${err.message}`);
    });

    return () => {
      rtcSocket.off();
      rtcSocket.disconnect();
    };
  }, []);

  return { rtcSocket, session, status, signallingMessage };
};

export default useRTCSocket;
