
'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function InvitePage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;

  useEffect(() => {
    // Check if user has a username
    const username = localStorage.getItem('shadowtalk-username');
    
    if (username) {
      // If they have a username, redirect directly to chat
      router.push(`/chat/${groupId}`);
    } else {
      // If they don't have a username, redirect to home page
      // The group ID will be handled after they create a username
      localStorage.setItem('shadowtalk-pending-invite', groupId);
      router.push('/');
    }
  }, [groupId, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-400 mb-4">Shadow<span className="text-white">Talk</span></h2>
        <p className="text-gray-400">Redirecting to secure chat...</p>
      </div>
    </main>
  );
}