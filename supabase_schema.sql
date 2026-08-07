-- =========================================================
-- ELEXOIR HOME SPA - SUPABASE SCHEMA & MIGRATION SCRIPT
-- (Safe to run multiple times, works on existing or new tables)
-- =========================================================

-- 1. CAMPAIGNS TABLE & COLUMNS
CREATE TABLE IF NOT EXISTS public.campaigns (
    id TEXT PRIMARY KEY
);

ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS label TEXT;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '1_month';
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS "discountPercentage" NUMERIC DEFAULT 20;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS "selectedTreatments" JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS "tripOffer" TEXT;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 1;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS brand TEXT DEFAULT 'elexoir';
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read campaigns" ON public.campaigns;
CREATE POLICY "Public read campaigns" ON public.campaigns FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert campaigns" ON public.campaigns;
CREATE POLICY "Public insert campaigns" ON public.campaigns FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update campaigns" ON public.campaigns;
CREATE POLICY "Public update campaigns" ON public.campaigns FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public delete campaigns" ON public.campaigns;
CREATE POLICY "Public delete campaigns" ON public.campaigns FOR DELETE USING (true);


-- 2. TREATMENTS TABLE & COLUMNS
CREATE TABLE IF NOT EXISTS public.treatments (
    id TEXT PRIMARY KEY
);

ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS "desc" TEXT;
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS options JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS benefits JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS "bgPattern" TEXT;
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS pinned_image TEXT;
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS brand TEXT DEFAULT 'elexoir';
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read treatments" ON public.treatments;
CREATE POLICY "Public read treatments" ON public.treatments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert treatments" ON public.treatments;
CREATE POLICY "Public insert treatments" ON public.treatments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update treatments" ON public.treatments;
CREATE POLICY "Public update treatments" ON public.treatments FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public delete treatments" ON public.treatments;
CREATE POLICY "Public delete treatments" ON public.treatments FOR DELETE USING (true);


-- 3. PRODUCTS TABLE & COLUMNS (Store)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY
);

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 10;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "howToUse" TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS ingredients TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand TEXT DEFAULT 'elexoir';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert products" ON public.products;
CREATE POLICY "Public insert products" ON public.products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update products" ON public.products;
CREATE POLICY "Public update products" ON public.products FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public delete products" ON public.products;
CREATE POLICY "Public delete products" ON public.products FOR DELETE USING (true);


-- 4. THERAPISTS TABLE & COLUMNS
CREATE TABLE IF NOT EXISTS public.therapists (
    id TEXT PRIMARY KEY
);

ALTER TABLE public.therapists ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.therapists ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.therapists ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.therapists ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 5.0;
ALTER TABLE public.therapists ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.therapists ADD COLUMN IF NOT EXISTS brand TEXT DEFAULT 'elexoir';
ALTER TABLE public.therapists ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read therapists" ON public.therapists;
CREATE POLICY "Public read therapists" ON public.therapists FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert therapists" ON public.therapists;
CREATE POLICY "Public insert therapists" ON public.therapists FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update therapists" ON public.therapists;
CREATE POLICY "Public update therapists" ON public.therapists FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public delete therapists" ON public.therapists;
CREATE POLICY "Public delete therapists" ON public.therapists FOR DELETE USING (true);


-- 5. THERAPIST FEES TABLE & COLUMNS
CREATE TABLE IF NOT EXISTS public.therapist_fees (
    id TEXT PRIMARY KEY
);

ALTER TABLE public.therapist_fees ADD COLUMN IF NOT EXISTS therapist_id TEXT;
ALTER TABLE public.therapist_fees ADD COLUMN IF NOT EXISTS fee NUMERIC DEFAULT 0;
ALTER TABLE public.therapist_fees ADD COLUMN IF NOT EXISTS brand TEXT DEFAULT 'elexoir';
ALTER TABLE public.therapist_fees ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

ALTER TABLE public.therapist_fees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read therapist_fees" ON public.therapist_fees;
CREATE POLICY "Public read therapist_fees" ON public.therapist_fees FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert therapist_fees" ON public.therapist_fees;
CREATE POLICY "Public insert therapist_fees" ON public.therapist_fees FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update therapist_fees" ON public.therapist_fees;
CREATE POLICY "Public update therapist_fees" ON public.therapist_fees FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public delete therapist_fees" ON public.therapist_fees;
CREATE POLICY "Public delete therapist_fees" ON public.therapist_fees FOR DELETE USING (true);


-- =========================================================
-- SEED INITIAL 2 ACTIVE HOMEPAGE CAMPAIGNS (NO PEXELS IMAGES)
-- =========================================================
INSERT INTO public.campaigns (id, title, label, description, image, duration, "discountPercentage", "selectedTreatments", "tripOffer", "order", is_published, brand)
VALUES 
(
    'camp-default-1',
    'Summer Retreat',
    'EXCLUSIVE OFFER',
    'Special summer massage package designed to rejuvenate your senses in the comfort of your private villa. Includes complimentary local organic fruit basket.',
    NULL,
    '1_month',
    10,
    '[]'::jsonb,
    '20% OFF Bali Day Trip Tour Included',
    1,
    true,
    'elexoir'
),
(
    'camp-default-2',
    'Bali Day Trip & Spa Combo',
    'EXCLUSIVE TRIP DEAL',
    'Book any signature in-villa massage below and claim an exclusive 25% discount voucher for private Bali Day Trips, Waterfall Tours & Temple excursions.',
    NULL,
    '1_month',
    25,
    '[]'::jsonb,
    '25% OFF Private Bali Day Trip & Waterfalls',
    2,
    true,
    'elexoir'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    label = EXCLUDED.label,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    "discountPercentage" = EXCLUDED."discountPercentage",
    "tripOffer" = EXCLUDED."tripOffer",
    "order" = EXCLUDED."order",
    is_published = EXCLUDED.is_published,
    brand = EXCLUDED.brand;
