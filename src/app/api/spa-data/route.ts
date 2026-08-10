import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 60; // Cache on Vercel Edge/Server for 60 seconds

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand') || 'elexoir';

    try {
        let [treatmentsRes, productsRes, campaignsRes, therapistsRes] = await Promise.all([
            supabase.from('treatments').select('*').eq('is_published', true).eq('brand', brand).order('created_at', { ascending: false }),
            supabase.from('products').select('*').eq('is_published', true).eq('brand', brand).order('created_at', { ascending: false }),
            supabase.from('campaigns').select('id, title, label, description, image, image_url, duration, "discountPercentage", "selectedTreatments", "tripOffer", "tripImage", trip_image_url, "campaignType", "order", is_published, brand, created_at, updated_at').eq('is_published', true).order('created_at', { ascending: false }),
            supabase.from('therapists').select('*').eq('is_active', true).eq('brand', brand).order('created_at', { ascending: false })
        ]);

        // Fallback to elexoir if current brand has no treatments
        if (brand !== 'elexoir' && (!treatmentsRes.data || treatmentsRes.data.length === 0)) {
            const fallbackRes = await Promise.all([
                supabase.from('treatments').select('*').eq('is_published', true).eq('brand', 'elexoir').order('created_at', { ascending: false }),
                supabase.from('products').select('*').eq('is_published', true).eq('brand', 'elexoir').order('created_at', { ascending: false }),
                supabase.from('therapists').select('*').eq('is_active', true).eq('brand', 'elexoir').order('created_at', { ascending: false })
            ]);
            treatmentsRes = fallbackRes[0];
            productsRes = fallbackRes[1];
            therapistsRes = fallbackRes[2];
        }

        return NextResponse.json({
            treatments: treatmentsRes.data || [],
            products: productsRes.data || [],
            campaigns: campaignsRes.data || [],
            therapists: therapistsRes.data || []
        });
    } catch (error) {
        console.error("API error fetching spa data:", error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
