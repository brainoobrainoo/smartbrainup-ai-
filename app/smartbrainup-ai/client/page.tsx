'use client'

// app/(smartbrainup-ai)/client/page.tsx

import { useState } from 'react'
import Link from 'next/link'
import Container from '@/components/layout/Container'
import { clientContent, Section, SecondBrain } from '@/content/smartbrainup-ai/client'

const { user, brains, billing, plans, enterprise, nav, sections } = clientContent

export default function ClientArea() {
  const [section, setSection] = useState<Section>('dashboard')
  const [brain, setBrain] = useState<SecondBrain | null>(null)
  const [editName, setEditName] = useState(false)
  const [editEmail, setEditEmail] = useState(false)
  const [userName, setUserName] = useState(user.name)
  const [userEmail, setUserEmail] = useState(user.email)

  function go(s: Section) {
    setSection(s)
    setBrain(null)
    window.scrollTo(0, 0)
  }

  function openBrain(b: SecondBrain) {
    setBrain(b)
    setSection('detail')
    window.scrollTo(0, 0)
  }

  // detail / new → highlight dashboard in nav
  const activeNav = section === 'detail' || section === 'new' ? 'dashboard' : section

  return (
    <div className="bg-white">
      {/* ═══════════════════════════════════════════ */}
      {/* TOP DARK ZONE                               */}
      {/* ═══════════════════════════════════════════ */}
      <div
        className="text-white"
        style={{
          background: 'linear-gradient(to bottom, #252525 0%, #161616 100%)',
        }}
      >
        {/* ── Identity ── */}
        <div className="border-b border-white/[0.06]">
          <Container>
            <div className="flex items-end justify-between pt-20 pb-6 md:pt-32 md:pb-8">
              <div>
                <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-40 mb-2">
                  AI-UP Second Brain™
                </p>
                <h1 className="text-[28px] md:text-[32px] font-normal leading-[1.05] tracking-[-0.01em]">
                  {userName}
                </h1>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-[13px] opacity-40 mb-1">
                  {brains.length} Second Brain{brains.length !== 1 ? 's' : ''}
                </p>
                <p className="text-[11px] opacity-25">Since {user.since}</p>
              </div>
            </div>
          </Container>
        </div>

        {/* ── Desktop nav ── */}
        <div className="hidden md:block">
          <Container>
            <nav className="flex gap-8 py-4">
              {nav.map((item) => (
                <button
                  key={item.key}
                  onClick={() => go(item.key)}
                  className={`
                    font-ui text-[11px] font-medium tracking-widest uppercase
                    text-white pb-2 border-b bg-transparent cursor-pointer
                    transition-all duration-300
                    ${
                      activeNav === item.key
                        ? 'opacity-90 border-white/50'
                        : 'opacity-30 border-transparent hover:opacity-60'
                    }
                  `}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </Container>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* DASHBOARD                                   */}
      {/* ═══════════════════════════════════════════ */}
      {section === 'dashboard' && (
        <section className="py-16 md:py-20">
          <Container>
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">
              {sections.dashboard.label}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* ── Brain cards ── */}
              {brains.map((b) => (
                <button
                  key={b.id}
                  onClick={() => openBrain(b)}
                  className="bg-[#f7f7f7] hover:bg-[#f0f0f0] rounded-[4px] p-8 text-left
                             cursor-pointer transition-colors duration-300 relative border-0"
                >
                  <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-30 mb-4">
                    Second Brain {b.num}
                  </p>

                  <div className="flex items-center gap-2.5 mb-3">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        b.status === 'active'
                          ? 'bg-emerald-500 opacity-80'
                          : 'bg-neutral-400 opacity-40'
                      }`}
                    />
                    <span className="font-ui text-[10px] font-medium tracking-widest uppercase opacity-40">
                      {b.status === 'active' ? 'Active' : 'Setup'}
                    </span>
                  </div>

                  <h3 className="text-[22px] font-normal leading-[1.15] mb-3">
                    {b.name}
                  </h3>

                  <p className="text-[15px] font-normal leading-[1.3] opacity-50 mb-5">
                    {b.context.length > 90
                      ? b.context.slice(0, 90) + '…'
                      : b.context}
                  </p>

                  <div className="flex gap-2 flex-wrap">
                    {b.platforms.map((p) => (
                      <span
                        key={p}
                        className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase
                                   opacity-30 px-2.5 py-1 border border-black/10 rounded-[4px]"
                      >
                        {p}
                      </span>
                    ))}
                  </div>

                  <span className="absolute top-6 right-6 text-[14px] opacity-20">
                    →
                  </span>
                </button>
              ))}

              {/* ── New brain card ── */}
              <button
                onClick={() => {
                  setSection('new')
                  window.scrollTo(0, 0)
                }}
                className="rounded-[4px] p-8 border-2 border-dashed border-black/10
                           hover:border-black/25 transition-colors duration-300
                           flex flex-col items-center justify-center min-h-[220px]
                           cursor-pointer bg-transparent"
              >
                <span className="text-[32px] opacity-20 mb-3 font-light">
                  +
                </span>
                <span className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-30">
                  New Second Brain
                </span>
              </button>
            </div>
          </Container>
        </section>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* SECOND BRAIN DETAIL                         */}
      {/* ═══════════════════════════════════════════ */}
      {section === 'detail' && brain && (
        <div>
          {/* Header */}
          <section className="pt-12 md:pt-16">
            <Container>
              <button
                onClick={() => go('dashboard')}
                className="font-ui text-[11px] font-medium tracking-widest uppercase
                           opacity-40 hover:opacity-70 transition-opacity cursor-pointer
                           bg-transparent border-0 p-0 mb-8 block"
              >
                ← Dashboard
              </button>

              <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-30 mb-3">
                Second Brain {brain.num}
              </p>

              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    brain.status === 'active'
                      ? 'bg-emerald-500 opacity-80'
                      : 'bg-neutral-400 opacity-40'
                  }`}
                />
                <span className="font-ui text-[10px] font-medium tracking-widest uppercase opacity-40">
                  {brain.status === 'active' ? 'Active' : 'Setup in progress'}
                </span>
              </div>

              <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
                {brain.name}
              </h2>
            </Container>
          </section>

          {/* Context — 12 col grid */}
          <section className="py-16 md:py-20">
            <Container>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">
                {sections.detail.context.label}
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-5">
                  <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
                    {sections.detail.context.title}
                  </h2>
                </div>
                <div className="lg:col-span-6 lg:col-start-7">
                  <p className="text-[17px] md:text-[18px] font-normal leading-[1.4] opacity-60">
                    {brain.context}
                  </p>
                </div>
              </div>
            </Container>
          </section>

          {/* Execution card */}
          <section className="pb-16 md:pb-20">
            <Container>
              <div className="bg-[#f7f7f7] rounded-[4px] p-6 pt-14 md:p-12 relative">
                <span className="absolute top-6 right-6 font-ui text-[10px] tracking-widest uppercase opacity-25">
                  {sections.detail.execution}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  {/* Platforms */}
                  <div>
                    <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-40 mb-4">
                      Platforms
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {brain.platforms.map((p) => (
                        <span
                          key={p}
                          className="text-[15px] font-normal opacity-70 px-4 py-2
                                     border border-black/10 rounded-[4px]"
                        >
                          {p}
                        </span>
                      ))}
                      {brain.platforms.length < 5 && (
                        <button
                          className="text-[15px] font-normal opacity-25 px-4 py-2
                                     border border-dashed border-black/15 rounded-[4px]
                                     bg-transparent cursor-pointer hover:opacity-40
                                     transition-opacity"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </div>

                  {/* PMF delivery */}
                  <div>
                    <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-40 mb-4">
                      Method Delivery
                    </p>
                    <p className="text-[17px] md:text-[18px] font-normal leading-[1.15] opacity-70">
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
          <section className="pb-16 md:pb-20">
            <Container>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">
                {sections.detail.activity}
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {[
                  { label: 'Created', value: brain.created },
                  { label: 'Last active', value: brain.lastActive },
                  { label: 'Interactions', value: String(brain.interactions) },
                  {
                    label: 'Platforms',
                    value: `${brain.platforms.length} / 5`,
                  },
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

      {/* ═══════════════════════════════════════════ */}
      {/* NEW SECOND BRAIN                            */}
      {/* ═══════════════════════════════════════════ */}
      {section === 'new' && (
        <div>
          <section className="pt-12 md:pt-16">
            <Container>
              <button
                onClick={() => go('dashboard')}
                className="font-ui text-[11px] font-medium tracking-widest uppercase
                           opacity-40 hover:opacity-70 transition-opacity cursor-pointer
                           bg-transparent border-0 p-0 mb-8 block"
              >
                ← Dashboard
              </button>
            </Container>
          </section>

          <section className="pb-16 md:pb-20">
            <Container>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-12">
                {sections.newBrain.label}
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
                {/* 2 × 2 plans */}
                <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {plans.map((plan) => (
                    <div
                      key={plan.name}
                      className="rounded-[4px] p-8 min-h-[260px] flex flex-col"
                      style={{
                        background:
                          'linear-gradient(to bottom, #f7f7f7 0%, #efefef 100%)',
                      }}
                    >
                      <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-1">
                        {plan.name}
                      </p>
                      <p className="text-[14px] font-normal opacity-50 mb-5">
                        {plan.brains}
                      </p>
                      <p className="text-[28px] md:text-[32px] font-normal leading-[1.1] tracking-[-0.01em] mb-4">
                        {plan.price}
                      </p>
                      <div className="mb-auto">
                        {plan.lines.map((line, i) => (
                          <p
                            key={i}
                            className="text-[15px] md:text-[16px] font-normal leading-[1.4] opacity-50"
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                      <div className="pt-6">
                        <button
                          className="bg-[#252525] text-white border-0 rounded-[4px]
                                     px-6 py-2.5 font-ui text-[11px] font-medium
                                     tracking-widest uppercase cursor-pointer
                                     opacity-90 hover:opacity-100 transition-opacity"
                        >
                          Start
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enterprise */}
                <div
                  className="lg:col-span-5 rounded-[4px] p-8 text-white
                             flex flex-col justify-center min-h-[260px]"
                  style={{
                    background:
                      'linear-gradient(to bottom, #484848 0%, #2f2f2f 100%)',
                  }}
                >
                  <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-1">
                    {enterprise.name}
                  </p>
                  <p className="text-[14px] font-normal opacity-40 mb-5">
                    {enterprise.brains}
                  </p>
                  <p className="text-[28px] md:text-[32px] font-normal leading-[1.1] tracking-[-0.01em] mb-6">
                    {enterprise.price}
                  </p>
                  <div className="mb-6">
                    {enterprise.lines.map((line, i) => (
                      <p
                        key={i}
                        className="text-[15px] font-normal leading-[1.4] opacity-50"
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
          </section>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* BILLING                                     */}
      {/* ═══════════════════════════════════════════ */}
      {section === 'billing' && (
        <div>
          {/* Intro — 12 col */}
          <section className="py-16 md:py-20">
            <Container>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">
                {sections.billing.label}
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-5">
                  <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
                    {sections.billing.title}
                  </h2>
                </div>
                <div className="lg:col-span-6 lg:col-start-7">
                  <p className="text-[17px] md:text-[18px] font-normal leading-[1.4] opacity-60">
                    {sections.billing.body[0]}
                    <br />
                    {sections.billing.body[1]}
                  </p>
                </div>
              </div>
            </Container>
          </section>

          {/* Desktop table */}
          <section className="pb-16 md:pb-20 hidden md:block">
            <Container>
              {/* Header */}
              <div className="grid grid-cols-[120px_1fr_140px_80px_80px] gap-4 px-6 py-3 bg-[#f7f7f7] rounded-t-[4px]">
                {['Date', 'Item', 'Amount', 'Status', ''].map((h) => (
                  <span
                    key={h}
                    className="font-ui text-[10px] font-medium tracking-widest uppercase opacity-40"
                  >
                    {h}
                  </span>
                ))}
              </div>
              {/* Rows */}
              {billing.map((row, i) => (
                <div
                  key={row.id}
                  className={`grid grid-cols-[120px_1fr_140px_80px_80px] gap-4 px-6 py-4 bg-[#f7f7f7]
                    ${i === billing.length - 1 ? 'rounded-b-[4px]' : ''}`}
                >
                  <span className="text-[15px] opacity-50">{row.date}</span>
                  <span className="text-[15px] opacity-70">{row.item}</span>
                  <span className="text-[15px] font-normal">{row.amount}</span>
                  <span className="text-[13px] opacity-50">{row.status}</span>
                  <button
                    className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase
                               opacity-40 hover:opacity-70 transition-opacity cursor-pointer
                               bg-transparent border-0 p-0 text-right"
                  >
                    Invoice
                  </button>
                </div>
              ))}
            </Container>
          </section>

          {/* Mobile cards */}
          <section className="pb-16 md:hidden">
            <Container>
              <div className="flex flex-col gap-3">
                {billing.map((row) => (
                  <div
                    key={row.id}
                    className="bg-[#f7f7f7] rounded-[4px] p-6"
                  >
                    <p className="font-ui text-[10px] font-medium tracking-widest uppercase opacity-40 mb-3">
                      {row.date}
                    </p>
                    <p className="text-[16px] font-normal opacity-70 mb-2">
                      {row.item}
                    </p>
                    <div className="flex justify-between items-end">
                      <p className="text-[22px] font-normal">{row.amount}</p>
                      <div className="flex items-center gap-4">
                        <span className="font-ui text-[10px] font-medium tracking-widest uppercase opacity-40">
                          {row.status}
                        </span>
                        <button
                          className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase
                                     opacity-40 underline bg-transparent border-0 p-0
                                     cursor-pointer"
                        >
                          Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          </section>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* SUPPORT                                     */}
      {/* ═══════════════════════════════════════════ */}
      {section === 'support' && (
        <div>
          {/* Intro — 12 col */}
          <section className="py-16 md:py-20">
            <Container>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">
                {sections.support.label}
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-5">
                  <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
                    {sections.support.title}
                  </h2>
                </div>
                <div className="lg:col-span-6 lg:col-start-7">
                  <p className="text-[17px] md:text-[18px] font-normal leading-[1.4] opacity-60">
                    {sections.support.body[0]}
                    <br />
                    {sections.support.body[1]}
                  </p>
                </div>
              </div>
            </Container>
          </section>

          {/* Chat entry */}
          <section className="pb-16 md:pb-20">
            <Container>
              <div
                className="rounded-[4px] p-8 md:p-12 text-white relative overflow-hidden"
                style={{
                  background: 'linear-gradient(to bottom, #484848 0%, #2f2f2f 100%)',
                }}
              >
                <span className="absolute top-6 right-6 font-ui text-[10px] tracking-widest uppercase opacity-25">
                  Chat
                </span>

                <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-40 mb-4">
                  AI-UP Support
                </p>
                <p className="text-[17px] md:text-[18px] font-normal leading-[1.4] opacity-60 mb-8">
                  {sections.support.welcome}
                </p>

                <Link
                  href="/client/chat"
                  className="inline-block bg-white text-[#1a1a1a] border-0 rounded-[4px]
                             px-6 py-2.5 font-ui text-[11px] font-medium
                             tracking-widest uppercase no-underline
                             opacity-90 hover:opacity-100 transition-opacity"
                >
                  Open chat
                </Link>
              </div>
            </Container>
          </section>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* ACCOUNT                                     */}
      {/* ═══════════════════════════════════════════ */}
      {section === 'account' && (
        <div>
          {/* Intro — 12 col */}
          <section className="py-16 md:py-20">
            <Container>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">
                {sections.account.label}
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-5">
                  <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
                    {sections.account.title}
                  </h2>
                </div>
                <div className="lg:col-span-6 lg:col-start-7">
                  <p className="text-[17px] md:text-[18px] font-normal leading-[1.4] opacity-60">
                    {sections.account.body[0]}
                    <br />
                    {sections.account.body[1]}
                  </p>
                </div>
              </div>
            </Container>
          </section>

          {/* Fields */}
          <section className="pb-16 md:pb-20">
            <Container>
              <div className="flex flex-col">
                {/* Name */}
                <div
                  className="bg-[#f7f7f7] rounded-t-[4px] px-6 md:px-8 py-6
                             flex justify-between items-center border-b border-black/[0.04]"
                >
                  <div className="flex-1">
                    <p className="font-ui text-[10px] font-medium tracking-widest uppercase opacity-40 mb-2">
                      Name
                    </p>
                    {editName ? (
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        autoFocus
                        className="text-[17px] font-editorial font-normal border-0
                                   border-b border-black/20 bg-transparent outline-none
                                   w-full md:w-[300px] rounded-none"
                      />
                    ) : (
                      <p className="text-[17px] font-normal opacity-70">
                        {userName}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setEditName(!editName)}
                    className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase
                               opacity-40 hover:opacity-70 transition-opacity cursor-pointer
                               bg-transparent border-0 flex-shrink-0 ml-4"
                  >
                    {editName ? 'Save' : 'Edit'}
                  </button>
                </div>

                {/* Email */}
                <div
                  className="bg-[#f7f7f7] px-6 md:px-8 py-6
                             flex justify-between items-center border-b border-black/[0.04]"
                >
                  <div className="flex-1">
                    <p className="font-ui text-[10px] font-medium tracking-widest uppercase opacity-40 mb-2">
                      Email
                    </p>
                    {editEmail ? (
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        autoFocus
                        className="text-[17px] font-editorial font-normal border-0
                                   border-b border-black/20 bg-transparent outline-none
                                   w-full md:w-[300px] rounded-none"
                      />
                    ) : (
                      <p className="text-[17px] font-normal opacity-70">
                        {userEmail}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setEditEmail(!editEmail)}
                    className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase
                               opacity-40 hover:opacity-70 transition-opacity cursor-pointer
                               bg-transparent border-0 flex-shrink-0 ml-4"
                  >
                    {editEmail ? 'Save' : 'Edit'}
                  </button>
                </div>

                {/* Access method */}
                <div className="bg-[#f7f7f7] px-6 md:px-8 py-6 border-b border-black/[0.04]">
                  <p className="font-ui text-[10px] font-medium tracking-widest uppercase opacity-40 mb-2">
                    Access method
                  </p>
                  <p className="text-[17px] font-normal opacity-70">
                    {user.method} + Magic Link
                  </p>
                </div>

                {/* Session */}
                <div
                  className="bg-[#f7f7f7] rounded-b-[4px] px-6 md:px-8 py-6
                             flex justify-between items-center"
                >
                  <div>
                    <p className="font-ui text-[10px] font-medium tracking-widest uppercase opacity-40 mb-2">
                      Session
                    </p>
                    <p className="text-[17px] font-normal opacity-70">Active</p>
                  </div>
                  <button
                    className="bg-transparent border border-black/[0.12] rounded-[4px]
                               px-5 py-2 font-ui text-[10px] font-medium tracking-[0.08em]
                               uppercase opacity-50 hover:opacity-80 transition-opacity
                               cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </Container>
          </section>
        </div>
      )}

      {/* Spacer for mobile tab bar (Footer comes from parent layout) */}
      <div className="h-[72px] md:h-0" />

      {/* ═══════════════════════════════════════════ */}
      {/* MOBILE TAB BAR                              */}
      {/* ═══════════════════════════════════════════ */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-[#252525]
                   border-t border-white/[0.08] grid grid-cols-4 md:hidden z-50"
      >
        {nav.map((item) => (
          <button
            key={item.key}
            onClick={() => go(item.key)}
            className={`
              py-3.5 flex items-center justify-center cursor-pointer
              bg-transparent border-0 font-ui text-[9px] font-medium
              tracking-widest uppercase text-white transition-opacity duration-300
              ${activeNav === item.key ? 'opacity-80' : 'opacity-25'}
            `}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
