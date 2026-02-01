'use client'

// app/(smartbrainup-ai)/start/page.tsx

import { useState, useEffect } from 'react'
import Container from '@/components/layout/Container'
import { 
  questionsMap,
  strati,
  startQuestionId,
  assessmentContent, 
  AdaptiveOption,
  CollectedData 
} from '@/content/smartbrainup-ai/start'

export default function StartPage() {
  const [currentQuestionId, setCurrentQuestionId] = useState(startQuestionId)
  const [history, setHistory] = useState<string[]>([])
  const [collectedData, setCollectedData] = useState<CollectedData>({})
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const question = questionsMap[currentQuestionId]
  const { hero, complete } = assessmentContent

  // Get current strato index for progress
  const currentStratoIndex = strati.indexOf(question?.strato || '')
  
  // Fixed total questions in linear path
  const totalQuestions = 39
  
  const handleOptionClick = (option: AdaptiveOption) => {
    // Save data
    setCollectedData(prev => ({
      ...prev,
      [question.collectAs]: option.value,
    }))

    // Fade out
    setIsTransitioning(true)
    
    // Wait for fade out, then change content
    setTimeout(() => {
      if (option.nextId === null) {
        // End of assessment
        setIsComplete(true)
        console.log('Assessment complete:', { ...collectedData, [question.collectAs]: option.value })
      } else {
        // Add current to history and move to next
        setHistory(prev => [...prev, currentQuestionId])
        setCurrentQuestionId(option.nextId)
      }
      
      // Small delay then fade in
      setTimeout(() => {
        setIsTransitioning(false)
      }, 50)
    }, 300)
  }

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  if (isComplete) {
    return (
      <div 
        className="fixed inset-0 flex flex-col z-40 overflow-y-auto"
        style={{ background: 'linear-gradient(to bottom, #252525 0%, #1a1a1a 100%)' }}
      >
        {/* Hero: Badge + Intro */}
        <div className="pt-20 md:pt-32 pb-6">
          <Container>
            <div className="relative">
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase mb-8 text-white">
                <span className="opacity-100">{hero.badge.primary}</span>
                <span className="opacity-50"> {hero.badge.secondary}</span>
              </p>
              <div className="text-[17px] md:text-[18px] font-normal leading-[1.15] text-white max-w-[560px] space-y-5">
                {hero.intro.blocks.map((block, blockIndex) => (
                  <p key={blockIndex} className="opacity-70">
                    {block.map((line, lineIndex) => (
                      <span 
                        key={lineIndex} 
                        className={`block ${blockIndex === 0 && lineIndex === 0 ? 'font-medium' : ''}`}
                      >
                        {line}
                      </span>
                    ))}
                  </p>
                ))}
              </div>
            </div>
          </Container>
        </div>

        {/* Complete Card */}
        <div className="py-8 md:py-12">
          <Container>
            <div 
              className="rounded-[4px] p-8 py-10 md:p-12 md:py-16"
              style={{ background: 'linear-gradient(to bottom, #353535 0%, #232323 100%)' }}
            >
              {/* Single column - centered */}
              <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                
                {/* Complete message */}
                <h2 className="text-[24px] md:text-[32px] font-normal leading-[1.1] text-white mb-4">
                  {complete.title.map((line, index) => (
                    <span key={index} className="block">{line}</span>
                  ))}
                </h2>
                <p className="text-[17px] md:text-[18px] font-normal leading-[1.15] text-white opacity-70 mb-10">
                  {complete.body}
                </p>
                
                {/* CTA Button */}
                <button 
                  onClick={() => console.log('Go to login', collectedData)}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-[4px] text-white text-[17px] md:text-[18px] font-medium transition-all"
                >
                  {complete.cta}
                </button>
                
              </div>

              {/* Step counter */}
              <p className="mt-10 md:mt-14 text-center font-ui text-[11px] font-medium tracking-widest uppercase text-white/40">
                {complete.section}
              </p>
              
            </div>
          </Container>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="fixed inset-0 flex flex-col z-40 overflow-y-auto"
      style={{ background: 'linear-gradient(to bottom, #252525 0%, #1a1a1a 100%)' }}
    >
      {/* Hero: Badge + Intro */}
      <div className="pt-20 md:pt-32 pb-6">
        <Container>
          <div className="relative">
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase mb-8 text-white">
              <span className="opacity-100">{hero.badge.primary}</span>
              <span className="opacity-50"> {hero.badge.secondary}</span>
            </p>
            <div className="text-[17px] md:text-[18px] font-normal leading-[1.15] text-white max-w-[560px] space-y-5">
              {hero.intro.blocks.map((block, blockIndex) => (
                <p key={blockIndex} className="opacity-70">
                  {block.map((line, lineIndex) => (
                    <span 
                      key={lineIndex} 
                      className={`block ${blockIndex === 0 && lineIndex === 0 ? 'font-medium' : ''}`}
                    >
                      {line}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* Question Card */}
      <div className="py-8 md:py-12">
        <Container>
          <div 
            className="rounded-[4px] p-8 pt-8 pb-10 md:p-12 md:pt-10 md:pb-16 relative"
            style={{ background: 'linear-gradient(to bottom, #353535 0%, #232323 100%)' }}
          >
            {/* Strato label - top */}
            <p className="text-center font-ui text-[11px] font-medium tracking-widest uppercase text-white/[0.45]" style={{ marginBottom: '40px' }}>
              {question.strato}
            </p>

            {/* Content with transition */}
            <div 
              className={`transition-opacity duration-300 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {/* Center content */}
              <div className="flex flex-col items-center text-center">
                
                {/* Question */}
                <h2 className="text-[24px] md:text-[32px] font-normal leading-[1.1] text-white" style={{ marginBottom: '40px' }}>
                  {question.question}
                </h2>
                
                {/* Options - full width, key resets hover on question change */}
                <div className="space-y-3 w-full" key={currentQuestionId}>
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(option)}
                      className="w-full px-8 py-5 bg-white/[0.02] hover:bg-white/10 active:bg-white/10 rounded-[4px] text-white text-[17px] md:text-[18px] font-normal text-center transition-all touch-manipulation"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                
              </div>
            </div>

            {/* Navigation: arrows + page number - below answers */}
            <div className="flex justify-center items-center gap-6 mt-10 md:mt-14">
              {/* Left arrow */}
              <button
                onClick={() => {
                  if (history.length > 0) {
                    setIsTransitioning(true)
                    setTimeout(() => {
                      const prevQuestionId = history[history.length - 1]
                      setCollectedData(prev => {
                        const newData = { ...prev }
                        delete newData[question.collectAs]
                        return newData
                      })
                      setHistory(prev => prev.slice(0, -1))
                      setCurrentQuestionId(prevQuestionId)
                      setTimeout(() => {
                        setIsTransitioning(false)
                      }, 50)
                    }, 300)
                  }
                }}
                className={`w-12 h-12 flex items-center justify-center transition-opacity ${
                  history.length > 0 ? 'opacity-80 hover:opacity-100 cursor-pointer' : 'opacity-20 cursor-not-allowed'
                }`}
                disabled={history.length === 0}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              {/* Page number */}
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-white/40 min-w-[60px] text-center">
                {history.length + 1} / {totalQuestions}
              </p>

              {/* Right arrow - disabled */}
              <button
                className="w-12 h-12 flex items-center justify-center opacity-20 cursor-not-allowed"
                disabled={true}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
            
          </div>
        </Container>
      </div>
      
    </div>
  )
}
