'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { createClient } from '@/lib/supabase/client';
import { Tournament, RegistrationWithProfile } from '@/types';

export default function AdminPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // New tournament form
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [timeStart, setTimeStart] = useState('09:00');
  const [timeEnd, setTimeEnd] = useState('11:00');
  const [location, setLocation] = useState('');
  const [levelMin, setLevelMin] = useState(2.5);
  const [levelMax, setLevelMax] = useState(3.5);
  const [price, setPrice] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(20);
  const [payboxUrl, setPayboxUrl] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [editingTournament, setEditingTournament] = useState<typeof tournaments[0] | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }

      const { data: p } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
      if (!p?.is_admin) { window.location.href = '/'; return; }
      setIsAdmin(true);

      const { data: t } = await supabase.from('tournaments').select('*').order('date', { ascending: false });
      setTournaments(t ?? []);
      if (t && t.length > 0) setSelected(t[0].id);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (!selected) return;
    async function loadRegs() {
      const supabase = createClient();
      const { data } = await supabase
        .from('tournament_registrations')
        .select('*, profile:profiles(*)')
        .eq('tournament_id', selected)
        .order('created_at', { ascending: true });
      setRegistrations(data ?? []);
    }
    loadRegs();
  }, [selected]);

  async function updateStatus(regId: string, status: 'approved' | 'rejected') {
    const supabase = createClient();
    await supabase.from('tournament_registrations').update({ status }).eq('id', regId);
    setRegistrations((prev) => prev.map((r) => r.id === regId ? { ...r, status } : r));
  }

  async function deleteRegistration(regId: string) {
    if (!confirm('האם למחוק את הרישום לחלוטין?')) return;
    const supabase = createClient();
    await supabase.from('tournament_registrations').delete().eq('id', regId);
    setRegistrations((prev) => prev.filter((r) => r.id !== regId));
  }

  async function deleteTournament(id: string) {
    if (!confirm('האם למחוק את הטורניר לחלוטין? פעולה זו תמחק גם את כל הנרשמים.')) return;
    const supabase = createClient();
    await supabase.from('tournaments').delete().eq('id', id);
    setTournaments((prev) => prev.filter(t => t.id !== id));
    if (selected === id) setSelected(null);
  }

  function startEdit(t: typeof tournaments[0]) {
    setEditingTournament(t);
    setTitle(t.title);
    setDate(t.date);
    setTimeStart(t.time_start);
    setTimeEnd(t.time_end);
    setLocation(t.location);
    setLevelMin(t.level_min);
    setLevelMax(t.level_max);
    setPrice(t.price);
    setMaxPlayers(t.max_players);
    setPayboxUrl(t.paybox_url || '');
    setWhatsappUrl(t.whatsapp_url || '');
    setImageUrl((t as any).image_url || '');
    setDescription(t.description || '');
    setShowForm(true);
  }

  async function updateTournament(e: React.FormEvent) {
    e.preventDefault();
    if (!editingTournament) return;
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase.from('tournaments').update({
      title, date, time_start: timeStart, time_end: timeEnd,
      location, level_min: levelMin, level_max: levelMax,
      price, max_players: maxPlayers,
      paybox_url: payboxUrl || null,
      whatsapp_url: whatsappUrl || null,
      image_url: imageUrl || null,
      description: description || null,
    }).eq('id', editingTournament.id).select().single();

    if (!error && data) {
      setTournaments((prev) => prev.map(t => t.id === data.id ? data : t));
      setEditingTournament(null);
      setShowForm(false);
      setTitle(''); setDate(''); setLocation(''); setPayboxUrl(''); setWhatsappUrl(''); setImageUrl(''); setDescription('');
    }
    setSaving(false);
  }

  async function createTournament(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase.from('tournaments').insert({
      title, date, time_start: timeStart, time_end: timeEnd,
      location, level_min: levelMin, level_max: levelMax,
      price, max_players: maxPlayers,
      paybox_url: payboxUrl || null,
      whatsapp_url: whatsappUrl || null,
      image_url: imageUrl || null,
      description: description || null,
      status: 'upcoming',
    }).select().single();

    if (!error && data) {
      setTournaments((prev) => [data, ...prev]);
      setSelected(data.id);
      setShowForm(false);
      setTitle(''); setDate(''); setLocation(''); setPayboxUrl(''); setWhatsappUrl(''); setImageUrl(''); setDescription('');
    }
    setSaving(false);
  }

  if (loading) return (
    <>
      <Navbar />
      <div className="text-center py-20 text-slate-400">טוען...</div>
    </>
  );

  const selectedTournament = tournaments.find(t => t.id === selected);
  const pending = registrations.filter(r => r.status === 'pending');
  const approved = registrations.filter(r => r.status === 'approved');

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">ניהול טורנירים</h1>
          <button
            onClick={() => { setShowForm(!showForm); setEditingTournament(null); setTitle(''); setDate(''); setLocation(''); setPayboxUrl(''); setWhatsappUrl(''); setImageUrl(''); setDescription(''); }}
            className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
          >
            {showForm ? 'ביטול' : '+ טורניר חדש'}
          </button>
        </div>

        {/* Create tournament form */}
        {showForm && (
          <div className="bg-white border border-blue-200 rounded-2xl p-5 mb-6">
            <h2 className="font-bold text-slate-800 mb-4">טורניר חדש</h2>
            <form onSubmit={editingTournament ? updateTournament : createTournament} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">שם הטורניר</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">תאריך</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} required
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">שעת התחלה</label>
                  <input type="time" value={timeStart} onChange={e => setTimeStart(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">שעת סיום</label>
                  <input type="time" value={timeEnd} onChange={e => setTimeEnd(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">מיקום</label>
                  <input type="text" value={location} onChange={e => setLocation(e.target.value)} required
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">מחיר (₪)</label>
                  <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} min={0}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">רמה מינימום</label>
                  <select value={levelMin} onChange={e => setLevelMin(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                    {[2,2.5,3,3.5,4,4.5,5].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">רמה מקסימום</label>
                  <select value={levelMax} onChange={e => setLevelMax(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                    {[2,2.5,3,3.5,4,4.5,5].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">מקסימום שחקנים</label>
                  <input type="number" value={maxPlayers} onChange={e => setMaxPlayers(Number(e.target.value))} min={4}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">קישור PayBox</label>
                  <input type="url" value={payboxUrl} onChange={e => setPayboxUrl(e.target.value)} placeholder="https://..."
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" dir="ltr" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">קבוצת WhatsApp</label>
                  <input type="url" value={whatsappUrl} onChange={e => setWhatsappUrl(e.target.value)} placeholder="https://chat.whatsapp.com/..."
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" dir="ltr" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">תמונת טורניר (URL)</label>
                  <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..."
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" dir="ltr" />
                  {imageUrl && (
                    <img src={imageUrl} alt="preview" className="mt-2 w-full h-20 object-cover rounded-lg border border-slate-200" />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">תיאור (אופציונלי)</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <button type="submit" disabled={saving}
                className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl transition-colors">
                {saving ? 'שומר...' : editingTournament ? 'שמור שינויים' : 'צור טורניר'}
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tournament list */}
          <div className="md:col-span-1">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">טורנירים</h2>
            <div className="space-y-2">
              {tournaments.map((t) => (
                <div
                  key={t.id}
                  className={`w-full text-right px-4 py-3 rounded-xl border transition-colors cursor-pointer ${
                    selected === t.id
                      ? 'bg-blue-700 border-blue-700 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
                  }`}
                  onClick={() => setSelected(t.id)}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{t.title}</p>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); startEdit(t); }}
                        className={`text-xs px-2 py-0.5 rounded-lg transition-colors ${selected === t.id ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                      >
                        עריכה
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteTournament(t.id); }}
                        className="text-xs px-2 py-0.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                  <p className={`text-xs mt-0.5 ${selected === t.id ? 'text-blue-200' : 'text-slate-400'}`}>
                    {new Date(t.date).toLocaleDateString('he-IL')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Registrations */}
          <div className="md:col-span-2">
            {selectedTournament && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    נרשמים — {selectedTournament.title}
                  </h2>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg font-semibold">
                      ממתינים: {pending.length}
                    </span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg font-semibold">
                      מאושרים: {approved.length}
                    </span>
                  </div>
                </div>

                {registrations.length === 0 ? (
                  <p className="text-center text-slate-400 py-10">אין נרשמים עדיין</p>
                ) : (
                  <div className="space-y-2">
                    {registrations.map((reg) => (
                      <div key={reg.id} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                          {reg.profile.first_name.charAt(0)}{reg.profile.last_name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-sm">
                            {reg.profile.first_name} {reg.profile.last_name}
                          </p>
                          <p className="text-xs text-slate-400">{reg.profile.phone} · רמה {reg.profile.level}</p>
                        </div>

                        {reg.status === 'pending' ? (
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              onClick={() => updateStatus(reg.id, 'approved')}
                              className="bg-green-100 hover:bg-green-200 text-green-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                            >
                              אשר
                            </button>
                            <button
                              onClick={() => updateStatus(reg.id, 'rejected')}
                              className="bg-red-100 hover:bg-red-200 text-red-600 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                            >
                              דחה
                            </button>
                            <button
                              onClick={() => deleteRegistration(reg.id)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                            >
                              🗑
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              reg.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                            }`}>
                              {reg.status === 'approved' ? 'מאושר' : 'נדחה'}
                            </span>
                            {reg.status === 'approved' && selectedTournament.paybox_url && (
                              <a
                                href={selectedTournament.paybox_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-0.5 rounded-lg transition-colors"
                              >
                                PayBox
                              </a>
                            )}
                            {reg.status === 'approved' && (
                              <button
                                onClick={() => updateStatus(reg.id, 'rejected')}
                                className="text-xs bg-red-100 hover:bg-red-200 text-red-600 px-2 py-0.5 rounded-lg transition-colors"
                              >
                                ביטול
                              </button>
                            )}
                            {reg.status === 'rejected' && (
                              <button
                                onClick={() => updateStatus(reg.id, 'approved')}
                                className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-0.5 rounded-lg transition-colors"
                              >
                                החזר
                              </button>
                            )}
                            <button
                              onClick={() => deleteRegistration(reg.id)}
                              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-500 px-2 py-0.5 rounded-lg transition-colors"
                            >
                              🗑
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
