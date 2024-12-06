import { Header } from '../components/header'
import { Footer } from '../components/footer'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'E-Sign - Digital Signature App',
  description: 'Securely sign and manage your documents online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

