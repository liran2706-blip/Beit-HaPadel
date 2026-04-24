'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const LEVEL_COLORS: Record<string, string> = {
  '2': 'bg-green-100 text-green-700',
  '2.5': 'bg-green-100 text-green-700',
  '3': 'bg-blue-100 text-blue-700',
  '3.5': 'bg-blue-100 text-blue-700',
  '4': 'bg-purple-100 text-purple-700',
  '4.5': 'bg-purple-100 text-purple-700',
  '5': 'bg-red-100 text-red-700',
};

const MONTH_NAMES = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
];

export default function TournamentList() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from('tournaments')
        .select('*')
        .in('status', ['upcoming', 'active'])
        .order('date', { ascending: true });

      if (data) {
        const enriched = await Promise.all(data.map(async (t: any) => {
          const { count } = await supabase
            .from('tournament_registrations')
            .select('*', { count: 'exact', head: true })
            .eq('tournament_id', t.id)
            .eq('status', 'approved');
          return { ...t, approved_count: count ?? 0 };
        }));
        setTournaments(enriched);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (tournaments.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-4xl mb-3">🎾</p>
        <p className="text-lg font-medium text-slate-600">אין טורנירים פעילים כרגע</p>
        <p className="text-sm mt-1">בקרוב יפורסמו טורנירים חדשים</p>
      </div>
    );
  }

  // Group by month
  const grouped: Record<string, any[]> = {};
  tournaments.forEach(t => {
    const date = new Date(t.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(t);
  });

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([key, group]) => {
        const [year, month] = key.split('-').map(Number);
        return (
          <div key={key}>
            {/* Month header */}
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-black text-slate-800">
                {MONTH_NAMES[month]} {year}
              </h3>
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">{group.length} טורנירים</span>
            </div>

            {/* Tournament cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {group.map((t) => {
                const available = t.max_players - t.approved_count;
                const isFull = available <= 0;
                const isLow = available > 0 && available <= 4;
                const fillPercent = Math.min(100, Math.round((t.approved_count / t.max_players) * 100));
                const isActive = t.status === 'active';

                return (
                  <Link key={t.id} href={`/tournament/${t.id}`}>
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group">

                      {/* Card header / image placeholder */}
                      <div className="bg-gradient-to-br from-[#0a1628] to-[#1a3060] h-28 relative flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[url('/beit-hapadel.png')] bg-cover bg-center" />
                        <div className="relative text-center px-4">
                          <p className="text-white font-black text-lg leading-tight group-hover:text-blue-300 transition-colors">
                            {t.title}
                          </p>
                        </div>
                        {isActive && (
                          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                            LIVE
                          </div>
                        )}
                        {isFull && (
                          <div className="absolute top-2 left-2 bg-slate-800/80 text-slate-300 text-xs font-semibold px-2 py-1 rounded-full">
                            מלא
                          </div>
                        )}
                      </div>

                      {/* Card body */}
                      <div className="p-4">
                        {/* Tags */}
                        <div className="flex items-center gap-1.5 flex-wrap mb-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${LEVEL_COLORS[String(t.level_min)] ?? 'bg-slate-100 text-slate-600'}`}>
                            {t.level_min}–{t.level_max}
                          </span>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            📍 {t.location}
                          </span>
                          {(t as any).whatsapp_url && (
                            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                              WhatsApp ✓
                            </span>
                          )}
                        </div>

                        {/* Date & time */}
                        <div className="flex items-center gap-3 text-sm text-slate-600 mb-3">
                          <span className="flex items-center gap-1">
                            📅 {new Date(t.date).toLocaleDateString('he-IL', { weekday: 'short', day: 'numeric', month: 'numeric' })}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span>⏰ {t.time_start}–{t.time_end}</span>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>{t.approved_count} נרשמו</span>
                            <span className={isFull ? 'text-red-500 font-semibold' : isLow ? 'text-orange-500 font-semibold' : ''}>
                              {isFull ? 'מלא' : isLow ? `נותרו ${available} בלבד!` : `${available} מקומות`}
                            </span>
                          </div>
                          <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${isFull ? 'bg-red-400' : isLow ? 'bg-orange-400' : 'bg-blue-500'}`}
                              style={{ width: `${fillPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-black text-slate-800">
                            ₪{t.price}
                            <span className="text-xs text-slate-400 font-normal mr-1">/ שחקן</span>
                          </span>
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${
                            isFull
                              ? 'bg-slate-100 text-slate-400'
                              : 'bg-blue-600 text-white group-hover:bg-blue-500 transition-colors'
                          }`}>
                            {isFull ? 'מלא' : 'הרשמה עכשיו'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
