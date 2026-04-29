import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10" dir="rtl">
        <Link href="/" className="text-blue-400 hover:text-blue-600 text-sm mb-6 inline-block">← חזרה לדף הבית</Link>
        <h1 className="text-3xl font-black text-slate-900 mb-2">תנאי שימוש – Israel Padel</h1>
        <p className="text-slate-400 text-sm mb-8">עודכן לאחרונה: אפריל 2025</p>

        <div className="space-y-6 text-slate-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">1. כללי</h2>
            <p>השימוש באתר מהווה הסכמה לתנאים אלו.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">2. הרשמה לאתר</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>ייתכן ותידרש הרשמה לצורך הזמנת שירותים.</li>
              <li>המשתמש מתחייב למסור פרטים נכונים ומדויקים.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">3. הזמנת שירותים ותשלומים</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>הזמנת מגרשים/שירותים באתר כרוכה בתשלום.</li>
              <li>התשלום מתבצע באמצעות ספק סליקה חיצוני.</li>
              <li>אישור הזמנה יישלח לאחר השלמת התשלום.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">4. מדיניות ביטולים והחזרים</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>ביטול הזמנה יתאפשר בהתאם למדיניות שתיקבע באתר.</li>
              <li>ייתכן וייגבו דמי ביטול בהתאם לחוק הגנת הצרכן.</li>
              <li>החזר כספי יינתן לפי שיקול דעת האתר ובהתאם לדין.</li>
              <li>הודעה על ביטול — 72 שעות לפני תחילת הטורניר.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">5. אחריות המשתמש</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>המשתמש אחראי לשימוש תקין במתקנים/שירותים.</li>
              <li>האתר אינו אחראי לנזק שייגרם עקב שימוש לא נכון.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">6. קניין רוחני</h2>
            <p>כל הזכויות באתר שמורות ל-Israel Padel.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">7. הגבלת אחריות</h2>
            <p>השירות ניתן "כפי שהוא" והאתר לא יישא באחריות לנזקים עקיפים או תקלות.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">8. הפסקת שירות</h2>
            <p>האתר רשאי להפסיק או לשנות שירותים בכל עת.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">9. דין וסמכות שיפוט</h2>
            <p>יחולו דיני מדינת ישראל בלבד.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">10. יצירת קשר</h2>
            <p>📧 <a href="mailto:beit.hapadel@gmail.com" className="text-blue-600 hover:underline">beit.hapadel@gmail.com</a></p>
          </section>

        </div>
      </main>
    </>
  );
}
