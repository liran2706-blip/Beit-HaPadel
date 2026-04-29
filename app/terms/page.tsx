import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10" dir="rtl">
        <Link href="/" className="text-blue-400 hover:text-blue-600 text-sm mb-6 inline-block">← חזרה לדף הבית</Link>
        <h1 className="text-3xl font-black text-slate-900 mb-2">תנאי שימוש</h1>
        <p className="text-slate-400 text-sm mb-8">עדכון אחרון: ינואר 2025</p>

        <div className="space-y-6 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">כללי</h2>
            <p>השימוש באתר בית הפאדל מהווה הסכמה לתנאי שימוש אלה. האתר מיועד לניהול הרשמות לטורנירי פאדל בישראל.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">הרשמה לטורנירים</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>ההרשמה מותנית בתשלום דמי השתתפות</li>
              <li>מקומך בטורניר מובטח רק לאחר אישור ההרשמה ותשלום מלא</li>
              <li>המארגנים שומרים לעצמם את הזכות לדחות הרשמות לפי שיקול דעתם</li>
              <li>ביטול השתתפות יש לדווח מראש</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">אחריות</h2>
            <p>ההשתתפות בטורניר היא על אחריות המשתתף בלבד. על כל משתתף לחתום על הצהרה רפואית לפני השתתפות. האתר ומארגניו אינם אחראים לנזקים גופניים שעלולים להיגרם במהלך הפעילות.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">קניין רוחני</h2>
            <p>כל תוכן באתר זה, לרבות עיצוב, טקסט ולוגו, הם רכושו של בית הפאדל. אין להעתיק או להשתמש בתוכן ללא אישור מפורש.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">יצירת קשר</h2>
            <p>לשאלות בנוגע לתנאי השימוש: <a href="mailto:info@israelpadel.com" className="text-blue-600 hover:underline">info@israelpadel.com</a></p>
          </section>
        </div>
      </main>
    </>
  );
}
