import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Listing } from '@/lib/types';
import { MapPin } from 'lucide-react';

interface Props {
  listing: Listing;
}

export default function ListingCard({ listing }: Props) {
  const img = listing.images?.[0];

  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className="overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer h-full">
        <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
          {img ? (
            <Image src={img} alt={listing.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <Badge
            className="absolute top-2 right-2 text-white"
            style={{ backgroundColor: 'white', color: '#3E9142', border: '1px solid #3E9142' }}
          >
            {listing.tesla_model}
          </Badge>
        </div>
        <CardContent className="p-4">
          <p className="font-semibold text-gray-900 line-clamp-1">{listing.title}</p>
          <p className="text-xs text-gray-400 mt-1 font-medium">
            {listing.master_accessories?.name ?? 'Other'}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="font-bold text-xl text-gray-900">
              ${listing.daily_price}/day
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <MapPin size={12} /> {listing.city}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
