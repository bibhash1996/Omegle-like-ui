'use client';

import Loading from '@/components/loading';
import VideoCallButtons from '@/components/videoCallButtons';
import useRTCSocket from '@/hooks/useRTCSocket';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

let peerconnection: RTCPeerConnection;
// peerconnection.addT

export default function Home() {
  const { rtcSocket, session, status } = useRTCSocket();
  const searchParams = useSearchParams();

  const user1Ref = useRef(null);
  const user2Ref = useRef(null);
  const rtcConnectionRef = useRef(null);
  const hostRef = useRef(false);
  const [offer, setOffer] = useState('');
  const [ringing, setRinging] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const servers = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
  };

  useEffect(() => {
    peerconnection = new RTCPeerConnection();
    hostRef.current = true;
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((localStream) => {
        (user1Ref.current as any).srcObject = localStream;
        (user2Ref.current as any).srcObject = new MediaStream();
      });
  }, []);

  const createPeerConnection = () => {
    // We create a RTC Peer Connection
    const connection = new RTCPeerConnection(servers);

    // We implement our onicecandidate method for when we received a ICE candidate from the STUN server
    connection.onicecandidate = handleICECandidateEvent;

    // We implement our onTrack method for when we receive tracks
    connection.ontrack = handleTrackEvent;
    return connection;
  };

  const initiateCall = (to: string) => {
    console.log('TO : ', to);
    // console.log("user1Ref.current : ", user1Ref.current.srcObject)
    if (hostRef.current && (user1Ref?.current as any)?.srcObject) {
      (rtcConnectionRef.current as any) = createPeerConnection();
      (rtcConnectionRef.current as any).addTrack(
        (user1Ref.current as any).srcObject.getTracks()[0],
        (user1Ref.current as any).srcObject
      );

      (rtcConnectionRef.current as any).onicecandidate = async (event: any) => {
        //Event that fires off when a new offer ICE candidate is created
        if (event.candidate) {
          console.log('ice candaite');
          setOffer(
            JSON.stringify((rtcConnectionRef.current as any).localDescription)
          );
        }
      };

      (rtcConnectionRef.current as any)
        .createOffer()
        .then(async (offer: any) => {
          (rtcConnectionRef.current as any).setLocalDescription(offer);

          /**
           * send the offer
           */
          const response = await fetch('/api/location', {
            method: 'POST',
            body: JSON.stringify({
              to: to,
              data: JSON.stringify(offer),
            }),
          });
          const res = await response.json();
          console.log('Response for signal : ', res);
        })
        .catch((error: any) => {
          console.log(error);
          alert('Error calling : ' + (error as any).message);
        });
    }
  };

  useEffect(() => {
    // console.log("SEARCH PARAMS : ", searchParams.get('to'), user1Ref.current.srcObject)
    let to = searchParams.get('to');
    if (to)
      setTimeout(() => {
        initiateCall(to);
      }, 2000);
    // Generate offer
  }, [searchParams.get('to')]);

  const handleICECandidateEvent = (e: any) => {
    if (e.candidate) {
      console.log('ICE candidate');
    }
  };

  const handleTrackEvent = (event: RTCTrackEvent) => {
    event.streams[0].getTracks().forEach((track) => {
      console.log('Tracl : ', track);
      (user2Ref.current as any).srcObject.addTrack(track);
    });
  };

  const handleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleDisconnect = () => {
    // Logic to disconnect from the video call
    console.log('Disconnected from the call');
  };

  if (status === 'loading') {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {ringing ? (
        <div className="flex justify-center items-center h-full w-full absolute left-0 top-0">
          <Avatar className="h-40 w-40">
            <AvatarImage src="https://github.com/hadcn.png" />
            <AvatarFallback className="text-3xl bg-gray-300">CN</AvatarFallback>
          </Avatar>
        </div>
      ) : null}
      <video
        id="user-2"
        ref={user2Ref}
        playsInline
        autoPlay
        className="h-full"
      ></video>

      <div className="absolute bottom-8 right-8 h-60 w-60 rounded-lg border-white border-2">
        {/* <video id='user-2' ref={user2Ref} playsInline autoPlay className=""></video> */}
        <video
          id="user-1"
          ref={user1Ref}
          playsInline
          autoPlay
          className="h-full aspect-auto"
        ></video>
      </div>

      {/* buttons */}
      <div className="absolute bottom-10 h-10 w-full rounded-lg flex justify-center">
        <VideoCallButtons
          onMute={handleMute}
          onDisconnect={handleDisconnect}
          isMuted={isMuted}
        />
      </div>
    </div>
  );
}
