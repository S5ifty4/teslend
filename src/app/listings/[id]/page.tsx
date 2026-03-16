import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import InquiryForm from '@/components/InquiryForm';
import UserAvatar from '@/components/UserAvatar';
import { Listing } from '@/lib/types';
import { MapPin, Calendar } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase';
import ImageGallery from '@/components/ImageGallery';

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


async function getOwnerListings(userId: string, excludeId: string): Promise<{ id: string; title: string; images: string[]; daily_price: number }[]> {
  try {
    const { data } = await supabaseAdmin
      .from('listings')
      .select('id, title, images, daily_price')
      .eq('user_id', userId)
      .eq('active', true)
      .neq('id', excludeId)
      .order('created_at', { ascending: false })
      .limit(4);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) return { title: 'Listing Not Found' };

  const ma = listing.master_accessories as { name?: string; description?: string } | null;
  const itemType = ma?.name ?? listing.title;
  const description = listing.description
    ? listing.description.slice(0, 155)
    : `Rent a ${itemType} in ${listing.city ?? 'the Bay Area'} for $${listing.daily_price}/day. ${listing.tesla_model} compatible.`;

  return {
    title: `Rent: ${listing.title} in ${listing.city ?? 'Bay Area'} — $${listing.daily_price}/day`,
    description,
    alternates: {
      canonical: `https://teslend.com/listings/${id}`,
    },
    openGraph: {
      title: `${listing.title} — $${listing.daily_price}/day in ${listing.city ?? 'Bay Area'}`,
      description,
      url: `https://teslend.com/listings/${id}`,
      images: listing.images?.[0] ? [{ url: listing.images[0], alt: listing.title }] : [],
    },
  };
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  const ownerId = (listing.users as { id?: string } | null)?.id;
  const ownerListings = ownerId ? await getOwnerListings(ownerId, id) : [];

  const images = listing.images?.length ? listing.images : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.title,
    description: listing.description ?? `Rent a ${listing.title} in ${listing.city ?? 'the Bay Area'}.`,
    image: images,
    areaServed: {
      '@type': 'Place',
      name: listing.city ?? 'San Francisco Bay Area',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: images + details */}
        <div className="lg:col-span-2 space-y-6">
          <ImageGallery images={images} alt={listing.title} />

          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {/* Show all compatible models if available, else just the lister's model */}
              {(listing.master_accessories as { name?: string; compatibility?: string[] } | null)?.compatibility?.length
                ? (listing.master_accessories as { compatibility: string[] }).compatibility.map((m) => (
                    <Badge key={m} style={{ backgroundColor: 'white', color: '#3E9142', border: '1px solid #3E9142' }}>{m}</Badge>
                  ))
                : <Badge style={{ backgroundColor: 'white', color: '#3E9142', border: '1px solid #3E9142' }}>{listing.tesla_model}</Badge>
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
                    const parts = ma.description!.split(/

(Note:)/);
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
                    <p className="text-xs text-gray-400 mt-4">
                      Product information courtesy of{' '}
                      <a
                        href={ma.tesla_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-gray-500 hover:text-black underline underline-offset-2"
                      >
                        Tesla Shop
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Right: price + inquiry */}
        <div className="space-y-6 sticky top-6 self-start">
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
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <UserAvatar src={listing.users.image} name={listing.users.name} size={40} />
                  <div>
                    <p className="font-medium text-sm">{listing.users.name ?? 'Tesla owner'}</p>
                    <p className="text-xs text-gray-400">Listing owner</p>
                  </div>
                </div>
                {ownerListings.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">More from this owner</p>
                    <div className="flex gap-2 flex-wrap">
                      {ownerListings.map((ol) => (
                        <a key={ol.id} href={`/listings/${ol.id}`} className="group flex-shrink-0">
                          <div className="w-14 h-14 rounded overflow-hidden bg-gray-100 relative border border-gray-200 group-hover:border-gray-400 transition-colors">
                            {ol.images?.[0] ? (
                              <img src={ol.images[0]} alt={ol.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 w-14 truncate">{ol.title}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
