import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';
import { sanitizeForEmail, stripHtml } from '@/lib/sanitize';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder');

export async function POST(req: NextRequest) {
  // Rate limit: 5 inquiries per IP per 10 minutes
  const ip = getClientIp(req);
  if (!rateLimit(ip, 'inquiries', 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests. Please wait before submitting another inquiry.' }, { status: 429 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { listing_id, start_date, end_date, tesla_model, tesla_year, phone, note } = body;

  // Sanitize all user-supplied text fields
  const safeNote = note ? sanitizeForEmail(note) : null;
  const safeTeslaModel = stripHtml(tesla_model);
  const safeTeslaYear = tesla_year ? stripHtml(String(tesla_year)) : null;

  if (!listing_id || !start_date || !end_date || !tesla_model || !phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Get requester info
  const { data: requester } = await supabaseAdmin
    .from('users')
    .select('id, name, email, phone')
    .eq('email', session.user.email)
    .single();

  if (!requester) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Get listing + owner info
  const { data: listing } = await supabaseAdmin
    .from('listings')
    .select('id, title, city, daily_price, users(id, name, email)')
    .eq('id', listing_id)
    .single();

  if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

  const owner = listing.users as unknown as { id: string; name: string | null; email: string } | null;
  if (!owner?.email) return NextResponse.json({ error: 'Owner not found' }, { status: 404 });

  // Save inquiry
  const { data: inquiry, error: insertError } = await supabaseAdmin
    .from('inquiries')
    .insert({
      listing_id,
      requester_id: requester.id,
      start_date,
      end_date,
      tesla_model,
      tesla_year: tesla_year ?? null,
      phone,
      note: note ?? null,
    })
    .select()
    .single();

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  const formatPhone = (raw: string) => {
    const d = (raw ?? '').replace(/\D/g, '').slice(0, 10);
    if (d.length === 10) return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
    return raw;
  };

  const startFormatted = new Date(start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const endFormatted = new Date(end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const days = Math.ceil((new Date(end_date).getTime() - new Date(start_date).getTime()) / (1000 * 60 * 60 * 24));
  const total = (days * listing.daily_price).toFixed(2);

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'inquiry@teslend.com';

  // Email to owner
  await resend.emails.send({
    from: fromEmail,
    to: owner.email,
    replyTo: requester.email,
    subject: `Rental inquiry for "${listing.title}"`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <div style="border-bottom: 3px solid #E31937; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="margin: 0; font-size: 24px;">New Rental Inquiry</h1>
          <p style="margin: 4px 0 0; color: #666;">via Teslend</p>
        </div>

        <p>Hi ${owner.name?.split(' ')[0] ?? 'there'},</p>
        <p>Someone is interested in renting your <strong>${listing.title}</strong>.</p>

        <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="margin: 0 0 16px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #666;">Rental Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #666; width: 140px;">Dates</td><td style="padding: 6px 0; font-weight: 600;">${startFormatted} to ${endFormatted} (${days} day${days !== 1 ? 's' : ''})</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Est. Total</td><td style="padding: 6px 0; font-weight: 600;">$${total}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Vehicle</td><td style="padding: 6px 0;">${safeTeslaModel}${safeTeslaYear ? ` (${safeTeslaYear})` : ''}</td></tr>
          </table>
          ${safeNote ? `<div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #ddd;"><p style="margin: 0; color: #666; font-size: 13px;">Note from requester:</p><p style="margin: 8px 0 0;">${safeNote}</p></div>` : ''}
        </div>

        <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="margin: 0 0 16px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #666;">Requester</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #666; width: 140px;">Name</td><td style="padding: 6px 0;">${requester.name ?? 'Not provided'}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Phone</td><td style="padding: 6px 0;"><a href="tel:${phone}" style="color: #111;">${formatPhone(phone)}</a></td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Email</td><td style="padding: 6px 0;"><a href="mailto:${requester.email}" style="color: #E31937;">${requester.email}</a></td></tr>
          </table>
        </div>

        <p>Reply directly to this email to get in touch with the requester.</p>

        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          Teslend · Bay Area Tesla Accessory Rentals
        </div>
      </div>
    `,
  });

  // Confirmation email to requester
  await resend.emails.send({
    from: fromEmail,
    to: requester.email,
    subject: `Your inquiry for "${listing.title}" was sent`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <div style="border-bottom: 3px solid #E31937; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="margin: 0; font-size: 24px;">Inquiry Sent</h1>
          <p style="margin: 4px 0 0; color: #666;">via Teslend</p>
        </div>

        <p>Hi ${requester.name?.split(' ')[0] ?? 'there'},</p>
        <p>Your rental inquiry for <strong>${listing.title}</strong> in ${listing.city} has been sent to the owner. They'll reach out to you directly once they review your request.</p>

        <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="margin: 0 0 16px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #666;">Your Request Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #666; width: 140px;">Item</td><td style="padding: 6px 0;">${listing.title}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Dates</td><td style="padding: 6px 0;">${startFormatted} to ${endFormatted}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Duration</td><td style="padding: 6px 0;">${days} day${days !== 1 ? 's' : ''}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Est. Total</td><td style="padding: 6px 0; font-weight: 600;">$${total} at $${listing.daily_price}/day</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Your Vehicle</td><td style="padding: 6px 0;">${safeTeslaModel}${safeTeslaYear ? ` (${safeTeslaYear})` : ''}</td></tr>
          </table>
        </div>

        <p style="color: #666; font-size: 14px;">Typical response time is 24–48 hours. If you don't hear back, feel free to browse other listings on Teslend.</p>

        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          Teslend · Bay Area Tesla Accessory Rentals
        </div>
      </div>
    `,
  });

  return NextResponse.json(inquiry, { status: 201 });
}
