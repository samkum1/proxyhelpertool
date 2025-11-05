import './globals.css'
import Nav from '../components/Nav'
import FloatingItems from '../components/FloatingItems'
export const metadata = { title: 'Proxy Helper Tool', description: 'Proxy checking and fraud detection' }

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


