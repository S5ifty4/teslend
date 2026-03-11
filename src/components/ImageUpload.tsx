'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { X, Upload } from 'lucide-react';

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

// Compress image to under 3MB using canvas
async function compressImage(file: File, maxBytes = 3 * 1024 * 1024): Promise<File> {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      // Scale down if image is very large
      const maxDim = 2000;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);

      // Try quality steps until under maxBytes
      const tryQuality = (q: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return; }
            if (blob.size <= maxBytes || q <= 0.4) {
              resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
            } else {
              tryQuality(q - 0.1);
            }
          },
          'image/jpeg',
          q
        );
      };
      tryQuality(0.85);
    };
    img.src = url;
  });
}

export default function ImageUpload({ value, onChange, maxImages = 5 }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    if (!files.length) return;
    setUploading(true);
    setUploadError('');
    const newUrls: string[] = [];

    for (const rawFile of Array.from(files).slice(0, maxImages - value.length)) {
      try {
        const file = await compressImage(rawFile);
        const form = new FormData();
        form.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: form });
        if (!res.ok) {
          const d = await res.json();
          setUploadError(d.error ?? 'Upload failed');
          continue;
        }
        const data = await res.json();
        if (data.url) newUrls.push(data.url);
      } catch {
        setUploadError('Upload failed — please try again');
      }
    }

    onChange([...value, ...newUrls]);
    setUploading(false);
  }

  function remove(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {value.map((url) => (
          <div key={url} className="relative w-24 h-24 rounded overflow-hidden border">
            <Image src={url} alt="upload" fill className="object-cover" />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-white hover:bg-black"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {value.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 transition-colors disabled:opacity-50"
          >
            <Upload size={20} />
            <span className="text-xs mt-1">{uploading ? 'Uploading...' : 'Add photo'}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
      <p className="text-xs text-gray-400">Up to {maxImages} photos</p>
    </div>
  );
}
