import type { Metadata } from 'next';
import Script from 'next/script';
import { fraunces, inter } from './fonts';
import { Toaster } from 'sonner';
import { TranslationProvider } from '@/shared/lib/TranslationProvider';
import './globals.css';

const GA_ID = 'G-WT40C1X5S0';

export const metadata: Metadata = {
  title: {
    default: 'Cenotes Aventura y Más | Tours Guiados en Homún, Yucatán — Mochotours',
    template: '%s | Mochotours — Cenotes en Homún',
  },
  description:
    'Tours guiados de cenotes en Homún, Yucatán con Pedro Poot, guía local con +10 años de experiencia. Recorre Tzajuncat, Holcozón, Baalmil, Yaxbacaltún y Santa Rosa en moto-taxi tradicional. Grupos de 2 a 50 personas. A 1 hora de Mérida.',
  keywords: [
    'cenotes Homún',
    'tour cenotes Yucatán',
    'cenotes cerca de Mérida',
    'guía local cenotes',
    'mochotours',
    'cenote Yaxbacaltún',
    'cenote Tzajuncat',
    'cenote Holcozón',
    'cenote Baalmil',
    'cenote Santa Rosa',
    'tours en moto-taxi Homún',
    'cenotes familiares Homún',
  ],
  openGraph: {
    title: 'Cenotes Aventura y Más | Tours Guiados en Homún, Yucatán',
    description:
      'Tours guiados de cenotes en Homún, Yucatán con Pedro Poot. Recorre Tzajuncat, Holcozón, Baalmil y más en moto-taxi tradicional. Grupos de 2 a 50 personas.',
    type: 'website',
    locale: 'es_MX',
    images: [
      {
        url: 'https://cenotesmochotours.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Cenotes Aventura y Más — Tours guiados en Homún, Yucatán',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cenotes Aventura y Más | Tours Guiados en Homún, Yucatán',
    description:
      'Tours guiados de cenotes en Homún con Pedro Poot, guía local. Moto-taxi tradicional, cenotes Tzajuncat, Holcozón, Baalmil. Grupos de 2 a 50 personas.',
    images: ['https://cenotesmochotours.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://cenotesmochotours.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased scroll-smooth`}
    >
      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>

      <body className="min-h-full flex flex-col">
        <TranslationProvider>
          {children}
        </TranslationProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}

