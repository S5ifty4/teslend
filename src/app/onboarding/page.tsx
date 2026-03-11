'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TESLA_MODELS, TESLA_YEARS } from '@/lib/constants';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().optional(),
  tesla_model: z.string().optional(),
  tesla_year: z.number().optional(),
});

type FormData = z.infer<typeof schema>;

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState('');

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: session?.user?.name ?? '',
    },
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/api/auth/signin');
    if (session?.user?.name) setValue('name', session.user.name);
  }, [session, status, router, setValue]);

  async function onSubmit(data: FormData) {
    setError('');
    const res = await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, profile_completed: true }),
    });
    if (res.ok) {
      const next = new URLSearchParams(window.location.search).get('next') ?? '/';
      router.push(next);
    } else {
      const d = await res.json();
      setError(d.error ?? 'Something went wrong');
    }
  }

  if (status === 'loading') return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Complete your profile</h1>
          <p className="text-gray-500 mt-2">
            Just a few details so listings owners know who's reaching out.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label>Full name *</Label>
            <Input {...register('name')} placeholder="Jane Smith" className="mt-1" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label>Phone number <span className="text-gray-400 font-normal">(optional)</span></Label>
            <Input {...register('phone')} type="tel" placeholder="+1 (415) 555-0100" className="mt-1" />
            <p className="text-xs text-gray-400 mt-1">
              Shared with listing owners when you submit an inquiry.
            </p>
          </div>

          <div>
            <Label>Your Tesla <span className="text-gray-400 font-normal">(optional)</span></Label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <Select onValueChange={(v) => setValue('tesla_model', (v ?? '') as string)}>
                <SelectTrigger>
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent>
                  {TESLA_MODELS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={(v) => setValue('tesla_year', parseInt((v ?? '0') as string))}>
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {TESLA_YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-white"
            style={{ backgroundColor: '#E31937' }}
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </Button>

          <button
            type="button"
            onClick={() => router.push('/')}
            className="w-full text-sm text-gray-400 hover:text-gray-600 text-center"
          >
            Skip for now
          </button>
        </form>
      </div>
    </div>
  );
}
