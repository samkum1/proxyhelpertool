import { useState, useEffect } from 'react'

interface ProxyInfo {
  host: string
  port: string
  username: string
  password: string
}

interface IpInfoResponse {
  ip: string
  city?: string
  region?: string
  country?: string
  loc?: string
  org?: string
  postal?: string
  timezone?: string
}

const ProxyTool = () => {
  const [proxyInput, setProxyInput] = useState('')
  const [proxyInfo, setProxyInfo] = useState<ProxyInfo>({
    host: '',
    port: '',
    username: '',
    password: '',
  })
  const [curlCommand, setCurlCommand] = useState('')
  const [loading, setLoading] = useState(false)
  const [proxyResult, setProxyResult] = useState<IpInfoResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    generateCurlCommand()
  }, [proxyInfo])

  const parseProxyInput = (input: string) => {
    const parts = input.split(':')
    if (parts.length === 4) {
      setProxyInfo({
        host: parts[0],
        port: parts[1],
        username: parts[2],
        password: parts[3],
      })
    }
  }

  const handleProxyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setProxyInput(value)
    parseProxyInput(value)
  }

  const handleFieldChange = (field: keyof ProxyInfo, value: string) => {
    setProxyInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const generateCurlCommand = () => {
    const { host, port, username, password } = proxyInfo
    if (host && port && username && password) {
      const command = `curl -x ${host}:${port} -U ${username}:${password} ipinfo.io`
      setCurlCommand(command)
    } else {
      setCurlCommand('')
    }
  }

  const checkProxy = async () => {
    const { host, port, username, password } = proxyInfo
    
    if (!host || !port || !username || !password) {
      setError('Please fill in all proxy fields')
      return
    }

    setLoading(true)
    setError(null)
    setProxyResult(null)

    try {
      // Use environment variable if set, otherwise use relative URL (works on Vercel)
      // In development, use localhost, in production use relative URL
      let apiUrl = import.meta.env.VITE_API_URL
      
      if (!apiUrl) {
        // Check if we're in development mode
        if (import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          apiUrl = 'http://localhost:3001'
        } else {
          // Production - use relative URL
          apiUrl = ''
        }
      }
      
      const response = await fetch(`${apiUrl}/api/check-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          host,
          port,
          username,
          password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }))
        throw new Error(errorData.error || errorData.details || `Failed to check proxy: ${response.statusText}`)
      }

      const data: IpInfoResponse = await response.json()
      setProxyResult(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to check proxy. Please verify your proxy credentials and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatProxyResult = (result: IpInfoResponse): string => {
    return JSON.stringify(result, null, 2)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Enter Proxy Details
        </h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste Proxy (format: host:port:username:password)
          </label>
          <input
            type="text"
            value={proxyInput}
            onChange={handleProxyInputChange}
            placeholder="res-ww.lightningproxies.net:9999:evnxmcecwccgpnp188201-zone-lightning:bewcsnpvbr"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Host
            </label>
            <input
              type="text"
              value={proxyInfo.host}
              onChange={(e) => handleFieldChange('host', e.target.value)}
              placeholder="host"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Port
            </label>
            <input
              type="text"
              value={proxyInfo.port}
              onChange={(e) => handleFieldChange('port', e.target.value)}
              placeholder="port"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={proxyInfo.username}
              onChange={(e) => handleFieldChange('username', e.target.value)}
              placeholder="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={proxyInfo.password}
              onChange={(e) => handleFieldChange('password', e.target.value)}
              placeholder="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {curlCommand && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold text-gray-800">
              Generated cURL Command
            </h2>
            <button
              onClick={() => copyToClipboard(curlCommand, 'curl')}
              className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              {copied === 'curl' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="bg-gray-100 p-4 rounded-md font-mono text-sm overflow-x-auto">
            <code>{curlCommand}</code>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <button
          onClick={checkProxy}
          disabled={loading || !curlCommand}
          className="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-md hover:opacity-90 transition-opacity disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Checking Proxy...' : 'Check Proxy'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {proxyResult && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Proxy Information
            </h2>
            <button
              onClick={() => copyToClipboard(formatProxyResult(proxyResult), 'result')}
              className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              {copied === 'result' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-semibold text-gray-700">IP Address:</span>
                <p className="text-gray-900">{proxyResult.ip}</p>
              </div>
              {proxyResult.city && (
                <div>
                  <span className="font-semibold text-gray-700">City:</span>
                  <p className="text-gray-900">{proxyResult.city}</p>
                </div>
              )}
              {proxyResult.region && (
                <div>
                  <span className="font-semibold text-gray-700">Region:</span>
                  <p className="text-gray-900">{proxyResult.region}</p>
                </div>
              )}
              {proxyResult.country && (
                <div>
                  <span className="font-semibold text-gray-700">Country:</span>
                  <p className="text-gray-900">{proxyResult.country}</p>
                </div>
              )}
              {proxyResult.loc && (
                <div>
                  <span className="font-semibold text-gray-700">Location:</span>
                  <p className="text-gray-900">{proxyResult.loc}</p>
                </div>
              )}
              {proxyResult.org && (
                <div>
                  <span className="font-semibold text-gray-700">ISP:</span>
                  <p className="text-gray-900">{proxyResult.org}</p>
                </div>
              )}
              {proxyResult.postal && (
                <div>
                  <span className="font-semibold text-gray-700">Postal Code:</span>
                  <p className="text-gray-900">{proxyResult.postal}</p>
                </div>
              )}
              {proxyResult.timezone && (
                <div>
                  <span className="font-semibold text-gray-700">Timezone:</span>
                  <p className="text-gray-900">{proxyResult.timezone}</p>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="font-semibold text-gray-700">Full JSON:</span>
              <pre className="mt-2 bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                {formatProxyResult(proxyResult)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProxyTool

