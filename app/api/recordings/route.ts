import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

const recordingsDir = '/opt/livekit/recordings';

export async function GET(req: NextRequest) {
  try {
    const files = fs.readdirSync(recordingsDir);

    // Filter only mp4 files (optional)
    const mp4Files = files.filter((file) => file.endsWith('.mp4'));

    return Response.json({ files: mp4Files });
  } catch (error) {
    console.error(error);
    return new Response('Failed to list files', { status: 500 });
  }
}
