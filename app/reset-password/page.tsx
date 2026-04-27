'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // קרא token מה-URL hash
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token') || '';
      if (accessToken) {
        supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
          .then(() => setReady(true));
        return;
      }
    }

    // אחרת בדוק session רגיל
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
  }, []);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) { setError('הסיסמה חייבת להכיל לפחות 6 תווים'); return; }
    if (password !== confirm) { setError('הסיסמאות אינן תואמות'); return; }
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError('שגיאה: ' + error.message);
    } else {
      setSuccess(true);
      setTimeout(() => { window.location.href = '/'; }, 2000);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-black text-2xl">
            <span className="text-white">בית</span>
            <span className="text-blue-400"> הפאדל</span>
          </Link>
          <p className="text-blue-300 mt-2">איפוס סיסמה</p>
        </div>

        <div className="bg-[#0f2347] border border-blue-900 rounded-2xl p-6">
          {success ? (
            <div className="text-center">
              <p className="text-3xl mb-3">✅</p>
              <p className="text-green-400 font-bold text-lg">הסיסמה עודכנה בהצלחה!</p>
              <p className="text-blue-300 text-sm mt-2">מעביר אותך לדף הבית...</p>
            </div>
          ) : !ready ? (
            <div className="text-center space-y-3">
              <p className="text-blue-300">טוען...</p>
              <p className="text-blue-400 text-sm">אם הדף לא נטען תוך כמה שניות,{' '}
                <Link href="/login" className="text-blue-300 underline">לחץ כאן לכניסה</Link>
              </p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <p className="text-blue-300 text-sm mb-2">הזן סיסמה חדשה לחשבונך.</p>
              <div>
                <label className="block text-sm font-semibold text-blue-300 mb-1.5">סיסמה חדשה</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="לפחות 6 תווים" dir="ltr" required
                  className="w-full bg-blue-950 border border-blue-800 rounded-xl px-3 py-2.5 text-white placeholder-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-300 mb-1.5">אימות סיסמה</label>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  placeholder="הזן שוב את הסיסמה" dir="ltr" required
                  className="w-full bg-blue-950 border border-blue-800 rounded-xl px-3 py-2.5 text-white placeholder-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-xl px-3 py-2">{error}</p>
              )}

              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 text-white font-bold py-3.5 rounded-xl text-lg transition-colors"
              >
                {loading ? 'מעדכן...' : 'עדכן סיסמה'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
