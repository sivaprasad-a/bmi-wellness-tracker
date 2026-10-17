import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BMI & Wellness Tracker',
    short_name: 'BMI Tracker',
    description: 'Calculate your BMI and get a personalized nutrition, activity and hydration plan.',
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F3F7F5',
    theme_color: '#0F7657',
    categories: ['health', 'fitness', 'lifestyle'],
    icons: [
      { src: '/icons/192', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/512', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-512', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
