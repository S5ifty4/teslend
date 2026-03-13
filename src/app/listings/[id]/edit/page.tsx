'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUpload from '@/components/ImageUpload';
import { useTeslaModels } from '@/lib/useTeslaModels';
import { Listing, MasterAccessory } from '@/lib/types';

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

export default function EditListingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [listing, setListing] = useState<Listing | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [masterAccessories, setMasterAccessories] = useState<MasterAccessory[]>([]);
  const [selectedMasterId, setSelectedMasterId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('');
  const [error, setError] = useState('');
  const { models: teslaModels } = useTeslaModels();

  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/api/auth/signin');
  }, [status, router]);

  useEffect(() => {
    fetch('/api/master-accessories')
      .then((r) => r.json())
      .then((data) => setMasterAccessories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/listings/${id}`)
      .then((r) => r.json())
      .then((data: Listing) => {
        setListing(data);
        setImages(data.images ?? []);
        setSelectedModel(data.tesla_model ?? '');
        setSelectedMasterId(data.master_accessory_id ?? 'other');
        reset({
          title: data.title,
          description: data.description ?? '',
          tesla_model: data.tesla_model ?? '',
          daily_price: data.daily_price,
          city: data.city ?? '',
          zip_code: data.zip_code ?? '',
          master_accessory_id: data.master_accessory_id ?? 'other',
        });
      });
  }, [id, reset]);

  const compatibleItems = selectedModel
    ? masterAccessories.filter(
        (acc) => !acc.compatibility?.length || acc.compatibility.includes(selectedModel)
      )
    : masterAccessories;

  async function onSubmit(data: FormData) {
    setError('');
    const res = await fetch(`/api/listings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, images }),
    });
    if (res.ok) {
      router.push(`/listings/${id}`);
    } else {
      const d = await res.json();
      setError(d.error ?? 'Something went wrong');
    }
  }

  if (status === 'loading' || !listing) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Edit Listing</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Item Details</p>
        <div>
          <Label>Title *</Label>
          <Input {...register('title')} className="mt-1" />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <Label>Description *</Label>
          <Textarea {...register('description')} rows={4} className="mt-1" />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
        </div>

        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Vehicle & Pricing</p>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3">
            <Label>Tesla Model *</Label>
            <Select
              value={selectedModel}
              onValueChange={(v) => {
                const model = v ?? '';
                setSelectedModel(model);
                setValue('tesla_model', model);
                if (selectedMasterId) {
                  const acc = masterAccessories.find((a) => a.id === selectedMasterId);
                  if (acc && acc.compatibility?.length && !acc.compatibility.includes(model)) {
                    setSelectedMasterId(null);
                    setValue('master_accessory_id', 'other');
                    setSelectedMasterId('other');
                  }
                }
              }}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue>{selectedModel || 'Select model'}</SelectValue>
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
            <Input {...register('daily_price', { valueAsNumber: true })} type="number" min="1" step="0.01" className="mt-1" />
            {errors.daily_price && <p className="text-xs text-red-500 mt-1">{errors.daily_price.message}</p>}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Location</p>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3">
            <Label>City *</Label>
            <Input {...register('city')} className="mt-1" />
            {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
          </div>
          <div className="col-span-2">
            <Label>ZIP *</Label>
            <Input {...register('zip_code')} maxLength={5} className="mt-1" />
            {errors.zip_code && <p className="text-xs text-red-500 mt-1">{errors.zip_code.message}</p>}
          </div>
        </div>

        <div>
          <Label>Accessory Type *</Label>
          <Select
            value={selectedMasterId ?? 'other'}
            onValueChange={(v) => {
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
                <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
              ))}
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.master_accessory_id && <p className="text-xs text-red-500 mt-1">{errors.master_accessory_id.message}</p>}
        </div>

        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Photos</p>
        </div>
        <div>
          <Label>Photos (up to 5)</Label>
          <div className="mt-2">
            <ImageUpload value={images} onChange={setImages} />
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="text-white px-8"
            style={{ backgroundColor: '#3E6AE1' }}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push(`/listings/${id}`)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
