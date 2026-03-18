'use client'

// app/(smartbrainup-ai)/client/page.tsx

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Container from '@/components/layout/Container'
import SecondBrainCard from '@/components/client/SecondBrainCard'
import PhaseAssessment from '@/components/client/PhaseAssessment'
import Phase3Chat from '@/components/client/Phase3Chat'
import { clientContent, Section, SecondBrain, BillingItem } from '@/content/smartbrainup-ai/client'
import { supportChatContent } from '@/content/smartbrainup-ai/support-chat'
import { questionsMap as phase1QuestionsMap, startQuestionId as phase1StartQuestionId } from '@/content/smartbrainup-ai/start'
import { phase2QuestionsMap, phase2StartQuestionId } from '@/content/smartbrainup-ai/phase2'
import { useAuth, updateDisplayName, signOut } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/client'
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

const { plans, enterprise, nav, sections } = clientContent

const clientTabs = [
  { key: 'dashboard', label: 'dashboard' },
  { key: 'subscription', label: 'generic ai' },
  { key: 'support', label: 'support' },
  { key: 'account', label: 'account' },
]

export default function ClientArea() {
  const { user, loading, displayName, userEmail } = useAuth()
  const router = useRouter()

  const [section, setSection] = useState<Section>('dashboard')
  const [brain, setBrain] = useState<SecondBrain | null>(null)

  // Account state
  const [editName, setEditName] = useState(false)
  const [userName, setUserName] = useState('')
  const [savingName, setSavingName] = useState(false)

  // Dynamic data
  const [brains, setBrains] = useState<SecondBrain[]>([])
  const [billing, setBilling] = useState<BillingItem[]>([])

  // Phase 2 state
  // Active phase state (v2)
  const [activePhase, setActivePhase] = useState<1 | 2 | 3 | null>(null)
  const [activePhaseBrainId, setActivePhaseBrainId] = useState<string | null>(null)
  const [submittedBrainIds, setSubmittedBrainIds] = useState<string[]>([])

  // Inline rename state for incomplete cards
  const [editingBrainId, setEditingBrainId] = useState<string | null>(null)
  const [editingBrainName, setEditingBrainName] = useState('')
  const [savingBrainName, setSavingBrainName] = useState(false)

  // Delete confirm state
  const [deletingBrainId, setDeletingBrainId] = useState<string | null>(null)
  const [contactBrainId, setContactBrainId] = useState<string | null>(null)

  // localStorage pending brain (Phase 1 done, not yet in Supabase)
  const [pendingBrain, setPendingBrain] = useState<SecondBrain | null>(null)

  // Credits from user_profiles
  const [credits, setCredits] = useState<number>(0)
  const cardsCreatedRef = useRef(false)

  // Phase completion status per brain id
  const [phaseStatus, setPhaseStatus] = useState<Record<string, { p1: boolean; p2: boolean; p3: boolean }>>({})

  // Sphere animation for incomplete cards (semi-transparent)
  const [incompleteSphereData, setIncompleteSphereData] = useState<any>(null)
  useEffect(() => {
    fetch('/animations/SFERA_LOGO_B_bianco.json')
      .then((r) => r.json())
      .then(setIncompleteSphereData)
      .catch(() => {})
  }, [])

  // Sync displayName from auth
  useEffect(() => {
    if (displayName && !userName && !editName) {
      setUserName(displayName)
    }
  }, [displayName])

  // ── FETCH OR CREATE USER PROFILE (credits) ──
  const DEVELOPER_EMAILS = ['ca75it@gmail.com']

  const fetchCredits = async (userId: string, resolvedEmail: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('credits, email, full_name, role')
      .eq('id', userId)
      .single()

    if (data) {
      let finalCredits = data.credits

      // If credits = 0, check pending_credits — may have paid before creating account
      if (data.credits === 0 && resolvedEmail) {
        const { data: pending } = await supabase
          .from('pending_credits')
          .select('id, brains_count')
          .eq('email', resolvedEmail)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (pending) {
          finalCredits = pending.brains_count
          await supabase
            .from('user_profiles')
            .update({ credits: finalCredits })
            .eq('id', userId)
          await supabase
            .from('pending_credits')
            .update({ status: 'claimed' })
            .eq('id', pending.id)
        }
      }

      setCredits(finalCredits)
      // Update email/name if missing
      if (!data.email || !data.full_name) {
        await supabase.from('user_profiles').update({
          email: resolvedEmail || null,
          full_name: displayName || null,
        }).eq('id', userId)
      }
      // Create missing cards if credits > existing assessments
      if (finalCredits > 0) await createMissingCards(userId, finalCredits)
    } else if (error?.code === 'PGRST116') {
      // No row exists — check pending_credits before assigning 0
      const isDev = DEVELOPER_EMAILS.includes((resolvedEmail || '').toLowerCase())

      let creditsToAssign = isDev ? 10 : 0
      let pendingId: number | null = null

      if (!isDev && resolvedEmail) {
        const { data: pending } = await supabase
          .from('pending_credits')
          .select('id, brains_count')
          .eq('email', resolvedEmail)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (pending) {
          creditsToAssign = pending.brains_count
          pendingId = pending.id
        }
      }

      await supabase.from('user_profiles').insert([{
        id: userId,
        credits: creditsToAssign,
        role: isDev ? 'developer' : 'client',
        email: resolvedEmail || null,
        full_name: displayName || null,
      }])

      if (pendingId) {
        await supabase
          .from('pending_credits')
          .update({ status: 'claimed' })
          .eq('id', pendingId)
      }

      setCredits(creditsToAssign)
      if (creditsToAssign > 0) await createMissingCards(userId, creditsToAssign)
    }
  }

  useEffect(() => {
    if (user) fetchCredits(user.id, user.email || '')
  }, [user])

  // ── POST-CHECKOUT: save Phase 1 to Supabase immediately after login ──
  useEffect(() => {
    if (!user) return
    const pending = localStorage.getItem('post_checkout_pending')
    if (pending !== 'true') return
    const raw = localStorage.getItem('phase1_results')
    if (!raw) return

    const savePhase1 = async () => {
      try {
        const phase1Data = JSON.parse(raw)
        const { error } = await supabase.from('assessments').insert([{
          user_id: user.id,
          user_email: user.email,
          user_name: user.user_metadata?.full_name || displayName || user.email,
          responses: { phase1: phase1Data, phase2: {} },
          phase2_complete: false,
        }])
        if (!error) {
          localStorage.removeItem('post_checkout_pending')
          await fetchAssessments(user.id)
        }
      } catch (e) {
        console.error('[PostCheckout] Save error:', e)
      }
    }

    savePhase1()
  }, [user])

  // ── READ PENDING PHASE 1 FROM LOCALSTORAGE (no Supabase write) ──
  useEffect(() => {
    const raw = localStorage.getItem('phase1_results')
    if (!raw) {
      setPendingBrain(null)
      return
    }
    try {
      JSON.parse(raw) // validate
      const savedName = localStorage.getItem('phase1_brain_name') || 'Second Brain'
      setPendingBrain({
        id: 'local',
        num: '–',
        name: savedName,
        status: 'setup',
        context: '',
        platforms: [],
        pmf: 'Pending',
        created: '',
        lastActive: '',
        interactions: 0,
        cardColor: 'default',
      })
    } catch {
      localStorage.removeItem('phase1_results')
      setPendingBrain(null)
    }
  }, [user, section])

  // ── FETCH ASSESSMENTS FROM SUPABASE ──
  const fetchAssessments = async (userId: string) => {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Failed to fetch assessments:', error)
      return
    }

    if (data && data.length > 0) {
      const mapped: SecondBrain[] = data.map((row: any, index: number) => ({
        id: row.id.toString(),
        num: String(index + 1),
        name: row.brain_name || 'Second Brain',
        status: row.phase2_complete ? 'active' as const : 'setup' as const,
        context: '',
        platforms: [],
        pmf: 'Pending',
        created: new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        lastActive: '',
        interactions: 0,
        cardColor: row.card_color || 'default',
      }))
      setBrains(mapped)

      // Build phase status map
      const ps: Record<string, { p1: boolean; p2: boolean; p3: boolean }> = {}
      const submittedIds: string[] = []
      data.forEach((row: any) => {
        const r = row.responses || {}
        ps[row.id.toString()] = {
          p1: !!(r.phase1 && Object.keys(r.phase1).length > 0),
          p2: !!(r.phase2 && Object.keys(r.phase2).length > 0),
          p3: !!(r.phase3 && r.phase3.length > 0),
        }
        if (row.submitted) submittedIds.push(row.id.toString())
      })
      setPhaseStatus(ps)
      setSubmittedBrainIds(submittedIds)
    } else {
      setBrains([])
    }
  }

  useEffect(() => {
    if (user) fetchAssessments(user.id)
  }, [user])

  // ── CREATE MISSING CARDS after credits load ──
  const createMissingCards = async (userId: string, creditCount: number) => {
    if (creditCount <= 0) return
    if (cardsCreatedRef.current) return
    cardsCreatedRef.current = true
    const { data } = await supabase
      .from('assessments')
      .select('id')
      .eq('user_id', userId)
    const existing = data?.length || 0
    const missing = creditCount - existing
    if (missing <= 0) {
      cardsCreatedRef.current = false
      return
    }
    const inserts = Array.from({ length: missing }, () => ({
      user_id: userId,
      user_email: userEmail || null,
      user_name: displayName || null,
      responses: { phase1: {}, phase2: {}, phase3: '' },
      phase2_complete: false,
      brain_name: 'Second Brain',
    }))
    await supabase.from('assessments').insert(inserts)
    await fetchAssessments(userId)
    cardsCreatedRef.current = false
  }

  // ── RENAME BRAIN ──
  const handleRenameBrain = async (brainId: string) => {
    if (!editingBrainName.trim()) return
    setSavingBrainName(true)
    if (brainId === 'local') {
      localStorage.setItem('phase1_brain_name', editingBrainName.trim())
      setPendingBrain(prev => prev ? { ...prev, name: editingBrainName.trim() } : null)
    } else {
      const { error } = await supabase
        .from('assessments')
        .update({ brain_name: editingBrainName.trim() })
        .eq('id', parseInt(brainId))
      if (!error && user) {
        await fetchAssessments(user.id)
      }
    }
    setSavingBrainName(false)
    setEditingBrainId(null)
  }

  // ── DELETE BRAIN ──
  const handleDeleteBrain = async (brainId: string) => {
    if (brainId === 'local') {
      localStorage.removeItem('phase1_results')
      localStorage.removeItem('phase1_brain_name')
      setPendingBrain(null)
    } else {
      const { error } = await supabase
        .from('assessments')
        .delete()
        .eq('id', parseInt(brainId))
      if (!error && user) {
        await fetchAssessments(user.id)
      }
    }
    setDeletingBrainId(null)
  }

  // ── ACTIVE BRAIN RENAME ──
  const handleActiveBrainRename = async (brainId: string, newName: string) => {
    const { error } = await supabase
      .from('assessments')
      .update({ brain_name: newName })
      .eq('id', parseInt(brainId))
    // Sync to second_brains (using auth client)
    const authClient = createClient()
    const { error: sbError } = await authClient
      .from('second_brains')
      .update({ name: newName })
      .eq('assessment_id', parseInt(brainId))

    if (!error && user) {
      await fetchAssessments(user.id)
    }
  }

  // ── ACTIVE BRAIN COLOR CHANGE ──
  const handleActiveBrainColor = async (brainId: string, color: string) => {
    const { error } = await supabase
      .from('assessments')
      .update({ card_color: color })
      .eq('id', parseInt(brainId))
    // Sync to second_brains (using auth client) - convert key to hex
    const COLOR_MAP: Record<string, string> = {
      default: '#aeaeae', slate: '#8f99a8', ocean: '#9bb4c4',
      sage: '#8a9070', sand: '#d0c078', rose: '#945c5c',
      lavender: '#2d3f4e', charcoal: '#3a3a3a',
    }
    const hexColor = COLOR_MAP[color] || color
    const authClientColor = createClient()
    const { error: sbColorErr } = await authClientColor
      .from('second_brains')
      .update({ color: hexColor })
      .eq('assessment_id', parseInt(brainId))

    if (!error && user) {
      await fetchAssessments(user.id)
    }
  }

  // ── OPEN PHASE (v2) ──
  const handleOpenPhase = async (brainId: string, phase: 1 | 2 | 3) => {
    let realId = brainId

    // If local brain — create Supabase record first
    if (brainId === 'local' && user) {
      try {
        const { data, error } = await supabase.from('assessments').insert([{
          user_id: user.id,
          user_email: user.email,
          user_name: user.user_metadata?.full_name || displayName || user.email,
          responses: { phase1: {}, phase2: {}, phase3: '' },
          phase2_complete: false,
          brain_name: localStorage.getItem('phase1_brain_name') || 'Second Brain',
        }]).select('id').single()
        if (!error && data) {
          realId = data.id.toString()
          localStorage.removeItem('phase1_results')
          localStorage.removeItem('phase1_brain_name')
          await fetchAssessments(user.id)
        }
      } catch (e) { console.error('[OpenPhase] Create error:', e) }
    }

    setActivePhaseBrainId(realId)
    setActivePhase(phase)
    window.scrollTo(0, 0)
  }

  // ── EXIT PHASE (v2) ──
  const handleExitPhase = () => {
    setActivePhase(null)
    setActivePhaseBrainId(null)
  }

  // ── COMPLETE PHASE 1 (v2) ──
  const handleCompletePhase1 = async (data: Record<string, string | string[]>) => {
    if (!activePhaseBrainId || !user) return
    try {
      const { data: existing } = await supabase.from('assessments').select('responses').eq('id', parseInt(activePhaseBrainId)).single()
      const merged = { ...(existing?.responses || {}), phase1: data }
      await supabase.from('assessments').update({ responses: merged, submitted: false }).eq('id', parseInt(activePhaseBrainId))
      setSubmittedBrainIds(prev => prev.filter(id => id !== activePhaseBrainId))
      await fetchAssessments(user.id)
      handleExitPhase()
    } catch (e) { console.error('[Phase1] Save error:', e) }
  }

  // ── COMPLETE PHASE 2 (v2) ──
  const handleCompletePhase2V2 = async (data: Record<string, string | string[]>) => {
    if (!activePhaseBrainId || !user) return
    try {
      const { data: existing } = await supabase.from('assessments').select('responses').eq('id', parseInt(activePhaseBrainId)).single()
      const merged = { ...(existing?.responses || {}), phase2: data }
      await supabase.from('assessments').update({ responses: merged, submitted: false }).eq('id', parseInt(activePhaseBrainId))
      setSubmittedBrainIds(prev => prev.filter(id => id !== activePhaseBrainId))
      await fetchAssessments(user.id)
      handleExitPhase()
    } catch (e) { console.error('[Phase2] Save error:', e) }
  }

  // ── COMPLETE PHASE 3 (v2) ──
  const handleCompletePhase3 = async (text: string) => {
    if (!activePhaseBrainId || !user) return
    try {
      const { data: existing } = await supabase.from('assessments').select('responses').eq('id', parseInt(activePhaseBrainId)).single()
      const merged = { ...(existing?.responses || {}), phase3: text }
      await supabase.from('assessments').update({ responses: merged, submitted: false }).eq('id', parseInt(activePhaseBrainId))
      setSubmittedBrainIds(prev => prev.filter(id => id !== activePhaseBrainId))
      await fetchAssessments(user.id)
      handleExitPhase()
    } catch (e) { console.error('[Phase3] Save error:', e) }
  }

  // ── EXIT PHASE 2 (no save) ──
  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string; message: string; sender: string;
    direction: 'incoming' | 'outgoing'; timestamp: Date;
  }>>([
    {
      id: 'welcome',
      message: supportChatContent.system.welcome,
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
        message: supportChatContent.mockResponses[responseIndex % supportChatContent.mockResponses.length],
        sender: 'assistant',
        direction: 'incoming' as const,
        timestamp: new Date(),
      }])
      setResponseIndex(prev => prev + 1)
    }, 800 + Math.random() * 400)
  }, [responseIndex])

  // Save name to Supabase
  async function handleSaveName() {
    if (!userName.trim()) return
    setSavingName(true)
    const { error } = await updateDisplayName(userName.trim())
    if (error) console.error('Failed to update name:', error)
    setSavingName(false)
    setEditName(false)
  }

  function go(s: Section) {
    setSection(s)
    setBrain(null)
    window.scrollTo(0, 0)
  }

  function openBrain(b: SecondBrain) {
    const authClient = createClient()
    authClient.auth.getSession().then(({ data: { session } }) => {
      if (!session) { alert('No session - please log in again'); return }
      const url = 'https://secondbrain-chat.vercel.app' +
        '?access_token=' + encodeURIComponent(session.access_token) +
        '&refresh_token=' + encodeURIComponent(session.refresh_token) +
        '&assessment_id=' + encodeURIComponent(b.id)
      window.location.href = url
    })
  }

  const activeNav = (section === 'detail' || section === 'new') ? 'dashboard' : section
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const activeBrains = brains.filter((b) => b.status === 'active')
  const incompleteBrains = [
    ...(pendingBrain ? [pendingBrain] : []),
    ...brains.filter((b) => b.status === 'setup'),
  ]

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : ''

  const accessMethod = user?.app_metadata?.provider === 'google' ? 'Google OAuth' : 'Magic Link'

  // ═══════════════════════════════════════════════════════
  // PHASE RENDERS (v2)
  // ═══════════════════════════════════════════════════════
  if (activePhase === 1 && activePhaseBrainId) {
    return (
      <PhaseAssessment
        phaseNumber={1}
        phaseLabel="Phase 1 — Identity & Direction"
        introText={'This phase captures your operating context.\nAnswer each question to define your starting point.'}
        questionsMap={phase1QuestionsMap}
        startQuestionId={phase1StartQuestionId}
        onComplete={handleCompletePhase1}
        onExit={handleExitPhase}
      />
    )
  }

  if (activePhase === 2 && activePhaseBrainId) {
    return (
      <PhaseAssessment
        phaseNumber={2}
        phaseLabel="Phase 2 — Execution & Style"
        introText={'This phase defines how your Second Brain should operate.\nYour answers shape the logic and the output style.'}
        questionsMap={phase2QuestionsMap}
        startQuestionId={phase2StartQuestionId}
        onComplete={handleCompletePhase2V2}
        onExit={handleExitPhase}
      />
    )
  }

  if (activePhase === 3 && activePhaseBrainId) {
    return (
      <Phase3Chat
        onComplete={handleCompletePhase3}
        onExit={handleExitPhase}
      />
    )
  }

  return (
    <div className="bg-white min-h-screen">
      {/* ═══════════════════════════════════════════════════════
          DESKTOP TAB BAR
          ═══════════════════════════════════════════════════════ */}
      <div
        className="hidden md:block fixed top-[67px] left-0 right-0 z-40 bg-white"
      >
        <div className="max-w-[880px] mx-auto px-10 xl:px-12 flex items-center gap-6 pt-5 pb-3">
          {clientTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => go(tab.key as Section)}
              className={`
                font-ui text-[13px] bg-transparent border-0
                cursor-pointer transition-opacity
                ${activeNav === tab.key
                  ? 'font-medium text-[#1a1a1a] opacity-90'
                  : 'font-normal text-[#1a1a1a] opacity-50 hover:opacity-80'
                }
              `}
            >
              {tab.label}
            </button>
          ))}

          <button
            onClick={signOut}
            className="font-ui text-[13px] text-[#1a1a1a] font-normal bg-transparent border-0
                       cursor-pointer opacity-70 hover:opacity-100 transition-opacity ml-auto"
          >
            sign out
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          MOBILE TAB BAR — 4 text tabs, no icons
          ═══════════════════════════════════════════════════════ */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-white
                   flex items-center justify-evenly md:hidden z-50
                   border-t border-black/[0.06]"
      >
        {clientTabs.map((item) => (
          <button
            key={item.key}
            onClick={() => go(item.key as Section)}
            className={`
              py-4 px-2 flex items-center justify-center cursor-pointer
              bg-transparent border-0 transition-opacity duration-300
              font-ui text-[10px] font-medium tracking-widest uppercase
              ${activeNav === item.key ? 'text-[#1a1a1a] opacity-85' : 'text-[#1a1a1a] opacity-30'}
            `}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* ═══════════════════════════════════════════════════════
          CONTENT
          ═══════════════════════════════════════════════════════ */}
      <div className="pt-[67px] md:pt-[120px] pb-[72px] md:pb-12">

        {/* ─────────────────────────────────────────────────
            LOADING STATE
            ───────────────────────────────────────────────── */}
        {loading && (
          <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 180px)' }}>
            <p className="font-ui text-[13px] opacity-45">Loading…</p>
          </div>
        )}

        {/* ─────────────────────────────────────────────────
            DASHBOARD
            ───────────────────────────────────────────────── */}
        {!loading && section === 'dashboard' && (
          <Container>
            {/* Client name */}
            <h1 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em] pt-10 md:pt-14 mb-12">
              {userName}
            </h1>

            {/* ── All brain cards — active first, then in preparation, then incomplete (fixed order) ── */}
            {brains.length > 0 && (() => {
              const allCards = [...(pendingBrain ? [pendingBrain] : []), ...brains]
              const active = allCards.filter(b => b.status === 'active')
              const inPrep = allCards.filter(b => b.status !== 'active' && submittedBrainIds.includes(b.id))
              const incomplete = allCards.filter(b => b.status !== 'active' && !submittedBrainIds.includes(b.id))
              const ordered = [...active, ...inPrep, ...incomplete]

              const phaseBtn = (label: string, done: boolean, onClick: () => void) => (
                <button
                  onClick={onClick}
                  className="flex-1 md:flex-none md:w-[110px] border-0 cursor-pointer transition-colors font-ui font-medium tracking-widest uppercase rounded-[4px]"
                  style={{
                    backgroundColor: done ? 'rgba(26,26,26,0.55)' : 'rgba(26,26,26,0.10)',
                    color: done ? '#ffffff' : 'rgba(26,26,26,0.65)',
                    padding: '8px 4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                  }}
                >
                  <span style={{
                    width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                    backgroundColor: done ? '#34c759' : 'rgba(26,26,26,0.20)',
                    display: 'block',
                  }} />
                  <span style={{ fontSize: '10px', lineHeight: 1 }}>{label}</span>
                </button>
              )

              return (
                <div className="flex flex-col gap-4 mb-5">
                  {ordered.map((b) => {
                    if (b.status === 'active') {
                      return (
                        <SecondBrainCard
                          key={b.id}
                          brain={b}
                          onOpen={openBrain}
                          onRename={handleActiveBrainRename}
                          onColorChange={handleActiveBrainColor}
                        />
                      )
                    }
                    const ps = phaseStatus[b.id] || { p1: false, p2: false, p3: false }
                    const allDone = ps.p1 && ps.p2 && ps.p3
                    const isSubmitted = submittedBrainIds.includes(b.id)
                    return (
                      <div
                        key={b.id}
                        className="rounded-[12px] p-6 h-[220px] md:h-[88px] overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6"
                        style={{ background: isSubmitted
                          ? 'linear-gradient(to bottom, #d8d8d8 0%, #b8b8b8 100%)'
                          : 'linear-gradient(to bottom, #ededed 0%, #c9c9c9 100%)' }}
                      >
                        <div className="flex-shrink-0 opacity-15">
                          {incompleteSphereData ? (
                            <Lottie animationData={incompleteSphereData} loop autoplay style={{ width: 40, height: 40 }} />
                          ) : (
                            <div className="w-[40px] h-[40px] rounded-full bg-black/[0.06]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/45 mb-1">
                            Second Brain {b.num}
                          </p>
                          <div className="h-[28px]" />
                        </div>
                        <div className="flex-shrink-0 mt-auto md:mt-0 w-full md:w-auto">
                          {isSubmitted ? (
                            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.65)', textAlign: 'right' as const }}>
                              In preparation
                            </div>
                          ) : allDone ? (
                            <div className="flex gap-2 w-full md:w-auto">
                              <button
                                onClick={async () => {
                                  if (!user) return
                                  await supabase.from('assessments').update({ submitted: true }).eq('id', parseInt(b.id))
                                  setSubmittedBrainIds(prev => [...prev, b.id])
                                }}
                                className="flex-1 md:flex-none md:w-[169px] py-2.5 px-6 rounded-[4px] border-0 cursor-pointer font-ui text-[10px] font-medium tracking-widest uppercase transition-colors"
                                style={{ backgroundColor: 'rgba(26,26,26,0.55)', color: '#ffffff' }}
                              >
                                Submit
                              </button>
                              <button
                                onClick={async () => {
                                  if (!user) return
                                  await supabase.from('assessments').update({
                                    submitted: false,
                                    responses: { phase1: {}, phase2: {}, phase3: '' },
                                  }).eq('id', parseInt(b.id))
                                  setSubmittedBrainIds(prev => prev.filter(id => id !== b.id))
                                  setPhaseStatus(prev => ({ ...prev, [b.id]: { p1: false, p2: false, p3: false } }))
                                }}
                                className="flex-1 md:flex-none md:w-[169px] py-2.5 px-6 rounded-[4px] border-0 cursor-pointer font-ui text-[10px] font-medium tracking-widest uppercase transition-colors"
                                style={{ backgroundColor: 'rgba(26,26,26,0.06)', color: 'rgba(26,26,26,0.50)' }}
                              >
                                Redo phases
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2 w-full md:w-auto">
                              {phaseBtn('Phase 1', ps.p1, () => handleOpenPhase(b.id, 1))}
                              {phaseBtn('Phase 2', ps.p2, () => handleOpenPhase(b.id, 2))}
                              {phaseBtn('Phase 3', ps.p3, () => handleOpenPhase(b.id, 3))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })()}

            {/* New brain */}
            <button
              onClick={() => router.push('/start')}
              className="w-full rounded-[12px] bg-[#f7f7f7] hover:bg-[#f0f0f0]
                         transition-colors duration-200
                         flex flex-col items-center justify-center h-[220px] md:h-[88px]
                         cursor-pointer border-0"
            >
              <span className="text-[72px] leading-none font-thin text-[#1a1a1a]/20 select-none md:hidden">+</span>
              <span className="font-ui text-[10px] font-medium tracking-widest uppercase text-[#1a1a1a]/35 mt-2 md:hidden">
                New Second Brain
              </span>
              {/* Desktop: inline compact */}
              <span className="hidden md:flex items-center gap-3">
                <span className="text-[22px] font-thin text-[#1a1a1a]/25 leading-none">+</span>
                <span className="font-ui text-[10px] font-medium tracking-widest uppercase text-[#1a1a1a]/40">
                  New Second Brain
                </span>
              </span>
            </button>
          </Container>
        )}

        {/* ─────────────────────────────────────────────────
            DETAIL
            ───────────────────────────────────────────────── */}
        {!loading && section === 'detail' && brain && (
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

              <p className="font-ui text-[10px] font-medium tracking-widest uppercase opacity-45 mb-2">
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
                <p className="text-[17px] leading-[1.45] opacity-75 max-w-[640px]">
                  {brain.context}
                </p>
              </Container>
            </section>

            {/* Execution */}
            <section className="pb-10 md:pb-14">
              <Container>
                <div className="bg-[#f7f7f7] rounded-[4px] p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-40 mb-4">
                        Platforms
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {brain.platforms.map((p) => (
                          <span
                            key={p}
                            className="text-[17px] opacity-75 px-4 py-2
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

        {/* ─────────────────────────────────────────────────
            NEW SECOND BRAIN
            ───────────────────────────────────────────────── */}
        {!loading && section === 'new' && (
          <Container>
            <button
              onClick={() => go('dashboard')}
              className="font-ui text-[11px] font-medium tracking-widest uppercase
                         opacity-40 hover:opacity-70 transition-opacity cursor-pointer
                         bg-transparent border-0 p-0 mb-8 block"
            >
              ← Dashboard
            </button>

            <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-45 mb-8">
              {sections.newBrain.label}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
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
                    <p className="text-[32px] font-normal tracking-[-0.01em] mb-4">
                      {plan.price}
                    </p>
                    <div className="mb-auto">
                      {plan.lines.map((line, i) => (
                        <p key={i} className="text-[17px] leading-[1.4] opacity-65">
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
                <p className="text-[14px] opacity-60 mb-4">{enterprise.brains}</p>
                <p className="text-[28px] font-normal tracking-[-0.01em] mb-5">
                  {enterprise.price}
                </p>
                <div className="mb-5">
                  {enterprise.lines.map((line, i) => (
                    <p key={i} className="text-[17px] leading-[1.4] opacity-65">
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

        {/* ─────────────────────────────────────────────────
            SUBSCRIPTION / GENERIC AI
            ───────────────────────────────────────────────── */}
        {!loading && section === 'subscription' && (
          <Container>
            {/* Badge */}
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-60 pt-10 md:pt-14 mb-8">
              {sections.subscription.badge}
            </p>

            {/* Title */}
            <h2 className="text-[28px] md:text-[36px] font-normal leading-[1.05] tracking-[-0.01em] mb-6 max-w-[560px]">
              {sections.subscription.title}
            </h2>

            {/* Intro */}
            <div className="mb-10 max-w-[560px]">
              {sections.subscription.intro.map((line, i) => (
                <p key={i} className="text-[20px] leading-[1.6] opacity-65 mb-3">
                  {line}
                </p>
              ))}
            </div>

            {/* Launch period callout */}
            <div className="bg-[#f7f7f7] rounded-[4px] px-6 py-5 mb-10">
              <p className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase opacity-40 mb-2">
                {sections.subscription.launch.label}
              </p>
              <p className="text-[19px] leading-[1.5] opacity-80 mb-2">
                {sections.subscription.launch.body}
              </p>
              <p className="text-[17px] leading-[1.5] opacity-55">
                {sections.subscription.launch.note}
              </p>
            </div>

            {/* Subscription plan cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {sections.subscription.plans.map((plan) => (
                <div
                  key={plan.name}
                  className="rounded-[4px] p-6 flex flex-col min-h-[280px]"
                  style={{ background: 'linear-gradient(to bottom, #f7f7f7, #efefef)' }}
                >
                  {/* Name — fixed height block so price stays aligned */}
                  <div className="mb-5" style={{ minHeight: 44 }}>
                    <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-1">
                      {plan.name}
                    </p>
                    <p className="text-[16px] opacity-60">{plan.subtitle}</p>
                  </div>

                  {/* Price — always at same vertical position */}
                  <div className="mb-5">
                    <span className="text-[32px] font-normal tracking-[-0.02em] opacity-90">{plan.monthly}</span>
                    <span className="text-[14px] opacity-45 ml-1">/ mo</span>
                    <p className="text-[15px] opacity-55 mt-1">{plan.yearly} / year</p>
                  </div>

                  {/* Features */}
                  <div className="mb-auto">
                    {plan.features.map((f, i) => (
                      <p key={i} className="text-[17px] leading-[1.5] opacity-70 mb-2">
                        {f}
                      </p>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-6">
                    <button
                      className="bg-[#252525] text-white border-0 rounded-[4px]
                                 px-6 py-2.5 font-ui text-[10px] font-medium
                                 tracking-widest uppercase cursor-pointer
                                 hover:opacity-80 transition-opacity"
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison table */}
            <p className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase opacity-40 mb-4">
              {sections.subscription.comparison.label}
            </p>
            <div className="bg-[#f7f7f7] rounded-[4px] overflow-hidden mb-10">
              {/* Header */}
              <div className="flex px-6 py-4 border-b border-black/[0.06]">
                <div className="flex-1" />
                {sections.subscription.comparison.columns.map((col) => (
                  <div key={col} className="w-[110px] text-center">
                    <p className="font-ui text-[11px] font-medium tracking-[0.08em] uppercase opacity-50">
                      {col}
                    </p>
                  </div>
                ))}
              </div>
              {/* Rows */}
              {sections.subscription.comparison.rows.map((row, i) => (
                <div
                  key={i}
                  className={`flex items-center px-6 py-4
                    ${i < sections.subscription.comparison.rows.length - 1 ? 'border-b border-black/[0.05]' : ''}`}
                >
                  <div className="flex-1">
                    <p className="text-[17px] opacity-75">{row.label}</p>
                  </div>
                  <div className="w-[110px] flex justify-center">
                    {row.generic
                      ? <span className="text-[#1a1a1a] opacity-70 text-[18px]">✓</span>
                      : <span className="text-[#1a1a1a] opacity-20 text-[18px]">–</span>
                    }
                  </div>
                  <div className="w-[110px] flex justify-center">
                    {row.secondBrain
                      ? <span className="text-[#1a1a1a] opacity-70 text-[18px]">✓</span>
                      : <span className="text-[#1a1a1a] opacity-20 text-[18px]">–</span>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Structural principle */}
            <div className="max-w-[480px] pb-10 md:pb-14">
              {sections.subscription.principle.map((line, i) => (
                <p key={i} className="text-[19px] leading-[1.6] opacity-60 mb-2">
                  {line}
                </p>
              ))}
            </div>
          </Container>
        )}

        {/* ─────────────────────────────────────────────────
            SUPPORT
            ───────────────────────────────────────────────── */}
        {!loading && section === 'support' && (
          <div className="fixed top-[120px] md:top-[120px] left-0 right-0 bottom-0 pb-[52px] md:pb-0 bg-white">
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
              .ps__rail-x, .ps__rail-y, .ps__thumb-x, .ps__thumb-y { display: none !important; }
              .cs-main-container { border: none !important; background: transparent !important; height: 100% !important; border-radius: 4px !important; }
              .cs-chat-container { background: transparent !important; }
              .cs-message-list { background: transparent !important; padding: 1rem !important; }
              @media (min-width: 768px) { .cs-message-list { padding: 1.5rem !important; } }
              .cs-message-list__scroll-wrapper { padding: 0 !important; }
              .cs-message { margin-bottom: 0.5rem !important; }
              .cs-message__content { padding: 10px 16px !important; font-size: 16px !important; line-height: 1.45 !important; font-family: inherit !important; }
              @media (min-width: 768px) { .cs-message__content { padding: 12px 18px !important; } }
              .cs-message--incoming .cs-message__content { background: #f0f0f0 !important; color: #1a1a1a !important; border: none !important; border-radius: 18px 18px 18px 4px !important; box-shadow: none !important; }
              .cs-message--outgoing .cs-message__content { background: #1a1a1a !important; color: white !important; border: none !important; border-radius: 18px 18px 4px 18px !important; }
              .cs-message-input { background: transparent !important; border-top: none !important; padding: 0.5rem 1rem !important; padding-bottom: 16px !important; }
              @media (min-width: 768px) { .cs-message-input { padding: 1rem 1.5rem !important; } }
              .cs-message-input__content-editor-wrapper { background: #f0f0f0 !important; border-radius: 24px !important; padding: 8px 16px !important; border: none !important; box-shadow: none !important; }
              @media (min-width: 768px) { .cs-message-input__content-editor-wrapper { padding: 10px 18px !important; } }
              .cs-message-input__content-editor { background: transparent !important; color: #1a1a1a !important; font-size: 16px !important; font-family: inherit !important; line-height: 1.4 !important; }
              .cs-message-input__content-editor:focus { outline: none !important; box-shadow: none !important; }
              .cs-message-input__content-editor-container { background: transparent !important; border: none !important; }
              .cs-message-input__content-editor[data-placeholder]:empty:before { color: #999 !important; font-size: 16px !important; }
              .cs-button--send { background: #1a1a1a !important; color: white !important; border-radius: 50% !important; width: 36px !important; height: 36px !important; min-width: 36px !important; margin-left: 8px !important; border: none !important; display: flex !important; align-items: center !important; justify-content: center !important; }
              @media (min-width: 768px) { .cs-button--send { width: 40px !important; height: 40px !important; min-width: 40px !important; margin-left: 10px !important; } }
              .cs-button--send:hover { background: #333 !important; }
              .cs-button--send:disabled { opacity: 0.2 !important; }
              .cs-button--send svg { fill: white !important; width: 16px !important; height: 16px !important; }
              .cs-typing-indicator { background: transparent !important; border: none !important; padding: 4px 16px !important; }
              .cs-typing-indicator__text { color: rgba(0, 0, 0, 0.35) !important; font-size: 13px !important; }
              .cs-typing-indicator__dot { display: none !important; }
              .cs-message-input__content-editor-wrapper:focus-within { border: none !important; outline: none !important; box-shadow: none !important; background: #e8e8e8 !important; }
              @media (max-width: 767px) { .cs-main-container { border-radius: 0 !important; } }
            `}</style>
          </div>
        )}

        {/* ─────────────────────────────────────────────────
            ACCOUNT
            ───────────────────────────────────────────────── */}
        {!loading && section === 'account' && (
          <Container>
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-60 pt-10 md:pt-14 mb-8">
              Account
            </p>

            <div className="bg-[#f7f7f7] rounded-[4px] overflow-hidden">
              {/* Name */}
              <div
                className="px-6 md:px-8 py-[18px] flex justify-between items-center
                           border-b border-black/[0.04]"
              >
                <div className="flex-1">
                  <p className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase opacity-45 mb-1.5">
                    Name
                  </p>
                  {editName ? (
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      autoFocus
                      className="text-[16px] font-normal border-0 border-b border-black/20
                                 bg-transparent outline-none w-full md:w-[300px] rounded-none"
                    />
                  ) : (
                    <p className="text-[17px] opacity-85">{userName}</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (editName) {
                      handleSaveName()
                    } else {
                      setEditName(true)
                    }
                  }}
                  disabled={savingName}
                  className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase
                             opacity-40 hover:opacity-70 transition-opacity cursor-pointer
                             bg-transparent border-0 ml-4"
                >
                  {savingName ? 'Saving…' : editName ? 'Save' : 'Edit'}
                </button>
              </div>

              {/* Email */}
              <div
                className="px-6 md:px-8 py-[18px] flex justify-between items-center
                           border-b border-black/[0.04]"
              >
                <div className="flex-1">
                  <p className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase opacity-45 mb-1.5">
                    Email
                  </p>
                  <p className="text-[17px] opacity-85">{userEmail}</p>
                </div>
              </div>

              {/* Member since */}
              <div className="px-6 md:px-8 py-[18px] border-b border-black/[0.04]">
                <p className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase opacity-45 mb-1.5">
                  Member since
                </p>
                <p className="text-[17px] opacity-85">
                  {memberSince}{brains.length > 0 ? ` · ${brains.length} Second Brain${brains.length !== 1 ? 's' : ''} active` : ''}
                </p>
              </div>

              {/* Access method */}
              <div className="px-6 md:px-8 py-[18px] border-b border-black/[0.04]">
                <p className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase opacity-45 mb-1.5">
                  Access method
                </p>
                <p className="text-[17px] opacity-85">
                  {accessMethod}
                </p>
              </div>

              {/* Session */}
              <div className="px-6 md:px-8 py-[18px] flex justify-between items-center">
                <div>
                  <p className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase opacity-45 mb-1.5">
                    Session
                  </p>
                  <p className="text-[17px] opacity-85">Active</p>
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

            {/* ── Billing ── */}
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-60 pt-10 mb-6">
              Billing &amp; Licenses
            </p>

            {billing.length > 0 ? (
              <>
                {/* Desktop */}
                <div className="hidden md:block bg-[#f7f7f7] rounded-[4px] overflow-hidden">
                  {billing.map((row, i) => (
                    <div
                      key={row.id}
                      className={`flex justify-between items-center px-6 py-[18px]
                        ${i < billing.length - 1 ? 'border-b border-black/[0.04]' : ''}`}
                    >
                      <div>
                        <p className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase opacity-45 mb-1.5">
                          {row.date}
                        </p>
                        <p className="text-[17px] opacity-80">{row.item}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[15px]">{row.amount}</p>
                        <p className="font-ui text-[10px] font-medium tracking-[0.08em] uppercase opacity-45 mt-1">
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
                      <p className="font-ui text-[10px] font-medium tracking-widest uppercase opacity-45 mb-3">
                        {row.date}
                      </p>
                      <p className="text-[17px] opacity-80 mb-2">{row.item}</p>
                      <div className="flex justify-between items-end">
                        <p className="text-[22px] font-normal">{row.amount}</p>
                        <span className="font-ui text-[10px] font-medium tracking-widest uppercase opacity-45">
                          {row.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-[#f7f7f7] rounded-[4px] p-8 md:p-12">
                <p className="text-[15px] opacity-60 text-center">
                  No billing records yet.
                </p>
              </div>
            )}
          </Container>
        )}
      </div>
    </div>
  )
}
