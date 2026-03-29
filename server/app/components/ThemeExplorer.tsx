'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Loader2, ChevronRight, BookOpen } from 'lucide-react';

interface Theme {
  id: string;
  theme: string;
  totalVerses: number;
}

interface Verse {
  english: string;
  englishReference: string;
  telugu: string;
  teluguReference: string;
  verseimagelink: string;
}

export default function ThemeExplorer() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [verse, setVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetch('/api/themes')
      .then(res => res.json())
      .then(data => {
        setThemes(data.themes || []);
        setInitialLoading(false);
      })
      .catch(err => {
        console.error(err);
        setInitialLoading(false);
      });
  }, []);

  async function fetchRandomVerse(themeId: string) {
    setLoading(true);
    setSelectedTheme(themeId);
    try {
      const res = await fetch(`/api/themes/${themeId}/random`);
      const data = await res.json();
      setVerse(data.verse);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap justify-center gap-3">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => fetchRandomVerse(t.id)}
            disabled={loading}
            className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 border shadow-lg active:scale-95
              ${selectedTheme === t.id 
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-indigo-500/20' 
                : 'bg-neutral-800/50 border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:bg-neutral-800'
              }`}
          >
            {t.theme}
            <ChevronRight size={16} className={selectedTheme === t.id ? 'translate-x-1 transition-transform' : ''} />
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 animate-pulse">
            <Sparkles className="w-12 h-12 text-indigo-500 animate-bounce mb-4" />
            <p className="text-indigo-400 font-medium tracking-widest uppercase text-sm">Searching the Word...</p>
        </div>
      )}

      {verse && !loading && (
        <div className="max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
          <div className="bg-neutral-800/40 backdrop-blur-md border border-neutral-700/50 rounded-[2.5rem] overflow-hidden shadow-2xl">
            {verse.verseimagelink && (
               <div className="aspect-video w-full bg-neutral-900 overflow-hidden relative group">
                  <img 
                    src={verse.verseimagelink} 
                    alt="Verse" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-indigo-600/90 text-white text-xs font-bold rounded-full uppercase tracking-tighter backdrop-blur-md">
                     <BookOpen size={14} /> Theme: {themes.find(t => t.id === selectedTheme)?.theme}
                  </div>
               </div>
            )}
            
            <div className="p-8 md:p-12 space-y-8">
              <div className="space-y-4">
                <p className="text-2xl md:text-3xl font-medium leading-relaxed text-indigo-100 italic">
                  "{verse.english}"
                </p>
                <p className="text-indigo-400 font-bold uppercase tracking-widest text-sm">
                  — {verse.englishReference}
                </p>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent w-full" />

              <div className="space-y-4 text-right">
                <p className="text-2xl md:text-3xl font-bold leading-relaxed text-pink-100">
                  "{verse.telugu}"
                </p>
                <p className="text-pink-400 font-bold tracking-wider text-sm">
                  — {verse.teluguReference}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <button 
                onClick={() => fetchRandomVerse(selectedTheme!)}
                className="flex items-center gap-2 px-8 py-4 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-full font-bold transition-all hover:scale-105 active:scale-95"
            >
                <Sparkles size={18} />
                Show Another One
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
