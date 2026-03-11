'use client';

import Image from 'next/image';
import { useState } from 'react';

interface Props {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
}

export default function UserAvatar({ src, name, size = 32, className = '' }: Props) {
  const [imgError, setImgError] = useState(false);
  const initials = name
    ? name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  if (src && !imgError) {
    return (
      <Image
        src={src}
        alt={name ?? 'User'}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
        onError={() => setImgError(true)}
        referrerPolicy="no-referrer"
      />
    );
  }

  // Fallback: initials avatar
  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold text-white select-none ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: '#E31937',
        fontSize: size * 0.38,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}
