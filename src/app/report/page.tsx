'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { convictionLabel, timeHorizonLabel } from '@/lib/decisions'

interface Decision {
  id: string; decisionText: string; conviction: number; timeHorizon: string;
  emotionalState: string; hasPrecedent: boolean; createdAt: string;
  reflection?: {
    reasoningSound: string; outcomeWin?: boolean; whatHappened: string
  }
}

export default function ReportPage() {
  const router = useRouter()
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/me').then(r => r.ok ? r.json() : null),
      fetch('/api/decisions').then(r => r.ok ? r.json() : []),
    ]).then(([u, d]) => {
      if (!u) { router.push('/auth/login'); return }
      setDecisions(d)
      setLoading(false)
    })
  }, [router])

  if (loading) return <LoadingScreen />

  const reflected = decisions.filter(d => d.reflection)
  const totalDecisions = decisions.length

  if (totalDecisions < 3 || reflected.length < 1) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
        <div className="text-center max-w-sm">
          <p className="text-5xl mb-4">📊</p>
          <h2 className="text-xl font-bold mb-3">Not enough training data yet</h2>
          <p className="text-sm opacity-50 mb-6">Log 3+ decisions and reflect on 1+ to unlock your training report.</p>
          <Link href="/dashboard" className="text-sm underline opacity-60">Back to gym</Link>
        </div>
      </div>
    )
  }

  // Conviction analysis
  const highConviction = reflected.filter(d => d.conviction >= 8)
  const midConviction = reflected.filter(d => d.conviction >= 6 && d.conviction < 8)
  const highWinRate = highConviction.length > 0
    ? Math.round(highConviction.filter(d => d.reflection?.outcomeWin).length / highConviction.length * 100)
    : null
  const midWinRate = midConviction.length > 0
    ? Math.round(midConviction.filter(d => d.reflection?.outcomeWin).length / midConviction.length * 100)
    : null

  // Precedent analysis
  const withPrecedent = reflected.filter(d => d.hasPrecedent)
  const freshDecisions = reflected.filter(d => !d.hasPrecedent)
  const precedentWinRate = withPrecedent.length > 0
    ? Math.round(withPrecedent.filter(d => d.reflection?.outcomeWin).length / withPrecedent.length * 100)
    : null
  const freshWinRate = freshDecisions.length > 0
    ? Math.round(freshDecisions.filter(d => d.reflection?.outcomeWin).length / freshDecisions.length * 100)
    : null

  // Emotional state analysis
  const emotionGroups: Record<string, { total: number; wins: number }> = {}
  for (const d of reflected) {
    const e = d.emotionalState
    if (!emotionGroups[e]) emotionGroups[e] = { total: 0, wins: 0 }
    emotionGroups[e].total++
    if (d.reflection?.outcomeWin) emotionGroups[e].wins++
  }

  // Reasoning quality
  const skillDecisions = reflected.filter(d => d.reflection?.reasoningSound === 'yes')
  const partialDecisions = reflected.filter(d => d.reflection?.reasoningSound === 'partial')
  const luckDecisions = reflected.filter(d => d.reflection?.reasoningSound === 'no')

  // Training plan
  const convictionAdvice = highWinRate !== null && midWinRate !== null
    ? highWinRate > midWinRate
      ? 'Your high-conviction calls outperform. Your instincts are calibrated — trust them, but keep logging to confirm.'
      : 'Medium-conviction decisions outperform your high-conviction ones. This is common: certainty breeds blind spots. Train medium-conviction judgment.'
    : 'Log more reflected decisions to see your conviction calibration.'

  const bestEmotion = Object.entries(emotionGroups)
    .filter(([, v]) => v.total >= 2)
    .sort(([, a], [, b]) => b.wins / b.total - a.wins / a.total)[0]

  const worstEmotion = Object.entries(emotionGroups)
    .filter(([, v]) => v.total >= 2)
    .sort(([, a], [, b]) => a.wins / a.total - b.wins / b.total)[0]

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <header className="border-b px-6 py-4 flex items-center justify-between max-w-3xl mx-auto" style={{ borderColor: 'var(--border)' }}>
        <Link href="/dashboard" className="text-sm opacity-40 hover:opacity-70">← Dashboard</Link>
        <span className="font-bold text-sm" style={{ color: 'var(--accent)' }}>TRAINING REPORT</span>
        <span className="text-xs opacity-30">{new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-10">
        {/* Intro */}
        <section>
          <p className="text-xs font-mono uppercase tracking-widest opacity-30 mb-4">Where judgment trains</p>
          <p className="text-lg leading-relaxed opacity-70">
            Based on <strong className="text-white">{totalDecisions} logged decisions</strong> and{' '}
            <strong className="text-white">{reflected.length} reflections</strong>, here&apos;s where your judgment is developing — and where it needs work.
          </p>
        </section>

        {/* Conviction patterns */}
        <ReportSection title="01 — Conviction Patterns" subtitle="Where does your confidence serve you?">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <StatBox
              label={`High conviction (8-10)`}
              value={highConviction.length > 0 ? `${highWinRate ?? '—'}%` : '—'}
              sub={`${highConviction.length} decisions`}
              highlight={highWinRate !== null && midWinRate !== null && highWinRate > midWinRate}
            />
            <StatBox
              label="Medium conviction (6-7)"
              value={midConviction.length > 0 ? `${midWinRate ?? '—'}%` : '—'}
              sub={`${midConviction.length} decisions`}
              highlight={midWinRate !== null && highWinRate !== null && midWinRate > highWinRate}
            />
          </div>
          <InsightBox>{convictionAdvice}</InsightBox>
        </ReportSection>

        {/* Precedent patterns */}
        <ReportSection title="02 — Precedent Patterns" subtitle="Does experience help or bias you?">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <StatBox
              label="With precedent"
              value={withPrecedent.length > 0 ? `${precedentWinRate ?? '—'}%` : '—'}
              sub={`${withPrecedent.length} decisions`}
            />
            <StatBox
              label="Fresh decisions"
              value={freshDecisions.length > 0 ? `${freshWinRate ?? '—'}%` : '—'}
              sub={`${freshDecisions.length} decisions`}
            />
          </div>
          <InsightBox>
            {withPrecedent.length < 2 || freshDecisions.length < 2
              ? 'Log more decisions of both types to see your precedent pattern.'
              : precedentWinRate !== null && freshWinRate !== null && precedentWinRate > freshWinRate
              ? 'Your precedent-backed decisions outperform. Your experience is an edge — the question is knowing when context has changed.'
              : 'Your fresh decisions outperform precedent-backed ones. Models do pattern matching. Your edge is knowing when past context doesn\'t apply.'}
          </InsightBox>
        </ReportSection>

        {/* Time horizon */}
        <ReportSection title="03 — Time Horizon" subtitle="When do you judge?">
          <div className="space-y-2">
            {['one_month', 'three_months', 'six_months', 'one_year', 'two_plus_years'].map(th => {
              const count = decisions.filter(d => d.timeHorizon === th).length
              if (count === 0) return null
              return (
                <div key={th} className="flex items-center gap-3">
                  <span className="text-sm opacity-50 w-24">{timeHorizonLabel(th as never)}</span>
                  <div className="flex-1 h-2 rounded-full" style={{ background: 'var(--border)' }}>
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${(count / totalDecisions) * 100}%`, background: 'var(--accent)' }}
                    />
                  </div>
                  <span className="text-sm opacity-50 w-6 text-right">{count}</span>
                </div>
              )
            })}
          </div>
          <InsightBox className="mt-4">
            You judge early. The hardest judgment call is patience. If you&apos;re consistently choosing shorter time horizons, practice committing to longer ones.
          </InsightBox>
        </ReportSection>

        {/* Emotional bias */}
        <ReportSection title="04 — Emotional Bias" subtitle="Which emotions help your judgment?">
          {Object.keys(emotionGroups).length < 2 ? (
            <p className="text-sm opacity-40">Log decisions with varied emotional states to see your bias pattern.</p>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {Object.entries(emotionGroups).map(([emotion, { total, wins }]) => (
                  <div key={emotion} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{emotion}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${total > 0 ? (wins / total) * 100 : 0}%`, background: 'var(--accent)' }}
                        />
                      </div>
                      <span className="text-xs opacity-40 w-16 text-right">
                        {total > 0 ? Math.round((wins / total) * 100) : 0}% wins · {total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <InsightBox>
                {bestEmotion && worstEmotion && bestEmotion[0] !== worstEmotion[0]
                  ? `You perform best when ${bestEmotion[0]} and worst when ${worstEmotion[0]}. Understanding this pattern is judgment.`
                  : 'More data needed to detect your emotional bias pattern.'}
              </InsightBox>
            </>
          )}
        </ReportSection>

        {/* Skill vs luck */}
        <ReportSection title="05 — Skill vs. Luck" subtitle="Separate them. That's judgment.">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <StatBox label="Reasoned well" value={String(skillDecisions.length)} sub="decisions" />
            <StatBox label="Some blind spots" value={String(partialDecisions.length)} sub="decisions" />
            <StatBox label="Lucky / unlucky" value={String(luckDecisions.length)} sub="decisions" />
          </div>
          <InsightBox>
            {skillDecisions.length > luckDecisions.length
              ? 'You attribute most outcomes to reasoning, not luck. Keep testing this honestly — the market will correct overconfidence.'
              : luckDecisions.length > skillDecisions.length
              ? 'You recognise luck when you see it. That\'s a sign of good judgment. The question is: what patterns of luck do you rely on?'
              : 'Your skill-vs-luck read is balanced. Continue reflecting honestly — this is where real judgment development happens.'}
          </InsightBox>
        </ReportSection>

        {/* Training plan */}
        <section
          className="rounded-2xl p-8 border"
          style={{ borderColor: 'var(--accent)', background: 'var(--card)' }}
        >
          <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>
            Your Judgment Gym Training Plan
          </p>
          <ul className="space-y-4 text-sm">
            <TrainingPoint n="1">
              {convictionAdvice}
            </TrainingPoint>
            <TrainingPoint n="2">
              {withPrecedent.length >= 2
                ? `You rely on precedent ${Math.round(withPrecedent.length / reflected.length * 100)}% of the time. Next time you reach for a past example, ask: what's different this time?`
                : 'Start noting when you rely on precedent. Precedent reliance is a pattern worth tracking.'}
            </TrainingPoint>
            <TrainingPoint n="3">
              {bestEmotion
                ? `Log one decision made while ${bestEmotion[0]} and one made while ${worstEmotion?.[0] ?? 'pressured'}. See if the pattern holds.`
                : 'Pay attention to your emotional state when you log. Emotional context is where judgment hides.'}
            </TrainingPoint>
            <TrainingPoint n="4">
              On your next decision, extend the time horizon by one step. You judge early — train patience.
            </TrainingPoint>
          </ul>
        </section>

        <div className="text-center pb-8">
          <Link
            href="/log"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
            style={{ background: 'var(--accent)', color: '#000' }}
          >
            🏋️ Log another decision
          </Link>
        </div>
      </main>
    </div>
  )
}

function ReportSection({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="font-bold text-lg">{title}</h2>
        <p className="text-sm opacity-40">{subtitle}</p>
      </div>
      {children}
    </section>
  )
}

function StatBox({ label, value, sub, highlight }: { label: string; value: string; sub: string; highlight?: boolean }) {
  return (
    <div
      className="rounded-xl p-4 border"
      style={{
        borderColor: highlight ? 'var(--accent)' : 'var(--border)',
        background: 'var(--card)',
      }}
    >
      <p className="text-2xl font-bold mb-1" style={{ color: highlight ? 'var(--accent)' : undefined }}>{value}</p>
      <p className="text-xs opacity-50">{label}</p>
      <p className="text-xs opacity-30">{sub}</p>
    </div>
  )
}

function InsightBox({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl p-4 border text-sm opacity-80 leading-relaxed ${className || ''}`}
      style={{ borderColor: 'var(--border)', background: 'rgba(232,255,32,0.04)' }}
    >
      {children}
    </div>
  )
}

function TrainingPoint({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="font-mono text-xs mt-0.5 opacity-40 shrink-0">{n}.</span>
      <span className="opacity-70">{children}</span>
    </li>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
      <p className="text-sm opacity-30 animate-pulse">Generating your training report...</p>
    </div>
  )
}
