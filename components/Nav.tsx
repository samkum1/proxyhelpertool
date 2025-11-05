"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Globe, Home, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const isActive = (path: string) => pathname === path

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-gray-200/50 border-b border-gray-200/60' 
        : 'bg-white/95 backdrop-blur-md border-b border-gray-200/40'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link 
            href="/" 
            className="flex items-center gap-2 group transition-transform duration-200 hover:scale-105"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <img 
                src="/lightning-proxies-logo.svg" 
                alt="Lightning Proxies" 
                className="h-6 sm:h-8 w-auto relative z-10"
              />
            </div>
          </Link>
          
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
            <Link 
              href="/" 
              className={`group relative flex items-center gap-2 px-3 sm:px-5 py-2 rounded-xl overflow-hidden transition-all duration-500 ease-in-out ${
                isActive('/') 
                  ? 'text-white shadow-lg shadow-blue-500/30 scale-105' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
              }`}
            >
              {/* Gradient background with smooth transition */}
              <span 
                className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transition-opacity duration-500 ease-in-out ${
                  isActive('/') ? 'opacity-100' : 'opacity-0'
                }`}
              />
              {/* Content with proper z-index */}
              <div className="relative z-10 flex items-center gap-2">
                <Home className={`w-4 h-4 transition-transform duration-500 ease-in-out ${isActive('/') ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className={`hidden sm:inline font-medium transition-colors duration-500 ease-in-out`}>Home</span>
              </div>
            </Link>
            
            <Link 
              href="/proxy" 
              className={`group relative flex items-center gap-2 px-3 sm:px-5 py-2 rounded-xl overflow-hidden transition-all duration-500 ease-in-out ${
                isActive('/proxy') 
                  ? 'text-white shadow-lg shadow-blue-500/30 scale-105' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
              }`}
            >
              {/* Gradient background with smooth transition */}
              <span 
                className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transition-opacity duration-500 ease-in-out ${
                  isActive('/proxy') ? 'opacity-100' : 'opacity-0'
                }`}
              />
              {/* Content with proper z-index */}
              <div className="relative z-10 flex items-center gap-2">
                <Globe className={`w-4 h-4 transition-transform duration-500 ease-in-out ${isActive('/proxy') ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className={`hidden sm:inline font-medium transition-colors duration-500 ease-in-out`}>Proxy Checker</span>
              </div>
            </Link>
            
            <Link 
              href="/fraud" 
              className={`group relative flex items-center gap-2 px-3 sm:px-5 py-2 rounded-xl overflow-hidden transition-all duration-500 ease-in-out ${
                isActive('/fraud') 
                  ? 'text-white shadow-lg shadow-blue-500/30 scale-105' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
              }`}
            >
              {/* Gradient background with smooth transition */}
              <span 
                className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transition-opacity duration-500 ease-in-out ${
                  isActive('/fraud') ? 'opacity-100' : 'opacity-0'
                }`}
              />
              {/* Content with proper z-index */}
              <div className="relative z-10 flex items-center gap-2">
                <Shield className={`w-4 h-4 transition-transform duration-500 ease-in-out ${isActive('/fraud') ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className={`hidden sm:inline font-medium transition-colors duration-500 ease-in-out`}>Fraud Detection</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Gradient accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20"></div>
    </nav>
  )
}


