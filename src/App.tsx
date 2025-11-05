import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './components/Home'
import ProxyChecker from './components/ProxyChecker'
import FraudDetectionPage from './components/FraudDetectionPage'
import FloatingItems from './components/FloatingItems'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navigation />
        <FloatingItems />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/proxy" element={<ProxyChecker />} />
          <Route path="/fraud" element={<FraudDetectionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App