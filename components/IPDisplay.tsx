"use client"
import { useState, useEffect } from 'react'

export default function IPDisplay() {
  const [ip, setIp] = useState<string | null>(null)

  useEffect(() => {
    const fetchIP = async () => {
      try {
        // Fetch directly from a public API service to get the client's actual public IP
        const response = await fetch('https://api.ipify.org?format=json', {
          cache: 'no-store'
        })
        if (response.ok) {
          const data = await response.json()
          setIp(data.ip)
        }
      } catch (err) {
        console.error('Error fetching IP:', err)
        // Try alternative API if first one fails
        try {
          const altResponse = await fetch('https://api64.ipify.org?format=json', {
            cache: 'no-store'
          })
          if (altResponse.ok) {
            const altData = await altResponse.json()
            setIp(altData.ip)
          }
        } catch (altErr) {
          console.error('Error fetching from alternative API:', altErr)
        }
      }
    }

    fetchIP()
  }, [])

  if (!ip) {
    return null
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:inline">
        Your Public IP:
      </span>
      <code className="text-xs sm:text-sm font-mono font-semibold text-gray-900">
        {ip}
      </code>
    </div>
  )
}

