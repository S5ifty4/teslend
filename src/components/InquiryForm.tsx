'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTeslaModels } from '@/lib/useTeslaModels';

const schema = z.object({
  start_date: z.string().min(1, 'Start date required'),
  end_date: z.string().min(1, 'End date required'),
  tesla_model: z.string().min(1, 'Vehicle model required'),
  phone: z.string().min(7, 'Phone number required'),
  note: z.string().optional(),
}).refine((d) => new Date(d.end_date) > new Date(d.start_date), {
  message: 'End date must be after start date',
  path: ['end_date'],
});

type FormData = z.infer<typeof schema>;

interface SessionUser {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  tesla_model?: string | null;
}

interface Props {
  listingId: string;
  listingTitle: string;
  dailyPrice: number;
}

export default function InquiryForm({ listingId, listingTitle, dailyPrice }: Props) {
  const { data: session } = useSession();
  const user = session?.user as SessionUser | undefined;
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [days, setDays] = useState(0);

  const today = new Date().toISOString().split('T')[0];
  const { models: teslaModels } = useTeslaModels();

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: user?.phone ?? '',
      tesla_model: user?.tesla_model ?? '',
    },
  });

  const startDate = watch('start_date');
  const endDate = watch('end_date');

  function updateDays(start: string, end: string) {
    if (start && end) {
      const d = Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
      setDays(d > 0 ? d : 0);
    }
  }

  if (!session) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-600 mb-4">Sign in to send a rental inquiry.</p>
        <Button
          onClick={() => signIn('google')}
          className="w-full text-white"
          style={{ backgroundColor: '#E31937' }}
        >
          Sign in with Google
        </Button>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-semibold text-gray-900">Inquiry sent</p>
        <p className="text-sm text-gray-500 mt-1">
          The owner will review your request and reach out to you directly.
        </p>
      </div>
    );
  }

  async function onSubmit(data: FormData) {
    setError('');
    const res = await fetch('/api/inquiries', {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-gray-500">
        Inquiring about <strong>{listingTitle}</strong>
      </p>

      {/* Dates — stacked to avoid collision on mobile */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-sm">Start date *</Label>
          <Input
            {...register('start_date')}
            type="date"
            min={today}
            className="mt-1 text-sm"
            onChange={(e) => { register('start_date').onChange(e); updateDays(e.target.value, endDate); }}
          />
          {errors.start_date && <p className="text-xs text-red-500 mt-1">{errors.start_date.message}</p>}
        </div>
        <div>
          <Label className="text-sm">End date *</Label>
          <Input
            {...register('end_date')}
            type="date"
            min={startDate || today}
            className="mt-1 text-sm"
            onChange={(e) => { register('end_date').onChange(e); updateDays(startDate, e.target.value); }}
          />
          {errors.end_date && <p className="text-xs text-red-500 mt-1">{errors.end_date.message}</p>}
        </div>
      </div>

      {days > 0 && (
        <div className="bg-gray-50 rounded-lg px-4 py-3 flex justify-between text-sm">
          <span className="text-gray-600">{days} day{days !== 1 ? 's' : ''}</span>
          <span className="font-semibold" style={{ color: '#E31937' }}>
            Est. ${(days * dailyPrice).toFixed(0)} total
          </span>
        </div>
      )}

      {/* Vehicle — full width, no Year */}
      <div>
        <Label>Your Vehicle *</Label>
        <Select
          defaultValue={user?.tesla_model ?? undefined}
          onValueChange={(v: string | null) => setValue('tesla_model', v ?? '')}
        >
          <SelectTrigger className="mt-1 w-full">
            <SelectValue placeholder="Select your model" />
          </SelectTrigger>
          <SelectContent>
            {teslaModels.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.tesla_model && <p className="text-xs text-red-500 mt-1">{errors.tesla_model.message}</p>}
      </div>

      {/* Phone — pre-filled from profile */}
      <div>
        <Label>Phone number *</Label>
        <Input
          {...register('phone')}
          type="tel"
          placeholder="+1 (415) 555-0100"
          className="mt-1"
          defaultValue={user?.phone ?? ''}
        />
        <p className="text-xs text-gray-400 mt-1">Shared with the listing owner so they can reach you.</p>
        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <Label>Note <span className="text-gray-400 font-normal">(optional)</span></Label>
        <Textarea
          {...register('note')}
          placeholder="Any specific questions or details for the owner..."
          rows={3}
          className="mt-1"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full text-white"
        style={{ backgroundColor: '#E31937' }}
      >
        {isSubmitting ? 'Sending...' : 'Send Inquiry'}
      </Button>
    </form>
  );
}
