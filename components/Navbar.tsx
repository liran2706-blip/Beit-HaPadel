'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types';

export default function Navbar() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      setProfile(data);
    }
    load();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  if (!mounted) return <nav className="bg-[#0a1628] text-white px-4 py-3 sticky top-0 z-50"><div className="max-w-4xl mx-auto flex items-center justify-between"><span className="font-black text-xl"><span className="text-white">בית</span><span className="text-blue-400"> הפאדל</span></span></div></nav>;

  return (
    <nav className="bg-[#0a1628] text-white px-4 py-3 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-black text-xl tracking-tight">
          <span className="text-white">בית</span>
          <span className="text-blue-400"> הפאדל</span>
          <Image src="/il.png" alt="ישראל" width={22} height={22} className="mr-1 inline-block" />
        </Link>

        <div className="flex items-center gap-3">
          {profile ? (
            <>
              {profile.is_admin && (
                <Link href="/admin" className="text-xs bg-blue-700 hover:bg-blue-600 px-3 py-1.5 rounded-lg transition-colors">
                  ניהול
                </Link>
              )}
              <Link href="/profile" className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">
                  {profile.first_name.charAt(0)}{profile.last_name.charAt(0)}
                </div>
                <span className="hidden sm:block text-blue-200 text-xs">{profile.first_name}</span>
              </Link>
              <button onClick={handleLogout} className="text-xs text-blue-400 hover:text-white transition-colors">
                יציאה
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-blue-300 hover:text-white transition-colors">
                כניסה
              </Link>
              <Link href="/register" className="text-sm bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition-colors font-medium">
                הרשמה
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
