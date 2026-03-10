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
        <Button onClick={() => signIn('google')} style={{ backgroundColor: '#E31937', color: 'white' }}>
          Sign In with Google
        </Button>
      </div>
    );
  }

  async function deactivate(id: string) {
    if (!confirm('Remove this listing?')) return;
    await fetch(`/api/listings/${id}`, { method: 'DELETE' });
    setListings((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Link href="/listings/new">
          <Button style={{ backgroundColor: '#E31937', color: 'white' }}>
            <Plus size={16} className="mr-1" /> New Listing
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">📦</div>
          <p>No listings yet.</p>
          <Link href="/listings/new">
            <Button className="mt-4" style={{ backgroundColor: '#E31937', color: 'white' }}>
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
                    <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{listing.title}</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <Badge style={{ backgroundColor: '#E31937', color: 'white' }} className="text-xs">{listing.tesla_model}</Badge>
                    <Badge variant="outline" className="text-xs">{listing.category}</Badge>
                  </div>
                  <p className="text-sm font-medium mt-1" style={{ color: '#E31937' }}>${listing.daily_price}/day</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Link href={`/listings/${listing.id}`}>
                    <Button variant="outline" size="sm"><Pencil size={14} /></Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => deactivate(listing.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
