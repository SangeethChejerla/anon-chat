'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Pusher from 'pusher-js';
import { FaEye, FaEyeSlash, FaShareAlt, FaSignOutAlt, FaRegCopy , FaCheck } from 'react-icons/fa';

type Message = {
  id: string;
  username: string;
  text: string;
  timestamp: number;
  expiresAt: number;
};

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [cloakMode, setCloakMode] = useState(false);
  const [groupLink, setGroupLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  const pusher = useRef<Pusher | null>(null);

  // Set message expiration time (in milliseconds)
  const MESSAGE_LIFESPAN = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    // Check for username
    const storedUsername = localStorage.getItem('shadowtalk-username');
    if (!storedUsername) {
      router.push('/');
      return;
    }
    setUsername(storedUsername);

    // Generate shareable link
    setGroupLink(`${window.location.origin}/invite/${groupId}`);

    // Initialize Pusher
    pusher.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || 'demo-key', {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu',
      forceTLS: true
    });

    const channel = pusher.current.subscribe(`shadow-group-${groupId}`);
    channel.bind('new-message', (data: Message) => {
      setMessages(prevMessages => [...prevMessages, data]);
    });

    // Clean up
    return () => {
      if (pusher.current) {
        pusher.current.unsubscribe(`shadow-group-${groupId}`);
      }
    };
  }, [groupId, router]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Clean up expired messages
    const interval = setInterval(() => {
      const now = Date.now();
      setMessages(prevMessages => prevMessages.filter(msg => msg.expiresAt > now));
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const messageData: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      username,
      text: newMessage,
      timestamp: Date.now(),
      expiresAt: Date.now() + MESSAGE_LIFESPAN
    };

    // In a production app, this would be an API call
    // For demo purposes, we'll simulate the server response
    setMessages(prevMessages => [...prevMessages, messageData]);
    
    // In a real app, you'd make an API call like this:
    /*
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        groupId,
        message: messageData
      })
    });
    */
    
    // This is a simulation of the Pusher trigger that would happen on the server
    // In a real app, the server would trigger this after receiving the message
    setTimeout(() => {
      if (pusher.current) {
        // This is for demonstration - in a real app, this would be triggered by the server
        console.log('Message would be broadcast via Pusher in a real implementation');
      }
    }, 100);

    setNewMessage('');
  };

  const copyGroupLink = () => {
    navigator.clipboard.writeText(groupLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const calculateTimeRemaining = (expiresAt: number) => {
    const secondsRemaining = Math.floor((expiresAt - Date.now()) / 1000);
    if (secondsRemaining < 60) {
      return `${secondsRemaining}s`;
    }
    return `${Math.floor(secondsRemaining / 60)}m ${secondsRemaining % 60}s`;
  };

  return (
    <main className="flex min-h-screen flex-col bg-black">
      <div className={`flex flex-col h-screen ${cloakMode ? 'cloak-mode' : ''}`}>
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-purple-400">Shadow<span className="text-white">Talk</span></h1>
              <p className="text-sm text-gray-400">Group: <span className="text-gray-300">{groupId}</span></p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setCloakMode(!cloakMode)}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                title={cloakMode ? "Disable Cloak Mode" : "Enable Cloak Mode"}
              >
                {cloakMode ? <FaEyeSlash /> : <FaEye />}
              </button>
              <button 
                onClick={copyGroupLink}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                title="Copy Invite Link"
              >
                {linkCopied ? <FaCheck className="text-green-400" /> : <FaShareAlt />}
              </button>
              <button 
                onClick={() => router.push('/lobby')}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                title="Leave Chat"
              >
                <FaSignOutAlt />
              </button>
            </div>
          </div>
        </header>

        {/* Messages Container */}
        <div 
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-900 to-black"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="mb-4 p-4 rounded-full bg-gray-800 opacity-60">
                <FaRegCopy  size={24} />
              </div>
              <h3 className="text-xl mb-2">No messages yet</h3>
              <p className="text-center max-w-md text-sm">
                Messages sent here will automatically disappear after 5 minutes.
                No logs. No history. Complete privacy.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`max-w-md rounded-lg p-3 ${
                    message.username === username 
                      ? 'ml-auto bg-purple-900/40 border border-purple-800' 
                      : 'bg-gray-800/70 border border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-medium text-sm ${
                      message.username === username ? 'text-purple-300' : 'text-gray-300'
                    }`}>
                      {message.username}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <span className="mr-1">{formatTime(message.timestamp)}</span>
                      <span 
                        className="text-gray-600 text-xs"
                        title="Time until message expires"
                      >
                        ({calculateTimeRemaining(message.expiresAt)})
                      </span>
                    </span>
                  </div>
                  <p className="text-gray-300 break-words">{message.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="bg-gray-900 border-t border-gray-800 p-4">
          <form onSubmit={sendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className={`px-4 py-2 rounded-md ${
                newMessage.trim() 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              Send
            </button>
          </form>
          <p className="mt-2 text-xs text-gray-600 text-center">
            Messages automatically expire after 5 minutes
          </p>
        </div>
      </div>
    </main>
  );
}

