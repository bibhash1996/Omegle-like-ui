'use client';

import Loading from '@/components/loading';
import VideoCallButtons from '@/components/videoCallButtons';
import useRTCSocket from '@/hooks/useRTCSocket';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

let peerconnection: RTCPeerConnection;

/**
 * Decide whether this component is loaded in
 * offer mode or answer mode
 *
 * user1Ref is always the current user and user2ref is the remote user
 */
export default function Home() {
  const { session, status, signallingMessage } = useRTCSocket();
  const searchParams = useSearchParams();
  const router = useRouter();

  const user1Ref = useRef(null);
  const user2Ref = useRef(null);
  const rtcConnectionRef = useRef(null);
  const hostRef = useRef(false);
  const [offer, setOffer] = useState('');
  const [ringing, setRinging] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [mode, setMode] = useState<'OFFER' | 'ANSWER'>('OFFER');
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
    if (hostRef.current && (user1Ref?.current as any)?.srcObject) {
      (rtcConnectionRef.current as any) = createPeerConnection();
      (rtcConnectionRef.current as any).addTrack(
        (user1Ref.current as any).srcObject.getTracks()[0],
        (user1Ref.current as any).srcObject
      );

      (rtcConnectionRef.current as any).onicecandidate = async (event: any) => {
        //Event that fires off when a new offer ICE candidate is created
        if (event.candidate) {
          console.log('ice candaite : ', event.candidate);
          // setOffer(
          //   JSON.stringify((rtcConnectionRef.current as any).localDescription)
          // );
          await fetch('/api/location', {
            method: 'POST',
            body: JSON.stringify({
              /**
               * Send answer to the offer guy
               */
              to: to,
              data: JSON.stringify({
                type: 'ice-candidate',
                data: event.candidate,
              }),
            }),
          });
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
        })
        .catch((error: any) => {
          console.log(error);
          alert('Error calling : ' + (error as any).message);
        });
    }
  };

  useEffect(() => {
    let updatedMode: 'OFFER' | 'ANSWER' =
      (searchParams.get('mode') as any) || 'OFFER';
    setMode(updatedMode);

    let to = searchParams.get('to');
    let from = searchParams.get('from');
    if (to && updatedMode.toUpperCase() == 'OFFER')
      setTimeout(() => {
        // Generate offer
        initiateCall(to);
      }, 2000);
    else if (from && updatedMode.toUpperCase() == 'ANSWER') {
      // use this offer and create answer
      let offerStringified = localStorage.getItem('signal');
      if (!offerStringified) {
        console.log('OFFER NOT FOUND');
        router.push('/user/home');
        return;
      }
      let offer = JSON.parse(offerStringified);
      console.log('OFFER : ', offer);
      setTimeout(() => {
        handleReceivedOffer(offer);
      }, 2000);
      // I have the offer now
    }
  }, [searchParams.get('mode'), searchParams.get('to')]);

  useEffect(() => {
    /**
     * Handle receive answers only
     */
    console.log('Signalling message preferrably answer: ', signallingMessage);
    if (signallingMessage && signallingMessage.type == 'answer') {
      setRinging(false);
      (rtcConnectionRef as any).current
        .setRemoteDescription(signallingMessage)
        .catch((err: any) => console.log(err));
    } else if (signallingMessage && signallingMessage.type == 'ice-candidate') {
      const candidate = new RTCIceCandidate(signallingMessage.data);
      (rtcConnectionRef as any).current
        .addIceCandidate(candidate)
        .catch((e: any) => console.log(e));
    }
  }, [signallingMessage]);

  const handleICECandidateEvent = (e: any) => {
    if (e.candidate) {
      console.log('ICE candidate : ', e.candidate);
    }
  };

  const handleTrackEvent = (event: RTCTrackEvent) => {
    console.log('event track : ', event);
    event.streams[0].getTracks().forEach((track) => {
      console.log('TRACK : ', track);
      console.log(user2Ref.current as any);
      (user2Ref.current as any).srcObject.addTrack(track);
    });
    // (user2Ref.current as any).srcObject = event.streams[0];
  };

  const handleReceivedOffer = async (offer: any) => {
    if (hostRef.current) {
      (rtcConnectionRef as any).current = createPeerConnection();
      (rtcConnectionRef.current as any).addTrack(
        (user1Ref as any).current.srcObject.getTracks()[0],
        (user1Ref as any).current.srcObject
      );
      // (rtcConnectionRef.current as any).addTrack(
      //   (user1Ref as any).current.srcObject.getTracks()[1],
      //   (user1Ref as any).current.srcObject
      // );
      // rtcConnectionRef.current.addTrack(
      //     user1Ref.current.getTracks()[1],
      //     user1Ref.current,
      // );
      (rtcConnectionRef.current as any).onicecandidate = async (event: any) => {
        //Event that fires off when a new offer ICE candidate is created
        if (event.candidate) {
          console.log('ice candidate : ', event.candidate);
          // setOffer(
          //   JSON.stringify((rtcConnectionRef.current as any).localDescription)
          // );
          await fetch('/api/location', {
            method: 'POST',
            body: JSON.stringify({
              /**
               * Send answer to the offer guy
               */
              to: offer.fromUser.id,
              data: JSON.stringify({
                type: 'ice-candidate',
                data: event.candidate,
              }),
            }),
          });
        }
      };

      (rtcConnectionRef as any).current.setRemoteDescription(offer);

      (rtcConnectionRef as any).current
        .createAnswer()
        .then(async (answer: any) => {
          (rtcConnectionRef as any).current.setLocalDescription(answer);
          const response = await fetch('/api/location', {
            method: 'POST',
            body: JSON.stringify({
              /**
               * Send answer to the offer guy
               */
              to: offer.fromUser.id,
              data: JSON.stringify(answer),
            }),
          });
          const res = await response.json();
          setRinging(false);
        })
        .catch((error: Error) => {
          console.log(error);
        });
    }
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
        className="h-full object-cover"
      ></video>

      <div className="absolute bottom-8 right-8 h-60 w-60 rounded-lg border-white border-2">
        {/* <video id='user-2' ref={user2Ref} playsInline autoPlay className=""></video> */}
        <video
          id="user-1"
          ref={user1Ref}
          playsInline
          autoPlay
          className="h-full object-cover"
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
