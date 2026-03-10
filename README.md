# Teslend 🚗

> Turo for Tesla accessories. Bay Area first.

P2P rental marketplace for Tesla accessories — tow hitches, bike racks, roof systems, cargo boxes, and more.

## Stack

- **Next.js 14** App Router + TypeScript
- **NextAuth.js v5** with Google OAuth
- **Supabase** (Postgres + Storage)
- **Tailwind CSS** + shadcn/ui
- **Resend** for secure email relay
- **Vercel** (deploy target)

**Total infra cost: $0/month**

---

## Setup

### 1. Clone & install

```bash
git clone https://github.com/yourname/teslend
cd teslend
npm install
```

### 2. Environment variables

```bash
cp .env.local.example .env.local
```

Fill in:
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — [Google Cloud Console](https://console.cloud.google.com/)
- `NEXT_PUBLIC_SUPABASE_URL` / keys — your Supabase project
- `RESEND_API_KEY` — [resend.com](https://resend.com)

### 3. Supabase setup

In your Supabase project:

1. Run `src/lib/schema.sql` in the SQL editor
2. Create a Storage bucket named `listing-images` (set to **Public**)
3. Set Storage policy: allow all inserts (or restrict to authenticated)

### 4. Google OAuth

In Google Cloud Console:
- Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
- For production: `https://yourdomain.com/api/auth/callback/google`

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

```bash
vercel --prod
```

Set all env vars in Vercel dashboard. Update `NEXTAUTH_URL` to your production URL.

---

## Features

- **Browse** — filter by Tesla model + accessory category
- **List** — create listing with up to 5 photos, daily rate, pickup city
- **Contact** — secure email relay (neither side sees the other's real email)
- **My Listings** — manage your active listings
- **Auth** — Google OAuth, zero friction

## Category support

- Tow Hitch & Receivers
- Hitch Bike Carriers
- Roof Rack Systems
- Cargo Boxes
- Cargo Carriers
- Frunk / Trunk Organizers
- Camping & Overlanding
- Other

## Tesla model support

Model S · Model 3 · Model X · Model Y · Cybertruck
