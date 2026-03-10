'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span style={{ color: '#E31937' }}>Tes</span>lend
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/browse" className="text-sm text-gray-600 hover:text-gray-900">
            Browse
          </Link>
          {session ? (
            <>
              <Link href="/listings/new" className="text-sm text-gray-600 hover:text-gray-900">
                List Accessory
              </Link>
              <Link href="/my-listings" className="text-sm text-gray-600 hover:text-gray-900">
                My Listings
              </Link>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => signIn('google')} style={{ backgroundColor: '#E31937', color: 'white' }}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
