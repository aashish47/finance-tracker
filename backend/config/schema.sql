-- ==========================================
-- 1. MATERIALIZED VIEWS
-- ==========================================
CREATE MATERIALIZED VIEW IF NOT EXISTS public.distinct_years as
SELECT DISTINCT
EXTRACT(YEAR FROM transactions.date) as year,
transactions.user_id
FROM
transactions;

-- ==========================================
-- 2. FUNCTIONS & TRIGGERS
-- ==========================================
CREATE OR REPLACE FUNCTION refresh_distinct_years()
RETURNS TRIGGER AS $$
BEGIN
-- For INSERT or UPDATE: Refresh if a new year is added for an existing user
IF (TG_OP IN ('INSERT', 'UPDATE') AND NOT EXISTS (
SELECT 1
FROM public.distinct_years
WHERE user_id = NEW.user_id AND year = EXTRACT(YEAR FROM NEW.date)
)) THEN
REFRESH MATERIALIZED VIEW public.distinct_years;

-- For DELETE: Always refresh the materialized view to keep it accurate
ELSIF (TG_OP = 'DELETE') THEN
REFRESH MATERIALIZED VIEW public.distinct_years;
END IF;

RETURN NULL; -- AFTER Trigger function can return NULL
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists to avoid conflicts on re-runs
DROP TRIGGER IF EXISTS refresh_distinct_years_trigger ON public.transactions;

CREATE TRIGGER refresh_distinct_years_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION refresh_distinct_years();

-- ==========================================
-- 3. INDEXES
-- ==========================================
CREATE UNIQUE INDEX IF NOT EXISTS categories_pkey ON public.categories USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS transactions_pkey ON public.transactions USING btree (id);

-- Indexes on Materialized View (Requires a UNIQUE index if you ever want to use REFRESH MATERIALIZED VIEW CONCURRENTLY)
CREATE UNIQUE INDEX IF NOT EXISTS distinct_years_user_id_year_idx ON public.distinct_years USING btree (user_id, year DESC);

-- Indexes on Transactions table
CREATE INDEX IF NOT EXISTS transactions_category_id_date_idx ON public.transactions USING btree (category_id, date);
CREATE INDEX IF NOT EXISTS transactions_category_id_idx ON public.transactions USING btree (category_id);
CREATE INDEX IF NOT EXISTS transactions_date_idx ON public.transactions USING btree (date);
CREATE INDEX IF NOT EXISTS transactions_user_id_date_idx ON public.transactions USING btree (user_id, date);
CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON public.transactions USING btree (user_id);

