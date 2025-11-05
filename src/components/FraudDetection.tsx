import React, { useState } from 'react'
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Copy,
  Settings,
  Loader2,
  AlertCircle,
  Zap,
  Globe,
  Lock,
  Bot,
  Wifi
} from 'lucide-react'
import { SpurFraudAnalysis } from '../types/spur'
import { freeFraudService } from '../services/freeFraudService'
import ServiceStatus from './ServiceStatus'

interface FraudDetectionProps {
  ipAddress: string
  onAnalysisComplete?: (analysis: SpurFraudAnalysis) => void
  allowEdit?: boolean
}

export default function FraudDetection({ ipAddress, onAnalysisComplete, allowEdit = false }: FraudDetectionProps) {
  const [analysis, setAnalysis] = useState<SpurFraudAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [copied, setCopied] = useState(false)
  const [inputIp, setInputIp] = useState(ipAddress)

  const checkFraud = async () => {
    const ipToCheck = allowEdit ? inputIp : ipAddress

    if (!ipToCheck.trim()) {
      setError('Please enter a valid IP address')
      return
    }

    setLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      const fraudAnalysis = await freeFraudService.checkIpFraud(ipToCheck)
      setAnalysis(fraudAnalysis)
      onAnalysisComplete?.(fraudAnalysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze IP for fraud')
    } finally {
      setLoading(false)
    }
  }

  const copyAnalysis = async () => {
    if (!analysis) return

    try {
      const analysisText = `Fraud Analysis Report
IP Address: ${analysis.ip}
Risk Score: ${analysis.risk_score}/100
Risk Level: ${analysis.risk_level.toUpperCase()}
Fraudulent: ${analysis.is_fraudulent ? 'YES' : 'NO'}
Confidence: ${analysis.confidence}%

Fraud Indicators:
${analysis.fraud_indicators.map(indicator => `- ${indicator}`).join('\n')}

Recommendations:
${analysis.recommendations.map(rec => `- ${rec}`).join('\n')}

Analysis Time: ${new Date(analysis.analysis_timestamp).toLocaleString()}`

      await navigator.clipboard.writeText(analysisText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy analysis:', err)
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case 'high':
        return <AlertCircle className="w-5 h-5 text-orange-400" />
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <Shield className="w-5 h-5 text-gray-400" />
    }
  }

  const getFraudStatusIcon = (isFraudulent: boolean) => {
    return isFraudulent ? (
      <XCircle className="w-6 h-6 text-red-400" />
    ) : (
      <CheckCircle className="w-6 h-6 text-green-400" />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center justify-center gap-2 mb-4">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
          Fraud Detection Analysis
        </h2>
        <p className="text-lg text-gray-600">
          Analyze IP address for potential fraud indicators using free APIs
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IP Address to Analyze
            </label>
            <input
              type="text"
              value={allowEdit ? inputIp : ipAddress}
              onChange={allowEdit ? (e) => setInputIp(e.target.value) : undefined}
              readOnly={!allowEdit}
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder={allowEdit ? "Enter IP address to analyze" : ""}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={checkFraud}
              disabled={loading || !(allowEdit ? inputIp : ipAddress).trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Check Fraud
                </>
              )}
            </button>
          </div>
        </div>

        {/* Service Status */}
        <div className="mt-4">
          <ServiceStatus />
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 flex items-center gap-2">
              {getFraudStatusIcon(analysis.is_fraudulent)}
              Analysis Results
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-all duration-200 text-sm"
              >
                {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showDetails ? 'Hide Details' : 'Show Details'}
              </button>
              <button
                onClick={copyAnalysis}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Report
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Risk Score */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                {getRiskIcon(analysis.risk_level)}
                <span className="text-gray-700 font-medium">Risk Score</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{analysis.risk_score}/100</div>
              <div className={`text-sm font-medium ${freeFraudService.getRiskLevelColor(analysis.risk_level)}`}>
                {analysis.risk_level.toUpperCase()}
              </div>
            </div>

            {/* Fraud Status */}
            <div className={`rounded-lg p-4 border ${analysis.is_fraudulent ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {getFraudStatusIcon(analysis.is_fraudulent)}
                <span className="text-gray-700 font-medium">Fraud Status</span>
              </div>
              <div className={`text-2xl font-bold ${analysis.is_fraudulent ? 'text-red-600' : 'text-green-600'}`}>
                {analysis.is_fraudulent ? 'FRAUDULENT' : 'CLEAN'}
              </div>
              <div className="text-sm text-gray-600">
                Confidence: {analysis.confidence}%
              </div>
            </div>

            {/* Analysis Time */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 font-medium">Analysis Time</span>
              </div>
              <div className="text-gray-900 text-sm">
                {new Date(analysis.analysis_timestamp).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          {showDetails && (
            <div className="space-y-4">
              {/* Fraud Indicators */}
              {analysis.fraud_indicators.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Fraud Indicators
                  </h4>
                  <ul className="space-y-2">
                    {analysis.fraud_indicators.map((indicator, index) => (
                      <li key={index} className="flex items-center gap-2 text-red-700">
                        <XCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{indicator}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {analysis.recommendations.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-blue-700 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-center gap-2 text-blue-700">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* No Issues Found */}
              {analysis.fraud_indicators.length === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">No fraud indicators detected</span>
                  </div>
                  <p className="text-green-600 mt-2">
                    This IP address appears to be clean with no significant fraud risk factors.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  )
}
