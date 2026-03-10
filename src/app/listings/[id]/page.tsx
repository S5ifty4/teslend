import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import ContactForm from '@/components/ContactForm';
import { Listing } from '@/lib/types';
import { MapPin, Calendar } from 'lucide-react';

async function getListing(id: string): Promise<Listing | null> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/listings/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
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
          {/* Image gallery */}
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
            <div className="aspect-[4/3] bg-gray-100 rounded-xl flex items-center justify-center text-6xl">
              📦
            </div>
          )}

          {/* Listing info */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge style={{ backgroundColor: '#E31937', color: 'white' }}>{listing.tesla_model}</Badge>
              <Badge variant="outline">{listing.category}</Badge>
              <Badge variant="outline">{listing.condition}</Badge>
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
          </div>
        </div>

        {/* Right: price + contact */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-4xl font-bold mb-1" style={{ color: '#E31937' }}>
                ${listing.daily_price}
                <span className="text-lg font-normal text-gray-400">/day</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">{listing.city} · {listing.condition}</p>
              <ContactForm listingId={listing.id} listingTitle={listing.title} />
            </CardContent>
          </Card>

          {listing.users && (
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                {listing.users.image ? (
                  <Image src={listing.users.image} alt="" width={40} height={40} className="rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    👤
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm">{listing.users.name ?? 'Lister'}</p>
                  <p className="text-xs text-gray-400">Tesla owner</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
