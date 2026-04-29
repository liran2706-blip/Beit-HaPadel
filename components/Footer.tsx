'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#0a1628] border-t border-blue-900 mt-auto" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-blue-500 text-xs">© 2025 בית הפאדל · israelpadel.com</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/accessibility" className="text-blue-400 hover:text-white transition-colors">הצהרת נגישות</Link>
            <span className="text-blue-800">·</span>
            <Link href="/privacy" className="text-blue-400 hover:text-white transition-colors">מדיניות פרטיות</Link>
            <span className="text-blue-800">·</span>
            <Link href="/terms" className="text-blue-400 hover:text-white transition-colors">תנאי שימוש</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
