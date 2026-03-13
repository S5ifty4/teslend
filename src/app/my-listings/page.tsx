'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Listing } from '@/lib/types';
import { Pencil, Trash2, Plus } from 'lucide-react';

export default function MyListingsPage() {
  const { data: session, status } = useSession();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/listings/mine')
        .then((r) => r.json())
        .then((data) => { setListings(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [status]);

  if (status === 'unauthenticated') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Sign in to manage your listings.</p>
        <Button onClick={() => signIn('google')} style={{ backgroundColor: '#3E6AE1', color: 'white' }}>
          Sign in with Google
        </Button>
      </div>
    );
  }

  async function deactivate(id: string) {
    setDeletingId(id);
    setConfirming(null);
    await fetch(`/api/listings/${id}`, { method: 'DELETE' });
    setListings((prev) => prev.filter((l) => l.id !== id));
    setDeletingId(null);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Link href="/listings/new">
          <Button style={{ backgroundColor: '#3E6AE1', color: 'white' }}>
            <Plus size={16} className="mr-1" /> New Listing
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="w-16 h-16 border-2 border-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="mb-4">No listings yet.</p>
          <Link href="/listings/new">
            <Button style={{ backgroundColor: '#3E6AE1', color: 'white' }}>
              List your first accessory
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-20 h-16 relative rounded overflow-hidden bg-gray-100 flex-shrink-0">
                  {listing.images?.[0] ? (
                    <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/listings/${listing.id}`} className="font-semibold truncate hover:underline block">{listing.title}</Link>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <Badge style={{ backgroundColor: 'transparent', color: '#3E9142', border: '1px solid #3E9142' }} className="text-xs">{listing.tesla_model}</Badge>
                  </div>
                  <p className="text-sm font-semibold mt-1 text-gray-900">${listing.daily_price}/day</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Link href={`/listings/${listing.id}/edit`}>
                    <Button variant="outline" size="sm"><Pencil size={14} /></Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirming(listing.id)}
                    disabled={deletingId === listing.id}
                    className="text-red-500 hover:text-red-600 hover:border-red-300"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
              {confirming === listing.id && (
                <div className="px-4 pb-4 flex items-center justify-between gap-3 border-t pt-3">
                  <p className="text-sm text-gray-600">Remove this listing? This can&apos;t be undone.</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setConfirming(null)}>Cancel</Button>
                    <Button
                      size="sm"
                      onClick={() => deactivate(listing.id)}
                      disabled={deletingId === listing.id}
                      style={{ backgroundColor: '#E31937', color: 'white' }}
                    >
                      {deletingId === listing.id ? 'Removing...' : 'Yes, Remove'}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
