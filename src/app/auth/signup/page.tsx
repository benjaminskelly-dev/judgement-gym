'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '', professionalTitle: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'var(--background)' }}>
      <Link href="/" className="mb-12 text-lg font-bold tracking-tight" style={{ color: 'var(--accent)' }}>
        JUDGMENT GYM
      </Link>
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-2">Open your gym</h1>
        <p className="text-sm opacity-50 mb-8">10 decisions free. No credit card required.</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest opacity-50 mb-2">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border text-sm outline-none focus:border-[var(--accent)] transition-colors"
              style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }}
              placeholder="you@fund.com"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest opacity-50 mb-2">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border text-sm outline-none focus:border-[var(--accent)] transition-colors"
              style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }}
              placeholder="8+ characters"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest opacity-50 mb-2">
              Role <span className="normal-case opacity-40">(optional)</span>
            </label>
            <input
              type="text"
              value={form.professionalTitle}
              onChange={e => setForm(f => ({ ...f, professionalTitle: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border text-sm outline-none focus:border-[var(--accent)] transition-colors"
              style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }}
              placeholder="Portfolio Manager, CIO, Analyst..."
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold text-sm transition-opacity disabled:opacity-50"
            style={{ background: 'var(--accent)', color: '#000' }}
          >
            {loading ? 'Opening...' : 'Start training'}
          </button>
        </form>

        <p className="text-center text-sm opacity-40 mt-6">
          Already training?{' '}
          <Link href="/auth/login" className="underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}
