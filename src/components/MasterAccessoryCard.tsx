'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Tag } from 'lucide-react';
import { MasterAccessory } from '@/lib/types';

interface Props {
  accessory: MasterAccessory;
}

export default function MasterAccessoryCard({ accessory }: Props) {
  const [imgError, setImgError] = useState(false);
  const showImage = accessory.image_url && !imgError;

  return (
    <Link
      href={`/browse?master=${accessory.slug}`}
      className="flex-shrink-0 w-64 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 cursor-pointer"
    >
      {/* Image */}
      <div className="relative w-full h-44 bg-gray-100">
        {showImage ? (
          <Image
            src={accessory.image_url!}
            alt={accessory.name}
            fill
            unoptimized
            className="object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
            <svg
              className="w-12 h-12 text-gray-300 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8M10 12h4"
              />
            </svg>
            <span className="text-xs text-gray-400 text-center px-2">{accessory.name}</span>
          </div>
        )}

        {/* Availability badge */}
        <div className="absolute top-2 right-2">
          {(accessory.listing_count ?? 0) > 0 ? (
            <span
              className="text-white text-xs font-semibold px-2 py-1 rounded-full"
              style={{ backgroundColor: '#3E6AE1' }}
            >
              {accessory.listing_count} available
            </span>
          ) : (
            <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
              Be first to list
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight">{accessory.name}</h3>

        {/* Compatibility chips */}
        {accessory.compatibility.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {accessory.compatibility.map((model) => (
              <span
                key={model}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
              >
                {model}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        {accessory.tesla_price != null && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Tag className="w-3 h-3" />
            <span>Tesla retail: ${accessory.tesla_price.toLocaleString()}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
