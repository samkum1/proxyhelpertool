import express from 'express'
import cors from 'cors'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.options('/api/check-proxy', (req, res) => {
  res.status(200).end()
})

app.post('/api/check-proxy', async (req, res) => {
  try {
    const { host, port, username, password } = req.body

    if (!host || !port || !username || !password) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Construct the curl command
    const curlCommand = `curl -x ${host}:${port} -U ${username}:${password} ipinfo.io`
    
    console.log('Executing curl command:', curlCommand)

    // Execute the curl command
    const { stdout, stderr } = await execAsync(curlCommand, {
      timeout: 30000, // 30 second timeout
    })

    if (stderr) {
      console.error('Curl stderr:', stderr)
    }

    // Parse the JSON response from ipinfo.io
    let ipInfo
    try {
      ipInfo = JSON.parse(stdout)
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError)
      console.error('Raw response:', stdout)
      return res.status(500).json({ 
        error: 'Failed to parse response from ipinfo.io',
        details: stdout
      })
    }

    // Return the IP information
    res.status(200).json(ipInfo)

  } catch (error) {
    console.error('Error executing curl:', error)
    
    // Handle different types of errors
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ 
        error: 'Connection refused. Please check your proxy settings.' 
      })
    }
    
    if (error.code === 'ETIMEDOUT') {
      return res.status(500).json({ 
        error: 'Connection timeout. The proxy server may be slow or unreachable.' 
      })
    }
    
    if (error.signal === 'SIGTERM') {
      return res.status(500).json({ 
        error: 'Request timeout. Please try again.' 
      })
    }

    return res.status(500).json({ 
      error: 'Failed to check IP information',
      details: error.message 
    })
  }
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

