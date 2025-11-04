import { SpurContextResponse, SpurFraudAnalysis, SpurConfig } from '../types/spur'

const DEFAULT_CONFIG: SpurConfig = {
  api_key: '',
  base_url: 'https://api.spur.us/v1',
  timeout: 10000
}

class SpurService {
  private config: SpurConfig

  constructor(config?: Partial<SpurConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  updateConfig(config: Partial<SpurConfig>) {
    this.config = { ...this.config, ...config }
  }

  async checkIpContext(ip: string): Promise<SpurContextResponse> {
    if (!this.config.api_key) {
      throw new Error('Spur.us API key is required. Please configure it in settings.')
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(`${this.config.base_url}/context/${ip}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.api_key}`,
          'Content-Type': 'application/json',
          'User-Agent': 'ProxyConnector/1.0'
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your Spur.us API key.')
        } else if (response.status === 429) {
          throw new Error('API rate limit exceeded. Please try again later.')
        } else if (response.status === 404) {
          throw new Error('IP address not found in Spur.us database.')
        } else {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`)
        }
      }

      const data = await response.json()
      return this.normalizeResponse(data)
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout. Please try again.')
        }
        throw error
      }
      throw new Error('Unknown error occurred while checking IP context.')
    }
  }

  private normalizeResponse(data: any): SpurContextResponse {
    return {
      ip: data.ip || '',
      risk_score: data.risk_score || 0,
      risk_level: data.risk_level || 'low',
      is_vpn: data.is_vpn || false,
      is_proxy: data.is_proxy || false,
      is_tor: data.is_tor || false,
      is_bot: data.is_bot || false,
      is_datacenter: data.is_datacenter || false,
      is_residential: data.is_residential || false,
      is_mobile: data.is_mobile || false,
      is_anonymous: data.is_anonymous || false,
      country: data.country || '',
      region: data.region || '',
      city: data.city || '',
      timezone: data.timezone || '',
      asn: data.asn || '',
      organization: data.organization || '',
      connection_type: data.connection_type || '',
      threat_types: data.threat_types || [],
      confidence: data.confidence || 0,
      last_seen: data.last_seen || '',
      first_seen: data.first_seen || '',
      reputation: {
        score: data.reputation?.score || 0,
        factors: data.reputation?.factors || []
      },
      geolocation: {
        latitude: data.geolocation?.latitude || 0,
        longitude: data.geolocation?.longitude || 0,
        accuracy: data.geolocation?.accuracy || 0
      },
      network_info: {
        isp: data.network_info?.isp || '',
        asn_name: data.network_info?.asn_name || '',
        asn_country: data.network_info?.asn_country || ''
      }
    }
  }

  analyzeFraudRisk(context: SpurContextResponse): SpurFraudAnalysis {
    const fraudIndicators: string[] = []
    const recommendations: string[] = []

    // Analyze risk factors
    if (context.is_vpn) {
      fraudIndicators.push('VPN detected')
      recommendations.push('Consider additional verification for VPN users')
    }

    if (context.is_proxy) {
      fraudIndicators.push('Proxy detected')
      recommendations.push('High risk - proxy usage detected')
    }

    if (context.is_tor) {
      fraudIndicators.push('Tor network detected')
      recommendations.push('Critical risk - Tor network usage')
    }

    if (context.is_bot) {
      fraudIndicators.push('Bot activity detected')
      recommendations.push('Implement bot protection measures')
    }

    if (context.is_datacenter) {
      fraudIndicators.push('Datacenter IP detected')
      recommendations.push('Verify residential address for datacenter IPs')
    }

    if (context.is_anonymous) {
      fraudIndicators.push('Anonymous connection detected')
      recommendations.push('Require additional identity verification')
    }

    if (context.risk_score > 80) {
      fraudIndicators.push('High risk score')
      recommendations.push('Manual review recommended')
    }

    if (context.threat_types.length > 0) {
      fraudIndicators.push(`Threat types: ${context.threat_types.join(', ')}`)
      recommendations.push('Block or flag for manual review')
    }

    // Determine if fraudulent
    const isFraudulent = context.risk_level === 'critical' || 
                        context.risk_level === 'high' ||
                        context.is_tor ||
                        context.threat_types.length > 0 ||
                        context.risk_score > 75

    return {
      ip: context.ip,
      risk_score: context.risk_score,
      risk_level: context.risk_level,
      is_fraudulent: isFraudulent,
      fraud_indicators: fraudIndicators,
      recommendations: recommendations,
      confidence: context.confidence,
      analysis_timestamp: new Date().toISOString()
    }
  }

  async checkIpFraud(ip: string): Promise<SpurFraudAnalysis> {
    const context = await this.checkIpContext(ip)
    return this.analyzeFraudRisk(context)
  }

  // Utility method to get risk level color
  getRiskLevelColor(riskLevel: string): string {
    switch (riskLevel) {
      case 'low':
        return 'text-green-400'
      case 'medium':
        return 'text-yellow-400'
      case 'high':
        return 'text-orange-400'
      case 'critical':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  // Utility method to get risk level background color
  getRiskLevelBgColor(riskLevel: string): string {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-500/20 border-green-500/50'
      case 'medium':
        return 'bg-yellow-500/20 border-yellow-500/50'
      case 'high':
        return 'bg-orange-500/20 border-orange-500/50'
      case 'critical':
        return 'bg-red-500/20 border-red-500/50'
      default:
        return 'bg-gray-500/20 border-gray-500/50'
    }
  }
}

export const spurService = new SpurService()
