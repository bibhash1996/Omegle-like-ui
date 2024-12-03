'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { IoIosSend } from 'react-icons/io';
import { cn, getInitials } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  fromUser: {
    id: string;
    name: string;
    status: string;
  };
  message: string;
}

function ChatBox(props: { message: Message; currentUser: boolean }) {
  return (
    <div
      className={cn(
        'w-full mt-4  flex justify-between items-center font-thin text-sm',
        props.currentUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <Avatar>
        <AvatarImage src="https://github.com/shdcn.png" alt="Profile Picture" />
        <AvatarFallback
          className={cn(
            ' text-black',
            props.currentUser
              ? 'bg-red-500 text-white'
              : 'bg-green-400 text-white'
          )}
        >
          {getInitials(props.message.fromUser.name)}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'bg-gray-100 rounded-sm p-2 w-full',
          props.currentUser ? 'mr-2' : 'ml-2'
        )}
      >
        {props.message.message}
      </div>
    </div>
  );
}

export default function Chat(props: {
  currentUserId: string;
  messages: Message[];
  open: boolean;
  onOpenChange: (op: boolean) => void;
  onSend: (messge: string) => void;
}) {
  const [msg, setMsg] = useState('');
  const chatSection = useRef(null);

  useEffect(() => {
    if (
      !props.open &&
      !chatSection &&
      !(chatSection as any).current &&
      !((chatSection as any).current as any).scrollIntoView
    )
      return;
    setTimeout(() => {
      // if (chatSection.current) {
      (chatSection.current as any).scrollIntoView({ behavior: 'smooth' });
      // }
    }, 500);
  }, [chatSection.current]);

  useEffect(() => {
    if (chatSection.current) {
      (chatSection.current as any).scrollIntoView({ behavior: 'smooth' });
    }
  }, [props.messages, chatSection.current]);

  return (
    <Sheet
      open={props.open}
      defaultOpen={false}
      onOpenChange={props.onOpenChange}
    >
      <SheetContent className="overflow-hidden flex flex-col pb-0">
        <SheetHeader>
          <SheetTitle>Chat with the stranger</SheetTitle>
          <SheetDescription>
            The message sent here are not saved here and are peer to peer. Once
            the call disconnects the chat history will be erased.
          </SheetDescription>
        </SheetHeader>
        <div
          className="max-h-[calc(100vh-80px)] h-[calc(100vh-80px)]  w-full flex 
          flex-col overflow-y-scroll [scrollbar-width:none]"
        >
          {props.messages.map((msg, idx) => (
            // <p key={`msg_${idx}`}>{msg.message}</p>
            <ChatBox
              key={`msg_${idx}`}
              message={msg}
              currentUser={msg.fromUser.id === props.currentUserId}
            />
          ))}
          {/* 
          Empty div acts as a scroll target
          */}
          <div ref={chatSection} />
        </div>
        <div className="h-20 w-full flex flex-row justify-between">
          <Input
            type="text"
            placeholder="Enter your message here"
            className=""
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (msg) {
                  setMsg('');
                  props.onSend(msg);
                }
              }
            }}
          />
          <Button
            className="ml-4 bg-slate-500 cursor-pointer"
            onClick={() => {
              if (msg) {
                setMsg('');
                props.onSend(msg);
              }
            }}
          >
            <IoIosSend />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
