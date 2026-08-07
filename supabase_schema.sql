-- ==========================================
-- ELEXOIR HOME SPA - COMPLETE SUPABASE SQL SCHEMA
-- Run this in your Supabase Project -> SQL Editor
-- ==========================================

-- 1. CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS public.campaigns (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    label TEXT,
    description TEXT,
    image TEXT,
    duration TEXT DEFAULT '1_month',
    "discountPercentage" NUMERIC DEFAULT 20,
    "selectedTreatments" JSONB DEFAULT '[]'::jsonb,
    "tripOffer" TEXT,
    "order" INTEGER DEFAULT 1,
    is_published BOOLEAN DEFAULT true,
    brand TEXT DEFAULT 'elexoir',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and create full access policies for campaigns
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read campaigns" ON public.campaigns;
CREATE POLICY "Public read campaigns" ON public.campaigns FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert campaigns" ON public.campaigns;
CREATE POLICY "Public insert campaigns" ON public.campaigns FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update campaigns" ON public.campaigns;
CREATE POLICY "Public update campaigns" ON public.campaigns FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public delete campaigns" ON public.campaigns;
CREATE POLICY "Public delete campaigns" ON public.campaigns FOR DELETE USING (true);


-- 2. TREATMENTS TABLE
CREATE TABLE IF NOT EXISTS public.treatments (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    "desc" TEXT,
    options JSONB DEFAULT '[]'::jsonb,
    benefits JSONB DEFAULT '[]'::jsonb,
    "bgPattern" TEXT,
    is_published BOOLEAN DEFAULT true,
    is_pinned BOOLEAN DEFAULT false,
    pinned_image TEXT,
    brand TEXT DEFAULT 'elexoir',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read treatments" ON public.treatments;
CREATE POLICY "Public read treatments" ON public.treatments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert treatments" ON public.treatments;
CREATE POLICY "Public insert treatments" ON public.treatments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update treatments" ON public.treatments;
CREATE POLICY "Public update treatments" ON public.treatments FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public delete treatments" ON public.treatments;
CREATE POLICY "Public delete treatments" ON public.treatments FOR DELETE USING (true);


-- 3. PRODUCTS TABLE (Store)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    price TEXT,
    image TEXT,
    description TEXT,
    stock INTEGER DEFAULT 10,
    "howToUse" TEXT,
    ingredients TEXT,
    is_published BOOLEAN DEFAULT true,
    brand TEXT DEFAULT 'elexoir',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert products" ON public.products;
CREATE POLICY "Public insert products" ON public.products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update products" ON public.products;
CREATE POLICY "Public update products" ON public.products FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public delete products" ON public.products;
CREATE POLICY "Public delete products" ON public.products FOR DELETE USING (true);


-- 4. THERAPISTS TABLE
CREATE TABLE IF NOT EXISTS public.therapists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    bio TEXT,
    image_url TEXT,
    rating NUMERIC DEFAULT 5.0,
    is_active BOOLEAN DEFAULT true,
    brand TEXT DEFAULT 'elexoir',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read therapists" ON public.therapists;
CREATE POLICY "Public read therapists" ON public.therapists FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert therapists" ON public.therapists;
CREATE POLICY "Public insert therapists" ON public.therapists FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update therapists" ON public.therapists;
CREATE POLICY "Public update therapists" ON public.therapists FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public delete therapists" ON public.therapists;
CREATE POLICY "Public delete therapists" ON public.therapists FOR DELETE USING (true);


-- 5. THERAPIST FEES TABLE
CREATE TABLE IF NOT EXISTS public.therapist_fees (
    id TEXT PRIMARY KEY,
    therapist_id TEXT,
    fee NUMERIC DEFAULT 0,
    brand TEXT DEFAULT 'elexoir',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.therapist_fees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read therapist_fees" ON public.therapist_fees;
CREATE POLICY "Public read therapist_fees" ON public.therapist_fees FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert therapist_fees" ON public.therapist_fees;
CREATE POLICY "Public insert therapist_fees" ON public.therapist_fees FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update therapist_fees" ON public.therapist_fees;
CREATE POLICY "Public update therapist_fees" ON public.therapist_fees FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public delete therapist_fees" ON public.therapist_fees;
CREATE POLICY "Public delete therapist_fees" ON public.therapist_fees FOR DELETE USING (true);


-- ==========================================
-- SEED INITIAL 2 ACTIVE HOMEPAGE CAMPAIGNS
-- ==========================================
INSERT INTO public.campaigns (id, title, label, description, image, duration, "discountPercentage", "selectedTreatments", "tripOffer", "order", is_published, brand)
VALUES 
(
    'camp-default-1',
    'Summer Retreat',
    'EXCLUSIVE OFFER',
    'Special summer massage package designed to rejuvenate your senses in the comfort of your private villa. Includes complimentary local organic fruit basket.',
    'https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop&crop=center',
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
    'https://images.pexels.com/photos/3865676/pexels-photo-3865676.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop&crop=center',
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
