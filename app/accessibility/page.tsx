import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function AccessibilityPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10" dir="rtl">
        <Link href="/" className="text-blue-400 hover:text-blue-600 text-sm mb-6 inline-block">← חזרה לדף הבית</Link>
        <h1 className="text-3xl font-black text-slate-900 mb-2">הצהרת נגישות</h1>
        <p className="text-slate-400 text-sm mb-8">עדכון אחרון: ינואר 2025</p>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">מחויבות לנגישות</h2>
            <p>בית הפאדל מחויב להנגיש את שירותיו לכלל המשתמשים, לרבות אנשים עם מוגבלויות. אנו פועלים להתאים את האתר לדרישות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג–2013.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">רמת הנגישות</h2>
            <p>אנו שואפים לעמוד בדרישות תקן WCAG 2.1 ברמה AA. האתר תומך בשימוש בקוראי מסך, ניווט במקלדת, וניגודיות צבעים מתאימה.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">התאמות שבוצעו</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>תמיכה בניווט באמצעות מקלדת בלבד</li>
              <li>תגיות alt לתמונות</li>
              <li>ניגודיות צבעים עומדת בתקן</li>
              <li>גודל טקסט ניתן לשינוי</li>
              <li>כפתורים ולינקים עם תיאור ברור</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">פנייה בנושא נגישות</h2>
            <p>אם נתקלת בבעיית נגישות באתר, נשמח לשמוע ולתקן. ניתן לפנות אלינו בדוא"ל: <a href="mailto:info@israelpadel.com" className="text-blue-600 hover:underline">info@israelpadel.com</a></p>
          </section>
        </div>
      </main>
    </>
  );
}
