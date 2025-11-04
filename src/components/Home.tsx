import React from 'react'
import { Globe, BookOpen, ArrowRight, Shield, Search, Calendar, Heart } from 'lucide-react'

interface HomeProps {
  onNavigate: (page: 'proxy' | 'diary' | 'fraud') => void
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Welcome to Your
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Digital Workspace
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 animate-fade-in max-w-3xl mx-auto">
            A powerful combination of proxy testing and personal diary management
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Proxy Checker Card */}
          <div 
            className="glass-effect rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer group"
            onClick={() => onNavigate('proxy')}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Globe className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Proxy IP Checker</h2>
            </div>
            
            <p className="text-white/70 mb-6 leading-relaxed">
              Test your proxy connections and verify your IP information through secure proxy servers. 
              Perfect for developers, security researchers, and privacy-conscious users.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-white/80">
                <Shield className="w-5 h-5 text-green-400" />
                <span>Secure proxy testing</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Globe className="w-5 h-5 text-blue-400" />
                <span>Real-time IP verification</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <ArrowRight className="w-5 h-5 text-purple-400" />
                <span>Easy cURL command generation</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors">
              <span>Try Proxy Checker</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Fraud Detection Card */}
          <div 
            className="glass-effect rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer group"
            onClick={() => onNavigate('fraud')}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <Shield className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Fraud Detection</h2>
            </div>
            
            <p className="text-white/70 mb-6 leading-relaxed">
              Advanced fraud detection using free APIs to identify VPNs, proxies, 
              bots, and other suspicious activities. No API key required - completely free to use.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-white/80">
                <Shield className="w-5 h-5 text-red-400" />
                <span>VPN & Proxy detection</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Search className="w-5 h-5 text-orange-400" />
                <span>Bot and Tor network detection</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span>Free & no API key required</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-red-400 group-hover:text-red-300 transition-colors">
              <span>Start Fraud Detection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Diary Card */}
          <div 
            className="glass-effect rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer group"
            onClick={() => onNavigate('diary')}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <BookOpen className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Personal Diary</h2>
            </div>
            
            <p className="text-white/70 mb-6 leading-relaxed">
              Capture your thoughts, memories, and experiences in a beautiful, 
              feature-rich diary. Organize, search, and cherish your personal moments.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-white/80">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span>Rich text entries with categories</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Search className="w-5 h-5 text-blue-400" />
                <span>Advanced search and filtering</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Calendar className="w-5 h-5 text-green-400" />
                <span>Date-based organization</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Heart className="w-5 h-5 text-red-400" />
                <span>Favorites and mood tracking</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors">
              <span>Start Your Diary</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="glass-effect rounded-2xl p-8 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Why Choose Our Platform?</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Privacy First</h4>
              <p className="text-white/70 text-sm">
                All your data is stored locally in your browser. No cloud storage, no data collection.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Powerful Search</h4>
              <p className="text-white/70 text-sm">
                Find anything instantly with our advanced search and filtering capabilities.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Personal Touch</h4>
              <p className="text-white/70 text-sm">
                Track your mood, categorize entries, and create a truly personal digital space.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
