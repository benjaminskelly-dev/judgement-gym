'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function UpgradePage() {
  const [interval, setInterval] = useState<'month' | 'year'>('month')
  const [loading, setLoading] = useState(false)

  async function checkout() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <Link href="/" className="mb-12 text-lg font-bold tracking-tight" style={{ color: 'var(--accent)' }}>
        JUDGMENT GYM
      </Link>

      <div className="w-full max-w-md text-center">
        <p className="text-xs font-mono uppercase tracking-widest opacity-30 mb-4">You&apos;ve logged 10 decisions</p>
        <h1 className="text-3xl font-bold mb-3">Your judgment is getting stronger.</h1>
        <p className="opacity-60 mb-10 leading-relaxed">
          Now train systematically. Unlock your training program and see where your judgment trains — and where it breaks.
        </p>

        {/* Interval toggle */}
        <div
          className="inline-flex rounded-lg p-1 mb-8"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          {(['month', 'year'] as const).map(i => (
            <button
              key={i}
              onClick={() => setInterval(i)}
              className="px-5 py-2 rounded-md text-sm font-semibold transition-all"
              style={{
                background: interval === i ? 'var(--accent)' : 'transparent',
                color: interval === i ? '#000' : 'var(--foreground)',
              }}
            >
              {i === 'month' ? 'Monthly' : 'Annual (save 18%)'}
            </button>
          ))}
        </div>

        <div
          className="rounded-2xl p-8 border mb-6 text-left"
          style={{ borderColor: 'var(--accent)', background: 'var(--card)' }}
        >
          <div className="flex items-end gap-2 mb-6">
            <span className="text-5xl font-bold">{interval === 'month' ? '£7.99' : '£79'}</span>
            <span className="opacity-40 mb-1">/ {interval === 'month' ? 'month' : 'year'}</span>
          </div>
          <ul className="space-y-3 text-sm opacity-70 mb-8">
            <li className="flex gap-2"><span style={{ color: 'var(--accent)' }}>✓</span> Unlimited decisions</li>
            <li className="flex gap-2"><span style={{ color: 'var(--accent)' }}>✓</span> Monthly training reports</li>
            <li className="flex gap-2"><span style={{ color: 'var(--accent)' }}>✓</span> Conviction calibration patterns</li>
            <li className="flex gap-2"><span style={{ color: 'var(--accent)' }}>✓</span> Emotional bias analysis</li>
            <li className="flex gap-2"><span style={{ color: 'var(--accent)' }}>✓</span> Skill vs. luck separation</li>
            <li className="flex gap-2"><span style={{ color: 'var(--accent)' }}>✓</span> Your personal training plan</li>
          </ul>
          <button
            onClick={checkout}
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-base transition-opacity disabled:opacity-50"
            style={{ background: 'var(--accent)', color: '#000' }}
          >
            {loading ? 'Redirecting...' : 'Unlock your training program'}
          </button>
        </div>

        <Link
          href="/dashboard"
          className="text-sm opacity-30 hover:opacity-60 transition-opacity"
        >
          Keep logging free (10 decision limit)
        </Link>
      </div>
    </div>
  )
}
