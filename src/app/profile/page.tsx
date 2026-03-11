'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import UserAvatar from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TESLA_YEARS } from '@/lib/constants';
import { useTeslaModels } from '@/lib/useTeslaModels';
import { Camera } from 'lucide-react';
import { User } from '@/lib/types';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().optional(),
  tesla_model: z.string().optional(),
  tesla_year: z.number().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { models: teslaModels } = useTeslaModels();
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/api/auth/signin');
    if (status === 'authenticated') {
      fetch('/api/user')
        .then((r) => r.json())
        .then((data: User) => {
          setProfile(data);
          setAvatarUrl(data.image ?? session?.user?.image ?? null);
          // Default to first name only from Google on first load
          const existingName = data.name ?? '';
          const googleName = session?.user?.name ?? '';
          const defaultName = existingName || googleName.split(' ')[0];
          setValue('name', defaultName);
          setValue('phone', data.phone ?? '');
          if (data.tesla_model) setValue('tesla_model', data.tesla_model);
          if (data.tesla_year) setValue('tesla_year', data.tesla_year);
        });
    }
  }, [status, session, router, setValue]);

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
    setSaved(false);
    const res = await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await update();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      const d = await res.json();
      setError(d.error ?? 'Something went wrong');
    }
  }

  if (status === 'loading' || !profile) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-2">
          <div className="relative">
            <UserAvatar src={avatarUrl} name={session?.user?.name} size={64} />
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
            <p className="text-xs text-gray-400">{uploading ? 'Uploading...' : 'Click to change'}</p>
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
          <Label>Name *</Label>
          <Input {...register('name')} className="mt-1" />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label>Email</Label>
          <Input value={session?.user?.email ?? ''} disabled className="mt-1 bg-gray-50 text-gray-500" />
        </div>

        <div>
          <Label>Phone number <span className="text-gray-400 font-normal">(optional)</span></Label>
          <Input {...register('phone')} type="tel" placeholder="+1 (415) 555-0100" className="mt-1" />
          <p className="text-xs text-gray-400 mt-1">Shared with listing owners when you send an inquiry.</p>
        </div>

        <div>
          <Label>Primary Tesla Vehicle <span className="text-gray-400 font-normal">(optional)</span></Label>
          <div className="grid grid-cols-2 gap-3 mt-1">
            <Select
              defaultValue={profile.tesla_model ?? undefined}
              onValueChange={(v) => setValue('tesla_model', (v ?? '') as string)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent>
                {teslaModels.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              defaultValue={profile.tesla_year ? String(profile.tesla_year) : undefined}
              onValueChange={(v) => setValue('tesla_year', parseInt((v ?? '0') as string))}
            >
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
        {saved && <p className="text-sm text-green-600">Profile saved.</p>}

        <Button
          type="submit"
          disabled={isSubmitting || uploading}
          className="w-full text-white"
          style={{ backgroundColor: '#E31937' }}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
}
