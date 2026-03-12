import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await supabase
    .from('listings')
    .select('*, users(id, name, image, email)')
    .eq('id', id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  // Strip email from response
  if (data?.users) {
    const { email: _, ...userWithoutEmail } = data.users as typeof data.users & { email: string };
    data.users = userWithoutEmail as typeof data.users;
  }
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const { data: user } = await supabaseAdmin
    .from('users').select('id').eq('email', session.user.email).single();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const sanitizedBody = {
    ...body,
    master_accessory_id: body.master_accessory_id === 'other' || !body.master_accessory_id ? null : body.master_accessory_id,
  };

  const { data, error } = await supabaseAdmin
    .from('listings')
    .update({ ...sanitizedBody, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { data: user } = await supabaseAdmin
    .from('users').select('id').eq('email', session.user.email).single();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const { error } = await supabaseAdmin
    .from('listings')
    .update({ active: false })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
