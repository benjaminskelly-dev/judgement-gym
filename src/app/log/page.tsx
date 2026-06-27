'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const TOTAL = 8

interface FormData {
  decisionText: string
  thesis: string
  conviction: number
  timeHorizon: string
  whatProvesWrong: string
  biggestAssumption: string
  hasPrecedent: boolean | null
  precedentOutcome: string
  emotionalState: string
}

const EMPTY: FormData = {
  decisionText: '',
  thesis: '',
  conviction: 5,
  timeHorizon: '',
  whatProvesWrong: '',
  biggestAssumption: '',
  hasPrecedent: null,
  precedentOutcome: '',
  emotionalState: '',
}

export default function LogPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function next() {
    setStep(s => Math.min(s + 1, TOTAL))
  }
  function back() {
    setStep(s => Math.max(s - 1, 1))
  }

  function canAdvance(): boolean {
    switch (step) {
      case 1: return form.decisionText.trim().length > 0
      case 2: return form.thesis.trim().length > 0
      case 3: return true
      case 4: return form.timeHorizon !== ''
      case 5: return form.whatProvesWrong.trim().length > 0
      case 6: return form.biggestAssumption.trim().length > 0
      case 7: return form.hasPrecedent !== null
      case 8: return form.emotionalState !== ''
      default: return true
    }
  }

  async function submit() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          hasPrecedent: Boolean(form.hasPrecedent),
          precedentOutcome: form.hasPrecedent ? form.precedentOutcome : null,
        }),
      })
      const data = await res.json()
      if (res.status === 402) {
        router.push('/upgrade')
        return
      }
      if (!res.ok) { setError(data.error); return }
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const progress = (step / TOTAL) * 100

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <Link href="/dashboard" className="text-sm opacity-40 hover:opacity-70">← Back</Link>
        <span className="text-xs font-mono uppercase tracking-widest opacity-40">
          Rep {step} of {TOTAL}
        </span>
        <span className="text-xs opacity-40">{Math.round(progress)}%</span>
      </header>

      {/* Progress bar */}
      <div className="h-0.5 transition-all" style={{ width: `${progress}%`, background: 'var(--accent)' }} />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {step === 1 && (
            <Screen
              label="Screen 1 of 8"
              title="WHAT'S THE DECISION?"
              guidance="Being specific is step one of judgment training."
            >
              <textarea
                autoFocus
                maxLength={200}
                value={form.decisionText}
                onChange={e => update('decisionText', e.target.value)}
                placeholder="e.g. Consolidate two correlated EM funds"
                className="w-full h-36 px-4 py-3 rounded-xl border text-base resize-none outline-none focus:border-[var(--accent)] transition-colors"
                style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }}
              />
              <CharCount current={form.decisionText.length} max={200} />
            </Screen>
          )}

          {step === 2 && (
            <Screen
              label="Screen 2 of 8"
              title="YOUR THESIS"
              subtitle="Why are you making this choice?"
              guidance="Articulating your reasoning is judgment training. If you can't explain it, you don't understand it."
            >
              <textarea
                autoFocus
                maxLength={500}
                value={form.thesis}
                onChange={e => update('thesis', e.target.value)}
                placeholder="e.g. Both funds have 87% correlation. Outperformance doesn't justify overlap. Consolidating reduces drag and simplifies rebalancing."
                className="w-full h-44 px-4 py-3 rounded-xl border text-base resize-none outline-none focus:border-[var(--accent)] transition-colors"
                style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }}
              />
              <CharCount current={form.thesis.length} max={500} />
            </Screen>
          )}

          {step === 3 && (
            <Screen
              label="Screen 3 of 8"
              title="HOW CERTAIN ARE YOU?"
              guidance="Conviction is where judgment training begins. High confidence often masks blind spots."
            >
              <div className="py-6">
                <div className="flex items-center gap-6 mb-6">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={form.conviction}
                    onChange={e => update('conviction', Number(e.target.value))}
                    className="flex-1 accent-[var(--accent)]"
                  />
                  <span className="text-5xl font-bold w-16 text-right" style={{ color: 'var(--accent)' }}>
                    {form.conviction}
                  </span>
                </div>
                <div className="flex justify-between text-xs opacity-40">
                  <span>Uncertain (1)</span>
                  <span>Certain (10)</span>
                </div>
                <p className="mt-4 text-sm opacity-50 text-center">
                  {form.conviction >= 8 ? 'High conviction — watch for blind spots'
                    : form.conviction >= 6 ? 'Medium conviction — good zone for judgment training'
                    : 'Low conviction — what would move you?'}
                </p>
              </div>
            </Screen>
          )}

          {step === 4 && (
            <Screen
              label="Screen 4 of 8"
              title="WHEN WILL YOU KNOW IF YOU'RE RIGHT?"
              guidance="This is where judgment meets patience."
            >
              <div className="grid grid-cols-1 gap-3 mt-2">
                {[
                  { value: 'one_month', label: '1 month' },
                  { value: 'three_months', label: '3 months' },
                  { value: 'six_months', label: '6 months' },
                  { value: 'one_year', label: '1 year' },
                  { value: 'two_plus_years', label: '2+ years' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => update('timeHorizon', opt.value)}
                    className="w-full py-4 px-5 rounded-xl border text-left font-semibold transition-all"
                    style={{
                      borderColor: form.timeHorizon === opt.value ? 'var(--accent)' : 'var(--border)',
                      background: form.timeHorizon === opt.value ? 'rgba(232,255,32,0.08)' : 'var(--card)',
                      color: form.timeHorizon === opt.value ? 'var(--accent)' : 'var(--foreground)',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </Screen>
          )}

          {step === 5 && (
            <Screen
              label="Screen 5 of 8"
              title="WHAT WOULD PROVE YOU WRONG?"
              guidance={`Be specific. Not "it doesn't work," but "X outcome."`}
            >
              <textarea
                autoFocus
                maxLength={150}
                value={form.whatProvesWrong}
                onChange={e => update('whatProvesWrong', e.target.value)}
                placeholder="e.g. Consolidated fund underperforms both originals by 200+ bps in Year 1"
                className="w-full h-32 px-4 py-3 rounded-xl border text-base resize-none outline-none focus:border-[var(--accent)] transition-colors"
                style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }}
              />
              <CharCount current={form.whatProvesWrong.length} max={150} />
            </Screen>
          )}

          {step === 6 && (
            <Screen
              label="Screen 6 of 8"
              title="WHAT'S YOUR BIGGEST ASSUMPTION?"
              guidance="Judgment is knowing what you don't know."
            >
              <textarea
                autoFocus
                maxLength={150}
                value={form.biggestAssumption}
                onChange={e => update('biggestAssumption', e.target.value)}
                placeholder="e.g. That correlation will remain stable as it has been"
                className="w-full h-32 px-4 py-3 rounded-xl border text-base resize-none outline-none focus:border-[var(--accent)] transition-colors"
                style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }}
              />
              <CharCount current={form.biggestAssumption.length} max={150} />
            </Screen>
          )}

          {step === 7 && (
            <Screen
              label="Screen 7 of 8"
              title="ARE YOU RELYING ON A PAST DECISION?"
              guidance="Precedent reliance is a judgment pattern worth understanding."
            >
              <div className="flex gap-4 mb-6">
                {[true, false].map(val => (
                  <button
                    key={String(val)}
                    onClick={() => update('hasPrecedent', val)}
                    className="flex-1 py-4 rounded-xl border font-bold transition-all"
                    style={{
                      borderColor: form.hasPrecedent === val ? 'var(--accent)' : 'var(--border)',
                      background: form.hasPrecedent === val ? 'rgba(232,255,32,0.08)' : 'var(--card)',
                      color: form.hasPrecedent === val ? 'var(--accent)' : 'var(--foreground)',
                    }}
                  >
                    {val ? 'Yes' : 'No'}
                  </button>
                ))}
              </div>
              {form.hasPrecedent && (
                <div>
                  <label className="block text-xs uppercase tracking-widest opacity-50 mb-2">What was the outcome?</label>
                  <textarea
                    autoFocus
                    maxLength={200}
                    value={form.precedentOutcome}
                    onChange={e => update('precedentOutcome', e.target.value)}
                    placeholder="e.g. Consolidated UK/Europe 18 months ago. Reduced costs 15 bps. Worked."
                    className="w-full h-28 px-4 py-3 rounded-xl border text-base resize-none outline-none focus:border-[var(--accent)] transition-colors"
                    style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }}
                  />
                  <CharCount current={form.precedentOutcome.length} max={200} />
                </div>
              )}
            </Screen>
          )}

          {step === 8 && (
            <Screen
              label="Screen 8 of 8"
              title="WHAT'S YOUR EMOTIONAL STATE?"
              guidance="Understanding the human condition starts with understanding yourself."
            >
              <div className="grid grid-cols-2 gap-3 mt-2">
                {['Confident', 'Cautious', 'Frustrated', 'Excited', 'Pressured', 'Other'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => update('emotionalState', opt.toLowerCase())}
                    className="py-4 px-4 rounded-xl border font-semibold text-sm transition-all"
                    style={{
                      borderColor: form.emotionalState === opt.toLowerCase() ? 'var(--accent)' : 'var(--border)',
                      background: form.emotionalState === opt.toLowerCase() ? 'rgba(232,255,32,0.08)' : 'var(--card)',
                      color: form.emotionalState === opt.toLowerCase() ? 'var(--accent)' : 'var(--foreground)',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {error && <p className="text-sm text-red-400 text-center mt-4">{error}</p>}
            </Screen>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={back}
                className="flex-1 py-4 rounded-xl border font-semibold text-sm transition-colors"
                style={{ borderColor: 'var(--border)' }}
              >
                Back
              </button>
            )}
            {step < TOTAL ? (
              <button
                onClick={next}
                disabled={!canAdvance()}
                className="flex-1 py-4 rounded-xl font-bold text-sm transition-opacity disabled:opacity-30"
                style={{ background: 'var(--accent)', color: '#000' }}
              >
                Continue
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={!canAdvance() || loading}
                className="flex-1 py-4 rounded-xl font-bold text-sm transition-opacity disabled:opacity-30"
                style={{ background: 'var(--accent)', color: '#000' }}
              >
                {loading ? 'Logging...' : 'Log this decision'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Screen({ label, title, subtitle, guidance, children }: {
  label: string; title: string; subtitle?: string; guidance: string; children: React.ReactNode
}) {
  return (
    <div>
      <p className="text-xs font-mono uppercase tracking-widest opacity-30 mb-6">{label}</p>
      <h2 className="text-2xl font-bold mb-1">{title}</h2>
      {subtitle && <p className="text-base opacity-60 mb-3">{subtitle}</p>}
      <p className="text-sm opacity-40 mb-6 leading-relaxed">{guidance}</p>
      {children}
    </div>
  )
}

function CharCount({ current, max }: { current: number; max: number }) {
  return (
    <p className="text-xs opacity-30 text-right mt-1">{current}/{max}</p>
  )
}
