'use client';

import { useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, Image as ImageIcon, Loader2, RefreshCw } from 'lucide-react';

import LogoutBtn from './components/LogoutBtn';

export default function AdminPage() {
  const [jsonStatus, setJsonStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message?: string, progress: number }>({ type: 'idle', progress: 0 });
  const [imgStatus, setImgStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message?: string, url?: string, progress: number }>({ type: 'idle', progress: 0 });
  const [bulkStatus, setBulkStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message?: string, count?: number, progress: number }>({ type: 'idle', progress: 0 });
  const [syncStatus, setSyncStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message?: string }>({ type: 'idle' });

  const uploadWithProgress = (url: string, formData: FormData, onProgress: (pct: number) => void): Promise<any> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          onProgress(pct);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          try {
            reject(JSON.parse(xhr.responseText));
          } catch {
            reject({ error: 'Upload failed' });
          }
        }
      };

      xhr.onerror = () => reject({ error: 'Network error' });
      xhr.send(formData);
    });
  };

  const handleJsonUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setJsonStatus({ type: 'loading', progress: 0 });
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;

    if (file && !file.name.endsWith('.json')) {
      setJsonStatus({ type: 'error', message: 'Please select a valid .json file', progress: 0 });
      return;
    }
    
    try {
      const result = await uploadWithProgress('/api/admin/themes/upload', formData, (progress) => {
        setJsonStatus(prev => ({ ...prev, progress }));
      });

      if (result.success) {
        setJsonStatus({ type: 'success', message: result.message, progress: 100 });
        (e.target as HTMLFormElement).reset();
      } else {
        setJsonStatus({ type: 'error', message: result.error, progress: 0 });
      }
    } catch (err: any) {
      setJsonStatus({ type: 'error', message: err.error || 'Unknown error occurred', progress: 0 });
    }
  };

  const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setImgStatus({ type: 'loading', progress: 0 });
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;

    if (file && !file.type.startsWith('image/')) {
      setImgStatus({ type: 'error', message: 'Please select a valid image file', progress: 0 });
      return;
    }
    
    try {
      const result = await uploadWithProgress('/api/admin/images/upload', formData, (progress) => {
        setImgStatus(prev => ({ ...prev, progress }));
      });

      if (result.success) {
        setImgStatus({ type: 'success', message: 'Image uploaded successfully!', url: result.url, progress: 100 });
        (e.target as HTMLFormElement).reset();
      } else {
        setImgStatus({ type: 'error', message: result.error, progress: 0 });
      }
    } catch (err: any) {
      setImgStatus({ type: 'error', message: err.error || 'Unknown error occurred', progress: 0 });
    }
  };

  const compressToWebP = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Compression failed'));
          }, 'image/webp', 0.8); // 80% quality is perfect balance
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleBulkUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBulkStatus({ type: 'loading', progress: 0 });
    const formData = new FormData(e.currentTarget);
    const files = formData.getAll('files') as File[];

    const invalidFiles = files.filter(f => !f.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setBulkStatus({ type: 'error', message: `Found ${invalidFiles.length} invalid file(s). Only images allowed.`, progress: 0 });
      return;
    }

    const patchedLinks: { fileName: string, url: string }[] = [];
    const total = files.length;
    let completedCount = 0;

    try {
      // Concurrency: 5 parallel uploads at a time
      const CONCURRENCY = 5;
      const chunks = [];
      for (let i = 0; i < files.length; i += CONCURRENCY) {
        chunks.push(files.slice(i, i + CONCURRENCY));
      }

      for (const chunk of chunks) {
        await Promise.all(chunk.map(async (file) => {
          const singleFormData = new FormData();
          singleFormData.append('file', file);

          const result = await uploadWithProgress('/api/admin/images/upload', singleFormData, (p) => {
             // We don't track per-file sub-progress in parallel for UX simplicity
          });

          if (result.success) {
            patchedLinks.push({ fileName: file.name, url: result.url });
            completedCount++;
            const overallProgress = Math.round((completedCount / total) * 100);
            setBulkStatus(prev => ({ ...prev, progress: overallProgress }));
          } else {
            throw new Error(`Failed to upload ${file.name}: ${result.error}`);
          }
        }));
      }

      // Step 2: Apply the sync to JSON themes
      setBulkStatus(prev => ({ ...prev, progress: 100 }));
      const syncRes = await fetch('/api/admin/images/apply-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patchedLinks })
      });
      const syncResult = await syncRes.json();

      if (syncResult.success) {
        setBulkStatus({ 
          type: 'success', 
          message: `Successfully compressed, uploaded ${total} images and updated ${syncResult.themesUpdatedCount} themes!`, 
          count: total, 
          progress: 100 
        });
        (e.target as HTMLFormElement).reset();
      } else {
        setBulkStatus({ type: 'error', message: syncResult.error || 'Failed to sync themes', progress: 0 });
      }

    } catch (err: any) {
      setBulkStatus({ type: 'error', message: err.message || 'Unknown error occurred', progress: 0 });
    }
  };

  const handleSyncOnly = async () => {
    setSyncStatus({ type: 'loading' });
    try {
      const res = await fetch('/api/admin/images/apply-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patchedLinks: [] }), // empty = scan all images in Blob
      });
      const result = await res.json();
      if (result.success) {
        setSyncStatus({
          type: 'success',
          message: `Synced! ${result.totalVersesUpdated} verse links updated across ${result.themesUpdatedCount} themes (${result.imagesAvailable} images in Blob).`,
        });
      } else {
        setSyncStatus({ type: 'error', message: result.error || 'Sync failed' });
      }
    } catch (err: any) {
      setSyncStatus({ type: 'error', message: err.message || 'Network error' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between items-start gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Holy Canvas Admin</h1>
            <p className="text-neutral-400 mt-2">Manage Themes and Images for your mobile app API.</p>
          </div>
          <LogoutBtn />
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
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {jsonStatus.type === 'loading' ? (
                  <><Loader2 className="animate-spin" size={18} /> Uploading {jsonStatus.progress}%</>
                ) : 'Save Theme'}
              </button>
            </form>

            {jsonStatus.type === 'loading' && (
              <div className="mt-4 h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-300 ease-out"
                  style={{ width: `${jsonStatus.progress}%` }}
                />
              </div>
            )}

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
                className="w-full py-2 px-4 bg-pink-600 hover:bg-pink-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {imgStatus.type === 'loading' ? (
                  <><Loader2 className="animate-spin" size={18} /> Uploading {imgStatus.progress}%</>
                ) : 'Upload Image'}
              </button>
            </form>

            {imgStatus.type === 'loading' && (
              <div className="mt-4 h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-pink-500 transition-all duration-300 ease-out"
                  style={{ width: `${imgStatus.progress}%` }}
                />
              </div>
            )}

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
          
          {/* Bulk Image Upload & SYNC */}
          <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 shadow-xl md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <UploadCloud className="text-emerald-400" size={28} />
              <h2 className="text-xl font-bold">3. Auto-Sync Bulk Images</h2>
            </div>
            
            <p className="text-sm text-neutral-400 mb-6">
              Upload multiple images at once. The system will automatically upload them to Vercel string, read all your JSON files, match the filename, and update the <code className="bg-neutral-900 px-1 py-0.5 rounded text-emerald-300">verseimagelink</code> for you permanently!
            </p>

            <form onSubmit={handleBulkUpload} className="space-y-4">
              <input 
                type="file" 
                name="files" 
                accept="image/*" 
                multiple
                required 
                className="block w-full text-sm text-neutral-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-emerald-500/10 file:text-emerald-400
                  hover:file:bg-emerald-500/20 file:cursor-pointer"
              />
              <button 
                disabled={bulkStatus.type === 'loading'}
                type="submit" 
                className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {bulkStatus.type === 'loading' ? (
                  <><Loader2 className="animate-spin" size={18} /> {bulkStatus.progress === 100 ? 'Processing...' : `Uploading ${bulkStatus.progress}%`}</>
                ) : 'Bulk Upload & Fix JSON'}
              </button>
            </form>

            {bulkStatus.type === 'loading' && (
              <div className="mt-4 space-y-2">
                <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                    style={{ width: `${bulkStatus.progress}%` }}
                  />
                </div>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest text-center">
                  {bulkStatus.progress === 100 ? 'Syncing with JSON files...' : 'Transferring data to server...'}
                </p>
              </div>
            )}

            <div className="mt-4">
              {bulkStatus.type === 'success' && (
                <div className="text-green-400 flex items-center gap-2 text-sm">
                  <CheckCircle size={16} /> Successfully synchronized {bulkStatus.count} images to JSON files!
                </div>
              )}
              {bulkStatus.type === 'error' && <div className="text-red-400 flex items-center gap-2 text-sm"><AlertCircle size={16} /> {bulkStatus.message}</div>}
            </div>
          </div>
        </div>

        {/* ─── Sync Only Card ─── */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 shrink-0">
                <RefreshCw className="text-violet-400" size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Re-Sync All Links</h2>
                <p className="text-sm text-neutral-400 mt-1">
                  Already uploaded images? Click to update <code className="bg-neutral-900 px-1 rounded text-violet-300">verseimagelink</code> in all
                  theme JSONs — no re-upload needed.
                </p>
              </div>
            </div>

            <button
              onClick={handleSyncOnly}
              disabled={syncStatus.type === 'loading'}
              className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {syncStatus.type === 'loading' ? (
                <><Loader2 className="animate-spin" size={16} /> Syncing...</>
              ) : (
                <><RefreshCw size={16} /> Sync Now</>
              )}
            </button>
          </div>

          {syncStatus.type !== 'idle' && (
            <div className="mt-4 pt-4 border-t border-neutral-700">
              {syncStatus.type === 'loading' && (
                <p className="text-sm text-violet-400 animate-pulse">Scanning Blob storage and updating all theme JSONs...</p>
              )}
              {syncStatus.type === 'success' && (
                <div className="flex items-start gap-2 text-sm text-green-400">
                  <CheckCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{syncStatus.message}</span>
                </div>
              )}
              {syncStatus.type === 'error' && (
                <div className="flex items-start gap-2 text-sm text-red-400">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{syncStatus.message}</span>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
