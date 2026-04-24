import Image from 'next/image';
import Navbar from '@/components/Navbar';
import TournamentList from '@/components/TournamentList';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#0a1628]">
          <div className="w-full">
            <Image
              src="/beit-hapadel.png"
              alt="בית הפאדל"
              width={1920}
              height={500}
              className="w-full object-cover max-h-56 md:max-h-72"
              priority
            />
          </div>
          <div className="text-center py-8 px-4 bg-[#0a1628]">
            <a
              href="#tournaments"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg text-lg"
            >
              טורנירים קרובים
            </a>
          </div>
        </section>

        <section id="tournaments" className="max-w-4xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">טורנירים קרובים</h2>
          <TournamentList />
        </section>
      </main>

      <footer className="bg-[#0a1628] text-blue-400 text-center py-6 text-sm border-t border-blue-900">
        <p className="font-bold text-white mb-1">בית הפאדל</p>
        <p>הבית של שחקני הפאדל בישראל · israelpadel.com</p>
      </footer>
    </>
  );
}
