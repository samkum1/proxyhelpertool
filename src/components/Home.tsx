import React from 'react'
import { Link } from 'react-router-dom'
import { Globe, ArrowRight, Shield, Search, Calendar, Heart, Zap, HelpCircle, Lock } from 'lucide-react'
import Footer from './Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-white bg-gradient-to-b from-[rgba(22,117,255,0.1)] to-transparent">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 pt-24 ">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20 pt-8">
          <div className="mb-6 flex justify-center">
            <img 
              src="/lightning-proxies-logo.svg" 
              alt="Lightning Proxies" 
              className="h-10 sm:h-12 w-auto mb-5"
            />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Proxy Helper Tools
            <span className="block mt-2 text-blue-600">by Lightning Proxies</span>
          </h1>
          <p className="text-lg sm:text-base text-gray-600 max-w-3xl mx-auto">
            Powerful proxy testing and fraud detection tools to help you verify, check, and analyze proxy connections
          </p>
        </div>

        

        {/* Main Services Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {/* Proxy Checker Card */}
          <Link 
            to="/proxy"
            className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group block"
          >
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16  rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <img src="/ipchecker.svg" alt="Proxy Checker" className="w-16 h-16" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Proxy IP Checker</h2>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed text-center text-sm sm:text-base">
              Test your proxy connections and verify your IP information through secure proxy servers. 
              Perfect for developers, security researchers, and privacy-conscious users.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-700">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-sm sm:text-base">Secure proxy testing</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Globe className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-sm sm:text-base">Real-time IP verification</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-sm sm:text-base">Easy cURL command generation</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-blue-600 group-hover:text-blue-700 transition-colors font-medium">
              <span>Try Proxy Checker</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Fraud Detection Card */}
          <Link 
            to="/fraud"
            className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group block"
          >
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
               <img src="/secure.svg" className='w-16 h-16' alt="" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Fraud Detection</h2>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed text-center text-sm sm:text-base">
              Advanced fraud detection using free APIs to identify VPNs, proxies, 
              bots, and other suspicious activities. No API key required - completely free to use.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-700">
                <Shield className="w-5 h-5 text-[#96085D] flex-shrink-0" />
                <span className="text-sm sm:text-base">VPN & Proxy detection</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Search className="w-5 h-5 text-[#96085D] flex-shrink-0" />
                <span className="text-sm sm:text-base">Bot and Tor network detection</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-5 h-5 text-[#96085D] flex-shrink-0" />
                <span className="text-sm sm:text-base">Free & no API key required</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-[#96085D] group-hover:text-orange-700 transition-colors font-medium">
              <span>Start Fraud Detection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>

        {/* Benefits Section */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-[#96085D] uppercase tracking-wider mb-3">
              Benefits
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Super-charge your proxy operations with our proxy network
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {/* Reliable Infrastructure Card */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1.5 border border-gray-300 rounded-full flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700">
                  <Zap className="w-4 h-4" />
                  <span>Guaranteed Uptime</span>
                </div>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Reliable Infrastructure
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-sm">
                Global datacenters across Europe, North America, and Asia guarantee 99% uptime and the fastest response times for any proxy IP.
              </p>
              
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="text-sm text-gray-600 mb-2">Worldwide IPs</div>
                <div className="text-2xl font-bold text-gray-900 mb-2">10,510,214</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>

            {/* Proxy Solutions Card */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1.5 border border-gray-300 rounded-full flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700">
                  <HelpCircle className="w-4 h-4" />
                  <span>Powerful Network</span>
                </div>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Proxy solutions you can rely on
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-sm">
                Choose from our range of proxy products that best suit your use case. Unsure which one to select? No worries — contact sales team.
              </p>
              
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="grid py-3 grid-cols-5 gap-2 flex-1">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Lock className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Search className="w-5 h-5 text-gray-600" />
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
            Why Choose Our Platform?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Privacy First</h4>
              <p className="text-gray-600 text-sm sm:text-base">
                All your data is stored locally in your browser. No cloud storage, no data collection.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Powerful Search</h4>
              <p className="text-gray-600 text-sm sm:text-base">
                Find anything instantly with our advanced search and filtering capabilities.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Fast & Reliable</h4>
              <p className="text-gray-600 text-sm sm:text-base">
                Lightning-fast proxy checking and fraud detection with reliable infrastructure.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
