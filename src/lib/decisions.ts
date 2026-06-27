import { TimeHorizon } from '@/generated/prisma/client'

export function dueReflectionDate(timeHorizon: TimeHorizon): Date {
  const map: Record<TimeHorizon, number> = {
    one_month: 30,
    three_months: 90,
    six_months: 180,
    one_year: 365,
    two_plus_years: 730,
  }
  const days = map[timeHorizon] || 90
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d
}

export function timeHorizonLabel(th: TimeHorizon): string {
  const map: Record<TimeHorizon, string> = {
    one_month: '1 month',
    three_months: '3 months',
    six_months: '6 months',
    one_year: '1 year',
    two_plus_years: '2+ years',
  }
  return map[th] || th
}

export function convictionLabel(n: number): string {
  if (n >= 8) return 'High conviction'
  if (n >= 6) return 'Medium conviction'
  return 'Low conviction'
}

export const FREE_DECISION_LIMIT = 10
