'use client';

import Loading from '@/components/loading';
import VideoCallButtons from '@/components/videoCallButtons';
import useRTCSocket from '@/hooks/useRTCSocket';
import { Ref, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  FaMicrophoneAltSlash,
  FaVideoSlash,
  FaPhone,
  FaPhoneSlash,
} from 'react-icons/fa';

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
  const dataChannelRef = useRef(null);
  const hostRef = useRef(false);
  const [offer, setOffer] = useState('');
  const [ringing, setRinging] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [mode, setMode] = useState<'OFFER' | 'ANSWER'>('OFFER');

  const [peerDisconnected, setPeerDisconnected] = useState(false);

  const [peerSettings, setPeerSettings] = useState<{
    audio: boolean;
    video: boolean;
  }>({ audio: true, video: true });

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
      .getUserMedia({ audio: true, video: true })
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

  /**
   * Data channel setup
   */
  const setupDataChannel = (dataChannel: RTCDataChannel) => {
    dataChannel.onopen = () => {
      console.log('Data channel is open');
    };

    dataChannel.onmessage = (event) => {
      console.log('DATA CHANNEL DATA : ', JSON.stringify(event.data));
      let data = JSON.parse(event.data);
      if (data && data.type) {
        let type = data.type;

        switch (type) {
          case 'INFO':
            setPeerSettings({
              audio: data.data.audio,
              video: data.data.video,
            });
            break;
          case 'DISCONNECT':
            console.log('PEER DISCONNECTED');
            setPeerDisconnected(true);
            // router.push('/user/home');
            break;
        }
      }
    };

    dataChannel.onclose = () => {
      console.log('Data channel is closed');
    };
  };

  const createDataChannel = () => {
    dataChannelRef.current = (
      rtcConnectionRef as any
    ).current.createDataChannel('chat');
    setupDataChannel((dataChannelRef as any).current as RTCDataChannel);
  };

  const sendMessageDataChannelMessage = (message: any) => {
    if (dataChannelRef.current && message) {
      (dataChannelRef as any).current.send(JSON.stringify(message));
      console.log('Sent Message');
    }
  };
  /**
   *
   */

  const initiateCall = (to: string) => {
    if (hostRef.current && (user1Ref?.current as any)?.srcObject) {
      (rtcConnectionRef.current as any) = createPeerConnection();
      // (rtcConnectionRef.current as any).addTrack(
      //   (user1Ref.current as any).srcObject.getTracks()[0],
      //   (user1Ref.current as any).srcObject
      // );
      (user1Ref.current as any).srcObject.getTracks().forEach((track: any) => {
        (rtcConnectionRef.current as any).addTrack(
          track,
          (user1Ref.current as any).srcObject
        );
      });

      /**
       * Data channel
       */
      createDataChannel();
      /**
       *
       */

      (rtcConnectionRef.current as any).onicecandidate = async (event: any) => {
        //Event that fires off when a new offer ICE candidate is created
        if (event.candidate) {
          // console.log('ice candaite : ', event.candidate);
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

  /**
   * Custom hook is used to handle  multiple mount and remount
   * components in react/next in development mode,
   * This behaioir affected webRTC connection
   */
  // useEffect(() => {
  //   if (!hasMounted) return;
  //   return () => {};
  // }, [hasMounted]);

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
        // console.log('OFFER NOT FOUND');
        router.push('/user/home');
        return;
      }
      let offer = JSON.parse(offerStringified);
      // console.log('OFFER : ', offer);
      setTimeout(() => {
        handleReceivedOffer(offer);
      }, 2000);
      // I have the offer now
    }

    return () => {
      // close the connections
      (rtcConnectionRef as any).current.close();
    };
  }, [searchParams.get('mode'), searchParams.get('to')]);

  useEffect(() => {
    /**
     * Handle receive answers only
     */
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
      // console.log('ICE candidate : ', e.candidate);
    }
  };

  const handleTrackEvent = (event: RTCTrackEvent) => {
    // console.log('event track : ', event);
    event.streams[0].getTracks().forEach((track) => {
      // console.log('TRACK : ', track);
      // console.log(user2Ref.current as any);
      (user2Ref.current as any).srcObject.addTrack(track);
    });
  };

  const handleReceivedOffer = async (offer: any) => {
    if (hostRef.current) {
      (rtcConnectionRef as any).current = createPeerConnection();
      (user1Ref.current as any).srcObject.getTracks().forEach((track: any) => {
        (rtcConnectionRef.current as any).addTrack(
          track,
          (user1Ref.current as any).srcObject
        );
      });
      /**
       * Data channel
       */
      // createDataChannel();
      (rtcConnectionRef as any).current.ondatachannel = (event: any) => {
        console.log('Data channnel received');
        const receivedChannel = event.channel;
        dataChannelRef.current = receivedChannel;
        setupDataChannel(receivedChannel);
      };
      /**
       *
       */
      (rtcConnectionRef.current as any).onicecandidate = async (event: any) => {
        //Event that fires off when a new offer ICE candidate is created
        if (event.candidate) {
          // console.log('ice candidate : ', event.candidate);
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

  const toggleAudio = () => {
    let localStream = (user1Ref.current as any).srcObject;
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach((track: any) => {
        track.enabled = !track.enabled; // Toggle the enabled property
      });
      setIsAudioEnabled(audioTracks[0].enabled);
      sendMessageDataChannelMessage({
        type: 'INFO',
        data: {
          audio: audioTracks[0].enabled,
          video: isVideoEnabled,
        },
      });
    }
  };

  const toggleVideo = () => {
    let localStream = (user1Ref.current as any).srcObject;
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach((track: any) => {
        track.enabled = !track.enabled; // Toggle the enabled property
      });
      setIsVideoEnabled(videoTracks[0].enabled);
      sendMessageDataChannelMessage({
        type: 'INFO',
        data: {
          video: videoTracks[0].enabled,
          audio: isAudioEnabled,
        },
      });
    }
  };

  const handleDisconnect = () => {
    // Logic to disconnect from the video call
    sendMessageDataChannelMessage({ type: 'DISCONNECT' });
    console.log('Disconnected from the call');
    router.push('/user/home');
  };

  if (status === 'loading') {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-full bg-gray-700 relative">
      {ringing ? (
        <div className="flex text-black justify-center items-center h-full w-full absolute left-0 top-0">
          <div className="flex items-center justify-center px-4 py-4 rounded-full h-16 w-16 bg-gray-200 text-black">
            <FaPhone />
          </div>
        </div>
      ) : null}

      {peerDisconnected ? (
        <div className="flex text-black justify-center items-center h-full w-full absolute left-0 top-0 bg-gray-700">
          <div className="flex items-center justify-center px-4 py-4 rounded-full h-16 w-16 bg-gray-200 text-black">
            <FaPhoneSlash />
          </div>
        </div>
      ) : null}

      <video
        id="user-2"
        ref={user2Ref}
        playsInline
        autoPlay
        className="h-full object-cover"
      ></video>
      {peerSettings && peerSettings.video == false && (
        <div className="flex text-black justify-center items-center h-full w-full absolute left-0 top-0 bg-gray-700">
          <div className="flex items-center justify-center px-4 py-4 rounded-full h-16 w-16 bg-gray-200 text-black">
            <FaVideoSlash />
          </div>
        </div>
      )}
      {peerSettings && peerSettings.audio == false && (
        <FaMicrophoneAltSlash
          size={70}
          className="absolute right-8 top-40 text-white"
        />
      )}

      <div className="absolute bottom-8 right-8 h-60 w-60 rounded-lg border-white border-2">
        <video
          id="user-1"
          ref={user1Ref}
          playsInline
          autoPlay
          className="h-full object-cover"
        ></video>
        {!isVideoEnabled && (
          // <div className="flex text-black justify-center items-center h-full w-full absolute left-0 top-0">
          //   <FaVideoSlash />
          // </div>
          <div className="flex text-black justify-center items-center h-full w-full absolute left-0 top-0 bg-gray-700">
            <div className="flex items-center justify-center px-4 py-4 rounded-full h-16 w-16 bg-gray-200 text-black">
              <FaVideoSlash />
            </div>
          </div>
        )}
        {!isAudioEnabled && (
          <FaMicrophoneAltSlash
            size={40}
            className="absolute right-8 top-8 text-white"
          />
        )}
      </div>

      {/* buttons */}
      <div className="absolute bottom-10 h-10 w-full rounded-lg flex justify-center">
        <VideoCallButtons
          onMute={toggleAudio}
          onDisconnect={handleDisconnect}
          isMuted={!isAudioEnabled}
          isVideoEnabled={isVideoEnabled}
          onVideo={toggleVideo}
        />
      </div>
    </div>
  );
}
