"use client"
import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react'
import { freeFraudService } from '../services/freeFraudService'

export default function ServiceStatus() {
  const [status, setStatus] = useState<{ getIPIntel: boolean; ipinfo: boolean } | null>(null)
  const [loading, setLoading] = useState(false)

  const checkStatus = async () => {
    setLoading(true)
    try {
      const serviceStatus = await freeFraudService.getServiceStatus()
      setStatus(serviceStatus)
    } catch (error) {
      console.error('Failed to check service status:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { checkStatus() }, [])

  return (
    <div className="glass-effect rounded-lg p-4 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-black/60">Free API Status</h3>
        <button onClick={checkStatus} disabled={loading} className="text-black/60 hover:text-white transition-colors p-1">{loading ? (<Loader2 className="w-4 h-4 animate-spin" />) : (<RefreshCw className="w-4 h-4" />)}</button>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm"><span className="text-black/60">GetIPIntel</span>{status ? (<div className="flex items-center gap-1">{status.getIPIntel ? (<><CheckCircle className="w-4 h-4 text-green-400" /><span className="text-green-400 text-xs">Online</span></>) : (<><XCircle className="w-4 h-4 text-red-400" /><span className="text-red-400 text-xs">Offline</span></>)}</div>) : (<Loader2 className="w-4 h-4 animate-spin text-black/60" />)}</div>
        <div className="flex items-center justify-between text-sm"><span className="text-black/60">IPinfo.io</span>{status ? (<div className="flex items-center gap-1">{status.ipinfo ? (<><CheckCircle className="w-4 h-4 text-green-400" /><span className="text-green-400 text-xs">Online</span></>) : (<><XCircle className="w-4 h-4 text-red-400" /><span className="text-red-400 text-xs">Offline</span></>)}</div>) : (<Loader2 className="w-4 h-4 animate-spin text-black/60" />)}</div>
      </div>
      <div className="mt-3 pt-3 border-t border-white/10"><p className="text-xs text-black/60">Using free APIs - no registration required</p></div>
    </div>
  )
}


