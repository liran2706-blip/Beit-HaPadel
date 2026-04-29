import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/Footer';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'בית הפאדל',
  description: 'הבית של שחקני הפאדל בישראל',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col" suppressHydrationWarning>
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <Script src="https://cdn.userway.org/widget.js" data-account="NpyHqVqD3F" strategy="afterInteractive" />
      </body>
    </html>
  );
}
