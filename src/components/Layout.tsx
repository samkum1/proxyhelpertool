import { Link } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-secondary">
      <nav className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold hover:opacity-80 transition-opacity">
              Proxy Helper Tool
            </Link>
            <div className="flex gap-4">
              <Link to="/" className="hover:opacity-80 transition-opacity">
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout

