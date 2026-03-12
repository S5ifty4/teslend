import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { sanitizeForEmail, stripHtml } from '@/lib/sanitize';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder');

const CATEGORIES: Record<string, string> = {
  feature: 'Feature Request',
  bug: 'Bug Report',
  question: 'General Question',
  other: 'Other',
};

export async function POST(req: NextRequest) {
  // Rate limit: 3 messages per IP per 10 minutes
  const ip = getClientIp(req);
  if (!rateLimit(ip, 'contact-us', 3, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests. Please wait before sending another message.' }, { status: 429 });
  }

  const body = await req.json();
  const { name, email, category, message } = body;

  if (!name || !email || !category || !message) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  if (!CATEGORIES[category]) {
    return NextResponse.json({ error: 'Invalid category.' }, { status: 400 });
  }

  // Sanitize all user input
  const safeName = stripHtml(name);
  const safeEmail = stripHtml(email);
  const safeMessage = sanitizeForEmail(message);
  const safeCategory = CATEGORIES[category];

  const toEmail = process.env.CONTACT_EMAIL;
  if (!toEmail) return NextResponse.json({ error: 'Contact email not configured.' }, { status: 500 });

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'inquiry@teslend.com',
    to: toEmail,
    replyTo: safeEmail,
    subject: `[Teslend] ${safeCategory} from ${safeName}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <div style="border-bottom: 3px solid #E31937; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="margin: 0; font-size: 22px;">Teslend Feedback</h1>
          <p style="margin: 4px 0 0; color: #666; font-size: 14px;">${safeCategory}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 8px 0; color: #666; width: 120px; font-size: 14px;">From</td>
            <td style="padding: 8px 0; font-size: 14px;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-size: 14px;">Email</td>
            <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${safeEmail}" style="color: #E31937;">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-size: 14px;">Category</td>
            <td style="padding: 8px 0; font-size: 14px;">${safeCategory}</td>
          </tr>
        </table>

        <div style="background: #f5f5f5; border-radius: 8px; padding: 20px;">
          <p style="margin: 0 0 8px; color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
          <p style="margin: 0; line-height: 1.6;">${safeMessage}</p>
        </div>

        <p style="margin-top: 24px; color: #999; font-size: 12px;">
          Reply to this email to respond directly to ${safeName}.
        </p>

        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; color: #bbb; font-size: 11px;">
          Teslend · Bay Area Tesla Accessory Rentals
        </div>
      </div>
    `,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
