import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SiteSettingsProvider } from '@/context/SiteSettingsContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingAppInstall from '@/components/ui/FloatingAppInstall'
import LiveOrderPopup from "@/components/LiveOrderPopup";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const viewport: Viewport = {
  themeColor: '#ec1a57',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://freefiretopupbd.com'),
  title: {
    template: '%s',
    default: 'Free Fire Diamond Top Up Bangladesh | Instant FF Diamond Recharge'
  
  },
  manifest: '/manifest.json',
  description: 'Buy Free Fire Diamond Top Up in Bangladesh instantly with bKash, Nagad & Rocket. Secure FF Diamond recharge with fast automated delivery.',
  
  authors: [{ name: 'Free Fire Top Up BD' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'Free Fire Top Up BD - Premium Game Top Up',
    description: 'Get your game credits instantly! Premium games top up app in Bangladesh with automated delivery.',
    url: '/',
    siteName: 'FreeFire TopUp BD',
    locale: 'en_BD',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Structured Data for Google Site Name */}
        <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
        __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "FreeFireTopUpBD",
        "url": "https://freefiretopupbd.com",
        "logo": "https://freefiretopupbd.com/favicon.ico"
        })
        }}
        />
      </head>

      <body className={`${inter.variable} font-sans min-h-screen flex flex-col pt-16 bg-gradient-to-b from-[#070c18] via-[#0b1224] to-[#05070d] text-white`}>
        <SiteSettingsProvider>
          <Header />
          
          <main className="flex-grow w-full h-full relative z-0">
            {children}
          </main>

          <Footer />
          <FloatingAppInstall />
          <LiveOrderPopup />
        </SiteSettingsProvider>
      </body>
    </html>
  )
}