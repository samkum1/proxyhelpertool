import { SpurFraudAnalysis } from '../types/spur'

interface FreeFraudResponse {
  ip: string
  risk_score: number
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  is_fraudulent: boolean
  fraud_indicators: string[]
  recommendations: string[]
  confidence: number
  analysis_timestamp: string
  source: string
}

interface GetIPIntelResponse { status: string; result: number; query: string; message?: string }

interface IPinfoResponse {
  ip: string
  city?: string
  region?: string
  country?: string
  loc?: string
  org?: string
  postal?: string
  timezone?: string
  hostname?: string
  company?: { name: string; domain: string; type: string }
  privacy?: { vpn: boolean; proxy: boolean; tor: boolean; hosting: boolean }
  abuse?: { address: string; country: string }
}

class FreeFraudService {
  private async checkWithGetIPIntel(ip: string): Promise<GetIPIntelResponse> {
    try {
      const url = `/api/getipintel?ip=${encodeURIComponent(ip)}`
      const response = await fetch(url)
      if (!response.ok) {
        if (response.status === 429) return { status: 'error', result: 0, query: ip, message: 'Rate limited' }
        return { status: 'error', result: 0, query: ip, message: `Backend error ${response.status}` }
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('GetIPIntel API error:', error)
      return { status: 'error', result: 0, query: ip, message: 'Failed to check with GetIPIntel' }
    }
  }

  private async checkWithIPinfo(ip: string): Promise<IPinfoResponse> {
    try {
      const response = await fetch(`https://ipinfo.io/${ip}/json`)
      if (!response.ok) throw new Error(`IPinfo API error: ${response.status}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('IPinfo API error:', error)
      throw new Error('Failed to check with IPinfo')
    }
  }

  private analyzeResults(ip: string, getIPIntelData: GetIPIntelResponse, ipinfoData: IPinfoResponse): FreeFraudResponse {
    const fraudIndicators: string[] = []
    const recommendations: string[] = []
    const getIPIntelScore = getIPIntelData.result || 0
    const isProxyOrVPN = getIPIntelScore > 0.5
    if (isProxyOrVPN) { fraudIndicators.push('Proxy or VPN detected'); recommendations.push('Additional verification recommended for proxy/VPN users') }
    if (ipinfoData.privacy) {
      if (ipinfoData.privacy.vpn) { fraudIndicators.push('VPN detected'); recommendations.push('VPN usage detected - consider additional verification') }
      if (ipinfoData.privacy.proxy) { fraudIndicators.push('Proxy detected'); recommendations.push('Proxy usage detected - high risk') }
      if (ipinfoData.privacy.tor) { fraudIndicators.push('Tor network detected'); recommendations.push('Critical risk - Tor network usage') }
      if (ipinfoData.privacy.hosting) { fraudIndicators.push('Hosting/Datacenter IP detected'); recommendations.push('Verify residential address for hosting IPs') }
    }
    if (ipinfoData.company?.type === 'hosting') { fraudIndicators.push('Hosting provider detected'); recommendations.push('Verify user identity for hosting IPs') }
    let riskScore = 0
    if (getIPIntelScore > 0.8) riskScore += 40
    else if (getIPIntelScore > 0.5) riskScore += 20
    else if (getIPIntelScore > 0.2) riskScore += 10
    if (ipinfoData.privacy?.vpn) riskScore += 25
    if (ipinfoData.privacy?.proxy) riskScore += 30
    if (ipinfoData.privacy?.tor) riskScore += 50
    if (ipinfoData.privacy?.hosting) riskScore += 15
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
    if (riskScore >= 80) riskLevel = 'critical'
    else if (riskScore >= 60) riskLevel = 'high'
    else if (riskScore >= 30) riskLevel = 'medium'
    const isFraudulent = riskLevel === 'critical' || riskLevel === 'high' || fraudIndicators.length > 2 || ipinfoData.privacy?.tor || getIPIntelScore > 0.8
    let confidence = 70
    if (getIPIntelData.status === 'success') confidence += 20
    if (ipinfoData.privacy) confidence += 10
    return { ip, risk_score: Math.min(riskScore, 100), risk_level: riskLevel, is_fraudulent: isFraudulent, fraud_indicators: fraudIndicators, recommendations, confidence: Math.min(confidence, 100), analysis_timestamp: new Date().toISOString(), source: 'Free APIs (GetIPIntel + IPinfo)' }
  }

  async checkIpFraud(ip: string): Promise<FreeFraudResponse> {
    try {
      const [getIPIntelData, ipinfoData] = await Promise.allSettled([
        this.checkWithGetIPIntel(ip),
        this.checkWithIPinfo(ip)
      ])
      const getIPIntelResult = getIPIntelData.status === 'fulfilled' ? getIPIntelData.value : null
      const ipinfoResult = ipinfoData.status === 'fulfilled' ? ipinfoData.value : null
      if (!getIPIntelResult && !ipinfoResult) {
        return { ip, risk_score: 0, risk_level: 'low', is_fraudulent: false, fraud_indicators: ['Unable to analyze - services unavailable'], recommendations: ['Manual review recommended'], confidence: 0, analysis_timestamp: new Date().toISOString(), source: 'No data available' }
      }
      return this.analyzeResults(ip, getIPIntelResult || { status: 'error', result: 0, query: ip }, ipinfoResult || { ip })
    } catch (error) {
      console.error('Free fraud detection error:', error)
      throw new Error('Failed to analyze IP for fraud')
    }
  }

  getRiskLevelColor(riskLevel: string): string {
    switch (riskLevel) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-orange-400'
      case 'critical': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  getRiskLevelBgColor(riskLevel: string): string {
    switch (riskLevel) {
      case 'low': return 'bg-green-500/20 border-green-500/50'
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/50'
      case 'high': return 'bg-orange-500/20 border-orange-500/50'
      case 'critical': return 'bg-red-500/20 border-red-500/50'
      default: return 'bg-gray-500/20 border-gray-500/50'
    }
  }

  async getServiceStatus(): Promise<{ getIPIntel: boolean; ipinfo: boolean }> {
    try {
      const testIP = '8.8.8.8'
      const [getIPIntelStatus, ipinfoStatus] = await Promise.allSettled([
        this.checkWithGetIPIntel(testIP),
        this.checkWithIPinfo(testIP)
      ])
      return { getIPIntel: getIPIntelStatus.status === 'fulfilled', ipinfo: ipinfoStatus.status === 'fulfilled' }
    } catch (error) {
      return { getIPIntel: false, ipinfo: false }
    }
  }
}

export const freeFraudService = new FreeFraudService()


