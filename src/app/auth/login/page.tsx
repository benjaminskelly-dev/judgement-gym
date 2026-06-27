'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
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
        <h1 className="text-2xl font-bold mb-2">Back to the gym</h1>
        <p className="text-sm opacity-50 mb-8">Continue your judgment training.</p>

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
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border text-sm outline-none focus:border-[var(--accent)] transition-colors"
              style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }}
              placeholder="Your password"
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
            {loading ? 'Loading...' : 'Log in'}
          </button>
        </form>

        <p className="text-center text-sm opacity-40 mt-6">
          New here?{' '}
          <Link href="/auth/signup" className="underline">Start training</Link>
        </p>
      </div>
    </div>
  )
}
