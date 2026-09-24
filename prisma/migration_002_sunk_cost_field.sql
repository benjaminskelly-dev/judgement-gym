-- Replaces the self-reported "sunk cost" rationale (nobody admits to it at
-- entry time) with a structural, factual question, same pattern as
-- hasPrecedent. The Analysis report computes the sunk-cost correlation from
-- this + outcome, instead of asking the user to self-diagnose the bias.
-- Apply manually: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f prisma/migration_002_sunk_cost_field.sql

ALTER TABLE "Decision"
  ADD COLUMN IF NOT EXISTS "addingToLosingPosition" BOOLEAN,
  ADD COLUMN IF NOT EXISTS "existingPositionLossPct" DOUBLE PRECISION;
