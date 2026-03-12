'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const schema = z.object({
  renter_name: z.string().min(2, 'Name required'),
  renter_email: z.string().email('Valid email required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  listingId: string;
  listingTitle: string;
}

export default function ContactForm({ listingId, listingTitle }: Props) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setError('');
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing_id: listingId, ...data }),
    });
    if (res.ok) {
      setSent(true);
    } else {
      const d = await res.json();
      setError(d.error ?? 'Something went wrong');
    }
  }

  if (sent) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">✅</div>
        <p className="font-semibold text-gray-900">Message sent!</p>
        <p className="text-sm text-gray-500 mt-1">
          The lister will reply directly to your email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-gray-500">
        Interested in <strong>{listingTitle}</strong>? Send a message and the lister will reply to your email.
      </p>

      <div>
        <Label>Your Name</Label>
        <Input {...register('renter_name')} placeholder="Jane Smith" className="mt-1" />
        {errors.renter_name && <p className="text-xs text-red-500 mt-1">{errors.renter_name.message}</p>}
      </div>

      <div>
        <Label>Your Email</Label>
        <Input {...register('renter_email')} type="email" placeholder="jane@example.com" className="mt-1" />
        {errors.renter_email && <p className="text-xs text-red-500 mt-1">{errors.renter_email.message}</p>}
      </div>

      <div>
        <Label>Message</Label>
        <Textarea
          {...register('message')}
          placeholder="Hi, I'm interested in renting this for the weekend. Is it available April 5-7?"
          rows={4}
          className="mt-1"
        />
        {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full text-white"
        style={{ backgroundColor: '#3E6AE1' }}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}
