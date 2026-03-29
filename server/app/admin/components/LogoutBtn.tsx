'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

export default function LogoutBtn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <button 
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors rounded-xl border border-red-500/20 active:scale-95 disabled:opacity-50"
    >
      <LogOut size={16} />
      {loading ? 'Logging out...' : 'Sign Out'}
    </button>
  );
}
