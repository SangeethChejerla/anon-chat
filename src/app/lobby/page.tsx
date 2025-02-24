'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaLock, FaPlus, FaShareAlt, FaHistory } from 'react-icons/fa';

export default function Lobby() {
  const [groupId, setGroupId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [customGroupId, setCustomGroupId] = useState('');
  const [recentGroups, setRecentGroups] = useState<string[]>([]);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check for username
    const storedUsername = localStorage.getItem('shadowtalk-username');
    if (!storedUsername) {
      router.push('/');
      return;
    }
    setUsername(storedUsername);

    // Load recent groups
    const storedGroups = localStorage.getItem('shadowtalk-recent-groups');
    if (storedGroups) {
      setRecentGroups(JSON.parse(storedGroups));
    }
  }, [router]);

  const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  const joinGroup = (id: string) => {
    if (!id.trim()) {
      setError('Group ID cannot be empty');
      return;
    }

    // Add to recent groups
    const updatedGroups = [id, ...recentGroups.filter(g => g !== id)].slice(0, 5);
    localStorage.setItem('shadowtalk-recent-groups', JSON.stringify(updatedGroups));
    
    // Redirect to chat
    router.push(`/chat/${id}`);
  };

  const createGroup = () => {
    const groupId = customGroupId.trim() || generateRandomId();
    joinGroup(groupId);
  };

  return (
    <main className="flex min-h-screen flex-col bg-black">
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-900 border-r border-gray-800 p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-purple-400">Shadow<span className="text-white">Talk</span></h1>
            <p className="text-sm text-gray-500">Logged in as <span className="text-gray-300">{username}</span></p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Recent Shadows</h2>
            {recentGroups.length > 0 ? (
              <ul>
                {recentGroups.map((group) => (
                  <li key={group} className="mb-2">
                    <button
                      onClick={() => joinGroup(group)}
                      className="w-full text-left p-2 rounded hover:bg-gray-800 transition-colors flex items-center"
                    >
                      <FaHistory className="mr-2 text-gray-500" />
                      <span className="text-gray-300 truncate">{group}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No recent groups</p>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-6 items-center justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Join or Create a Shadow Group</h2>
            
            {error && <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-2 rounded mb-4">{error}</div>}
            
            {isCreating ? (
              <div className="bg-gray-900 rounded-lg p-6 mb-4">
                <h3 className="text-lg font-medium mb-4">Create New Shadow Group</h3>
                <div className="mb-4">
                  <label className="block text-sm mb-2">Custom Group ID (optional)</label>
                  <input
                    type="text"
                    value={customGroupId}
                    onChange={(e) => setCustomGroupId(e.target.value)}
                    placeholder="Leave blank for random ID"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={createGroup}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Create & Join
                  </button>
                  <button
                    onClick={() => setIsCreating(false)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 px-4 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg p-6 mb-4">
                <h3 className="text-lg font-medium mb-4">Join Existing Shadow Group</h3>
                <div className="mb-4">
                  <label className="block text-sm mb-2">Enter Group ID</label>
                  <input
                    type="text"
                    value={groupId}
                    onChange={(e) => {
                      setGroupId(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter the secret group ID"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button
                  onClick={() => joinGroup(groupId)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                >
                  <FaLock className="mr-2" />
                  Join Secret Group
                </button>
              </div>
            )}
            
            {!isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 px-4 rounded-md transition-colors flex items-center justify-center"
              >
                <FaPlus className="mr-2" />
                Create New Shadow Group
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}