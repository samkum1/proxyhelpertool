import Link from 'next/link'
import { Globe, Shield, Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <img src="/lightning-proxies-logo.svg" alt="Lightning Proxies" className="h-8 w-auto mb-4" />
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Faster, Stronger, Reliable. Professional proxy tools and solutions for your business needs.
            </p>
            <p className="text-gray-500 text-xs">
              Made by <a href="https://lightningproxies.net" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">Lightning Proxies</a>
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/proxy" className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Proxy Checker
                </Link>
              </li>
              <li>
                <Link href="/fraud" className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Fraud Detection
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://lightningproxies.net" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 text-sm">
                  Main Website
                </a>
              </li>
              <li>
                <a href="https://lightningproxies.net" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="https://lightningproxies.net" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 text-sm">
                  Proxy Checker
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs text-center sm:text-left">
              © {new Date().getFullYear()} Lightning Proxies. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <Zap className="w-4 h-4" />
              <span>Faster, Stronger, Reliable</span>
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-4 text-center">
            Disclaimer: All services comply with local laws and regulations. Users are responsible for adhering to applicable rules.
          </p>
        </div>
      </div>
    </footer>
  )
}



