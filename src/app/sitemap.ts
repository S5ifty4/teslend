import { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

const siteUrl = 'https://teslend.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/browse`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Dynamic listing pages
  try {
    const { data: listings } = await supabaseAdmin
      .from('listings')
      .select('id, updated_at')
      .eq('active', true)
      .order('updated_at', { ascending: false });

    const listingPages: MetadataRoute.Sitemap = (listings ?? []).map((l) => ({
      url: `${siteUrl}/listings/${l.id}`,
      lastModified: new Date(l.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...listingPages];
  } catch {
    return staticPages;
  }
}
