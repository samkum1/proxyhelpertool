export interface SpurContextResponse {
  ip: string
  risk_score: number
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  is_vpn: boolean
  is_proxy: boolean
  is_tor: boolean
  is_bot: boolean
  is_datacenter: boolean
  is_residential: boolean
  is_mobile: boolean
  is_anonymous: boolean
  country: string
  region: string
  city: string
  timezone: string
  asn: string
  organization: string
  connection_type: string
  threat_types: string[]
  confidence: number
  last_seen: string
  first_seen: string
  reputation: {
    score: number
    factors: string[]
  }
  geolocation: {
    latitude: number
    longitude: number
    accuracy: number
  }
  network_info: {
    isp: string
    asn_name: string
    asn_country: string
  }
}

export interface SpurFraudAnalysis {
  ip: string
  risk_score: number
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  is_fraudulent: boolean
  fraud_indicators: string[]
  recommendations: string[]
  confidence: number
  analysis_timestamp: string
}

export interface SpurConfig {
  api_key: string
  base_url: string
  timeout: number
}
