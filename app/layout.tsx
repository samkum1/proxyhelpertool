import './globals.css'
import Nav from '../components/Nav'
import FloatingItems from '../components/FloatingItems'
export const metadata = {
  title: 'Proxy Helper Tool',
  description: 'Proxy checking and fraud detection',
  icons: {
    icon: 'https://lightningproxies.net/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <FloatingItems />
        {children}
      </body>
    </html>
  )
}


