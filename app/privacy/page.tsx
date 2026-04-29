import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10" dir="rtl">
        <Link href="/" className="text-blue-400 hover:text-blue-600 text-sm mb-6 inline-block">← חזרה לדף הבית</Link>
        <h1 className="text-3xl font-black text-slate-900 mb-2">מדיניות פרטיות</h1>
        <p className="text-slate-400 text-sm mb-8">עדכון אחרון: ינואר 2025</p>

        <div className="space-y-6 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">מידע שאנו אוספים</h2>
            <p>בעת ההרשמה לאתר אנו אוספים: שם מלא, כתובת דוא"ל, מספר טלפון ורמת משחק. מידע זה משמש אך ורק לצורך ניהול ההשתתפות בטורנירים.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">שימוש במידע</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>ניהול הרשמות לטורנירים</li>
              <li>שליחת עדכונים ואישורים בדוא"ל</li>
              <li>יצירת קשר בנוגע לטורנירים</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">שמירת מידע</h2>
            <p>המידע שלך מאוחסן בשרתים מאובטחים. אנו לא מוכרים או מעבירים את פרטיך לצדדים שלישיים ללא הסכמתך, למעט כנדרש על פי חוק.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">עוגיות (Cookies)</h2>
            <p>האתר משתמש בעוגיות לצורך שמירת מצב התחברות ושיפור חוויית המשתמש. ניתן לבטל עוגיות בהגדרות הדפדפן.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">זכויותיך</h2>
            <p>הנך זכאי לעיין במידע השמור עליך, לתקנו או למחקו. לבקשות פנה אלינו: <a href="mailto:info@israelpadel.com" className="text-blue-600 hover:underline">info@israelpadel.com</a></p>
          </section>
        </div>
      </main>
    </>
  );
}
