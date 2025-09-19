
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '../components/providers'
import { Toaster } from '../components/ui/toaster'
import { ErrorBoundary } from '../components/error-boundary'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
})

export const metadata = {
  title: 'College Algebra Learning Platform',
  description: 'Interactive College Algebra learning platform for undergraduate business students with AI tutoring assistance.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="font-display" content="swap" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary fallbackTitle="Application Error" showHomeButton={true}>
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
