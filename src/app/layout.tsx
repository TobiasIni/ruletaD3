import type { Metadata } from 'next'
import { Inter, Oswald } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const oswald = Oswald({ 
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap'
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
      <body className={`${inter.className} ${oswald.variable}`}>{children}</body>
    </html>
  )
}
