import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import ThemeRegistry from '@/components/ThemeRegistry';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'BMI & Wellness Tracker',
  description: 'Calculate your BMI and get personalized nutrition and activity suggestions to reach your goals.',
  applicationName: 'BMI & Wellness Tracker',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'BMI Tracker', statusBarStyle: 'default' },
  icons: {
    icon: [{ url: '/icons/192', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/icons/180', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#0F7657',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AppRouterCacheProvider>
          <ThemeRegistry>{children}</ThemeRegistry>
        </AppRouterCacheProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
