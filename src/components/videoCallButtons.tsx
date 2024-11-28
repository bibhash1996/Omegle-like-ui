import React from 'react';
import { Button } from '@/components/ui/button'; // Adjust the import based on your directory structure
import { cn } from '@/lib/utils'; // Utility function for conditional class names
import {
  FaMicrophoneAltSlash,
  FaMicrophone,
  FaVideo,
  FaVideoSlash,
  FaMobileAlt,
  FaPhoneSlash,
} from 'react-icons/fa';
import { IoIosChatbubbles } from 'react-icons/io';

const VideoCallButtons = (props: {
  onMute: () => void;
  onVideo: () => void;
  onDisconnect: () => void;
  isMuted: boolean;
  isVideoEnabled: boolean;
  onChatToggle: () => void;
}) => {
  return (
    // <div className="flex space-x-4 bg-gray-50 h-20 p-2 rounded-lg">
    <div className="flex space-x-4 ">
      <Button
        onClick={props.onMute}
        className={cn(
          'flex items-center justify-center px-4 py-4 rounded-full h-16 w-16',
          'bg-gray-200 text-black hover:bg-gray-400'
        )}
      >
        {props.isMuted ? <FaMicrophoneAltSlash /> : <FaMicrophone />}
      </Button>
      <Button
        onClick={props.onVideo}
        className={cn(
          'flex items-center justify-center px-4 py-4 rounded-full h-16 w-16',
          'bg-gray-200 text-black hover:bg-gray-400'
        )}
      >
        {props.isVideoEnabled ? <FaVideo /> : <FaVideoSlash />}
      </Button>
      <Button
        onClick={props.onDisconnect}
        className={cn(
          'flex items-center justify-center px-4 py-4 rounded-full h-16 w-16',
          'bg-red-700 text-black hover:bg-red-500'
        )}
      >
        <FaPhoneSlash />
      </Button>
      <Button
        onClick={props.onChatToggle}
        className={cn(
          'flex items-center justify-center px-4 py-4 rounded-full h-16 w-16',
          'bg-gray-200 text-black hover:bg-gray-400'
        )}
      >
        <IoIosChatbubbles />
      </Button>
    </div>
  );
};

export default VideoCallButtons;
