import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    // Get the user's IP from the request headers
    // Check various headers that might contain the real IP
    const forwarded = req.headers.get('x-forwarded-for')
    const realIp = req.headers.get('x-real-ip')
    const cfConnectingIp = req.headers.get('cf-connecting-ip')
    
    // If we have a forwarded IP, use the first one
    let ip = forwarded?.split(',')[0]?.trim() || 
             realIp || 
             cfConnectingIp
    
    // If we found an IP in headers, return it
    if (ip) {
      return NextResponse.json({ ip }, { status: 200 })
    }
    
    // Fallback: try to get IP from a public service
    try {
      const response = await fetch('https://api.ipify.org?format=json', {
        headers: {
          'User-Agent': 'ProxyHelperTool/1.0',
        },
        next: { revalidate: 60 } // Cache for 60 seconds
      })
      
      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({ ip: data.ip }, { status: 200 })
      }
    } catch (fetchError) {
      console.error('Error fetching from ipify:', fetchError)
    }
    
    return NextResponse.json({ error: 'Could not determine IP address' }, { status: 500 })
  } catch (error: any) {
    console.error('Error getting public IP:', error)
    return NextResponse.json({ error: 'Failed to get IP address', details: error?.message }, { status: 500 })
  }
}

