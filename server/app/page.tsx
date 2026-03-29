import Link from 'next/link';
import DeveloperPlayground from './components/DeveloperPlayground';
import { Terminal } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-indigo-500/30">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-8 text-center space-y-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-1000">
            Now Live: Version 1.0
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-br from-white via-white to-indigo-400 text-transparent bg-clip-text animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            Holy Canvas API
          </h1>
          
          <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto leading-relaxed font-light animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            The premium backend engine powering dynamic daily verses, custom themes, and divine inspiration for your digital sanctuary.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <Link href="/admin" className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black tracking-tight transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center gap-3">
            Go to Admin Dashboard
            <span className="opacity-50">→</span>
          </Link>
        </div>
      </div>



      {/* Developer Playground Section */}
      <div className="max-w-6xl mx-auto px-8 py-20 border-t border-neutral-800 animate-in fade-in duration-1000 delay-800">
        <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-black tracking-tight text-white flex items-center justify-center gap-3">
              <Terminal className="text-indigo-500" />
              API Playground
            </h2>
            <p className="text-neutral-500 font-medium max-w-xl mx-auto italic leading-relaxed">
              For developers and explorers. Test your endpoints directly from the browser to see the raw JSON responses for your app.
            </p>
        </div>
        
        <DeveloperPlayground />
      </div>

      <footer className="py-12 px-8 border-t border-neutral-800 text-center text-neutral-600 text-sm font-medium tracking-wide">
        &copy; 2026 Holy Canvas App. Built for the Glory of God.
      </footer>
    </div>
  );
}
