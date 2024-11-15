import React from 'react';
import { Button } from '@/components/ui/button'; // Adjust the import based on your directory structure
import { cn } from '@/lib/utils'; // Utility function for conditional class names

const VideoCallButtons = (props: {
  onMute: () => void;
  onDisconnect: () => void;
  isMuted: boolean;
}) => {
  return (
    <div className="flex space-x-4">
      <Button
        onClick={props.onMute}
        className={cn(
          'flex items-center justify-center px-4 py-4 rounded-full h-16 w-16',
          props.isMuted ? 'bg-red-300 text-white' : 'bg-gray-200 text-black'
        )}
      >
        {props.isMuted ? (
          <span role="img" aria-label="Unmute">
            🔊
          </span>
        ) : (
          <span role="img" aria-label="Mute">
            🔇
          </span>
        )}
        {/* <span className="ml-2">{props.isMuted ? "Unmute" : "Mute"}</span> */}
      </Button>
      <Button
        onClick={props.onDisconnect}
        className="flex bg-gray-200 items-center justify-center px-4 py-4 rounded-full h-16 w-16"
      >
        <span role="img" aria-label="Disconnect">
          ❌
        </span>
        {/* <span className="ml-2">Disconnect</span> */}
      </Button>
    </div>
  );
};

export default VideoCallButtons;
