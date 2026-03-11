import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const { data: accessories, error } = await supabaseAdmin
    .from('master_accessories')
    .select('*')
    .eq('active', true)
    .order('name');

  if (error) return NextResponse.json([], { status: 200 });

  const withCounts = await Promise.all(
    (accessories || []).map(async (acc) => {
      const { count } = await supabaseAdmin
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('master_accessory_id', acc.id)
        .eq('active', true);
      return { ...acc, listing_count: count ?? 0 };
    })
  );

  return NextResponse.json(withCounts);
}
