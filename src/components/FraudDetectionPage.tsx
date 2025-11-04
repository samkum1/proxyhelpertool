import React from 'react'
import FraudDetection from './FraudDetection'
import Footer from './Footer'

export default function FraudDetectionPage() {
  return (
    <div className="min-h-screen bg-white" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)', backgroundSize: '20px 20px' }}>
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

