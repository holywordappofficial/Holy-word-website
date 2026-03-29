'use client';

import { useState, useEffect } from 'react';
import { Terminal, ExternalLink, Code2 } from 'lucide-react';

export default function DeveloperPlayground() {
  const [firstTheme, setFirstTheme] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/themes')
      .then(res => res.json())
      .then(data => {
        if (data.themes && data.themes.length > 0) {
          setFirstTheme(data.themes[0].id);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const routes = [
    {
      name: 'All Themes',
      path: '/api/themes',
      desc: 'Retrieves a list of all theme identifiers, names, and total verse counts.',
      method: 'GET'
    },
    {
      name: 'Global Random Verse',
      path: '/api/random',
      desc: 'Fetches a single random verse from across the entire divine catalog.',
      method: 'GET'
    },
    {
      name: 'Theme Random Verse',
      path: firstTheme ? `/api/themes/${firstTheme}/random` : '/api/themes/[id]/random',
      desc: 'Fetches a random verse from a specific theme identified by its ID.',
      method: 'GET',
      isDynamic: !firstTheme
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {routes.map((route, i) => (
        <div key={i} className="bg-neutral-950 border border-neutral-800 p-6 rounded-3xl space-y-4 hover:border-indigo-500/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 px-2 py-1 bg-indigo-500/10 rounded-md">
              {route.method}
            </span>
            <Code2 size={16} className="text-neutral-700 group-hover:text-indigo-500 transition-colors" />
          </div>
          
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">{route.name}</h3>
            <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed h-10">
              {route.desc}
            </p>
          </div>

          <div className="p-3 bg-neutral-900 rounded-xl font-mono text-[10px] text-neutral-400 break-all select-all flex items-center justify-between">
            {route.path}
            <a 
              href={route.path} 
              target="_blank" 
              className="text-indigo-400 hover:text-indigo-300 ml-2"
              title="Try Now"
            >
              <ExternalLink size={12} />
            </a>
          </div>

          <a
            href={route.path}
            target="_blank"
            className="block w-full text-center py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-bold transition-all active:scale-95"
          >
            Try Now
          </a>
        </div>
      ))}
    </div>
  );
}
