import { NextRequest, NextResponse } from 'next/server'

let cache = new Map<string, { data: any; expiresAt: number }>()
let lastCallAt = 0

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const ip = searchParams.get('ip') || ''
  if (!ip) return NextResponse.json({ error: 'Missing ip' }, { status: 400 })
  const now = Date.now()
  const cached = cache.get(ip)
  if (cached && cached.expiresAt > now) return NextResponse.json(cached.data, { status: 200 })
  if (now - lastCallAt < 1000) return NextResponse.json({ error: 'Rate limited' }, { status: 429 })
  lastCallAt = now
  try {
    const contact = process.env.GETIPINTEL_CONTACT || 'contact@example.com'
    const url = `https://check.getipintel.net/check.php?ip=${encodeURIComponent(ip)}&contact=${encodeURIComponent(contact)}&format=json&flags=m`
    const upstream = await fetch(url, { headers: { 'User-Agent': 'proxyhelpertool/1.0' } })
    if (!upstream.ok) return NextResponse.json({ error: 'Upstream error' }, { status: upstream.status })
    const data = await upstream.json()
    cache.set(ip, { data, expiresAt: now + 15 * 60 * 1000 })
    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    console.error('getipintel route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


