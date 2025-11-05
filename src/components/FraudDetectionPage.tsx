import React from 'react'
import FraudDetection from './FraudDetection'
import Footer from './Footer'

export default function FraudDetectionPage() {
  return (
    <div className="min-h-screen bg-white bg-gradient-to-b from-[rgba(22,117,255,0.1)] to-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 pt-24">
        <FraudDetection 
          ipAddress=""
          allowEdit={true}
          onAnalysisComplete={(analysis) => {
            console.log('Fraud analysis completed:', analysis)
          }}
        />
      </div>
      <Footer />
    </div>
  )
}

