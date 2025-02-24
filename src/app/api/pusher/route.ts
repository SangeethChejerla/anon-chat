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
  const { socket_id, channel_name, username } = data;

  // Authorization logic would go here
  const authResponse = pusher.authorizeChannel(socket_id, channel_name, {
    user_id: username,
    user_info: { name: username }
  });

  return NextResponse.json(authResponse);
}