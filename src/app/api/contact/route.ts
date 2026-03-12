import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase';
import { sanitizeForEmail, stripHtml } from '@/lib/sanitize';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder');

export async function POST(req: NextRequest) {
  // Rate limit: 5 messages per IP per 10 minutes
  const ip = getClientIp(req);
  if (!rateLimit(ip, 'contact', 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests. Please wait before sending another message.' }, { status: 429 });
  }

  // Auth guard — must be signed in to send contact messages
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { listing_id, renter_name, renter_email, message } = await req.json();

  if (!listing_id || !renter_name || !renter_email || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Sanitize all user-supplied fields
  const safeName = stripHtml(renter_name);
  const safeEmail = stripHtml(renter_email);
  const safeMessage = sanitizeForEmail(message);

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

  const safeTitle = stripHtml(listing.title);
  const safeListerName = stripHtml(listerName ?? '');

  const { error: emailError } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'noreply@teslend.com',
    to: listerEmail,
    replyTo: safeEmail,
    subject: `Someone is interested in your "${safeTitle}" on Teslend`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #E31937;">New rental inquiry on Teslend</h2>
        <p>Hi ${safeListerName || 'there'},</p>
        <p><strong>${safeName}</strong> is interested in renting your <strong>${safeTitle}</strong>.</p>
        <blockquote style="border-left: 3px solid #E31937; padding-left: 16px; color: #555;">
          ${safeMessage}
        </blockquote>
        <p>To reply, simply respond to this email and it will go directly to ${safeName}.</p>
        <hr style="border: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">Teslend · Bay Area Tesla Accessory Rentals</p>
      </div>
    `,
  });

  if (emailError) return NextResponse.json({ error: emailError.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
