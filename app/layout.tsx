import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
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
  title: 'MedConnect - Platform Kesehatan Digital Indonesia',
  description: 'Konsultasi dokter online, beli obat, dan layanan kesehatan lengkap. Terhubung dengan dokter terpercaya dan apotek terverifikasi.',
  keywords: ['kesehatan', 'dokter online', 'konsultasi dokter', 'apotek online', 'obat', 'telemedicine'],
  authors: [{ name: 'MedConnect' }],
  openGraph: {
    title: 'MedConnect - Platform Kesehatan Digital Indonesia',
    description: 'Konsultasi dokter online, beli obat, dan layanan kesehatan lengkap',
    type: 'website',
  },
  icons: {
    icon: '/icon.svg',
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
    <html lang="id" className={`${geist.variable} ${geistMono.variable} bg-background`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Script
            src="https://app.sandbox.midtrans.com/snap/snap.js"
            data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'Mid-client-RmaDWKX8jsf_1WQH'}
            strategy="afterInteractive"
          />
          {children}
          <Toaster richColors closeButton position="top-right" />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}
