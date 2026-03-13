'use client';

import { useState, useEffect } from 'react';
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
import { useTeslaModels } from '@/lib/useTeslaModels';
import { MasterAccessory } from '@/lib/types';

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(3, 'Please add a description'),
  tesla_model: z.string().min(1, 'Vehicle model required'),
  daily_price: z.number().min(1, 'Price must be at least $1'),
  city: z.string().min(2, 'City required'),
  zip_code: z.string().regex(/^\d{5}$/, 'Enter a valid 5-digit ZIP'),
  master_accessory_id: z.string().min(1, 'Please select an accessory type'),
});

type FormData = z.infer<typeof schema>;

export default function ListingForm() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [masterAccessories, setMasterAccessories] = useState<MasterAccessory[]>([]);
  const [selectedMasterId, setSelectedMasterId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const { models: teslaModels } = useTeslaModels();

  useEffect(() => {
    fetch('/api/master-accessories')
      .then((r) => r.json())
      .then((data) => setMasterAccessories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Filter catalog items to only those compatible with the selected model
  const compatibleItems = selectedModel
    ? masterAccessories.filter(
        (acc) => !acc.compatibility?.length || acc.compatibility.includes(selectedModel)
      )
    : masterAccessories;

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
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
        <Input {...register('title')} placeholder="Tesla Model Y Hitch Rack" className="mt-1" />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <Label>Description *</Label>
        <Textarea {...register('description')} placeholder="Condition, included items, rental terms..." rows={4} className="mt-1" />
        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3">
          <Label>Tesla Model *</Label>
          <Select onValueChange={(v: string | null) => {
            const model = v ?? '';
            setSelectedModel(model);
            setValue('tesla_model', model);
            // Clear catalog item if no longer compatible with new model
            if (selectedMasterId) {
              const acc = masterAccessories.find((a) => a.id === selectedMasterId);
              if (acc && acc.compatibility?.length && !acc.compatibility.includes(model)) {
                setSelectedMasterId('other');
                setValue('master_accessory_id', 'other');
              }
            }
          }}>
            <SelectTrigger className="mt-1 w-full">
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

        <div className="col-span-2">
          <Label>Price/day ($) *</Label>
          <Input {...register('daily_price', { valueAsNumber: true })} type="number" min="1" step="0.01" placeholder="" className="mt-1" />
          {errors.daily_price && <p className="text-xs text-red-500 mt-1">{errors.daily_price.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3">
          <Label>City *</Label>
          <Input {...register('city')} placeholder="" className="mt-1" />
          {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
        </div>
        <div className="col-span-2">
          <Label>ZIP *</Label>
          <Input {...register('zip_code')} placeholder="" maxLength={5} className="mt-1" />
          {errors.zip_code && <p className="text-xs text-red-500 mt-1">{errors.zip_code.message}</p>}
        </div>
      </div>

      <div>
        <Label>Accessory Type *</Label>
        <Select
          value={selectedMasterId ?? 'other'}
          onValueChange={(v: string | null) => {
            const id = !v || v === 'other' ? null : v;
            setSelectedMasterId(id);
            setValue('master_accessory_id', v ?? 'other');
          }}
        >
          <SelectTrigger className="mt-1 w-full">
            <SelectValue placeholder="Select accessory type">
              {selectedMasterId && selectedMasterId !== 'other'
                ? masterAccessories.find((a) => a.id === selectedMasterId)?.name
                : selectedMasterId === 'other' ? 'Other' : 'Select accessory type'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {compatibleItems.map((acc) => (
              <SelectItem key={acc.id} value={acc.id}>
                {acc.name}
              </SelectItem>
            ))}
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.master_accessory_id && <p className="text-xs text-red-500 mt-1">{errors.master_accessory_id.message}</p>}
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
        style={{ backgroundColor: '#3E6AE1' }}
      >
        {isSubmitting ? 'Publishing...' : 'Publish Listing'}
      </Button>
    </form>
  );
}
