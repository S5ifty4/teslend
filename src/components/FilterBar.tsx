'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MasterAccessory, User } from '@/lib/types';
import { useTeslaModels } from '@/lib/useTeslaModels';

interface Props {
  accessories?: MasterAccessory[];
}

export default function FilterBar({ accessories = [] }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const model = params.get('model') ?? '';
  const master = params.get('master') ?? '';
  const category = params.get('category') ?? '';
  const [primaryVehicle, setPrimaryVehicle] = useState('');

  useEffect(() => {
    // Only auto-apply primary vehicle if no model filter is already in the URL
    if (model) return;
    fetch('/api/user')
      .then((r) => r.ok ? r.json() : null)
      .then((data: User | null) => {
        if (data?.tesla_model) {
          setPrimaryVehicle(data.tesla_model);
          // Apply as actual filter so listings are filtered server-side
          const p = new URLSearchParams(params.toString());
          p.set('model', data.tesla_model);
          router.replace(`/browse?${p.toString()}`);
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const itemValue = master || (category === 'Other' ? 'other' : 'all');
  const { models } = useTeslaModels();

  function updateModel(value: string) {
    const p = new URLSearchParams(params.toString());
    if (value && value !== 'all') p.set('model', value);
    else p.delete('model');
    router.push(`/browse?${p.toString()}`);
  }

  function updateItem(value: string) {
    const p = new URLSearchParams(params.toString());
    p.delete('master');
    p.delete('category');
    if (value === 'other') p.set('category', 'Other');
    else if (value && value !== 'all') p.set('master', value);
    router.push(`/browse?${p.toString()}`);
  }

  const hasFilters = !!(model || master || category);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex flex-col gap-1 w-full sm:w-64">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tesla Model</span>
        <Select value={model || primaryVehicle || 'all'} onValueChange={(v) => updateModel(v ?? '')}>
          <SelectTrigger className="w-full">
            <SelectValue>{model || primaryVehicle || 'All Models'}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Models</SelectItem>
            {models.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1 w-full sm:w-64">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Item Type</span>
        <Select value={itemValue} onValueChange={(v) => updateItem(v ?? '')}>
          <SelectTrigger className="w-full">
            <SelectValue>
              {itemValue === 'all' || !itemValue
                ? 'All Items'
                : itemValue === 'other'
                ? 'Other / Aftermarket'
                : (accessories.find((a) => a.slug === itemValue)?.name ?? itemValue)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            {accessories.map((acc) => (
              <SelectItem key={acc.id} value={acc.slug}>{acc.name}</SelectItem>
            ))}
            <SelectItem value="other">Other / Aftermarket</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <button
          onClick={() => {
            setPrimaryVehicle('');
            router.push('/browse');
          }}
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors" style={{ color: '#E31937' }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
