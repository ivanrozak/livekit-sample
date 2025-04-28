import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params: params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  const recordingsDir = '/opt/livekit/recordings';
  const filePath = path.join(recordingsDir, filename);

  if (!fs.existsSync(filePath)) {
    return new Response('File not found', { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.get('range');

  if (range) {
    // Handle partial request (for seeking video)
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });

    return new Response(file as any, {
      status: 206,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize.toString(),
        'Content-Type': 'video/mp4',
      },
    });
  }

  // No Range, send the entire file
  const file = fs.createReadStream(filePath);

  return new Response(file as any, {
    headers: {
      'Content-Length': fileSize.toString(),
      'Content-Type': 'video/mp4',
    },
  });
}
