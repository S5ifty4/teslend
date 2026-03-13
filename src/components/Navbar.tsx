'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import UserAvatar from '@/components/UserAvatar';

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatar = session?.user?.image;
  const name = session?.user?.name;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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
          {session ? (
            <>
              <Link href="/listings/new" className="text-sm text-gray-600 hover:text-gray-900">
                List Accessory
              </Link>
              <Link href="/how-it-works" className="text-sm text-gray-600 hover:text-gray-900">
                How It Works
              </Link>
              {/* Avatar dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="hover:opacity-80 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
                  aria-label="Account menu"
                >
                  <UserAvatar src={avatar} name={name} size={32} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <Link
                      href="/my-listings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Listings
                    </Link>
                    <div className="border-t border-gray-100 mt-1">
                      <button
                        onClick={() => { setDropdownOpen(false); signOut({ callbackUrl: '/' }); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
            <button
              onClick={() => setOpen(!open)}
              className="p-1 text-gray-600 hover:text-gray-900"
              aria-label="Menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
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
            <div className="pb-2 border-b border-gray-100 mb-1">
              <div className="flex items-center gap-3 py-2">
                <UserAvatar src={avatar} name={name} size={32} />
                <p className="text-sm font-medium text-gray-900">{name}</p>
              </div>
            </div>
            <Link href="/browse" className="py-2 text-sm text-gray-700 hover:text-gray-900" onClick={() => setOpen(false)}>
              Browse
            </Link>
            <Link href="/listings/new" className="py-2 text-sm text-gray-700 hover:text-gray-900" onClick={() => setOpen(false)}>
              List Accessory
            </Link>
            <Link href="/how-it-works" className="py-2 text-sm text-gray-700 hover:text-gray-900" onClick={() => setOpen(false)}>
              How It Works
            </Link>
            <Link href="/profile" className="py-2 text-sm text-gray-700 hover:text-gray-900" onClick={() => setOpen(false)}>
              Profile Settings
            </Link>
            <div className="pt-2 border-t mt-1">
              <button
                onClick={() => { signOut({ callbackUrl: '/' }); setOpen(false); }}
                className="w-full text-left py-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
