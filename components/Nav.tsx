"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Globe, Home, Shield } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <img src="/lightning-proxies-logo.svg" alt="Lightning Proxies" className="h-6 sm:h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/" className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-all duration-200 ${isActive('/') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}><Home className="w-4 h-4" /><span className="hidden sm:inline">Home</span></Link>
            <Link href="/proxy" className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-all duration-200 ${isActive('/proxy') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}><Globe className="w-4 h-4" /><span className="hidden sm:inline">Proxy Checker</span></Link>
            <Link href="/fraud" className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-all duration-200 ${isActive('/fraud') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}><Shield className="w-4 h-4" /><span className="hidden sm:inline">Fraud Detection</span></Link>
          </div>
        </div>
      </div>
    </nav>
  )
}


