import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Globe, BookOpen, Home, Shield } from 'lucide-react'

export default function Navigation() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass-effect rounded-full px-6 py-3 shadow-2xl">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
              isActive('/')
                ? 'bg-[#0086FF] text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          
          <Link
            to="/proxy"
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
              isActive('/proxy')
                ? 'bg-[#0086FF] text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Proxy Checker</span>
          </Link>
          
          <Link
            to="/fraud"
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
              isActive('/fraud')
                ? 'bg-[#0086FF] text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Fraud Detection</span>
          </Link>
          
          <Link
            to="/diary"
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
              isActive('/diary')
                ? 'bg-[#0086FF] text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Diary</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
