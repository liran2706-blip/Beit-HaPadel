'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { createClient } from '@/lib/supabase/client';
import { Profile, TournamentRegistration, Tournament, PLAYER_LEVELS, PlayerLevel } from '@/types';

interface RegWithTournament extends TournamentRegistration {
  tournament: Tournament;
}

const statusLabel: Record<string, string> = {
  pending: 'ממתין לאישור',
  approved: 'מאושר',
  rejected: 'נדחה',
};

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [registrations, setRegistrations] = useState<RegWithTournament[]>([]);
  const [editing, setEditing] = useState(false);
  const [level, setLevel] = useState<PlayerLevel>(3);
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }

      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(p);
      setLevel(p?.level ?? 3);
      setPhone(p?.phone ?? '');

      const { data: regs } = await supabase
        .from('tournament_registrations')
        .select('*, tournament:tournament_id(id, title, date, location, status)')
        .eq('player_id', user.id)
        .order('created_at', { ascending: false });

      setRegistrations(regs ?? []);
    }
    load();
  }, []);

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from('profiles').update({ level, phone }).eq('id', profile.id);
    setProfile({ ...profile, level, phone });
    setEditing(false);
    setSaving(false);
  }

  if (!profile) return (
    <>
      <Navbar />
      <div className="text-center py-20 text-slate-400">טוען...</div>
    </>
  );

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8" dir="rtl">
        {/* Profile card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center text-white font-black text-xl">
              {profile.first_name.charAt(0)}{profile.last_name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-slate-500 text-sm">{profile.phone}</p>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="mr-auto text-sm text-blue-600 hover:text-blue-800 border border-blue-200 px-3 py-1.5 rounded-lg"
            >
              {editing ? 'ביטול' : 'עריכה'}
            </button>
          </div>

          {editing ? (
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">טלפון</label>
                <input
                  type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">רמת משחק</label>
                <select
                  value={level} onChange={(e) => setLevel(parseFloat(e.target.value) as PlayerLevel)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {PLAYER_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <button
                onClick={handleSave} disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors"
              >
                {saving ? 'שומר...' : 'שמור שינויים'}
              </button>
            </div>
          ) : (
            <div className="flex gap-4 border-t border-slate-100 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-700">{profile.level}</p>
                <p className="text-xs text-slate-500">רמה</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">{registrations.length}</p>
                <p className="text-xs text-slate-500">טורנירים</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {registrations.filter(r => r.status === 'approved').length}
                </p>
                <p className="text-xs text-slate-500">מאושרים</p>
              </div>
            </div>
          )}
        </div>

        {/* Registrations */}
        <h2 className="text-lg font-bold text-slate-800 mb-3">הטורנירים שלי</h2>
        {registrations.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <p className="mb-3">לא נרשמת עדיין לאף טורניר</p>
            <Link href="/" className="text-blue-600 hover:underline text-sm">
              צפה בטורנירים זמינים
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {registrations.map((reg) => (
              <Link key={reg.id} href={`/tournament/${reg.tournament_id}`}>
                <div className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">{reg.tournament.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(reg.tournament.date).toLocaleDateString('he-IL')} · {reg.tournament.location}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[reg.status]}`}>
                      {statusLabel[reg.status]}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
