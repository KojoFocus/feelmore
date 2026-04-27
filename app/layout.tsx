import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import BottomNavWrapper from '@/components/layout/BottomNavWrapper'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  title: 'feelmore.',
  description: 'Explore quietly. Discreet delivery. Body-safe products.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} font-sans antialiased`}>
        <BottomNavWrapper>{children}</BottomNavWrapper>
      </body>
    </html>
  )
}
