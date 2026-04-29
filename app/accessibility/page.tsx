import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function AccessibilityPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10" dir="rtl">
        <Link href="/" className="text-blue-400 hover:text-blue-600 text-sm mb-6 inline-block">← חזרה לדף הבית</Link>
        <h1 className="text-3xl font-black text-slate-900 mb-2">הצהרת נגישות – Israel Padel</h1>
        <p className="text-slate-400 text-sm mb-8">עודכן לאחרונה: אפריל 2025</p>

        <div className="space-y-6 text-slate-700 leading-relaxed">
          <p>אנו פועלים להנגיש את האתר לכלל המשתמשים, לרבות אנשים עם מוגבלויות.</p>
          <p>האתר מותאם לתקן הישראלי (ת"י 5568) ברמת AA ככל האפשר, וכולל התאמות לניווט, קריאות ותפעול.</p>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">פנייה בנושא נגישות</h2>
            <p>במידה ונתקלתם בבעיה, ניתן לפנות:</p>
            <p className="mt-2">📧 <a href="mailto:beit.hapadel@gmail.com" className="text-blue-600 hover:underline">beit.hapadel@gmail.com</a></p>
            <p className="mt-3">אנו מתחייבים לטפל בפניות בהקדם.</p>
          </section>
        </div>
      </main>
    </>
  );
}
