import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Teslend — Bay Area Tesla Accessory Rentals';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0f0f0f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          padding: '80px',
        }}
      >
        {/* Red accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: '#E31937',
          }}
        />

        {/* Wordmark */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-2px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span style={{ color: '#E31937' }}>T</span>eslend
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: '#aaaaaa',
            textAlign: 'center',
            fontWeight: 400,
            marginBottom: 48,
          }}
        >
          Bay Area Tesla Accessory Rentals
        </div>

        {/* Sub-copy */}
        <div
          style={{
            fontSize: 22,
            color: '#666666',
            textAlign: 'center',
          }}
        >
          Roof racks · Hitch racks · Bike carriers · Camping gear
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: '#E31937',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
