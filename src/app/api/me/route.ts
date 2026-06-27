import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, plan: true, professionalTitle: true, createdAt: true },
  })

  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const decisionCount = await prisma.decision.count({ where: { userId: session.userId } })
  const reflectedCount = await prisma.decision.count({
    where: { userId: session.userId, reflectionStatus: 'done' },
  })
  const pendingCount = await prisma.decision.count({
    where: {
      userId: session.userId,
      reflectionStatus: 'pending',
      dueReflectionDate: { lte: new Date() },
    },
  })

  return NextResponse.json({ ...user, decisionCount, reflectedCount, pendingCount })
}
