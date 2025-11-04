import React, { useState } from 'react'
import { Copy, Globe, MapPin, Shield, Wifi, CheckCircle, AlertCircle, Loader2, Calendar } from 'lucide-react'
import FraudDetection from './FraudDetection'

interface ProxyConfig {
  host: string
  port: string
  username: string
  password: string
}

interface IPInfo {
  ip: string
  hostname?: string
  city: string
  region: string
  country: string
  loc: string
  org: string
  postal: string
  timezone: string
  readme?: string
}

export default function ProxyChecker() {
  const [config, setConfig] = useState<ProxyConfig>({
    host: '',
    port: '',
    username: '',
    password: ''
  })
  
  const [bulkInput, setBulkInput] = useState('')
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [ipResultsCopied, setIpResultsCopied] = useState(false)

  const generateCurlCommand = () => {
    return `curl -x ${config.host}:${config.port} -U ${config.username}:${config.password} ipinfo.io`
  }

  const parseBulkInput = (input: string) => {
    const parts = input.split(':')
    if (parts.length === 4) {
      const [host, port, username, password] = parts
      setConfig({
        host: host.trim(),
        port: port.trim(),
        username: username.trim(),
        password: password.trim()
      })
      setError(null)
    } else {
      setError('Invalid format. Please use: host:port:username:password')
    }
  }

  const handleBulkInputChange = (value: string) => {
    setBulkInput(value)
    if (value.includes(':') && value.split(':').length === 4) {
      parseBulkInput(value)
    }
  }

  const clearAll = () => {
    setConfig({
      host: '',
      port: '',
      username: '',
      password: ''
    })
    setBulkInput('')
    setIpInfo(null)
    setError(null)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateCurlCommand())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const copyIpResults = async () => {
    if (!ipInfo) return
    
    try {
      const resultsText = `IP Information:
IP Address: ${ipInfo.ip}
${ipInfo.hostname ? `Hostname: ${ipInfo.hostname}` : ''}
Location: ${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country}
Coordinates: ${ipInfo.loc}
Organization: ${ipInfo.org}
Postal Code: ${ipInfo.postal}
Timezone: ${ipInfo.timezone}
${ipInfo.readme ? `Readme: ${ipInfo.readme}` : ''}`
      
      await navigator.clipboard.writeText(resultsText)
      setIpResultsCopied(true)
      setTimeout(() => setIpResultsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy IP results: ', err)
    }
  }

  const checkIP = async () => {
    if (!config.host || !config.port || !config.username || !config.password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError(null)
    setIpInfo(null)

    try {
      const response = await fetch('/api/check-ip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })

      if (!response.ok) {
        throw new Error('Failed to check IP')
      }

      const data = await response.json()
      setIpInfo(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
            Proxy IP Checker
          </h1>
          <p className="text-xl text-white/80 animate-fade-in">
            Check your IP information through a proxy server
          </p>
        </div>

        <div className="glass-effect rounded-2xl p-8 shadow-2xl animate-slide-up">
          {/* Bulk Input Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <Copy className="w-6 h-6" />
              Quick Setup
            </h2>
            <div className="bg-black/20 rounded-lg p-4">
              <label className="block text-sm font-medium text-white/90 mb-2">
                Paste proxy info (host:port:username:password)
              </label>
              <input
                type="text"
                value={bulkInput}
                onChange={(e) => handleBulkInputChange(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#0086FF] focus:border-transparent transition-all"
                placeholder="65.195.110.27:50100:CYNrVp0D:YDXTI2Roaq"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-white/60">
                  Format: host:port:username:password
                </p>
                {bulkInput && bulkInput.split(':').length === 4 && (
                  <div className="flex items-center gap-1 text-green-400 text-xs">
                    <CheckCircle className="w-3 h-3" />
                    Parsed successfully
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Proxy Configuration
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Host
                  </label>
                  <input
                    type="text"
                    value={config.host}
                    onChange={(e) => setConfig({...config, host: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#0086FF] focus:border-transparent transition-all"
                    placeholder="65.195.110.27"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Port
                  </label>
                  <input
                    type="text"
                    value={config.port}
                    onChange={(e) => setConfig({...config, port: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#0086FF] focus:border-transparent transition-all"
                    placeholder="50100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={config.username}
                    onChange={(e) => setConfig({...config, username: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#0086FF] focus:border-transparent transition-all"
                    placeholder="CYNrVp0D"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={config.password}
                    onChange={(e) => setConfig({...config, password: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#0086FF] focus:border-transparent transition-all"
                    placeholder="YDXTI2Roaq"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={checkIP}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-[#0086FF] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Checking IP...
                    </>
                  ) : (
                    <>
                      <Wifi className="w-5 h-5" />
                      Check IP
                    </>
                  )}
                </button>
                
                <button
                  onClick={clearAll}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Results and Curl Command */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Globe className="w-6 h-6" />
                Results & Command
              </h2>

              {/* Curl Command */}
              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white/90">Generated cURL Command:</span>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 text-[#0086FF] hover:text-blue-400 transition-colors text-sm"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <code className="text-green-400 text-sm break-all">
                  {generateCurlCommand()}
                </code>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-300">{error}</span>
                </div>
              )}

              {/* IP Info Results */}
              {ipInfo && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6 animate-slide-up">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <h3 className="text-lg font-semibold text-white">IP Information Retrieved</h3>
                    </div>
                    <button
                      onClick={copyIpResults}
                      className="flex items-center gap-2 bg-[#0086FF] hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm"
                    >
                      {ipResultsCopied ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Results
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* IP Address - Most prominent */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-5 h-5 text-[#0086FF]" />
                        <span className="text-white font-semibold">IP Address</span>
                      </div>
                      <div className="text-white font-mono text-xl">{ipInfo.ip}</div>
                    </div>

                    {/* Hostname if available */}
                    {ipInfo.hostname && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-4 h-4 text-cyan-400" />
                          <span className="text-white/90 font-medium">Hostname</span>
                        </div>
                        <div className="text-white font-mono text-sm">{ipInfo.hostname}</div>
                      </div>
                    )}

                    {/* Location */}
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span className="text-white/90 font-medium">Location</span>
                      </div>
                      <div className="text-white">{ipInfo.city}, {ipInfo.region}, {ipInfo.country}</div>
                      {ipInfo.postal && (
                        <div className="text-white/70 text-sm mt-1">Postal Code: {ipInfo.postal}</div>
                      )}
                    </div>

                    {/* Organization */}
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-[#0086FF]" />
                        <span className="text-white/90 font-medium">Organization</span>
                      </div>
                      <div className="text-white text-sm">{ipInfo.org}</div>
                    </div>

                    {/* Coordinates */}
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-amber-400" />
                        <span className="text-white/90 font-medium">Coordinates</span>
                      </div>
                      <div className="text-white font-mono text-sm">{ipInfo.loc}</div>
                    </div>

                    {/* Timezone */}
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-yellow-400" />
                        <span className="text-white/90 font-medium">Timezone</span>
                      </div>
                      <div className="text-white text-sm">{ipInfo.timezone}</div>
                    </div>

                    {/* Readme link if available */}
                    {ipInfo.readme && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-4 h-4 text-[#0086FF]" />
                          <span className="text-white/90 font-medium">Additional Info</span>
                        </div>
                        <a 
                          href={ipInfo.readme} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#0086FF] hover:text-blue-400 text-sm underline"
                        >
                          {ipInfo.readme}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fraud Detection Section */}
              {ipInfo && (
                <div className="mt-8">
                  <FraudDetection 
                    ipAddress={ipInfo.ip}
                    allowEdit={false}
                    onAnalysisComplete={(analysis) => {
                      console.log('Fraud analysis completed:', analysis)
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

