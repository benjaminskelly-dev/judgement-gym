import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--accent)' }}>
          JUDGMENT GYM
        </span>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm opacity-70 hover:opacity-100 transition-opacity">
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            style={{ background: 'var(--accent)', color: '#000' }}
          >
            Start training
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-6 pt-20 pb-32">
        <div className="max-w-3xl">
          <p className="text-sm font-mono uppercase tracking-widest mb-6 opacity-50">
            Built for investment professionals
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-8">
            Automation is eliminating<br />
            routine work.<br />
            <span style={{ color: 'var(--accent)' }}>Judgment is what remains.</span>
          </h1>
          <p className="text-xl opacity-70 mb-4 leading-relaxed max-w-2xl">
            Most professionals have experience. Few train judgment deliberately.
          </p>
          <p className="text-xl opacity-70 mb-12 leading-relaxed max-w-2xl">
            Judgment Gym logs your investment decisions, tracks outcomes, and reveals the patterns in how you think — conviction, patience, emotional bias, skill vs. luck.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105"
              style={{ background: 'var(--accent)', color: '#000' }}
            >
              Open your gym — free
            </Link>
            <a
              href="#how"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-lg border transition-colors"
              style={{ borderColor: 'var(--border)' }}
            >
              How it works
            </a>
          </div>
          <p className="mt-4 text-sm opacity-40">10 decisions free. No credit card required.</p>
        </div>
      </main>

      {/* How it works */}
      <section id="how" className="max-w-5xl mx-auto px-6 pb-32">
        <p className="text-xs font-mono uppercase tracking-widest mb-12 opacity-40">Training method</p>
        <div className="grid sm:grid-cols-3 gap-8">
          <Step
            n="01"
            title="Log a decision"
            body="Write down what you're deciding, your thesis, conviction level, and what would prove you wrong. Articulating reasoning is step one of judgment training."
          />
          <Step
            n="02"
            title="Reflect on outcomes"
            body="When the time horizon hits, return to the decision. What happened? Did you think well? Separate skill from luck — that's judgment development."
          />
          <Step
            n="03"
            title="See your patterns"
            body="Your monthly training report shows where judgment trains: conviction calibration, emotional bias, precedent reliance, patience under pressure."
          />
        </div>
      </section>

      {/* Training areas */}
      <section className="max-w-5xl mx-auto px-6 pb-32">
        <p className="text-xs font-mono uppercase tracking-widest mb-12 opacity-40">What you train</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <TrainingArea
            title="Conviction training"
            body="You're better when humble. Train medium-conviction judgment."
          />
          <TrainingArea
            title="Precedent training"
            body="Models do pattern matching. Your edge is knowing when context changes."
          />
          <TrainingArea
            title="Time horizon"
            body="You judge early. Train patience."
          />
          <TrainingArea
            title="Emotional training"
            body="Your emotions color judgment. Understand which help and which hurt."
          />
          <TrainingArea
            title="Skill vs. luck"
            body="Separate them. That's judgment."
          />
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-6 pb-32">
        <p className="text-xs font-mono uppercase tracking-widest mb-12 opacity-40">Pricing</p>
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
          <div
            className="rounded-2xl p-8 border"
            style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
          >
            <p className="text-xs font-mono uppercase tracking-widest mb-4 opacity-50">Free</p>
            <p className="text-4xl font-bold mb-2">£0</p>
            <p className="opacity-50 mb-6 text-sm">First 10 decisions</p>
            <ul className="space-y-2 text-sm opacity-70 mb-8">
              <li>✓ Full logging flow</li>
              <li>✓ Reflection on all decisions</li>
              <li>✓ Dashboard</li>
            </ul>
            <Link
              href="/auth/signup"
              className="block text-center py-3 rounded-lg font-semibold border transition-colors"
              style={{ borderColor: 'var(--border)' }}
            >
              Start free
            </Link>
          </div>
          <div
            className="rounded-2xl p-8 border relative"
            style={{ borderColor: 'var(--accent)', background: 'var(--card)' }}
          >
            <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>Pro</p>
            <p className="text-4xl font-bold mb-2">£7.99<span className="text-lg font-normal opacity-50">/mo</span></p>
            <p className="opacity-50 mb-6 text-sm">or £79/year</p>
            <ul className="space-y-2 text-sm opacity-70 mb-8">
              <li>✓ Unlimited decisions</li>
              <li>✓ Monthly training reports</li>
              <li>✓ Conviction & bias patterns</li>
              <li>✓ Skill vs. luck analysis</li>
              <li>✓ Your judgment training plan</li>
            </ul>
            <Link
              href="/auth/signup"
              className="block text-center py-3 rounded-lg font-bold transition-colors"
              style={{ background: 'var(--accent)', color: '#000' }}
            >
              Unlock training
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Understanding humans is the competitive advantage of the future.</h2>
        <p className="opacity-50 mb-8">Start with understanding yourself.</p>
        <Link
          href="/auth/signup"
          className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105"
          style={{ background: 'var(--accent)', color: '#000' }}
        >
          Open your gym
        </Link>
      </section>

      <footer className="border-t px-6 py-8 text-center text-sm opacity-30" style={{ borderColor: 'var(--border)' }}>
        © {new Date().getFullYear()} Judgment Gym
      </footer>
    </div>
  )
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div>
      <p className="text-xs font-mono mb-3" style={{ color: 'var(--accent)' }}>{n}</p>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm opacity-60 leading-relaxed">{body}</p>
    </div>
  )
}

function TrainingArea({ title, body }: { title: string; body: string }) {
  return (
    <div
      className="rounded-xl p-6 border"
      style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
    >
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm opacity-60">{body}</p>
    </div>
  )
}
