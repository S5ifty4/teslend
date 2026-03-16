import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/browse', '/listings/', '/how-it-works'],
        disallow: [
          '/api/',
          '/profile',
          '/my-listings',
          '/listings/new',
          '/listings/*/edit',
          '/onboarding',
        ],
      },
    ],
    sitemap: 'https://teslend.com/sitemap.xml',
  };
}
