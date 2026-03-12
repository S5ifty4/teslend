import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-bold tracking-tight" style={{ color: '#E31937' }}>404</p>
      <h1 className="text-2xl font-bold mt-4 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        This page doesn&apos;t exist or the listing may have been removed.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link href="/browse">
          <Button style={{ backgroundColor: '#E31937', color: 'white' }}>
            Browse Accessories
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
