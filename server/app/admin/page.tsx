'use client';

import { useState } from 'react';
import { uploadThemeJSON, uploadImageToBlob } from './actions';
import { UploadCloud, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';

export default function AdminPage() {
  const [jsonStatus, setJsonStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message?: string }>({ type: 'idle' });
  const [imgStatus, setImgStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message?: string, url?: string }>({ type: 'idle' });

  const handleJsonUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setJsonStatus({ type: 'loading' });
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await uploadThemeJSON(formData);
      if (result.success) {
        setJsonStatus({ type: 'success', message: result.message });
        (e.target as HTMLFormElement).reset();
      } else {
        setJsonStatus({ type: 'error', message: result.error });
      }
    } catch {
      setJsonStatus({ type: 'error', message: 'Unknown error occurred' });
    }
  };

  const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setImgStatus({ type: 'loading' });
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await uploadImageToBlob(formData);
      if (result.success) {
        setImgStatus({ type: 'success', message: 'Image uploaded successfully!', url: result.url });
        (e.target as HTMLFormElement).reset();
      } else {
        setImgStatus({ type: 'error', message: result.error });
      }
    } catch {
      setImgStatus({ type: 'error', message: 'Unknown error occurred' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Holy Word Studio Admin</h1>
          <p className="text-neutral-400 mt-2">Manage Themes and Images for your mobile app API.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Theme JSON Upload */}
          <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <UploadCloud className="text-indigo-400" size={28} />
              <h2 className="text-xl font-bold">1. Upload Theme File</h2>
            </div>
            
            <p className="text-sm text-neutral-400 mb-6">
              Upload the generated <code className="bg-neutral-900 px-1 py-0.5 rounded text-indigo-300">.json</code> theme files. It will be immediately available in the API.
            </p>

            <form onSubmit={handleJsonUpload} className="space-y-4">
              <input 
                type="file" 
                name="file" 
                accept=".json" 
                required 
                className="block w-full text-sm text-neutral-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-500/10 file:text-indigo-400
                  hover:file:bg-indigo-500/20 file:cursor-pointer"
              />
              <button 
                disabled={jsonStatus.type === 'loading'}
                type="submit" 
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {jsonStatus.type === 'loading' ? 'Uploading...' : 'Save Theme'}
              </button>
            </form>

            <div className="mt-4">
              {jsonStatus.type === 'success' && <div className="text-green-400 flex items-center gap-2 text-sm"><CheckCircle size={16} /> {jsonStatus.message}</div>}
              {jsonStatus.type === 'error' && <div className="text-red-400 flex items-center gap-2 text-sm"><AlertCircle size={16} /> {jsonStatus.message}</div>}
            </div>
          </div>

          {/* Image Upload to Vercel JSON */}
          <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon className="text-pink-400" size={28} />
              <h2 className="text-xl font-bold">2. Upload Image to Blob</h2>
            </div>
            
            <p className="text-sm text-neutral-400 mb-6">
              Upload an image to Vercel Blob to receive a permanent public URL for your JSON file.
            </p>

            <form onSubmit={handleImageUpload} className="space-y-4">
              <input 
                type="file" 
                name="file" 
                accept="image/*" 
                required 
                className="block w-full text-sm text-neutral-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-pink-500/10 file:text-pink-400
                  hover:file:bg-pink-500/20 file:cursor-pointer"
              />
              <button 
                disabled={imgStatus.type === 'loading'}
                type="submit" 
                className="w-full py-2 px-4 bg-pink-600 hover:bg-pink-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {imgStatus.type === 'loading' ? 'Uploading...' : 'Upload Image'}
              </button>
            </form>

            <div className="mt-4">
              {imgStatus.type === 'success' && (
                <div className="space-y-2">
                  <div className="text-green-400 flex items-center gap-2 text-sm"><CheckCircle size={16} /> {imgStatus.message}</div>
                  <div className="p-3 bg-neutral-900 rounded border border-neutral-700 break-all text-xs font-mono text-neutral-300">
                    {imgStatus.url}
                  </div>
                </div>
              )}
              {imgStatus.type === 'error' && <div className="text-red-400 flex items-center gap-2 text-sm"><AlertCircle size={16} /> {imgStatus.message}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
