/*
# Create dress-up game tables (single-tenant, no auth)

This migration creates two tables for the kawaii pixel-art dress-up game:
a collection of saved/favorite outfits and a rotating daily outfit challenge.

1. New Tables

- `favorite_outfits`
  - `id` (uuid, primary key)
  - `outfit_name` (text, name the user gives the outfit)
  - `outfit_state` (jsonb, the full equipped-outfit state used to re-render)
  - `thumbnail` (text, optional data-URL PNG thumbnail for the gallery)
  - `created_at` (timestamptz, defaults to now)
  - Stores outfits the user has favorited so they can reload them later.

- `daily_challenges`
  - `id` (uuid, primary key)
  - `challenge_date` (date, unique, the day this challenge is active)
  - `theme` (text, the theme name e.g. "cottagecore picnic")
  - `prompt` (text, the descriptive prompt text shown to the user)
  - `suggested_items` (jsonb, optional suggested item ids for the theme)
  - `created_at` (timestamptz, defaults to now)
  - One row per day; the app looks up today's challenge by `challenge_date`.

2. Security

- This is a single-tenant app with no sign-in screen, so all policies are
  scoped to `anon, authenticated` and the data is intentionally shared/public.
- RLS is enabled on both tables.
- Full CRUD is allowed for anon + authenticated on both tables.

3. Indexes

- Unique index on `daily_challenges.challenge_date` for fast daily lookups.
- Index on `favorite_outfits.created_at` for ordered gallery display.
*/

CREATE TABLE IF NOT EXISTS favorite_outfits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  outfit_name text NOT NULL,
  outfit_state jsonb NOT NULL,
  thumbnail text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE favorite_outfits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_favorite_outfits" ON favorite_outfits;
CREATE POLICY "anon_select_favorite_outfits" ON favorite_outfits FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_favorite_outfits" ON favorite_outfits;
CREATE POLICY "anon_insert_favorite_outfits" ON favorite_outfits FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_favorite_outfits" ON favorite_outfits;
CREATE POLICY "anon_update_favorite_outfits" ON favorite_outfits FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_favorite_outfits" ON favorite_outfits;
CREATE POLICY "anon_delete_favorite_outfits" ON favorite_outfits FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_favorite_outfits_created_at
  ON favorite_outfits (created_at DESC);

CREATE TABLE IF NOT EXISTS daily_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_date date UNIQUE NOT NULL,
  theme text NOT NULL,
  prompt text NOT NULL,
  suggested_items jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_daily_challenges" ON daily_challenges;
CREATE POLICY "anon_select_daily_challenges" ON daily_challenges FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_daily_challenges" ON daily_challenges;
CREATE POLICY "anon_insert_daily_challenges" ON daily_challenges FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_daily_challenges" ON daily_challenges;
CREATE POLICY "anon_update_daily_challenges" ON daily_challenges FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_daily_challenges" ON daily_challenges;
CREATE POLICY "anon_delete_daily_challenges" ON daily_challenges FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_daily_challenges_challenge_date
  ON daily_challenges (challenge_date);
