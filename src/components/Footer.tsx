'use client';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleList = () => {
    if (session) {
      router.push('/listings/new');
    } else {
      signIn('google', { callbackUrl: '/listings/new' });
    }
  };

  return (
    <footer className="border-t bg-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">
            <span style={{ color: '#E31937' }}>Tes</span>lend
          </span>
          <span>· Bay Area Tesla accessories marketplace</span>
        </div>

        <nav className="flex flex-wrap gap-5 justify-center">
          <Link href="/browse" className="hover:text-gray-700">Browse</Link>
          <button onClick={handleList} className="hover:text-gray-700 cursor-pointer">List</button>
          <Link href="/how-it-works" className="hover:text-gray-700">How It Works</Link>
          <Link href="/contact" className="hover:text-gray-700">Contact</Link>
        </nav>

        <p className="text-xs text-center md:text-right">
          Not affiliated with Tesla, Inc. &copy; {new Date().getFullYear()} Teslend.
          <br />
          <Link href="/terms" className="underline underline-offset-2 hover:text-gray-600">Terms</Link>
          {' · '}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-gray-600">Privacy</Link>
        </p>
      </div>
    </footer>
  );
}
