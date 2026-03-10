import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import ListingForm from '@/components/ListingForm';

export default async function NewListingPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/api/auth/signin');

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">List an Accessory</h1>
      <p className="text-gray-500 mb-8">
        Share your Tesla accessories with the Bay Area community.
      </p>
      <ListingForm />
    </div>
  );
}
