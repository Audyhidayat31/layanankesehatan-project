import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'HealthServices - Platform Kesehatan Digital Indonesia',
  description: 'Konsultasi dokter online, beli obat, dan layanan kesehatan lengkap. Terhubung dengan dokter terpercaya dan apotek terverifikasi.',
  keywords: ['kesehatan', 'dokter online', 'konsultasi dokter', 'apotek online', 'obat', 'telemedicine'],
  authors: [{ name: 'HealthServices' }],
  openGraph: {
    title: 'HealthServices - Platform Kesehatan Digital Indonesia',
    description: 'Konsultasi dokter online, beli obat, dan layanan kesehatan lengkap',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0891b2',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${geist.variable} ${geistMono.variable} bg-background`}>
      <head>
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'Mid-client-RmaDWKX8jsf_1WQH'}
          strategy="beforeInteractive"
        />
      </head>
      <body className="font-sans antialiased min-h-screen">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
