import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const model = searchParams.get('model');
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') ?? '20');

  let query = supabase
    .from('listings')
    .select('*, users(id, name, image)')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (model) query = query.eq('tesla_model', model);
  if (category) query = query.eq('category', category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  // Get user id
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single();

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const { data, error } = await supabaseAdmin.from('listings').insert({
    ...body,
    user_id: user.id,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
