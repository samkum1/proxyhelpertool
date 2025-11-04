import React from 'react'
import { Globe, BookOpen, Home, Shield, Sparkles } from 'lucide-react'

interface NavigationProps {
  currentPage: 'home' | 'proxy' | 'diary' | 'fraud' | 'excite'
  onNavigate: (page: 'home' | 'proxy' | 'diary' | 'fraud' | 'excite') => void
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass-effect rounded-full px-6 py-3 shadow-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
              currentPage === 'home'
                ? 'bg-blue-500 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>
          
          <button
            onClick={() => onNavigate('proxy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
              currentPage === 'proxy'
                ? 'bg-blue-500 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Proxy Checker</span>
          </button>
          
          <button
            onClick={() => onNavigate('fraud')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
              currentPage === 'fraud'
                ? 'bg-blue-500 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Fraud Detection</span>
          </button>
          
          <button
            onClick={() => onNavigate('diary')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
              currentPage === 'diary'
                ? 'bg-blue-500 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Diary</span>
          </button>
          
          <button
            onClick={() => onNavigate('excite')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
              currentPage === 'excite'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Excite Me</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
