import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('tesla_models')
    .select('name')
    .eq('active', true)
    .order('display_order');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.map((r) => r.name), {
    headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate' },
  });
}
