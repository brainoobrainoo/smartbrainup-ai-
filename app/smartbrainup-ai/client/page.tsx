'use client'

// app/(smartbrainup-ai)/client/page.tsx

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Container from '@/components/layout/Container'
import { clientContent, Section, SecondBrain } from '@/content/smartbrainup-ai/client'
import { chatContent } from '@/content/smartbrainup-ai/chat'
import { useAuth, signOut } from '@/lib/useAuth'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

const { user, brains, billing, plans, enterprise, nav, sections } = clientContent

export default function ClientArea() {
  useAuth()
  const [section, setSection] = useState<Section>('dashboard')
  const [brain, setBrain] = useState<SecondBrain | null>(null)
  const [editName, setEditName] = useState(false)
  const [editEmail, setEditEmail] = useState(false)
  const [userName, setUserName] = useState(user.name)
  const [userEmail, setUserEmail] = useState(user.email)
  const [sphereData, setSphereData] = useState<any>(null)

  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string; message: string; sender: string;
    direction: 'incoming' | 'outgoing'; timestamp: Date;
  }>>([
    {
      id: 'welcome',
      message: chatContent.system.welcome,
      sender: 'assistant',
      direction: 'incoming' as const,
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [responseIndex, setResponseIndex] = useState(0)

  const handleSend = useCallback((text: string) => {
    if (!text.trim()) return
    setChatMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      message: text.trim(),
      sender: 'user',
      direction: 'outgoing' as const,
      timestamp: new Date(),
    }])
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setChatMessages(prev => [...prev, {
        id: `assistant-${Date.now()}`,
        message: chatContent.mockResponses[responseIndex % chatContent.mockResponses.length],
        sender: 'assistant',
        direction: 'incoming' as const,
        timestamp: new Date(),
      }])
      setResponseIndex(prev => prev + 1)
    }, 800 + Math.random() * 400)
  }, [responseIndex])

  // Load sphere animation
  useEffect(() => {
    fetch('/animations/SFERA_LOGO_B_bianco.json')
      .then((r) => r.json())
      .then(setSphereData)
      .catch(() => {})
  }, [])

  // Listen for tab changes from Header
  useEffect(() => {
    function onNav(e: Event) {
      const tab = (e as CustomEvent).detail as Section
      if (tab) {
        setSection(tab)
        setBrain(null)
        window.scrollTo(0, 0)
      }
    }
    window.addEventListener('client-nav', onNav)
    return () => window.removeEventListener('client-nav', onNav)
  }, [])

  function go(s: Section) {
    setSection(s)
    setBrain(null)
    window.scrollTo(0, 0)
    window.dispatchEvent(new CustomEvent('client-tab-update', { detail: s }))
  }

  function openBrain(b: SecondBrain) {
    setBrain(b)
    setSection('detail')
    window.scrollTo(0, 0)
  }

  const activeNav = section === 'detail' || section === 'new' ? 'dashboard' : section
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="bg-white min-h-screen">
      {/* ═══════════════════════════════════════════════════
          MOBILE TAB BAR — fixed bottom
          ═══════════════════════════════════════════════════ */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-white
                   flex items-center justify-evenly md:hidden z-50"
      >
        {nav.map((item) => (
          <button
            key={item.key}
            onClick={() => go(item.key)}
            className={`
              py-4 flex items-center justify-center cursor-pointer
              bg-transparent border-0 font-ui text-[11px] font-medium
              tracking-widest uppercase text-[#1a1a1a] transition-opacity duration-300
              ${activeNav === item.key ? 'opacity-80' : 'opacity-25'}
            `}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* ═══════════════════════════════════════════════════
          CONTENT
          ═══════════════════════════════════════════════════ */}
      <div className="pt-[67px] pb-[72px] md:pb-12">
        {/* ─────────────────────────────────────────────
            DASHBOARD
            ───────────────────────────────────────────── */}
        {section === 'dashboard' && (
          <Container>
            {/* Badge — same position as other pages */}
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase pt-10 md:pt-14 mb-4">
              <span className="font-semibold text-[#1a1a1a]/50">{brains.length} Second Brain{brains.length !== 1 ? 's' : ''}</span>
              <span className="text-[#1a1a1a]/30"> · Since {user.since}</span>
            </p>

            {/* Client name — same size as enterprise "What you get" */}
            <h1 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em] mb-12">
              {userName}
            </h1>

            {/* Brain grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
              {brains.map((b) =>
                b.status === 'active' ? (
                  /* ── ACTIVE CARD — gradient 15% top → 35% bottom ── */
                  <button
                    key={b.id}
                    onClick={() => openBrain(b)}
                    className="rounded-[4px] p-6
                               text-left cursor-pointer transition-all duration-200
                               relative border-0 hover:brightness-[0.96]"
                    style={{ background: 'linear-gradient(to bottom, #e0e0e0 0%, #aeaeae 100%)' }}
                  >
                    {/* Sphere */}
                    <div className="mb-4">
                      {sphereData ? (
                        <Lottie
                          animationData={sphereData}
                          loop
                          autoplay
                          style={{ width: 40, height: 40 }}
                        />
                      ) : (
                        <div className="w-[40px] h-[40px] rounded-full bg-black/[0.06]" />
                      )}
                    </div>

                    <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-black/50 mb-2">
                      Second Brain {b.num}
                    </p>

                    <h3 className="text-[20px] font-normal tracking-[-0.01em] text-[#1a1a1a] mb-2">
                      {b.name}
                    </h3>

                    <p className="text-[15px] leading-[1.4] text-black/60 mb-4">
                      {b.context.length > 90
                        ? b.context.slice(0, 90) + '…'
                        : b.context}
                    </p>

                    <div className="flex gap-1.5">
                      {b.platforms.map((p) => (
                        <span
                          key={p}
                          className="font-ui text-[10px] font-medium tracking-[0.06em]
                                     uppercase px-2.5 py-0.5 border border-black/[0.15]
                                     rounded-[3px] text-black/50"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </button>
                ) : (
                  /* ── INCOMPLETE CARD — solid gray, no dashes ── */
                  <Link
                    key={b.id}
                    href="/start/phase2"
                    className="rounded-[4px]
                               transition-all duration-200 hover:brightness-[0.96]
                               p-6 flex flex-col items-center justify-center text-center
                               min-h-[260px] no-underline border-0"
                    style={{ background: 'linear-gradient(to bottom, #ededed 0%, #c9c9c9 100%)' }}
                  >
                    <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/45 mb-3">
                      Second Brain {b.num}
                    </p>
                    <p className="text-[17px] font-normal text-[#1a1a1a]/55 mb-1">
                      Complete your Second Brain
                    </p>
                    <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40">
                      Continue assessment →
                    </p>
                  </Link>
                )
              )}
            </div>

            {/* New brain — same grid size */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  setSection('new')
                  window.scrollTo(0, 0)
                }}
                className="rounded-[4px] bg-[#f7f7f7] hover:bg-[#f0f0f0]
                           transition-colors duration-200
                           flex flex-col items-center justify-center min-h-[260px]
                           cursor-pointer border-0"
              >
                <span className="text-[24px] text-[#1a1a1a]/30 mb-2">+</span>
                <span className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/45">
                  New Second Brain
                </span>
              </button>
            </div>
          </Container>
        )}

        {/* ─────────────────────────────────────────────
            DETAIL
            ───────────────────────────────────────────── */}
        {section === 'detail' && brain && (
          <div>
            <Container>
              <button
                onClick={() => go('dashboard')}
                className="font-ui text-[11px] font-medium tracking-widest uppercase
                           opacity-40 hover:opacity-70 transition-opacity cursor-pointer
                           bg-transparent border-0 p-0 mb-8 block"
              >
                ← Dashboard
              </button>

              <p className="font-ui text-[10px] font-medium tracking-widest uppercase opacity-30 mb-2">
                Second Brain {brain.num}
              </p>

              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`inline-block w-1.5 h-1.5 rounded-full ${
                    brain.status === 'active' ? 'bg-[#34c759]' : 'bg-[#aaa]'
                  }`}
                />
                <span className="font-ui text-[10px] font-medium tracking-widest uppercase opacity-40">
                  {brain.status === 'active' ? 'Active' : 'Setup in progress'}
                </span>
              </div>

              <h2 className="text-[28px] md:text-[36px] font-normal leading-[1.05] tracking-[-0.01em] mb-12">
                {brain.name}
              </h2>
            </Container>

            {/* Context */}
            <section className="pb-10 md:pb-14">
              <Container>
                <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-40 mb-4">
                  Context
                </p>
                <p className="text-[17px] leading-[1.45] opacity-60 max-w-[640px]">
                  {brain.context}
                </p>
              </Container>
            </section>

            {/* Execution */}
            <section className="pb-10 md:pb-14">
              <Container>
                <div className="bg-[#f7f7f7] rounded-[4px] p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Platforms */}
                    <div>
                      <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-40 mb-4">
                        Platforms
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {brain.platforms.map((p) => (
                          <span
                            key={p}
                            className="text-[15px] opacity-70 px-4 py-2
                                       border border-black/10 rounded-[4px]"
                          >
                            {p}
                          </span>
                        ))}
                        {brain.platforms.length < 5 && (
                          <button
                            className="text-[15px] opacity-25 px-4 py-2
                                       border border-dashed border-black/15 rounded-[4px]
                                       bg-transparent cursor-pointer hover:opacity-40
                                       transition-opacity"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    </div>

                    {/* PMF */}
                    <div>
                      <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-40 mb-4">
                        Method Delivery
                      </p>
                      <p className="text-[17px] leading-[1.15] opacity-70">
                        {brain.pmf}
                      </p>
                      {brain.pmf !== 'Pending' && (
                        <button
                          className="mt-3 bg-transparent border border-black/15 rounded-[4px]
                                     px-5 py-2 font-ui text-[10px] font-medium tracking-[0.08em]
                                     uppercase opacity-50 hover:opacity-80 transition-opacity
                                     cursor-pointer"
                        >
                          Access PMF™
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Container>
            </section>

            {/* Activity */}
            <section className="pb-10 md:pb-14">
              <Container>
                <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-40 mb-6">
                  Activity
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Created', value: brain.created },
                    { label: 'Last active', value: brain.lastActive },
                    { label: 'Interactions', value: String(brain.interactions) },
                    { label: 'Platforms', value: `${brain.platforms.length} / 5` },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-[22px] font-normal leading-[1.15] mb-1">
                        {stat.value}
                      </p>
                      <p className="font-ui text-[10px] font-medium tracking-widest uppercase opacity-40">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </Container>
            </section>
          </div>
        )}

        {/* ─────────────────────────────────────────────
            NEW SECOND BRAIN
            ───────────────────────────────────────────── */}
        {section === 'new' && (
          <Container>
            <button
              onClick={() => go('dashboard')}
              className="font-ui text-[11px] font-medium tracking-widest uppercase
                         opacity-40 hover:opacity-70 transition-opacity cursor-pointer
                         bg-transparent border-0 p-0 mb-8 block"
            >
              ← Dashboard
            </button>

            <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-30 mb-8">
              {sections.newBrain.label}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Plans */}
              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className="rounded-[4px] p-6 md:p-8 min-h-[240px] flex flex-col"
                    style={{
                      background: 'linear-gradient(to bottom, #f7f7f7, #efefef)',
                    }}
                  >
                    <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-1">
                      {plan.name}
                    </p>
                    <p className="text-[14px] opacity-50 mb-4">{plan.brains}</p>
                    <p className="text-[28px] font-normal tracking-[-0.01em] mb-4">
                      {plan.price}
                    </p>
                    <div className="mb-auto">
                      {plan.lines.map((line, i) => (
                        <p
                          key={i}
                          className="text-[15px] leading-[1.4] opacity-50"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                    <div className="mt-6">
                      <button
                        className="bg-[#252525] text-white border-0 rounded-[4px]
                                   px-6 py-2.5 font-ui text-[11px] font-medium
                                   tracking-widest uppercase cursor-pointer
                                   hover:opacity-80 transition-opacity"
                      >
                        Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enterprise */}
              <div
                className="lg:col-span-5 rounded-[4px] p-6 md:p-8 text-white
                           flex flex-col justify-center min-h-[240px]"
                style={{
                  background: 'linear-gradient(to bottom, #484848, #2f2f2f)',
                }}
              >
                <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-1">
                  {enterprise.name}
                </p>
                <p className="text-[14px] opacity-40 mb-4">{enterprise.brains}</p>
                <p className="text-[28px] font-normal tracking-[-0.01em] mb-5">
                  {enterprise.price}
                </p>
                <div className="mb-5">
                  {enterprise.lines.map((line, i) => (
                    <p
                      key={i}
                      className="text-[15px] leading-[1.4] opacity-50"
                    >
                      {line}
                    </p>
                  ))}
                </div>
                <div>
                  <button
                    className="bg-white/10 text-white border border-white/20
                               rounded-[4px] px-6 py-2.5 font-ui text-[11px]
                               font-medium tracking-widest uppercase cursor-pointer
                               hover:bg-white/15 transition-colors"
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          </Container>
        )}

        {/* ─────────────────────────────────────────────
            BILLING
            ───────────────────────────────────────────── */}
        {section === 'billing' && (
          <Container>
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-30 pt-10 md:pt-14 mb-5">
              Billing &amp; Licenses
            </p>

            {/* Desktop */}
            <div className="hidden md:block bg-[#f7f7f7] rounded-[4px] overflow-hidden">
              {billing.map((row, i) => (
                <div
                  key={row.id}
                  className={`flex justify-between items-center px-6 py-[18px]
                    ${i < billing.length - 1 ? 'border-b border-black/[0.04]' : ''}`}
                >
                  <div>
                    <p className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase opacity-30 mb-1.5">
                      {row.date}
                    </p>
                    <p className="text-[15px] opacity-75">{row.item}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[15px]">{row.amount}</p>
                    <p className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase opacity-30 mt-1">
                      {row.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile */}
            <div className="md:hidden flex flex-col gap-3">
              {billing.map((row) => (
                <div key={row.id} className="bg-[#f7f7f7] rounded-[4px] p-6">
                  <p className="font-ui text-[10px] font-medium tracking-widest uppercase opacity-30 mb-3">
                    {row.date}
                  </p>
                  <p className="text-[15px] opacity-70 mb-2">{row.item}</p>
                  <div className="flex justify-between items-end">
                    <p className="text-[22px] font-normal">{row.amount}</p>
                    <span className="font-ui text-[10px] font-medium tracking-widest uppercase opacity-30">
                      {row.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        )}

        {/* ─────────────────────────────────────────────
            SUPPORT
            ───────────────────────────────────────────── */}
        {section === 'support' && (
          <div className="fixed top-[67px] left-0 right-0 bottom-0 md:bottom-0 pb-[52px] md:pb-0 bg-white">
            <div className="w-full h-full md:max-w-[1200px] md:mx-auto md:px-10 lg:px-12 md:py-8">
              <div className="h-full md:rounded-[4px] overflow-hidden relative">
                <MainContainer>
                  <ChatContainer>
                    <MessageList
                      typingIndicator={isTyping ? <TypingIndicator content="writing..." /> : null}
                    >
                      {chatMessages.map((msg) => (
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
              </div>
            </div>

            <style jsx global>{`
              /* Hide perfect-scrollbar */
              .ps__rail-x, .ps__rail-y,
              .ps__thumb-x, .ps__thumb-y {
                display: none !important;
              }

              /* Main containers — light theme */
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

              /* Incoming messages (assistant) — gray bubble */
              .cs-message--incoming .cs-message__content {
                background: #f0f0f0 !important;
                color: #1a1a1a !important;
                border: none !important;
                border-radius: 18px 18px 18px 4px !important;
                box-shadow: none !important;
              }

              /* Outgoing messages (user) — near black */
              .cs-message--outgoing .cs-message__content {
                background: #1a1a1a !important;
                color: white !important;
                border: none !important;
                border-radius: 18px 18px 4px 18px !important;
              }

              /* Input container */
              .cs-message-input {
                background: transparent !important;
                border-top: none !important;
                padding: 0.5rem 1rem !important;
                padding-bottom: 16px !important;
              }
              @media (min-width: 768px) {
                .cs-message-input {
                  padding: 1rem 1.5rem !important;
                }
              }

              /* Input wrapper */
              .cs-message-input__content-editor-wrapper {
                background: #f0f0f0 !important;
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
                color: #999 !important;
                font-size: 16px !important;
              }

              /* Send button — dark on light */
              .cs-button--send {
                background: #1a1a1a !important;
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
                background: #333 !important;
              }
              .cs-button--send:disabled {
                opacity: 0.2 !important;
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
                color: rgba(0, 0, 0, 0.35) !important;
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
                background: #e8e8e8 !important;
              }

              /* Mobile */
              @media (max-width: 767px) {
                .cs-main-container {
                  border-radius: 0 !important;
                }
              }
            `}</style>
          </div>
        )}

        {/* ─────────────────────────────────────────────
            ACCOUNT
            ───────────────────────────────────────────── */}
        {section === 'account' && (
          <Container>
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-30 pt-10 md:pt-14 mb-5">
              Account
            </p>

            <div className="bg-[#f7f7f7] rounded-[4px] overflow-hidden">
              {/* Name */}
              <div
                className="px-6 md:px-8 py-[18px] flex justify-between items-center
                           border-b border-black/[0.04]"
              >
                <div className="flex-1">
                  <p className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase opacity-30 mb-1.5">
                    Name
                  </p>
                  {editName ? (
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      autoFocus
                      className="text-[15px] font-normal border-0 border-b border-black/20
                                 bg-transparent outline-none w-full md:w-[300px] rounded-none"
                    />
                  ) : (
                    <p className="text-[15px] opacity-70">{userName}</p>
                  )}
                </div>
                <button
                  onClick={() => setEditName(!editName)}
                  className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase
                             opacity-40 hover:opacity-70 transition-opacity cursor-pointer
                             bg-transparent border-0 ml-4"
                >
                  {editName ? 'Save' : 'Edit'}
                </button>
              </div>

              {/* Email */}
              <div
                className="px-6 md:px-8 py-[18px] flex justify-between items-center
                           border-b border-black/[0.04]"
              >
                <div className="flex-1">
                  <p className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase opacity-30 mb-1.5">
                    Email
                  </p>
                  {editEmail ? (
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      autoFocus
                      className="text-[15px] font-normal border-0 border-b border-black/20
                                 bg-transparent outline-none w-full md:w-[300px] rounded-none"
                    />
                  ) : (
                    <p className="text-[15px] opacity-70">{userEmail}</p>
                  )}
                </div>
                <button
                  onClick={() => setEditEmail(!editEmail)}
                  className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase
                             opacity-40 hover:opacity-70 transition-opacity cursor-pointer
                             bg-transparent border-0 ml-4"
                >
                  {editEmail ? 'Save' : 'Edit'}
                </button>
              </div>

              {/* Member since */}
              <div className="px-6 md:px-8 py-[18px] border-b border-black/[0.04]">
                <p className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase opacity-30 mb-1.5">
                  Member since
                </p>
                <p className="text-[15px] opacity-70">
                  {user.since} · {brains.length} Second Brain
                  {brains.length !== 1 ? 's' : ''} active
                </p>
              </div>

              {/* Access method */}
              <div className="px-6 md:px-8 py-[18px] border-b border-black/[0.04]">
                <p className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase opacity-30 mb-1.5">
                  Access method
                </p>
                <p className="text-[15px] opacity-70">
                  {user.method} + Magic Link
                </p>
              </div>

              {/* Session */}
              <div className="px-6 md:px-8 py-[18px] flex justify-between items-center">
                <div>
                  <p className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase opacity-30 mb-1.5">
                    Session
                  </p>
                  <p className="text-[15px] opacity-70">Active</p>
                </div>
                <button
                  onClick={signOut}
                  className="bg-transparent border border-black/[0.1] rounded-[4px]
                             px-3.5 py-[7px] font-ui text-[10px] font-medium
                             tracking-[0.08em] uppercase opacity-40 hover:opacity-70
                             transition-opacity cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            </div>
          </Container>
        )}
      </div>
    </div>
  )
}
