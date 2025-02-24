import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || '',
  secret: process.env.PUSHER_SECRET || '',
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || '',
  useTLS: true,
});

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { groupId, message } = data;

  // In a production environment, you might want to:
  // 1. Validate the message format
  // 2. Sanitize input
  // 3. Add rate limiting
  // 4. Add spam detection

  // Trigger the message to all clients subscribed to this channel
  await pusher.trigger(`shadow-group-${groupId}`, 'new-message', message);

  return NextResponse.json({ success: true });
}