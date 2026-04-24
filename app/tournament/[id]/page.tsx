'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { createClient } from '@/lib/supabase/client';
import { Tournament, RegistrationWithProfile, TournamentRegistration, Profile } from '@/types';

type Tab = 'overview' | 'players' | 'standings';

const statusLabel: Record<string, string> = {
  pending: 'ממתין לאישור',
  approved: 'מאושר',
  rejected: 'נדחה',
};

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
};

export default function TournamentPage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<Tab>('overview');
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationWithProfile[]>([]);
  const [myReg, setMyReg] = useState<TournamentRegistration | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [registering, setRegistering] = useState(false);
  const [medicalApproved, setMedicalApproved] = useState(false);
  const [showDeclaration, setShowDeclaration] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const { data: t } = await supabase.from('tournaments').select('*').eq('id', id).single();
      setTournament(t);

      const { data: regs } = await supabase
        .from('tournament_registrations')
        .select('*, profile:profiles(*)')
        .eq('tournament_id', id)
        .order('created_at', { ascending: true });

      setRegistrations(regs ?? []);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(p);
        const myR = regs?.find((r: any) => r.player_id === user.id) ?? null;
        setMyReg(myR);
      }

      setLoading(false);
    }
    load();
  }, [id]);

  async function handleRegister() {
    if (!profile) { window.location.href = `/login?next=/tournament/${id}`; return; }
    if (!medicalApproved) { setError('יש לאשר את ההצהרה הרפואית'); return; }
    setRegistering(true);
    setError('');
    const supabase = createClient();
    const { data, error: regError } = await supabase
      .from('tournament_registrations')
      .insert({ tournament_id: id, player_id: profile.id, status: 'pending' })
      .select('*, profile:profiles(*)')
      .single();

    if (regError) {
      setError('שגיאה בהרשמה. נסה שוב.');
      setRegistering(false);
    } else {
      setMyReg(data);
      setRegistrations((prev) => [...prev, data]);
      setRegistering(false);
      // Redirect to PayBox immediately after registration
      if (tournament?.paybox_url) {
        window.location.href = tournament.paybox_url;
      }
    }
  }

  if (loading) return (
    <>
      <Navbar />
      <div className="text-center py-20 text-slate-400">טוען...</div>
    </>
  );

  if (!tournament) return (
    <>
      <Navbar />
      <div className="text-center py-20 text-slate-400">טורניר לא נמצא</div>
    </>
  );

  const approvedCount = registrations.filter(r => r.status === 'approved').length;
  const totalCount = registrations.length;
  const available = tournament.max_players - approvedCount;
  const isFull = available <= 0;

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-6" dir="rtl">

        {/* Header */}
        <div className="bg-[#0a1628] text-white rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-2xl font-black leading-tight">{tournament.title}</h1>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
              tournament.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
            }`}>
              {tournament.status === 'active' ? 'פעיל' : 'קרוב'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-blue-300 text-xs">תאריך</p>
              <p className="font-semibold mt-0.5">
                {new Date(tournament.date).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-blue-300 text-xs">שעות</p>
              <p className="font-semibold mt-0.5">{tournament.time_start}–{tournament.time_end}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-blue-300 text-xs">מיקום</p>
              <p className="font-semibold mt-0.5">{tournament.location}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-blue-300 text-xs">מחיר</p>
              <p className="font-semibold mt-0.5">₪{tournament.price}</p>
            </div>
          </div>

          {/* Register button */}
          {!myReg ? (
            <div className="space-y-3">
              {isFull ? (
                <div className="bg-red-900/30 border border-red-500/30 text-red-300 rounded-xl p-3 text-center text-sm">
                  הטורניר מלא
                </div>
              ) : (
                <>
                  {/* Medical Declaration */}
                  <div className="border border-blue-700 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowDeclaration(!showDeclaration)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-blue-900/40 text-blue-200 text-sm font-semibold"
                    >
                      <span>הצהרה רפואית</span>
                      <span>{showDeclaration ? '▲' : '▼'}</span>
                    </button>
                    {showDeclaration && (
                      <div className="px-4 py-3 text-blue-200 text-xs leading-relaxed space-y-1.5 max-h-44 overflow-y-auto bg-blue-950/40">
                        <p className="font-semibold">אני החתום מטה מצהיר ומאשר בזאת כי:</p>
                        <p>1. מצבי הבריאותי תקין, וכי אין לי כל מגבלה רפואית המונעת ממני להשתתף בפעילות ספורטיבית מסוג פאדל.</p>
                        <p>2. אני מודע לכך שהשתתפות בפעילות ספורטיבית כרוכה במאמץ פיזי ובסיכונים מסוימים, לרבות פציעות, נפילות או פגיעות גוף שונות.</p>
                        <p>3. אני לוקח על עצמי את מלוא האחריות להשתתפותי בטורניר, ומאשר כי ההשתתפות נעשית על אחריותי האישית בלבד.</p>
                        <p>4. אני מתחייב להפסיק את הפעילות באופן מיידי במקרה של תחושת כאב, סחרחורת או כל סימפטום חריג אחר.</p>
                        <p>5. אני מצהיר כי אין לי מחלה, פציעה או מצב רפואי אחר אשר עלול לסכן אותי או משתתפים אחרים במהלך הפעילות.</p>
                        <p>6. ידוע לי כי מארגני הטורניר אינם אחראים לכל נזק, פציעה או אובדן שעלולים להיגרם לי במהלך ההשתתפות, למעט במקרה של רשלנות מוכחת על פי דין.</p>
                        <p>7. אני מאשר כי האחריות לביטוח אישי, לרבות ביטוח תאונות אישיות, חלה עליי בלבד.</p>
                      </div>
                    )}
                    <label className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-blue-900/20">
                      <input
                        type="checkbox"
                        checked={medicalApproved}
                        onChange={(e) => setMedicalApproved(e.target.checked)}
                        className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
                      />
                      <span className="text-blue-200 text-sm">
                        קראתי את ההצהרה הרפואית ואני מסכים לכל התנאים
                      </span>
                    </label>
                  </div>

                  <button
                    onClick={handleRegister} disabled={registering || !medicalApproved}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
                  >
                    {registering ? 'נרשם...' : 'הרשמה לטורניר'}
                  </button>
                </>
              )}
              {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
            </div>
          ) : (
            <div className="space-y-2">
              <div className={`rounded-xl p-3 text-center text-sm font-semibold ${statusColor[myReg.status]}`}>
                הסטטוס שלך: {statusLabel[myReg.status]}
                {myReg.status === 'approved' && tournament.paybox_url && (
                  <a
                    href={tournament.paybox_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg transition-colors"
                  >
                    לתשלום ב-PayBox
                  </a>
                )}
              </div>
              {myReg.status === 'approved' && (tournament as any).whatsapp_url && (
                <a
                  href={(tournament as any).whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  הצטרף לקבוצת WhatsApp
                </a>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
          {([
            { key: 'overview', label: 'סקירה' },
            { key: 'players', label: `שחקנים ${totalCount}` },
            { key: 'standings', label: 'טבלת דירוג' },
          ] as { key: Tab; label: string }[]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <h3 className="font-bold text-slate-800 mb-3">פרטי הטורניר</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>רמת שחקנים</span>
                  <span className="font-semibold">{tournament.level_min}–{tournament.level_max}</span>
                </div>
                <div className="flex justify-between">
                  <span>מקסימום שחקנים</span>
                  <span className="font-semibold">{tournament.max_players}</span>
                </div>
                <div className="flex justify-between">
                  <span>נרשמו</span>
                  <span className="font-semibold">{totalCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>מקומות פנויים</span>
                  <span className={`font-semibold ${isFull ? 'text-red-500' : available <= 4 ? 'text-orange-500' : 'text-green-600'}`}>
                    {isFull ? 'מלא' : available}
                  </span>
                </div>
              </div>
            </div>

            {tournament.description && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4">
                <h3 className="font-bold text-slate-800 mb-2">תיאור</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{tournament.description}</p>
              </div>
            )}
          </div>
        )}

        {tab === 'players' && (
          <div className="space-y-2">
            {registrations.length === 0 ? (
              <p className="text-center text-slate-400 py-10">אין נרשמים עדיין</p>
            ) : (
              registrations.map((reg, i) => (
                <div key={reg.id} className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                    {reg.profile.first_name.charAt(0)}{reg.profile.last_name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 text-sm">
                      {reg.profile.first_name} {reg.profile.last_name.charAt(0)}.
                    </p>
                    <p className="text-xs text-slate-400">רמה {reg.profile.level}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">#{i + 1}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[reg.status]}`}>
                      {statusLabel[reg.status]}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'standings' && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-3xl mb-3">🏆</p>
            <p className="font-medium text-slate-600">טבלת הדירוג תתעדכן לאחר תחילת הטורניר</p>
          </div>
        )}
      </main>
    </>
  );
}
