'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TESLA_YEARS } from '@/lib/constants';
import { useTeslaModels } from '@/lib/useTeslaModels';
import { Camera } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().optional(),
  tesla_model: z.string().optional(),
  tesla_year: z.number().optional(),
});

type FormData = z.infer<typeof schema>;

export default function OnboardingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [error, setError] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { models: teslaModels } = useTeslaModels();
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: session?.user?.name ?? '' },
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/api/auth/signin');
    if (session?.user?.name) setValue('name', session.user.name);
    if (session?.user?.image) setAvatarUrl(session.user.image);
  }, [session, status, router, setValue]);

  async function handleAvatarUpload(file: File) {
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    const data = await res.json();
    if (data.url) {
      setAvatarUrl(data.url);
      await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: data.url }),
      });
    }
    setUploading(false);
  }

  async function onSubmit(data: FormData) {
    setError('');
    const res = await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, profile_completed: true }),
    });
    if (res.ok) {
      // Refresh JWT so profile_completed updates in middleware
      await update({ profile_completed: true });
      const next = new URLSearchParams(window.location.search).get('next') ?? '/';
      router.push(next);
    } else {
      const d = await res.json();
      setError(d.error ?? 'Something went wrong');
    }
  }

  if (status === 'loading') return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Complete your profile</h1>
          <p className="text-gray-500 mt-2">
            Just a few details so listing owners know who's reaching out.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="Profile" fill className="object-cover" />
                ) : (
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800"
              >
                <Camera size={12} />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium">Profile photo</p>
              <p className="text-xs text-gray-400">{uploading ? 'Uploading...' : 'Optional'}</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
            />
          </div>

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
                  {teslaModels.map((m) => (
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
            disabled={isSubmitting || uploading}
            className="w-full text-white"
            style={{ backgroundColor: '#3E6AE1' }}
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </Button>
        </form>
      </div>
    </div>
  );
}
