import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center text-white font-sans p-8 text-center space-y-8">
      <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-indigo-400 to-pink-400 text-transparent bg-clip-text">
        Holy Word Studio API
      </h1>
      
      <p className="text-xl text-neutral-400 max-w-lg leading-relaxed">
        The backend engine powering dynamic daily verses and custom themes.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 pt-8">
        <Link href="/api/themes" className="px-6 py-3 border border-neutral-700 hover:bg-neutral-800 rounded-xl font-medium transition-colors">
          View All Themes (JSON)
        </Link>
        <Link href="/api/random" className="px-6 py-3 border border-neutral-700 hover:bg-neutral-800 rounded-xl font-medium transition-colors">
          Get Random Verse (JSON)
        </Link>
      </div>

      <div className="pt-16 border-t border-neutral-800 w-full max-w-md">
        <Link href="/admin" className="block w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-colors">
          Go to Admin / Content Dashboard
        </Link>
      </div>
    </div>
  );
}
