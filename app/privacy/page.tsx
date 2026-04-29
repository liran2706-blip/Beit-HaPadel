import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10" dir="rtl">
        <Link href="/" className="text-blue-400 hover:text-blue-600 text-sm mb-6 inline-block">← חזרה לדף הבית</Link>
        <h1 className="text-3xl font-black text-slate-900 mb-2">מדיניות פרטיות – Israel Padel</h1>
        <p className="text-slate-400 text-sm mb-8">עודכן לאחרונה: אפריל 2025</p>

        <div className="space-y-6 text-slate-700 leading-relaxed">
          <p>ברוכים הבאים לאתר Israel Padel (להלן: "האתר"). אנו מכבדים את פרטיות המשתמשים ומחויבים להגן על המידע האישי הנאסף באמצעות האתר.</p>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">1. איסוף מידע</h2>
            <p className="mb-2">בעת השימוש באתר, ייתכן ונאסוף את המידע הבא:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>פרטים אישיים כגון שם, טלפון, כתובת דוא"ל</li>
              <li>מידע הנמסר בעת יצירת קשר או הרשמה</li>
              <li>מידע טכני כגון כתובת IP, סוג דפדפן ופעילות באתר</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">2. מטרות השימוש במידע</h2>
            <p className="mb-2">המידע שנאסף ישמש לצרכים הבאים:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>מתן שירותים ותפעול האתר</li>
              <li>יצירת קשר עם המשתמשים</li>
              <li>שיפור חוויית המשתמש</li>
              <li>שליחת עדכונים, בכפוף להסכמת המשתמש</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">3. שמירת מידע ואבטחה</h2>
            <p>אנו נוקטים באמצעים סבירים להגנה על המידע, אך אין אפשרות להבטיח אבטחה מוחלטת.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">4. מסירת מידע לצדדים שלישיים</h2>
            <p className="mb-2">לא נעביר מידע אישי לצדדים שלישיים, אלא אם:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>נדרש על פי חוק</li>
              <li>הדבר נחוץ לצורך תפעול השירותים (למשל ספקי שירות)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">5. עוגיות (Cookies)</h2>
            <p>האתר עשוי להשתמש בקובצי Cookies לצורך תפעול תקין ושיפור חוויית המשתמש.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">6. זכויות המשתמש</h2>
            <p>למשתמש הזכות לעיין, לתקן או לבקש מחיקה של המידע האישי שלו, בכפוף להוראות הדין.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">7. יצירת קשר</h2>
            <p>לשאלות בנושא פרטיות ניתן לפנות:</p>
            <p className="mt-2">📧 <a href="mailto:beit.hapadel@gmail.com" className="text-blue-600 hover:underline">beit.hapadel@gmail.com</a></p>
          </section>
        </div>
      </main>
    </>
  );
}
