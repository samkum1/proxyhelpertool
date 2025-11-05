import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { host, port, username, password, ipVersion } = body
    if (!host || !port || !username || !password) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    const targetHost = ipVersion === 'ipv6' ? 'v6.ipinfo.io' : 'ipinfo.io'
    const curlCommand = `curl -x ${host}:${port} -U ${username}:${password} ${targetHost}`
    const { stdout, stderr } = await execAsync(curlCommand, { timeout: 30000 })
    if (stderr) console.error('Curl stderr:', stderr)
    try { const ipInfo = JSON.parse(stdout); return NextResponse.json(ipInfo, { status: 200 }) }
    catch (parseError) { console.error('Failed to parse JSON response:', parseError); console.error('Raw response:', stdout); return NextResponse.json({ error: 'Failed to parse response from ipinfo.io', details: stdout }, { status: 500 }) }
  } catch (error: any) {
    console.error('Error executing curl:', error)
    if (error.code === 'ECONNREFUSED') return NextResponse.json({ error: 'Connection refused. Please check your proxy settings.' }, { status: 500 })
    if (error.code === 'ETIMEDOUT') return NextResponse.json({ error: 'Connection timeout. The proxy server may be slow or unreachable.' }, { status: 500 })
    if (error.signal === 'SIGTERM') return NextResponse.json({ error: 'Request timeout. Please try again.' }, { status: 500 })
    return NextResponse.json({ error: 'Failed to check IP information', details: error?.message }, { status: 500 })
  }
}

export async function OPTIONS() { return NextResponse.json({}, { status: 200 }) }


