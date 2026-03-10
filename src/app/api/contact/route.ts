import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder');

export async function POST(req: NextRequest) {
  const { listing_id, renter_name, renter_email, message } = await req.json();

  if (!listing_id || !renter_name || !renter_email || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Fetch listing + lister email (service role — bypasses RLS)
  const { data: listing, error } = await supabaseAdmin
    .from('listings')
    .select('title, users(email, name)')
    .eq('id', listing_id)
    .single();

  if (error || !listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  const listerUser = listing.users as unknown as { email: string; name: string | null } | null;
  const listerEmail = listerUser?.email;
  const listerName = listerUser?.name;

  if (!listerEmail) return NextResponse.json({ error: 'Lister not found' }, { status: 404 });

  const { error: emailError } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'noreply@teslend.com',
    to: listerEmail,
    replyTo: renter_email,
    subject: `Someone is interested in your "${listing.title}" on Teslend`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #E31937;">New rental inquiry on Teslend</h2>
        <p>Hi ${listerName ?? 'there'},</p>
        <p><strong>${renter_name}</strong> is interested in renting your <strong>${listing.title}</strong>.</p>
        <blockquote style="border-left: 3px solid #E31937; padding-left: 16px; color: #555;">
          ${message.replace(/\n/g, '<br>')}
        </blockquote>
        <p>To reply, simply respond to this email — it will go directly to ${renter_name}.</p>
        <hr style="border: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">Teslend · Bay Area Tesla Accessory Rentals</p>
      </div>
    `,
  });

  if (emailError) return NextResponse.json({ error: emailError.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
