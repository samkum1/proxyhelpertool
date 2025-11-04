import React from 'react'
import FraudDetection from './FraudDetection'

export default function FraudDetectionPage() {
  return (
    <div className="min-h-screen gradient-bg p-4">
      <div className="max-w-4xl mx-auto">
        <FraudDetection 
          ipAddress=""
          allowEdit={true}
          onAnalysisComplete={(analysis) => {
            console.log('Fraud analysis completed:', analysis)
          }}
        />
      </div>
    </div>
  )
}

