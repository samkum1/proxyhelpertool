import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './components/Home'
import ProxyChecker from './components/ProxyChecker'
import Diary from './components/Diary'
import FraudDetectionPage from './components/FraudDetectionPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/proxy" element={<ProxyChecker />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/fraud" element={<FraudDetectionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App