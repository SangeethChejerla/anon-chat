'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const [username, setUsername] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check for stored username
    const storedUsername = localStorage.getItem('shadowtalk-username');
    if (storedUsername) {
      setUsername(storedUsername);
      setIsValid(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username cannot be empty');
      return;
    }
    
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    
    if (username.length > 20) {
      setError('Username must be less than 20 characters');
      return;
    }
    
    // Store username in localStorage
    localStorage.setItem('shadowtalk-username', username);
    
    // Redirect to lobby
    router.push('/lobby');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-purple-400 mb-2">Shadow<span className="text-white">Talk</span></h1>
        <p className="text-gray-400">Ephemeral. Anonymous. Secure.</p>
      </div>

      <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Create Your Shadow Identity</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Choose a unique username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setIsValid(e.target.value.trim().length >= 3 && e.target.value.length <= 20);
                  setError('');
                }}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Anonymous_Raven"
              />
              {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
            </div>
            
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-2 px-4 rounded-md transition-colors ${
                isValid 
                  ? "bg-purple-600 hover:bg-purple-700 text-white" 
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              Enter the Shadows
            </button>
          </form>
          
          <p className="mt-4 text-xs text-gray-500 text-center">
            No account needed. No data stored. No traces left.
          </p>
        </div>
      </div>
    </main>
  );
}