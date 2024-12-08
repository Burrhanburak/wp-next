"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface Message {
  id: string;
  recipientName: string;
  recipientPhone: string;
  status: string;
  createdAt: string;
}

export function RecentMessages() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages/recent');
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch recent messages:', error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="space-y-8">
      {messages.map((message) => (
        <div key={message.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://avatar.vercel.sh/${message.recipientPhone}.png`} alt={message.recipientName} />
            <AvatarFallback>{message.recipientName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{message.recipientName}</p>
            <p className="text-sm text-muted-foreground">
              {message.recipientPhone}
            </p>
          </div>
          <div className="ml-auto font-medium">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
              ${message.status === 'delivered' ? 'bg-green-100 text-green-800' :
                message.status === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
              {message.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
