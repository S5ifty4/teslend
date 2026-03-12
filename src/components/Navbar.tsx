'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import UserAvatar from '@/components/UserAvatar';

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const avatar = session?.user?.image;
  const name = session?.user?.name;

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Image src="/logo.png" alt="Teslend" width={32} height={32} />
          <span className="text-xl font-bold tracking-tight">
            <span style={{ color: '#E31937' }}>Tes</span>lend
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/browse" className="text-sm text-gray-600 hover:text-gray-900">
            Browse
          </Link>
          <Link href="/how-it-works" className="text-sm text-gray-600 hover:text-gray-900">
            How It Works
          </Link>
          {session ? (
            <>
              <Link href="/listings/new" className="text-sm text-gray-600 hover:text-gray-900">
                List Accessory
              </Link>
              <Link href="/my-listings" className="text-sm text-gray-600 hover:text-gray-900">
                My Listings
              </Link>
              <Link href="/profile" className="hover:opacity-80">
                <UserAvatar src={avatar} name={name} size={32} />
              </Link>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => signIn('google')} style={{ backgroundColor: '#3E6AE1', color: 'white' }}>
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile right side */}
        <div className="flex md:hidden items-center gap-3">
          {session ? (
            <>
              <Link href="/profile" className="flex-shrink-0">
                <UserAvatar src={avatar} name={name} size={32} />
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
            <Button size="sm" onClick={() => signIn('google')} style={{ backgroundColor: '#3E6AE1', color: 'white' }}>
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
            <Link href="/how-it-works" className="py-2 text-sm text-gray-700 hover:text-gray-900" onClick={() => setOpen(false)}>
              How It Works
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
