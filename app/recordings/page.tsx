'use client';

import { useEffect, useState } from 'react';

export default function RecordingsPage() {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const res = await fetch('/api/recordings');
      const data = await res.json();
      setFiles(data.files);
    };

    fetchFiles();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Recordings</h1>
      <ul className="space-y-2">
        {files.map((file) => (
          <li key={file}>
            <video controls width="400">
              <source src={`/api/recordings/${file}`} type="video/mp4" />
              Your browser does not support video.
            </video>
            <div className="mt-1 text-sm">{file}</div>
          </li>
        ))}
        {files.length === 0 && <li>No recordings found</li>}
      </ul>
    </div>
  );
}
