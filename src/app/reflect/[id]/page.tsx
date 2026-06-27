'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const TOTAL = 3

interface FormData {
  whatHappened: string
  reasoningSound: string
  reasoningExplanation: string
  whatLearned: string
  outcomeWin: string
}

export default function ReflectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>({
    whatHappened: '',
    reasoningSound: '',
    reasoningExplanation: '',
    whatLearned: '',
    outcomeWin: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function canAdvance(): boolean {
    switch (step) {
      case 1: return form.whatHappened.trim().length > 0
      case 2: return form.reasoningSound !== ''
      case 3: return true
      default: return true
    }
  }

  async function submit() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/decisions/${id}/reflect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const progress = (step / TOTAL) * 100

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <Link href="/dashboard" className="text-sm opacity-40 hover:opacity-70">← Dashboard</Link>
        <span className="text-xs font-mono uppercase tracking-widest opacity-40">
          Reflection {step} of {TOTAL}
        </span>
        <span className="text-xs opacity-40">{Math.round(progress)}%</span>
      </header>

      <div className="h-0.5 transition-all" style={{ width: `${progress}%`, background: 'var(--accent)' }} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {step === 1 && (
            <Screen
              label="Reflection 1 of 3"
              title="WHAT ACTUALLY HAPPENED?"
              guidance="Tell the story, not just the score."
            >
              <textarea
                autoFocus
                maxLength={500}
                value={form.whatHappened}
                onChange={e => update('whatHappened', e.target.value)}
                placeholder="Describe what happened with this decision and its outcome..."
                className="w-full h-44 px-4 py-3 rounded-xl border text-base resize-none outline-none focus:border-[var(--accent)] transition-colors"
                style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }}
              />
              <div className="flex justify-between mt-3">
                <div className="flex gap-2">
                  {[
                    { value: 'yes', label: '✓ Outcome win' },
                    { value: 'no', label: '✗ Outcome loss' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => update('outcomeWin', opt.value)}
                      className="text-xs px-3 py-1.5 rounded-lg border transition-all"
                      style={{
                        borderColor: form.outcomeWin === opt.value ? 'var(--accent)' : 'var(--border)',
                        background: form.outcomeWin === opt.value ? 'rgba(232,255,32,0.08)' : 'transparent',
                        color: form.outcomeWin === opt.value ? 'var(--accent)' : undefined,
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs opacity-30">{form.whatHappened.length}/500</p>
              </div>
            </Screen>
          )}

          {step === 2 && (
            <Screen
              label="Reflection 2 of 3"
              title="DID YOU THINK WELL?"
              guidance="Separate the quality of your reasoning from the outcome."
            >
              <div className="space-y-3 mb-6">
                {[
                  { value: 'yes', label: 'Yes, my reasoning was solid' },
                  { value: 'partial', label: 'Partially — some blind spots' },
                  { value: 'no', label: 'No, I was lucky / unlucky' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => update('reasoningSound', opt.value)}
                    className="w-full py-4 px-5 rounded-xl border text-left font-semibold text-sm transition-all"
                    style={{
                      borderColor: form.reasoningSound === opt.value ? 'var(--accent)' : 'var(--border)',
                      background: form.reasoningSound === opt.value ? 'rgba(232,255,32,0.08)' : 'var(--card)',
                      color: form.reasoningSound === opt.value ? 'var(--accent)' : 'var(--foreground)',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {form.reasoningSound && (
                <div>
                  <label className="block text-xs uppercase tracking-widest opacity-50 mb-2">Why?</label>
                  <textarea
                    autoFocus
                    maxLength={300}
                    value={form.reasoningExplanation}
                    onChange={e => update('reasoningExplanation', e.target.value)}
                    placeholder="What does this tell you about how you reasoned?"
                    className="w-full h-28 px-4 py-3 rounded-xl border text-base resize-none outline-none focus:border-[var(--accent)] transition-colors"
                    style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }}
                  />
                  <p className="text-xs opacity-30 text-right mt-1">{form.reasoningExplanation.length}/300</p>
                </div>
              )}
            </Screen>
          )}

          {step === 3 && (
            <Screen
              label="Reflection 3 of 3"
              title="WHAT DID THIS REVEAL ABOUT YOUR JUDGMENT?"
              guidance="This is judgment development. Understanding what you missed."
            >
              <textarea
                autoFocus
                maxLength={400}
                value={form.whatLearned}
                onChange={e => update('whatLearned', e.target.value)}
                placeholder="Optional — what will you carry forward from this decision?"
                className="w-full h-40 px-4 py-3 rounded-xl border text-base resize-none outline-none focus:border-[var(--accent)] transition-colors"
                style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }}
              />
              <p className="text-xs opacity-30 text-right mt-1">{form.whatLearned.length}/400</p>
              {error && <p className="text-sm text-red-400 text-center mt-4">{error}</p>}
            </Screen>
          )}

          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex-1 py-4 rounded-xl border font-semibold text-sm transition-colors"
                style={{ borderColor: 'var(--border)' }}
              >
                Back
              </button>
            )}
            {step < TOTAL ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canAdvance()}
                className="flex-1 py-4 rounded-xl font-bold text-sm transition-opacity disabled:opacity-30"
                style={{ background: 'var(--accent)', color: '#000' }}
              >
                Continue
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={loading}
                className="flex-1 py-4 rounded-xl font-bold text-sm transition-opacity disabled:opacity-30"
                style={{ background: 'var(--accent)', color: '#000' }}
              >
                {loading ? 'Saving...' : 'Complete reflection'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Screen({ label, title, guidance, children }: {
  label: string; title: string; guidance: string; children: React.ReactNode
}) {
  return (
    <div>
      <p className="text-xs font-mono uppercase tracking-widest opacity-30 mb-6">{label}</p>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-sm opacity-40 mb-6 leading-relaxed">{guidance}</p>
      {children}
    </div>
  )
}
