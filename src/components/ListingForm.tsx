'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUpload from './ImageUpload';
import { ACCESSORY_CATEGORIES } from '@/lib/constants';
import { useTeslaModels } from '@/lib/useTeslaModels';

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Please add a description'),
  tesla_model: z.string().min(1, "Vehicle model required"),
  category: z.enum(ACCESSORY_CATEGORIES),
  daily_price: z.number().min(1, 'Price must be at least $1'),
  condition: z.enum(['Like New', 'Good', 'Fair']),
  city: z.string().min(2, 'City required'),
  zip_code: z.string().regex(/^\d{5}$/, 'Enter a valid 5-digit ZIP'),
});

type FormData = z.infer<typeof schema>;

export default function ListingForm() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState('');
  const { models: teslaModels } = useTeslaModels();

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setError('');
    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, images }),
    });

    if (res.ok) {
      const listing = await res.json();
      router.push(`/listings/${listing.id}`);
    } else {
      const d = await res.json();
      setError(d.error ?? 'Something went wrong');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div>
        <Label>Title *</Label>
        <Input {...register('title')} placeholder="e.g. Tesla Model Y Thule Hitch Bike Rack" className="mt-1" />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <Label>Description *</Label>
        <Textarea {...register('description')} placeholder="Condition, included items, rental terms..." rows={4} className="mt-1" />
        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Tesla Model *</Label>
          <Select onValueChange={(v) => setValue('tesla_model', (v ?? '') as string)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {teslaModels.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tesla_model && <p className="text-xs text-red-500 mt-1">{errors.tesla_model.message}</p>}
        </div>

        <div>
          <Label>Category *</Label>
          <Select onValueChange={(v) => setValue('category', v as typeof ACCESSORY_CATEGORIES[number])}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {ACCESSORY_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Daily Price ($) *</Label>
          <Input {...register('daily_price', { valueAsNumber: true })} type="number" min="1" step="0.01" placeholder="25" className="mt-1" />
          {errors.daily_price && <p className="text-xs text-red-500 mt-1">{errors.daily_price.message}</p>}
        </div>

        <div>
          <Label>Condition *</Label>
          <Select onValueChange={(v) => setValue('condition', v as 'Like New' | 'Good' | 'Fair')}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {['Like New', 'Good', 'Fair'].map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.condition && <p className="text-xs text-red-500 mt-1">{errors.condition.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>City *</Label>
          <Input {...register('city')} placeholder="San Jose" className="mt-1" />
          {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
        </div>
        <div>
          <Label>ZIP Code *</Label>
          <Input {...register('zip_code')} placeholder="95110" maxLength={5} className="mt-1" />
          {errors.zip_code && <p className="text-xs text-red-500 mt-1">{errors.zip_code.message}</p>}
        </div>
      </div>

      <div>
        <Label>Photos (up to 5)</Label>
        <div className="mt-2">
          <ImageUpload value={images} onChange={setImages} />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="text-white px-8"
        style={{ backgroundColor: '#E31937' }}
      >
        {isSubmitting ? 'Publishing...' : 'Publish Listing'}
      </Button>
    </form>
  );
}
