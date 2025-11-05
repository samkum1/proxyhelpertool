import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { platform } from 'os'

const execAsync = promisify(exec)

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { host, port, username, password } = body
    if (!host || !port || !username || !password) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    
    // Use the new curl command format to test speed
    // On Windows, use NUL instead of /dev/null. Avoid newlines in the -w string (breaks on Windows)
    const outputRedirect = platform() === 'win32' ? 'NUL' : '/dev/null'
    const writeOut = 'TTFB:%{time_starttransfer}s Total:%{time_total}s'
    const curlCommand = `curl -s -S -o ${outputRedirect} -w "${writeOut}" --proxy http://${host}:${port} -U "${username}:${password}" https://httpbin.org/get`
    
    const { stdout, stderr } = await execAsync(curlCommand, { timeout: 30000 })
    if (stderr) console.error('Curl stderr:', stderr)
    
    // Parse output like: "TTFB:0.123s Total:0.456s"
    const ttfbMatch = stdout.match(/TTFB:?\s*([\d.]+)s/i)
    const totalMatch = stdout.match(/Total:?\s*([\d.]+)s/i)
    
    if (!ttfbMatch || !totalMatch) {
      return NextResponse.json({ error: 'Failed to parse speed test results', details: stdout }, { status: 500 })
    }
    
    const ttfbSeconds = parseFloat(ttfbMatch[1])
    const totalSeconds = parseFloat(totalMatch[1])
    const ttfbMs = Math.round(ttfbSeconds * 1000)
    const totalMs = Math.round(totalSeconds * 1000)
    
    return NextResponse.json({ 
      ttfbMs, 
      totalMs, 
      ttfbSeconds: ttfbSeconds.toFixed(3), 
      totalSeconds: totalSeconds.toFixed(3) 
    }, { status: 200 })
  } catch (error: any) {
    console.error('Error executing speed test:', error)
    if (error.code === 'ECONNREFUSED') return NextResponse.json({ error: 'Connection refused. Please check your proxy settings.' }, { status: 500 })
    if (error.code === 'ETIMEDOUT') return NextResponse.json({ error: 'Connection timeout. The proxy server may be slow or unreachable.' }, { status: 500 })
    if (error.signal === 'SIGTERM') return NextResponse.json({ error: 'Request timeout. Please try again.' }, { status: 500 })
    return NextResponse.json({ error: 'Failed to check proxy speed', details: error?.message }, { status: 500 })
  }
}

export async function OPTIONS() { return NextResponse.json({}, { status: 200 }) }

