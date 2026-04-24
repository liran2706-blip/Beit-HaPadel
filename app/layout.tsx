import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'בית הפאדל',
  description: 'הבית של שחקני הפאדל בישראל',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="bg-slate-50 text-slate-900 min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
