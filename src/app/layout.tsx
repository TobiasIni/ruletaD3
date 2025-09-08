import type { Metadata } from 'next'
import { Inter, Oswald, Share_Tech } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const oswald = Oswald({ 
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap'
})
const shareTech = Share_Tech({ 
  subsets: ['latin'],
  variable: '--font-share-tech',
  display: 'swap',
  weight: '400'
})

export const metadata: Metadata = {
  title: 'Ruleta de Premios',
  description: 'Una ruleta interactiva para sortear premios',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${oswald.variable} ${shareTech.variable}`}>{children}</body>
    </html>
  )
}
