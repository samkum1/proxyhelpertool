import React, { useState } from 'react'
import { Shuffle, Image, Sparkles } from 'lucide-react'

// List of available images in the public folder
const availableImages = [
  'Gemini_Generated_Image_g1v4fbg1v4fbg1v4.png',
  'Gemini_Generated_Image_od2oo1od2oo1od2o.png',
  'Gemini_Generated_Image_od5cbtod5cbtod5c.png',
  'Gemini_Generated_Image_vcbq1bvcbq1bvcbq.png',
  'WhatsApp Image 2025-02-28 at 4.14.34 PM.jpeg',
  'WhatsApp Image 2025-03-03 at 11.30.53 AM.jpeg',
  'WhatsApp Image 2025-03-03 at 11.35.00 AM.jpeg',
  'WhatsApp Image 2025-09-09 at 2.05.39 PM.jpeg',
  'WhatsApp Image 2025-09-09 at 2.09.17 PM.jpeg',
  'WhatsApp Image 2025-09-09 at 2.11.12 PM.jpeg'
]

export default function ExciteMe() {
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const getRandomImage = () => {
    setIsLoading(true)
    
    // Add a small delay for better UX
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * availableImages.length)
      const randomImage = availableImages[randomIndex]
      setCurrentImage(randomImage)
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in flex items-center justify-center gap-3">
            <Sparkles className="w-12 h-12 text-yellow-400" />
            Excite Me
            <Sparkles className="w-12 h-12 text-yellow-400" />
          </h1>
          <p className="text-xl text-white/80 animate-fade-in">
            Click the button to see a random surprise image!
          </p>
        </div>

        <div className="glass-effect rounded-2xl p-8 shadow-2xl animate-slide-up">
          <div className="text-center">
            {/* Show Button */}
            <button
              onClick={getRandomImage}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 mx-auto text-lg shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                <>
                  <Shuffle className="w-6 h-6" />
                  Show Me Something Exciting!
                </>
              )}
            </button>

            {/* Image Display Area */}
            <div className="mt-8">
              {currentImage ? (
                <div className="relative">
                  <div className="bg-white/10 rounded-xl p-4 inline-block">
                    <img
                      src={`/${currentImage}`}
                      alt="Random surprise image"
                      className="max-w-full max-h-96 rounded-lg shadow-2xl transition-all duration-500 transform hover:scale-105"
                      style={{ maxHeight: '500px' }}
                    />
                  </div>
                  <div className="mt-4 text-white/70 text-sm">
                    <Image className="w-4 h-4 inline mr-2" />
                    {currentImage}
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 rounded-xl p-12 border-2 border-dashed border-white/20">
                  <Image className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <p className="text-white/50 text-lg">
                    Click the button above to see a random image!
                  </p>
                </div>
              )}
            </div>

            {/* Fun Stats */}
            <div className="mt-8 text-center">
              <div className="bg-white/5 rounded-lg p-4 inline-block">
                <p className="text-white/70 text-sm">
                  <span className="text-yellow-400 font-semibold">{availableImages.length}</span> amazing images available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
