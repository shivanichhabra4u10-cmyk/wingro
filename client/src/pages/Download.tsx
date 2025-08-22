
import React, { useEffect, useState } from 'react';

type DownloadFile = {
  url: string;
  originalName?: string;
  fileType?: string;
  fileId?: string;
  size?: number;
  uploadDate?: string;
};

const Download: React.FC = () => {
  const [files, setFiles] = useState<DownloadFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    async function fetchFiles() {
      setLoading(true);
      setError(null);
      try {
        if (!sessionId) throw new Error('Missing session ID');
        // Fetch download links from backend
        const res = await fetch(`http://localhost:3001/api/downloads/${sessionId}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data && data.error ? data.error : 'Failed to fetch download links');
          setFiles([]);
          return;
        }
        setFiles(Array.isArray(data.files) ? data.files : []);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchFiles();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', margin: 40 }}>Loading your files...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', margin: 40 }}>{error}</div>;
  return (
    <div style={{ minHeight: '100vh', minWidth: 0, width: '100vw', overflowX: 'hidden', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: 0, margin: 0 }}>
      <div style={{ width: '100vw', margin: 0, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px 0 rgba(80,80,120,0.08)', padding: 32 }}>
        <h2 style={{ textAlign: 'center', color: '#3730a3', marginBottom: 24 }}>Thank you for your purchase!</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {files.length === 0 ? (
            <div style={{ color: '#888', textAlign: 'center' }}>No files available for download.</div>
          ) : files.map((file, idx) => (
            <a key={file.fileId || idx} href={file.url} download target="_blank" rel="noopener noreferrer">
              <button style={{ width: '100%', padding: '14px 0', background: 'linear-gradient(90deg, #6366f1 0%, #a21caf 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 17, cursor: 'pointer', boxShadow: '0 2px 8px 0 rgba(80,80,120,0.10)', marginBottom: 8 }}>
                {file.originalName ? `Download ${file.originalName}` : `Download File ${idx + 1}`}
              </button>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Download;
