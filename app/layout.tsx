import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ORO Operations',
  description: 'ORO store operations dashboard',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}