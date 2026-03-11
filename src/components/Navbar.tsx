'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const avatar = session?.user?.image;
  const name = session?.user?.name;

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight flex-shrink-0">
          <span style={{ color: '#E31937' }}>Tes</span>lend
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
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
              {/* Profile avatar → /profile */}
              <Link href="/profile" className="flex items-center gap-2 hover:opacity-80">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {avatar ? (
                    <Image src={avatar} alt={name ?? 'Profile'} width={32} height={32} className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm font-medium">
                      {name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                  )}
                </div>
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

        {/* Mobile right side */}
        <div className="flex md:hidden items-center gap-3">
          {session ? (
            <>
              <Link href="/profile" className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                  {avatar ? (
                    <Image src={avatar} alt={name ?? 'Profile'} width={32} height={32} className="object-cover" />
                  ) : (
                    <span className="text-gray-500 text-sm font-medium">{name?.[0]?.toUpperCase() ?? 'U'}</span>
                  )}
                </div>
              </Link>
              <button
                onClick={() => setOpen(!open)}
                className="p-1 text-gray-600 hover:text-gray-900"
                aria-label="Menu"
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </>
          ) : (
            <Button size="sm" onClick={() => signIn('google')} style={{ backgroundColor: '#E31937', color: 'white' }}>
              Sign In
            </Button>
          )}
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {open && session && (
        <div className="md:hidden border-t bg-white">
          <div className="flex flex-col px-4 py-3 gap-1">
            <Link href="/browse" className="py-2 text-sm text-gray-700 hover:text-gray-900" onClick={() => setOpen(false)}>
              Browse
            </Link>
            <Link href="/listings/new" className="py-2 text-sm text-gray-700 hover:text-gray-900" onClick={() => setOpen(false)}>
              List Accessory
            </Link>
            <Link href="/my-listings" className="py-2 text-sm text-gray-700 hover:text-gray-900" onClick={() => setOpen(false)}>
              My Listings
            </Link>
            <Link href="/profile" className="py-2 text-sm text-gray-700 hover:text-gray-900" onClick={() => setOpen(false)}>
              Edit Profile
            </Link>
            <div className="pt-2 border-t mt-1">
              <Button variant="outline" size="sm" onClick={() => { signOut(); setOpen(false); }} className="w-full">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
