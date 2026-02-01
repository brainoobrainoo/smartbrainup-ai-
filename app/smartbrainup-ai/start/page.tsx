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

  // Get current strato index for progress dots
  const currentStratoIndex = strati.indexOf(question?.strato || '')
  
  // Get visited strati from history
  const getVisitedStrati = () => {
    const visited = new Set<number>()
    history.forEach(qId => {
      const q = questionsMap[qId]
      if (q) {
        visited.add(strati.indexOf(q.strato))
      }
    })
    visited.add(currentStratoIndex)
    return visited
  }

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

  const handleDotClick = (stratoIndex: number) => {
    const visitedStrati = getVisitedStrati()
    
    // Can only go to visited strati (going back)
    if (visitedStrati.has(stratoIndex) && stratoIndex < currentStratoIndex) {
      setIsTransitioning(true)
      
      setTimeout(() => {
        // Find the first question in history from that strato
        const targetStrato = strati[stratoIndex]
        let targetIndex = -1
        
        for (let i = 0; i < history.length; i++) {
          const q = questionsMap[history[i]]
          if (q && q.strato === targetStrato) {
            targetIndex = i
            break
          }
        }
        
        if (targetIndex >= 0) {
          // Get questions to remove from collected data (from targetIndex onwards + current)
          const questionsToRemove = history.slice(targetIndex)
          questionsToRemove.push(currentQuestionId)
          
          // Clear data for removed questions
          setCollectedData(prev => {
            const newData = { ...prev }
            questionsToRemove.forEach(qId => {
              const q = questionsMap[qId]
              if (q) {
                delete newData[q.collectAs]
              }
            })
            return newData
          })
          
          // Go back to that point
          const newHistory = history.slice(0, targetIndex)
          setHistory(newHistory)
          setCurrentQuestionId(history[targetIndex])
        }
        
        setTimeout(() => {
          setIsTransitioning(false)
        }, 50)
      }, 300)
    }
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

              {/* Progress dots - above counter */}
              <div className="flex justify-center gap-2 mt-10 md:mt-14 mb-4">
                {strati.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-white/40"
                  />
                ))}
              </div>

              {/* Step counter */}
              <p className="text-center font-ui text-[11px] font-medium tracking-widest uppercase text-white/40">
                {complete.section}
              </p>
              
            </div>
          </Container>
        </div>
      </div>
    )
  }

  const visitedStrati = getVisitedStrati()

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
            className="rounded-[4px] p-8 py-10 md:p-12 md:py-16 relative"
            style={{ background: 'linear-gradient(to bottom, #353535 0%, #232323 100%)' }}
          >
            {/* Strato label - top */}
            <p className="text-center font-ui text-[11px] font-medium tracking-widest uppercase text-white/[0.55] mb-10 md:mb-14">
              {question.strato}
            </p>

            {/* Content with transition */}
            <div 
              className={`transition-opacity duration-300 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {/* Single column - centered horizontally */}
              <div className="flex flex-col items-center min-h-[300px] text-center">
                
                {/* Question */}
                <h2 className="text-[24px] md:text-[32px] font-normal leading-[1.1] text-white mb-10 md:mb-12">
                  {question.question}
                </h2>
                
                {/* Options */}
                <div className="space-y-3 w-full">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(option)}
                      className="w-full px-6 py-4 bg-white/[0.02] hover:bg-white/10 rounded-[4px] text-white text-[17px] md:text-[18px] font-normal text-center transition-all"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                
              </div>
            </div>

            {/* Progress dots - above page numbers */}
            <div className="flex justify-center gap-2 mt-10 md:mt-14 mb-4">
              {strati.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStratoIndex 
                      ? 'bg-white/90' 
                      : visitedStrati.has(index) && index < currentStratoIndex
                        ? 'bg-white/40 hover:bg-white/60 cursor-pointer' 
                        : 'bg-white/20 cursor-not-allowed'
                  }`}
                />
              ))}
            </div>

            {/* Strato counter - centered bottom */}
            <p className="text-center font-ui text-[11px] font-medium tracking-widest uppercase text-white/40">
              {currentStratoIndex + 1} / {strati.length}
            </p>
            
          </div>
        </Container>
      </div>
      
    </div>
  )
}
