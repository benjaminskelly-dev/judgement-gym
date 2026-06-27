import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { dueReflectionDate, FREE_DECISION_LIMIT } from '@/lib/decisions'
import { TimeHorizon, EmotionalState } from '@/generated/prisma/client'

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const decisions = await prisma.decision.findMany({
    where: { userId: session.userId },
    include: { reflection: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(decisions)
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: session.userId } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  if (user.plan === 'free') {
    const count = await prisma.decision.count({ where: { userId: session.userId } })
    if (count >= FREE_DECISION_LIMIT) {
      return NextResponse.json({ error: 'Free limit reached', upgrade: true }, { status: 402 })
    }
  }

  const body = await req.json()
  const {
    decisionText, thesis, conviction, timeHorizon, whatProvesWrong,
    biggestAssumption, hasPrecedent, precedentOutcome, emotionalState,
  } = body

  const decision = await prisma.decision.create({
    data: {
      userId: session.userId,
      decisionText,
      thesis,
      conviction: Number(conviction),
      timeHorizon: timeHorizon as TimeHorizon,
      whatProvesWrong,
      biggestAssumption,
      hasPrecedent: Boolean(hasPrecedent),
      precedentOutcome: hasPrecedent ? precedentOutcome : null,
      emotionalState: emotionalState as EmotionalState,
      dueReflectionDate: dueReflectionDate(timeHorizon as TimeHorizon),
    },
  })

  return NextResponse.json(decision, { status: 201 })
}
