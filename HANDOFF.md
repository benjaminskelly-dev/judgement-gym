# Judgment Gym — Sunk Cost Fix Handoff (2026-09-24)

Context: Ben flagged that "sunk costs" was the only bias sitting in the
purchase-rationale list on the decision-log screen, next to normal reasons to
buy — and asked whether an investor would ever admit to that as their reason,
or whether it belongs in Analysis with the other biases instead.

**Verdict (agreed with Ben):** don't just relocate the label. Nobody
self-reports sunk cost — it always disguises itself as a normal reason
("averaging down," "getting back to even"). So the fix replaces the
self-reported bias with a **structural, factual question** at entry time
(mirrors the existing `hasPrecedent` pattern), and the **Analysis report
computes the sunk-cost correlation from behavior + outcome** — same as it
already does for conviction and precedent. Never a self-selected checkbox.

## What changed (commit `7c247ff`, local only — see blocker below)

- `prisma/schema.prisma` — added `addingToLosingPosition Boolean?` and
  `existingPositionLossPct Float?` to the `Decision` model.
- `prisma/migration_002_sunk_cost_field.sql` — new file, run manually
  (see below).
- `src/app/api/decisions/route.ts` — `POST` now accepts and stores both fields.
- `src/app/log/page.tsx` — new step 8 of 9 ("ARE YOU ADDING TO A LOSING
  POSITION?", Yes/No + optional "how far underwater" %), all step numbering
  and "Screen N of 9" labels updated (was 8 steps, now 9). Emotional state
  moved to step 9.
- `src/app/report/page.tsx` — new "03 — Sunk Cost Pattern" section (win rate
  for adding-to-loser vs. fresh entry, same shape as the Precedent Patterns
  section); old sections 03–05 renumbered to 04–06; added a training-plan
  bullet when the gap is real.

Frontend build (`npm run build`, includes `prisma generate` + TypeScript)
passes clean.

## Blocker: could not push to `benjaminskelly-dev/judgement-gym`

```
remote: Claude doesn't have GitHub access to benjaminskelly-dev/judgement-gym
for your organization. An org admin can install the Claude GitHub App at
https://github.com/apps/claude/installations/select_target
```

This is Ben's org/repo, not yours — my GitHub connection doesn't reach it.
The commit exists locally on branch `claude/trade-coach-deployment-integration-metchv`
in this cloud session but never left it.

**You already have the patch file** (sent earlier this session):
`0001-Replace-self-reported-sunk-cost-rationale-with-a-str.patch`

### To apply and push from your own terminal

```bash
cd path/to/judgement-gym          # your local clone, with push access
git checkout claude/trade-coach-deployment-integration-metchv   # or your working branch
git am ~/Downloads/0001-Replace-self-reported-sunk-cost-rationale-with-a-str.patch
git push origin claude/trade-coach-deployment-integration-metchv
```

If `git am` complains about a dirty tree, `git stash` first, then `git stash pop`
after.

### Longer-term fix for the access wall

Have Ben (org owner) install the Claude GitHub App:
https://github.com/apps/claude/installations/select_target — once that's
done I can push to this repo directly instead of round-tripping patches.

## Run the migration (Supabase/Postgres — wherever `DATABASE_URL` points for this project)

No DB credentials in this cloud session, same as the tradecoach handoff.

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f prisma/migration_002_sunk_cost_field.sql
```

Or paste `prisma/migration_002_sunk_cost_field.sql` into whatever SQL console
you use for this project's Postgres (Supabase/Neon/Railway — check
`prisma.config.ts` / `.env.local` for which one).

Then regenerate the Prisma client if you haven't already via `npm run build`
(it runs `prisma generate` first).

## Verify once applied

1. `npm run dev`, go to `/log`, step through to step 8 of 9 — confirm the new
   Yes/No question renders and the optional % input only shows on "Yes."
2. Log a decision with "Yes" + a loss %, reflect on it later (or seed a test
   row), then check `/report` — "03 — Sunk Cost Pattern" should populate once
   you have 2+ decisions in each bucket (adding-to-loser vs. fresh) that are
   reflected.
3. `psql "$DATABASE_URL" -c '\d "Decision"'` — confirm the two new columns
   exist.

## Still open from the broader handoff (see `tradecoach/HANDOFF.md`)

- tradecoach's own thesis/reflection migration (`migrations/001_add_thesis_reflection.sql`)
  — separate repo, separate DB, not this one.
- Netlify diagnosis for tradecoach — still needs the site URL or deploy log.
- `tradecoachv3/.env` committed to git history — rotate whatever's in it.
