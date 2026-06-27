import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ReasoningQuality } from '@/generated/prisma/client'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const decision = await prisma.decision.findUnique({ where: { id } })
  if (!decision || decision.userId !== session.userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body = await req.json()
  const { whatHappened, reasoningSound, reasoningExplanation, whatLearned, outcomeWin } = body

  const daysEarly = Math.max(
    0,
    Math.floor((decision.dueReflectionDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  )

  const reflection = await prisma.reflection.create({
    data: {
      decisionId: id,
      whatHappened,
      reasoningSound: reasoningSound as ReasoningQuality,
      reasoningExplanation,
      whatLearned,
      outcomeWin: outcomeWin === 'yes' ? true : outcomeWin === 'no' ? false : null,
      daysEarly,
    },
  })

  await prisma.decision.update({
    where: { id },
    data: { reflectionStatus: 'done' },
  })

  return NextResponse.json(reflection, { status: 201 })
}
