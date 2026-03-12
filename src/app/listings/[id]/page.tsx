import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import InquiryForm from '@/components/InquiryForm';
import UserAvatar from '@/components/UserAvatar';
import { Listing } from '@/lib/types';
import { MapPin, Calendar } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase';

async function getListing(id: string): Promise<Listing | null> {
  try {
    const { data } = await supabaseAdmin
      .from('listings')
      .select('*, users(id, name, image), master_accessories(name, compatibility, description, tesla_url)')
      .eq('id', id)
      .eq('active', true)
      .single();
    return data ?? null;
  } catch {
    return null;
  }
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  const images = listing.images?.length ? listing.images : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: images + details */}
        <div className="lg:col-span-2 space-y-6">
          {images.length > 0 ? (
            <div className="space-y-3">
              <div className="aspect-[4/3] relative rounded-xl overflow-hidden bg-gray-100">
                <Image src={images[0]} alt={listing.title} fill className="object-cover" />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.slice(1).map((url, i) => (
                    <div key={i} className="w-20 h-20 relative rounded overflow-hidden bg-gray-100">
                      <Image src={url} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-[4/3] bg-gray-100 rounded-xl flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="w-16 h-16 mx-auto mb-2 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm">No photos</p>
              </div>
            </div>
          )}

          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {/* Show all compatible models if available, else just the lister's model */}
              {(listing.master_accessories as { name?: string; compatibility?: string[] } | null)?.compatibility?.length
                ? (listing.master_accessories as { compatibility: string[] }).compatibility.map((m) => (
                    <Badge key={m} style={{ backgroundColor: '#475569', color: 'white' }}>{m}</Badge>
                  ))
                : <Badge style={{ backgroundColor: '#475569', color: 'white' }}>{listing.tesla_model}</Badge>
              }
              <Badge variant="outline" className="text-gray-600">
                {(listing.master_accessories as { name?: string } | null)?.name ?? 'Other'}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
            <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
              <span className="flex items-center gap-1"><MapPin size={14} /> {listing.city}, {listing.zip_code}</span>
              <span className="flex items-center gap-1">
                <Calendar size={14} /> Listed {new Date(listing.created_at).toLocaleDateString()}
              </span>
            </div>
            {listing.description && (
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
            )}

            {/* Tesla product description + link */}
            {(() => {
              const ma = listing.master_accessories as { name?: string; compatibility?: string[]; description?: string; tesla_url?: string } | null;
              if (!ma?.description && !ma?.tesla_url) return null;
              return (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">About this item</p>
                  {ma.description && (() => {
                    const parts = ma.description!.split(/\n\n(Note:)/);
                    const body = parts[0];
                    const note = parts.length > 1 ? parts[1] + parts[2] : null;
                    return (
                      <>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{body}</p>
                        {note && (
                          <p className="text-sm text-gray-500 italic mt-3 leading-relaxed">{note}</p>
                        )}
                      </>
                    );
                  })()}
                  {ma.tesla_url && (
                    <a
                      href={ma.tesla_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-gray-700 hover:text-black underline underline-offset-2"
                    >
                      View on Tesla Shop
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Right: price + inquiry */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-4xl font-bold mb-1 text-gray-900">
                ${listing.daily_price}
                <span className="text-lg font-normal text-gray-400">/day</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">{listing.city}</p>
              <InquiryForm
                listingId={listing.id}
                listingTitle={listing.title}
                dailyPrice={listing.daily_price}
              />
            </CardContent>
          </Card>

          {listing.users && (
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <UserAvatar src={listing.users.image} name={listing.users.name} size={40} />
                <div>
                  <p className="font-medium text-sm">{listing.users.name ?? 'Tesla owner'}</p>
                  <p className="text-xs text-gray-400">Listing owner</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
