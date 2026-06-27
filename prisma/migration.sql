-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('free', 'paid');

-- CreateEnum
CREATE TYPE "TimeHorizon" AS ENUM ('one_month', 'three_months', 'six_months', 'one_year', 'two_plus_years');

-- CreateEnum
CREATE TYPE "EmotionalState" AS ENUM ('confident', 'cautious', 'frustrated', 'excited', 'pressured', 'other');

-- CreateEnum
CREATE TYPE "ReflectionStatus" AS ENUM ('pending', 'done', 'skipped');

-- CreateEnum
CREATE TYPE "ReasoningQuality" AS ENUM ('yes', 'partial', 'no');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "plan" "Plan" NOT NULL DEFAULT 'free',
    "stripeCustomerId" TEXT,
    "nextBillingDate" TIMESTAMP(3),
    "professionalTitle" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Decision" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "decisionText" TEXT NOT NULL,
    "thesis" TEXT NOT NULL,
    "conviction" INTEGER NOT NULL,
    "timeHorizon" "TimeHorizon" NOT NULL,
    "whatProvesWrong" TEXT NOT NULL,
    "biggestAssumption" TEXT NOT NULL,
    "hasPrecedent" BOOLEAN NOT NULL,
    "precedentOutcome" TEXT,
    "emotionalState" "EmotionalState" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueReflectionDate" TIMESTAMP(3) NOT NULL,
    "reflectionStatus" "ReflectionStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "Decision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reflection" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "whatHappened" TEXT NOT NULL,
    "reasoningSound" "ReasoningQuality" NOT NULL,
    "reasoningExplanation" TEXT,
    "whatLearned" TEXT,
    "reflectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "daysEarly" INTEGER,
    "outcomeWin" BOOLEAN,

    CONSTRAINT "Reflection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pattern" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "monthYear" TEXT NOT NULL,
    "conviction8PlusAccuracy" DOUBLE PRECISION,
    "conviction6to7Accuracy" DOUBLE PRECISION,
    "precedentUsageRate" DOUBLE PRECISION,
    "precedentVsFreshOutcomes" JSONB,
    "timeHorizonAccuracy" DOUBLE PRECISION,
    "emotionalBiasBreakdown" JSONB,
    "reasoningQualityVsOutcome" JSONB,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pattern_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Reflection_decisionId_key" ON "Reflection"("decisionId");

-- AddForeignKey
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reflection" ADD CONSTRAINT "Reflection_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "Decision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pattern" ADD CONSTRAINT "Pattern_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
