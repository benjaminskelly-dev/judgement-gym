'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { timeHorizonLabel, convictionLabel, FREE_DECISION_LIMIT } from '@/lib/decisions'

interface User {
  id: string; email: string; plan: string; decisionCount: number; reflectedCount: number; pendingCount: number
}
interface Decision {
  id: string; decisionText: string; conviction: number; timeHorizon: string; emotionalState: string;
  createdAt: string; dueReflectionDate: string; reflectionStatus: string; reflection?: { outcomeWin?: boolean }
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <DashboardContent />
    </Suspense>
  )
}

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<User | null>(null)
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [showUpgraded, setShowUpgraded] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (searchParams.get('upgraded')) setShowUpgraded(true)
  }, [searchParams])

  useEffect(() => {
    Promise.all([
      fetch('/api/me').then(r => r.ok ? r.json() : null),
      fetch('/api/decisions').then(r => r.ok ? r.json() : []),
    ]).then(([u, d]) => {
      if (!u) { router.push('/auth/login'); return }
      setUser(u)
      setDecisions(d)
      setLoading(false)
    })
  }, [router])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  if (loading) return <LoadingScreen />

  const pending = decisions.filter(d => d.reflectionStatus === 'pending' && new Date(d.dueReflectionDate) <= new Date())
  const recent = decisions.slice(0, 5)
  const isFree = user?.plan === 'free'
  const nearLimit = isFree && (user?.decisionCount || 0) >= FREE_DECISION_LIMIT - 2

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <header className="border-b px-6 py-4 flex items-center justify-between max-w-4xl mx-auto" style={{ borderColor: 'var(--border)' }}>
        <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--accent)' }}>JUDGMENT GYM</span>
        <div className="flex items-center gap-4">
          {user?.decisionCount && user.decisionCount >= 3 && user.reflectedCount >= 1 && (
            <Link href="/report" className="text-sm opacity-70 hover:opacity-100">Training report</Link>
          )}
          <button onClick={logout} className="text-sm opacity-40 hover:opacity-70">Log out</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {showUpgraded && (
          <div className="rounded-xl p-4 mb-6 text-sm font-semibold text-center" style={{ background: 'var(--accent)', color: '#000' }}>
            Your gym is unlocked. Train without limits.
          </div>
        )}

        {/* Stats */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">JUDGMENT GYM</h1>
          <p className="text-sm opacity-40 mb-6">
            {user?.decisionCount || 0} decisions logged ·{' '}
            {user?.reflectedCount || 0} reflected ·{' '}
            {user?.pendingCount || 0} pending reflection
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/log"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-transform hover:scale-105"
              style={{ background: 'var(--accent)', color: '#000' }}
            >
              🏋️ Log a decision
            </Link>
            {(user?.decisionCount || 0) >= 3 && (user?.reflectedCount || 0) >= 1 && (
              <Link
                href="/report"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm border transition-colors"
                style={{ borderColor: 'var(--border)' }}
              >
                View training progress
              </Link>
            )}
          </div>
        </div>

        {/* Near limit warning */}
        {nearLimit && (
          <div className="rounded-xl p-5 mb-6 border" style={{ borderColor: 'var(--accent)', background: 'var(--card)' }}>
            <p className="font-bold mb-1">
              You&apos;ve logged {user?.decisionCount} of {FREE_DECISION_LIMIT} free decisions.
            </p>
            <p className="text-sm opacity-70 mb-3">Your judgment is getting stronger. Now train systematically.</p>
            <Link href="/upgrade" className="text-sm font-bold underline" style={{ color: 'var(--accent)' }}>
              Unlock your training program →
            </Link>
          </div>
        )}

        {/* Pending reflections */}
        {pending.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs uppercase tracking-widest opacity-40 mb-4">Time to reflect</h2>
            <div className="space-y-3">
              {pending.map(d => (
                <DecisionCard key={d.id} decision={d} cta={{ label: 'Reflect now', href: `/reflect/${d.id}` }} highlight />
              ))}
            </div>
          </section>
        )}

        {/* Recent decisions */}
        {recent.length > 0 ? (
          <section>
            <h2 className="text-xs uppercase tracking-widest opacity-40 mb-4">Recent training sessions</h2>
            <div className="space-y-3">
              {recent.map(d => (
                <DecisionCard key={d.id} decision={d} />
              ))}
            </div>
            {decisions.length > 5 && (
              <button className="mt-4 text-sm opacity-40 hover:opacity-70 w-full text-center py-2">
                Load older training sessions...
              </button>
            )}
          </section>
        ) : (
          <section className="text-center py-20 opacity-40">
            <p className="text-6xl mb-4">🏋️</p>
            <p className="text-lg font-semibold mb-2">Your gym is empty</p>
            <p className="text-sm">Log your first investment decision to start training.</p>
          </section>
        )}
      </main>
    </div>
  )
}

function DecisionCard({ decision: d, cta, highlight }: {
  decision: Decision
  cta?: { label: string; href: string }
  highlight?: boolean
}) {
  const statusColor = d.reflectionStatus === 'done'
    ? 'text-green-400' : d.reflectionStatus === 'skipped' ? 'opacity-30' : 'text-yellow-400'

  return (
    <div
      className="rounded-xl p-5 border transition-colors"
      style={{
        borderColor: highlight ? 'var(--accent)' : 'var(--border)',
        background: 'var(--card)',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-snug mb-2 truncate">{d.decisionText}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs opacity-50">
            <span>{convictionLabel(d.conviction)} ({d.conviction}/10)</span>
            <span>·</span>
            <span>{timeHorizonLabel(d.timeHorizon as never)}</span>
            <span>·</span>
            <span className={statusColor}>
              {d.reflectionStatus === 'done'
                ? (d.reflection?.outcomeWin === true ? '✓ Won' : d.reflection?.outcomeWin === false ? '✗ Lost' : '✓ Reflected')
                : d.reflectionStatus === 'pending'
                ? `Reflects ${new Date(d.dueReflectionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
                : 'Skipped'}
            </span>
          </div>
        </div>
        {cta && (
          <Link
            href={cta.href}
            className="shrink-0 text-xs font-bold px-3 py-2 rounded-lg"
            style={{ background: 'var(--accent)', color: '#000' }}
          >
            {cta.label}
          </Link>
        )}
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
      <p className="text-sm opacity-30 animate-pulse">Loading your gym...</p>
    </div>
  )
}
