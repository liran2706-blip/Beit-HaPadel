import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import TournamentList from '@/components/TournamentList';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero - image only */}
        <section className="bg-[#0a1628]">
          <div className="w-full">
            <Image
              src="/beit-hapadel.png"
              alt="בית הפאדל"
              width={1920}
              height={800}
              className="w-full object-cover"
              priority
            />
          </div>

          {/* CTA buttons below image */}
          <div className="text-center py-8 px-4 bg-[#0a1628]">
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg text-lg"
              >
                הצטרף עכשיו
              </Link>
              <a
                href="#tournaments"
                className="bg-white/15 hover:bg-white/25 text-white font-medium px-8 py-4 rounded-xl transition-colors text-lg border border-white/20"
              >
                טורנירים קרובים
              </a>
            </div>
          </div>
        </section>

        {/* Tournaments */}
        <section id="tournaments" className="max-w-4xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">טורנירים קרובים</h2>
          <TournamentList />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a1628] text-blue-400 text-center py-6 text-sm border-t border-blue-900">
        <p className="font-bold text-white mb-1">בית הפאדל</p>
        <p>הבית של שחקני הפאדל בישראל · israelpadel.com</p>
      </footer>
    </>
  );
}
