"use client"
import React, { useState } from 'react'
import { Copy, Globe, MapPin, Shield, Wifi, CheckCircle, AlertCircle, Loader2, Calendar } from 'lucide-react'
import FraudDetection from './FraudDetection'
import Footer from './Footer'

interface ProxyConfig { host: string; port: string; username: string; password: string }
interface IPInfo { ip: string; hostname?: string; city: string; region: string; country: string; loc: string; org: string; postal: string; timezone: string; readme?: string }

export default function ProxyChecker() {
  const [config, setConfig] = useState<ProxyConfig>({ host: '', port: '', username: '', password: '' })
  const [ipVersion, setIpVersion] = useState<'ipv4' | 'ipv6'>('ipv4')
  const [bulkInput, setBulkInput] = useState('')
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [ipResultsCopied, setIpResultsCopied] = useState(false)

  const generateCurlCommand = () => {
    const targetHost = ipVersion === 'ipv6' ? 'v6.ipinfo.io' : 'ipinfo.io'
    return `curl -x ${config.host}:${config.port} -U ${config.username}:${config.password} ${targetHost}`
  }

  const detectIPVersion = (input: string) => {
    if (input.toLowerCase().includes('v6')) setIpVersion('ipv6'); else setIpVersion('ipv4')
  }

  const parseBulkInput = (input: string) => {
    const parts = input.split(':')
    if (parts.length === 4) {
      const [host, port, username, password] = parts
      setConfig({ host: host.trim(), port: port.trim(), username: username.trim(), password: password.trim() })
      detectIPVersion(host)
      setError(null)
    } else {
      setError('Invalid format. Please use: host:port:username:password')
    }
  }

  const handleBulkInputChange = (value: string) => {
    setBulkInput(value)
    if (value.includes(':') && value.split(':').length === 4) parseBulkInput(value)
  }

  const clearAll = () => {
    setConfig({ host: '', port: '', username: '', password: '' })
    setBulkInput('')
    setIpInfo(null)
    setError(null)
    setIpVersion('ipv4')
  }

  const copyToClipboard = async () => {
    try { await navigator.clipboard.writeText(generateCurlCommand()); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch (err) { console.error('Failed to copy: ', err) }
  }

  const copyIpResults = async () => {
    if (!ipInfo) return
    try {
      const resultsText = `IP Information:\nIP Address: ${ipInfo.ip}\n${ipInfo.hostname ? `Hostname: ${ipInfo.hostname}` : ''}\nLocation: ${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country}\nCoordinates: ${ipInfo.loc}\nOrganization: ${ipInfo.org}\nPostal Code: ${ipInfo.postal}\nTimezone: ${ipInfo.timezone}\n${ipInfo.readme ? `Readme: ${ipInfo.readme}` : ''}`
      await navigator.clipboard.writeText(resultsText)
      setIpResultsCopied(true)
      setTimeout(() => setIpResultsCopied(false), 2000)
    } catch (err) { console.error('Failed to copy IP results: ', err) }
  }

  const checkIP = async () => {
    if (!config.host || !config.port || !config.username || !config.password) { setError('Please fill in all fields'); return }
    setLoading(true); setError(null); setIpInfo(null)
    try {
      const response = await fetch('/api/check-ip', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...config, ipVersion }) })
      if (!response.ok) throw new Error('Failed to check IP')
      const data = await response.json(); setIpInfo(data)
    } catch (err) { setError(err instanceof Error ? err.message : 'An error occurred') } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-white bg-gradient-to-b from-[rgba(22,117,255,0.1)] to-transparent">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 pt-24">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Proxy IP Checker</h1>
          <p className="text-lg sm:text-xl text-gray-600">Check your IP information through a proxy server</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg">
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2"><Copy className="w-5 h-5 sm:w-6 sm:h-6" />Quick Setup</h2>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Paste proxy info (host:port:username:password)</label>
              <input type="text" value={bulkInput} onChange={(e) => handleBulkInputChange(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="65.195.110.27:50100:CYNrVp0D:YDXTI2Roaq" />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">Format: host:port:username:password</p>
                {bulkInput && bulkInput.split(':').length === 4 && (<div className="flex items-center gap-1 text-green-600 text-xs"><CheckCircle className="w-3 h-3" />Parsed successfully</div>)}
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2"><Shield className="w-5 h-5 sm:w-6 sm:h-6" />Proxy Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Proxy IP version</label>
                  <div className="flex gap-4 items-center">
                    <label className="inline-flex items-center gap-2 text-sm text-gray-700"><input type="radio" name="ipVersion" value="ipv4" checked={ipVersion === 'ipv4'} onChange={() => setIpVersion('ipv4')} className="text-blue-600 focus:ring-blue-500" />IPv4 (default)</label>
                    <label className="inline-flex items-center gap-2 text-sm text-gray-700"><input type="radio" name="ipVersion" value="ipv6" checked={ipVersion === 'ipv6'} onChange={() => setIpVersion('ipv6')} className="text-blue-600 focus:ring-blue-500" />IPv6</label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Host</label>
                  <input type="text" value={config.host} onChange={(e) => { const newHost = e.target.value; setConfig({ ...config, host: newHost }); detectIPVersion(newHost) }} className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="65.195.110.27" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
                  <input type="text" value={config.port} onChange={(e) => setConfig({ ...config, port: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="50100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input type="text" value={config.username} onChange={(e) => setConfig({ ...config, username: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="CYNrVp0D" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input type="password" value={config.password} onChange={(e) => setConfig({ ...config, password: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="YDXTI2Roaq" />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={checkIP} disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">{loading ? (<><Loader2 className="w-5 h-5 animate-spin" />Checking IP...</>) : (<><Wifi className="w-5 h-5" />Check IP</>)}</button>
                <button onClick={clearAll} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">Clear</button>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2"><Globe className="w-5 h-5 sm:w-6 sm:h-6" />Results & Command</h2>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-gray-700">Generated cURL Command:</span>
                  <button onClick={copyToClipboard} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors text-sm">{copied ? (<><CheckCircle className="w-4 h-4" />Copied!</>) : (<><Copy className="w-4 h-4" />Copy</>)}</button>
                </div>
                <code className="text-green-600 text-sm break-all font-mono">{generateCurlCommand()}</code>
              </div>
              {error && (<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-600" /><span className="text-red-700">{error}</span></div>)}
              {ipInfo && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6"><div className="flex items-center gap-2"><CheckCircle className="w-6 h-6 text-green-600" /><h3 className="text-lg font-semibold text-gray-900">IP Information Retrieved</h3></div>
                    <button onClick={copyIpResults} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm">{ipResultsCopied ? (<><CheckCircle className="w-4 h-4" />Copied!</>) : (<><Copy className="w-4 h-4" />Copy Results</>)}</button>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200"><div className="flex items-center gap-2 mb-2"><Globe className="w-5 h-5 text-blue-600" /><span className="text-gray-900 font-semibold">IP Address</span></div><div className="text-gray-900 font-mono text-xl">{ipInfo.ip}</div></div>
                    {ipInfo.hostname && (<div className="bg-white rounded-lg p-4 border border-gray-200"><div className="flex items-center gap-2 mb-2"><Globe className="w-4 h-4 text-cyan-600" /><span className="text-gray-700 font-medium">Hostname</span></div><div className="text-gray-900 font-mono text-sm">{ipInfo.hostname}</div></div>)}
                    <div className="bg-white rounded-lg p-4 border border-gray-200"><div className="flex items-center gap-2 mb-2"><MapPin className="w-4 h-4 text-blue-600" /><span className="text-gray-700 font-medium">Location</span></div><div className="text-gray-900">{ipInfo.city}, {ipInfo.region}, {ipInfo.country}</div>{ipInfo.postal && (<div className="text-gray-600 text-sm mt-1">Postal Code: {ipInfo.postal}</div>)}</div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200"><div className="flex items-center gap-2 mb-2"><Shield className="w-4 h-4 text-blue-600" /><span className="text-gray-700 font-medium">Organization</span></div><div className="text-gray-900 text-sm">{ipInfo.org}</div></div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200"><div className="flex items-center gap-2 mb-2"><MapPin className="w-4 h-4 text-amber-600" /><span className="text-gray-700 font-medium">Coordinates</span></div><div className="text-gray-900 font-mono text-sm">{ipInfo.loc}</div></div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200"><div className="flex items-center gap-2 mb-2"><Calendar className="w-4 h-4 text-yellow-600" /><span className="text-gray-700 font-medium">Timezone</span></div><div className="text-gray-900 text-sm">{ipInfo.timezone}</div></div>
                    {ipInfo.readme && (<div className="bg-white rounded-lg p-4 border border-gray-200"><div className="flex items-center gap-2 mb-2"><AlertCircle className="w-4 h-4 text-blue-600" /><span className="text-gray-700 font-medium">Additional Info</span></div><a href={ipInfo.readme} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm underline">{ipInfo.readme}</a></div>)}
                  </div>
                </div>
              )}
              {ipInfo && (
                <div className="mt-8">
                  <FraudDetection ipAddress={ipInfo.ip} allowEdit={false} onAnalysisComplete={(analysis) => { console.log('Fraud analysis completed:', analysis) }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}



