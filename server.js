import express from 'express'
import cors from 'cors'
import { HttpsProxyAgent } from 'https-proxy-agent'
import fetch from 'node-fetch'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.post('/api/check-proxy', async (req, res) => {
  try {
    const { proxy, targetUrl } = req.body

    if (!proxy || !proxy.host || !proxy.port || !proxy.username || !proxy.password) {
      return res.status(400).json({ 
        message: 'Missing proxy configuration. Please provide host, port, username, and password.' 
      })
    }

    if (!targetUrl) {
      return res.status(400).json({ 
        message: 'Missing target URL' 
      })
    }

    const proxyUrl = `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`
    const agent = new HttpsProxyAgent(proxyUrl)

    const response = await fetch(targetUrl, {
      agent,
      timeout: 10000, // 10 second timeout
    })

    if (!response.ok) {
      throw new Error(`Proxy request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error('Proxy check error:', error)
    res.status(500).json({ 
      message: error.message || 'Failed to check proxy. Please verify your proxy credentials and try again.' 
    })
  }
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

