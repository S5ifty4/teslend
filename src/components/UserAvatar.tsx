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

  // Fallback: silhouette avatar
  return (
    <div
      className={`rounded-full flex items-center justify-center bg-gray-200 overflow-hidden select-none flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size * 0.65, height: size * 0.65 }}
      >
        <circle cx="12" cy="8" r="4" fill="#9CA3AF" />
        <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" fill="#9CA3AF" />
      </svg>
    </div>
  );
}
