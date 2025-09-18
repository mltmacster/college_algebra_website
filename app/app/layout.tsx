
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '../components/providers'
import { Toaster } from '../components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
