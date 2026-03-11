'use client';

import { useState, useEffect } from 'react';

// Fallback in case the API is slow/unavailable
const FALLBACK_MODELS = [
  'Model S',
  'Model 3 (2017-2023)',
  'Model 3 Highland (2024+)',
  'Model X',
  'Model Y (2020-2025)',
  'Model Y Juniper (2025+)',
  'Cybertruck',
];

export function useTeslaModels() {
  const [models, setModels] = useState<string[]>(FALLBACK_MODELS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tesla-models')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) setModels(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { models, loading };
}
