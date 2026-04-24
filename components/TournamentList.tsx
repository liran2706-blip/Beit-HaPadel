'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { TournamentWithCount, PLAYER_LEVELS } from '@/types';

export default function TournamentList() {
  const [tournaments, setTournaments] = useState<TournamentWithCount[]>([]);
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
            .eq('tournament_id', t.id);
          return { ...t, registration_count: count ?? 0 };
        }));
        setTournaments(enriched);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p className="text-slate-400 text-center py-10">טוען...</p>;

  if (tournaments.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-4xl mb-3">🎾</p>
        <p className="text-lg font-medium text-slate-600">אין טורנירים פעילים כרגע</p>
        <p className="text-sm mt-1">בקרוב יפורסמו טורנירים חדשים</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {tournaments.map((t) => {
        const available = t.max_players - t.registration_count;
        const isFull = available <= 0;
        const isLow = available > 0 && available <= 4;

        return (
          <Link key={t.id} href={`/tournament/${t.id}`}>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">{t.title}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {new Date(t.date).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                  t.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {t.status === 'active' ? 'פעיל' : 'קרוב'}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                <span>📍 {t.location}</span>
                <span>⏰ {t.time_start}–{t.time_end}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                    רמה {t.level_min}–{t.level_max}
                  </span>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-semibold">
                    ₪{t.price}
                  </span>
                  {(t as any).whatsapp_url && (
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg font-semibold flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </span>
                  )}
                </div>
                <span className={`text-xs font-medium ${
                  isFull ? 'text-red-500' : isLow ? 'text-orange-500' : 'text-slate-500'
                }`}>
                  {isFull ? 'מלא' : `${available} מקומות פנויים`}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
