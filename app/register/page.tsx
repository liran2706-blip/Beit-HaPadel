'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { PLAYER_LEVELS, PlayerLevel } from '@/types';

export default function RegisterPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState<PlayerLevel>(3);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  if (!mounted) return null;

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName || !lastName || !phone || !email || !password) {
      setError('יש למלא את כל השדות');
      return;
    }
    if (password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }
    setLoading(true);
    setError('');
    const supabase = createClient();

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, phone, level },
      },
    });

    if (authError) {
      setError(authError.message === 'User already registered' ? 'אימייל זה כבר רשום' : authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        first_name: firstName,
        last_name: lastName,
        phone,
        level,
        is_admin: false,
      });

      if (profileError && profileError.code !== '23505') {
        setError('שגיאה: ' + (profileError?.message ?? 'unknown'));
        setLoading(false);
        return;
      }
    }

    window.location.href = '/';
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-4 py-8" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-black text-2xl">
            <span className="text-white">ISRAEL</span>
            <span className="text-blue-400"> PADEL</span>
          </Link>
          <p className="text-blue-300 mt-2">יצירת חשבון חדש</p>
        </div>

        <div className="bg-[#0f2347] border border-blue-900 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-blue-300 mb-1.5">שם פרטי</label>
                <input
                  type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  placeholder="ישראל"
                  className="w-full bg-blue-950 border border-blue-800 rounded-xl px-3 py-2.5 text-white placeholder-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-300 mb-1.5">שם משפחה</label>
                <input
                  type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                  placeholder="ישראלי"
                  className="w-full bg-blue-950 border border-blue-800 rounded-xl px-3 py-2.5 text-white placeholder-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-300 mb-1.5">טלפון</label>
              <input
                type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="050-0000000" dir="ltr"
                className="w-full bg-blue-950 border border-blue-800 rounded-xl px-3 py-2.5 text-white placeholder-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-300 mb-1.5">אימייל</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" dir="ltr"
                className="w-full bg-blue-950 border border-blue-800 rounded-xl px-3 py-2.5 text-white placeholder-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-300 mb-1.5">סיסמה</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="לפחות 6 תווים" dir="ltr"
                className="w-full bg-blue-950 border border-blue-800 rounded-xl px-3 py-2.5 text-white placeholder-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-300 mb-1.5">רמת משחק</label>
              <select
                value={level} onChange={(e) => setLevel(parseFloat(e.target.value) as PlayerLevel)}
                className="w-full bg-blue-950 border border-blue-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PLAYER_LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 text-white font-bold py-3.5 rounded-xl text-lg transition-colors"
            >
              {loading ? 'יוצר חשבון...' : 'צור חשבון'}
            </button>
          </form>

          <p className="text-center text-blue-400 text-sm mt-4">
            כבר יש לך חשבון?{' '}
            <Link href="/login" className="text-blue-300 hover:text-white font-semibold">
              כניסה
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
