import React, { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Save, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { spurService } from '../services/spurService'

interface SettingsProps {
  onClose: () => void
}

export default function Settings({ onClose }: SettingsProps) {
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load saved API key from localStorage
    const savedKey = localStorage.getItem('spur-api-key')
    if (savedKey) {
      setApiKey(savedKey)
    }
  }, [])

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('Please enter a valid API key')
      return
    }

    try {
      // Save to localStorage
      localStorage.setItem('spur-api-key', apiKey.trim())
      
      // Update service configuration
      spurService.updateConfig({ api_key: apiKey.trim() })
      
      setSaved(true)
      setError(null)
      
      // Hide success message after 2 seconds
      setTimeout(() => {
        setSaved(false)
        onClose()
      }, 2000)
    } catch (err) {
      setError('Failed to save API key')
    }
  }

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setError('Please enter a valid API key first')
      return
    }

    try {
      // Test with a known IP address
      await spurService.checkIpContext('8.8.8.8')
      setError(null)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection test failed')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-effect rounded-2xl p-6 shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Spur.us API Settings
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                placeholder="Enter your Spur.us API key"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-white/60 mt-1">
              Get your API key from <a href="https://spur.us" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">spur.us</a>
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          {/* Success Display */}
          {saved && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm">Settings saved successfully!</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
            
            <button
              onClick={handleTestConnection}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              Test
            </button>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-300 mb-2">How to get your API key:</h3>
            <ol className="text-xs text-blue-200 space-y-1">
              <li>1. Visit <a href="https://spur.us" target="_blank" rel="noopener noreferrer" className="underline">spur.us</a></li>
              <li>2. Sign up for an account</li>
              <li>3. Choose a plan (starts from $99/month)</li>
              <li>4. Get your API key from the dashboard</li>
              <li>5. Paste it here to enable fraud detection</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
