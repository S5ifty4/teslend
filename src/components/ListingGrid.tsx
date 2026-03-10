import { Listing } from '@/lib/types';
import ListingCard from './ListingCard';

interface Props {
  listings: Listing[];
  emptyMessage?: string;
}

export default function ListingGrid({ listings, emptyMessage = 'No listings found.' }: Props) {
  if (!listings.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-5xl mb-4">🔍</div>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {listings.map((l) => (
        <ListingCard key={l.id} listing={l} />
      ))}
    </div>
  );
}
