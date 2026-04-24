# Israel Padel — פלטפורמה לטורנירי פאדל מיקסינג

## הגדרה מקומית

```bash
npm install
cp .env.local.example .env.local
# מלא את פרטי Supabase
npm run dev
```

## Supabase

1. הרץ את `supabase/schema.sql` ב-SQL Editor
2. לאחר יצירת חשבון המנהל, הפעל אותו כ-admin:
   ```sql
   UPDATE profiles SET is_admin = true WHERE id = 'YOUR_USER_ID';
   ```
   את ה-ID תמצא ב: Supabase → Authentication → Users

## Vercel

הוסף Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## מבנה הפרויקט

```
app/
  page.tsx          — דף בית עם רשימת טורנירים
  login/            — כניסה
  register/         — הרשמה לפלטפורמה
  profile/          — פרופיל שחקן
  tournament/[id]/  — דף טורניר עם טאבים
  admin/            — ניהול טורנירים ונרשמים
components/
  Navbar.tsx
  TournamentList.tsx
```

## זרימת משתמש

1. שחקן נרשם → יוצר פרופיל עם שם, טלפון, רמה
2. נכנס לדף טורניר → לוחץ "הרשמה לטורניר"
3. סטטוס: "ממתין לאישור"
4. מנהל מאשר → סטטוס: "מאושר"
5. שחקן רואה כפתור PayBox לתשלום

## להפוך מנהל

לאחר יצירת חשבון ב-`/register`, הרץ ב-SQL Editor:
```sql
UPDATE profiles SET is_admin = true WHERE id = 'YOUR_USER_ID';
```
