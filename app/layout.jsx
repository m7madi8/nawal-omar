import './globals.css';
import Script from 'next/script';
import PageTransit from '@/components/PageTransit';
import ScrollRail from '@/components/ScrollRail';

const SITE_URL = 'https://nawalyoga.com';
const SITE_DESCRIPTION =
  'Nawal Yoga is a wellness experience brand — yoga, journeys and experiences for the moments when you need to slow down, breathe deeper and feel again.';
const OG_IMAGE = {
  url: '/media/brand/Black White Minimalist Simple Logo.png',
  width: 1200,
  height: 1200,
  alt: 'Nawal Omar — Nawal Yoga',
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Nawal Yoga',
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: [{ url: '/icon.png', type: 'image/png' }],
    apple: [{ url: '/icon.png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'ar_IL',
    url: SITE_URL,
    siteName: 'Nawal Yoga',
    title: 'Nawal Yoga',
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nawal Yoga',
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <Script id="ny-lang-boot" strategy="beforeInteractive">{`(function(){
  try {
    var lang = localStorage.getItem("nawal-lang") || "ar";
    var root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    if (sessionStorage.getItem("ny-transit")) root.classList.add("ny-transit-pending");
  } catch (e) {}
})();`}</Script>
        {children}
        <ScrollRail />
        <PageTransit />
      </body>
    </html>
  );
}
