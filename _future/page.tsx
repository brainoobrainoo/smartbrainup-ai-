'use client'

// app/(smartbrainup-ai)/chat/page.tsx

import { useState, useCallback, useEffect } from 'react'
import { chatContent } from '@/content/smartbrainup-ai/chat'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react'

interface ChatMessage {
  id: string
  message: string
  sender: string
  direction: 'incoming' | 'outgoing'
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      message: chatContent.system.welcome,
      sender: 'assistant',
      direction: 'incoming',
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [responseIndex, setResponseIndex] = useState(0)
  const [showScrollButton, setShowScrollButton] = useState(false)

  const scrollToBottom = () => {
    // Chatscope uses perfect-scrollbar, find the actual scrollable container
    const container = document.querySelector('.cs-message-list .scrollbar-container') as HTMLElement
      || document.querySelector('.cs-message-list') as HTMLElement
    
    if (container) {
      container.scrollTop = container.scrollHeight
      console.log('Scrolling to:', container.scrollHeight)
    } else {
      console.log('Container not found')
    }
  }

  // Set Safari toolbar color and prevent body scroll
  useEffect(() => {
    const metaTheme = document.querySelector('meta[name="theme-color"]')
    const originalColor = metaTheme?.getAttribute('content')
    
    if (metaTheme) {
      metaTheme.setAttribute('content', '#252525')
    } else {
      const newMeta = document.createElement('meta')
      newMeta.name = 'theme-color'
      newMeta.content = '#252525'
      document.head.appendChild(newMeta)
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
    document.body.style.height = '100%'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      if (metaTheme && originalColor) {
        metaTheme.setAttribute('content', originalColor)
      }
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
      document.documentElement.style.overflow = ''
    }
  }, [])

  const handleSend = useCallback((text: string) => {
    if (!text.trim()) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      message: text.trim(),
      sender: 'user',
      direction: 'outgoing',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])

    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const aiMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        message: chatContent.mockResponses[responseIndex % chatContent.mockResponses.length],
        sender: 'assistant',
        direction: 'incoming',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
      setResponseIndex(prev => prev + 1)
    }, 800 + Math.random() * 400)
  }, [responseIndex])

  // Scroll detection
  useEffect(() => {
    const getContainer = () => {
      return document.querySelector('.cs-message-list .scrollbar-container') as HTMLElement
        || document.querySelector('.cs-message-list') as HTMLElement
    }

    const checkScroll = () => {
      const container = getContainer()
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight
        setShowScrollButton(distanceFromBottom > 100)
      }
    }

    // Delay to let chatscope render
    const timer = setTimeout(() => {
      const container = getContainer()
      if (container) {
        container.addEventListener('scroll', checkScroll)
        checkScroll()
      }
    }, 300)

    return () => {
      clearTimeout(timer)
      const container = getContainer()
      if (container) {
        container.removeEventListener('scroll', checkScroll)
      }
    }
  }, [messages.length])

  return (
    <div 
      className="fixed top-[67px] left-0 right-0 bottom-0"
      style={{ background: 'linear-gradient(to bottom, #252525 0%, #505050 100%)' }}
    >
      <div className="w-full h-full text-white">
        <div className="h-full md:max-w-[1200px] md:mx-auto md:px-10 lg:px-12 md:py-8">
          <div className="h-full md:rounded-[4px] overflow-hidden relative">
            <MainContainer>
              <ChatContainer>
                <MessageList
                  typingIndicator={isTyping ? <TypingIndicator content="writing..." /> : null}
                >
                  {messages.map((msg) => (
                    <Message
                      key={msg.id}
                      model={{
                        message: msg.message,
                        sender: msg.sender,
                        direction: msg.direction,
                        position: 'single',
                      }}
                    />
                  ))}
                </MessageList>
                <MessageInput
                  placeholder="write here..."
                  onSend={handleSend}
                  attachButton={false}
                />
              </ChatContainer>
            </MainContainer>

            {/* Scroll to bottom button */}
            {showScrollButton && (
              <button
                onClick={scrollToBottom}
                className="absolute bottom-[100px] left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all z-50"
                aria-label="Scroll to bottom"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Hide perfect-scrollbar (chatscope internal) */
        .ps__rail-x,
        .ps__rail-y,
        .ps__thumb-x,
        .ps__thumb-y {
          display: none !important;
        }
        
        /* Mobile background */
        @media (max-width: 767px) {
          html, body {
            background-color: #252525 !important;
          }
        }
        
        /* Main containers */
        .cs-main-container {
          border: none !important;
          background: transparent !important;
          height: 100% !important;
          border-radius: 4px !important;
        }
        .cs-chat-container {
          background: transparent !important;
        }
        
        /* Message list */
        .cs-message-list {
          background: transparent !important;
          padding: 1rem !important;
        }
        @media (min-width: 768px) {
          .cs-message-list {
            padding: 1.5rem !important;
          }
        }
        .cs-message-list__scroll-wrapper {
          padding: 0 !important;
        }
        
        /* Messages */
        .cs-message {
          margin-bottom: 0.5rem !important;
        }
        .cs-message__content {
          padding: 10px 16px !important;
          font-size: 15px !important;
          line-height: 1.45 !important;
          font-family: inherit !important;
        }
        @media (min-width: 768px) {
          .cs-message__content {
            padding: 12px 18px !important;
          }
        }
        
        /* Incoming messages (assistant) */
        .cs-message--incoming .cs-message__content {
          background: rgba(255, 255, 255, 0.08) !important;
          color: white !important;
          border: none !important;
          border-radius: 18px 18px 18px 4px !important;
        }
        
        /* Outgoing messages (user) */
        .cs-message--outgoing .cs-message__content {
          background: white !important;
          color: #1a1a1a !important;
          border: none !important;
          border-radius: 18px 18px 4px 18px !important;
        }
        
        /* Input container */
        .cs-message-input {
          background: transparent !important;
          border-top: none !important;
          padding: 0.5rem 1rem !important;
          padding-bottom: 30px !important;
        }
        @media (min-width: 768px) {
          .cs-message-input {
            padding: 1rem 1.5rem !important;
          }
        }
        
        /* Input wrapper */
        .cs-message-input__content-editor-wrapper {
          background: white !important;
          border-radius: 24px !important;
          padding: 8px 16px !important;
          border: none !important;
          box-shadow: none !important;
        }
        @media (min-width: 768px) {
          .cs-message-input__content-editor-wrapper {
            padding: 10px 18px !important;
          }
        }
        
        /* Input field */
        .cs-message-input__content-editor {
          background: transparent !important;
          color: #1a1a1a !important;
          font-size: 16px !important;
          font-family: inherit !important;
          line-height: 1.4 !important;
        }
        .cs-message-input__content-editor:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        .cs-message-input__content-editor-container {
          background: transparent !important;
          border: none !important;
        }
        .cs-message-input__content-editor[data-placeholder]:empty:before {
          color: #888 !important;
          font-size: 16px !important;
        }
        
        /* Send button */
        .cs-button--send {
          background: #252525 !important;
          color: white !important;
          border-radius: 50% !important;
          width: 36px !important;
          height: 36px !important;
          min-width: 36px !important;
          margin-left: 8px !important;
          border: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        @media (min-width: 768px) {
          .cs-button--send {
            width: 40px !important;
            height: 40px !important;
            min-width: 40px !important;
            margin-left: 10px !important;
          }
        }
        .cs-button--send:hover {
          background: #3a3a3a !important;
        }
        .cs-button--send:disabled {
          opacity: 0.3 !important;
        }
        .cs-button--send svg {
          fill: white !important;
          width: 16px !important;
          height: 16px !important;
        }
        
        /* Typing indicator */
        .cs-typing-indicator {
          background: transparent !important;
          border: none !important;
          padding: 4px 16px !important;
        }
        .cs-typing-indicator__text {
          color: rgba(255, 255, 255, 0.5) !important;
          font-size: 13px !important;
        }
        .cs-typing-indicator__dot {
          display: none !important;
        }
        
        /* Focus states */
        .cs-message-input__content-editor-wrapper:focus-within {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        
        /* Mobile */
        @media (max-width: 767px) {
          .cs-main-container {
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}
