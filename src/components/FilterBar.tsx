'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TESLA_MODELS, ACCESSORY_CATEGORIES } from '@/lib/constants';

export default function FilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const model = (params.get('model') ?? '') as string;
  const category = (params.get('category') ?? '') as string;

  function update(key: string, value: string) {
    const p = new URLSearchParams(params.toString());
    if (value && value !== 'all') {
      p.set(key, value);
    } else {
      p.delete(key);
    }
    router.push(`/browse?${p.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Select value={model || 'all'} onValueChange={(v) => update('model', v ?? '')}>
        <SelectTrigger className="w-40 min-w-[140px]">
          <SelectValue placeholder="All Models" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Models</SelectItem>
          {TESLA_MODELS.map((m) => (
            <SelectItem key={m} value={m}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={category || 'all'} onValueChange={(v) => update('category', v ?? '')}>
        <SelectTrigger className="w-52">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {ACCESSORY_CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {(model || category) && (
        <Button variant="ghost" size="sm" onClick={() => router.push('/browse')}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
