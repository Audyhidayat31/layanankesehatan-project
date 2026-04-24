import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
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
  title: 'MedCare - Platform Kesehatan Digital Indonesia',
  description: 'Konsultasi dokter online, beli obat, dan layanan kesehatan lengkap. Terhubung dengan dokter terpercaya dan apotek terverifikasi.',
  keywords: ['kesehatan', 'dokter online', 'konsultasi dokter', 'apotek online', 'obat', 'telemedicine'],
  authors: [{ name: 'MedCare' }],
  openGraph: {
    title: 'MedCare - Platform Kesehatan Digital Indonesia',
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
      <body className="font-sans antialiased min-h-screen">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
