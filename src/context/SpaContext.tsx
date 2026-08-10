'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

// Define structures
export type TreatmentOption = {
    duration: string; // e.g. "60 Min", "90 Min"
    price: string;    // e.g. "450,000"
};

export type Treatment = {
    id: string;
    title: string;
    category: string;
    desc: string;
    options: TreatmentOption[];
    benefits?: string[];
    bgPattern: string;
    is_published?: boolean;
    is_pinned?: boolean;
    pinned_image?: string;
    created_at?: string;
    updated_at?: string;
};

export type Therapist = { id: string; name: string; bio: string; image_url: string; rating: number; is_active: boolean; brand: string; };

export type SelectedCampaignTreatment = {
    treatmentId: string;
    durations: string[]; // which durations are discounted
};

export type Product = {
    id: string;
    title: string;
    category: string;
    price: string;
    image: string;
    description: string;
    stock: number;
    howToUse?: string;
    ingredients?: string;
    is_published?: boolean;
    created_at?: string;
    updated_at?: string;
};

export type CartItem = {
    product: Product;
    quantity: number;
};

export type Campaign = {
    id?: string;
    title: string;
    label: string;
    description: string;
    image?: string;
    duration: string; // e.g., "1_month"
    discountPercentage: number;
    selectedTreatments: SelectedCampaignTreatment[];
    order?: number; // 1, 2, 3...
    is_published?: boolean;
    brand?: string;
    created_at?: string;
    updated_at?: string;
};

export type TherapistFee = {
    id: string;
    treatment_id: string;
    duration: string;
    fee: string;
    created_at?: string;
    updated_at?: string;
};

export type AdminBookingItem = {
    id: string;
    treatmentId: string;
    duration: string;
    treatmentsCount: number;
    therapistsCount: number;
    therapistNames?: string;
    priceOverride?: number;
    feeOverride?: number;
};

export type AdminBooking = {
    id: string;
    clientName: string;
    clientPhone: string;
    bookingDate: string;
    bookingTime: string;
    villaName: string;
    address: string;
    roomNumber?: string;
    googleMapsUrl?: string;
    items: AdminBookingItem[];
    transportFee: number;
    discountAmount: number;
    notes?: string;
    status: 'pending' | 'confirmed' | 'in_transit' | 'completed' | 'cancelled';
    brand: string;
    created_at: string;
};

export type DayTripPackage = {
    id: string;
    title: string;
    subtitle: string;
    region: string; // e.g. "Ubud & Waterfalls", "Uluwatu Sunset", "Bedugul & North", "Kintamani Volcano", "East Bali"
    highlights: string[];
    durationHours: number; // e.g. 6 (Half day) or 10 (Full day)
    carType: string; // e.g. "Private 5-Seater MPV" | "Luxury Van 12-Seater"
    includesDriver: boolean;
    includesFuel: boolean;
    includesTickets: boolean;
    includesWater: boolean;
    spaTreatmentAddon?: {
        enabled: boolean;
        treatmentTitle: string;
        duration: string;
        price: number;
    };
    customerPrice: number;
    driverFee: number;
    ticketCost: number;
    notes?: string;
    image?: string;
    brand: string;
    is_published?: boolean;
};

export type NusaPenidaTrip = {
    id: string;
    title: string;
    routeType: 'west' | 'east' | 'mix' | 'snorkeling';
    boatPort: string; // "Sanur Harbor"
    boatDepartureTime: string; // "07:30 AM" | "08:30 AM" | "09:15 AM"
    boatReturnTime: string; // "16:30 PM" | "17:00 PM"
    hotelPickupArea: string; // "Seminyak / Canggu / Ubud / Sanur / Kuta / Nusa Dua"
    passengerCount: number;
    includesFastboat: boolean;
    includesBaliTransfer: boolean;
    includesIslandCar: boolean;
    includesSnorkeling: boolean;
    includesLunch: boolean;
    spaTreatmentAddon?: {
        enabled: boolean;
        treatmentTitle: string;
        duration: string;
        price: number;
    };
    pricePerPerson: number;
    fastboatCostPerPerson: number;
    islandCarCost: number;
    baliTransferCost: number;
    snorkelingCostPerPerson: number;
    notes?: string;
    image?: string;
    brand: string;
    is_published?: boolean;
};

type SpaContextType = {
    treatments: Treatment[];
    setTreatments: React.Dispatch<React.SetStateAction<Treatment[]>>;
    campaign: Campaign | null;
    setCampaign: (c: Campaign | null) => void;
    campaigns: Campaign[];
    setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    cartItems: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    updateCartQuantity: (productId: string, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    savedProducts: string[];
    toggleSavedProduct: (productId: string) => void;
    isLoading: boolean;
    siteBrandFilter: string;
    setSiteBrandFilter: (brand: string) => void;
    therapists: Therapist[];
    setTherapists: React.Dispatch<React.SetStateAction<Therapist[]>>;
};



export const sortCampaigns = (list: Campaign[]): Campaign[] => {
    if (!Array.isArray(list)) return [];
    
    // Strictly deduplicate by unique title or ID so identical campaign cards never duplicate
    const seenTitles = new Set<string>();
    const seenIds = new Set<string>();
    const deduplicated: Campaign[] = [];
    
    for (const item of list) {
        if (!item || !item.title) continue;
        const normalizedTitle = item.title.trim().toLowerCase();
        const id = item.id;
        
        // If we already have a card with this title or ID, skip duplicate
        if (seenTitles.has(normalizedTitle) || (id && seenIds.has(id))) {
            continue;
        }
        
        seenTitles.add(normalizedTitle);
        if (id) seenIds.add(id);
        deduplicated.push(item);
    }

    return deduplicated.sort((a, b) => {
        const orderA = a.order !== undefined && a.order !== null ? a.order : 999;
        const orderB = b.order !== undefined && b.order !== null ? b.order : 999;
        if (orderA !== orderB) return orderA - orderB;
        return 0;
    });
};

export const DEFAULT_CAMPAIGNS: Campaign[] = [
    {
        id: 'a0000000-0000-0000-0000-000000000001',
        title: 'Summer Retreat',
        label: 'LIMITED 10% OFF',
        description: 'Enjoy a luxurious summer escape with exclusive spa treatments and limited-time discounts.',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
        duration: '1_month',
        discountPercentage: 10,
        selectedTreatments: [],
        order: 1,
        is_published: true,
        brand: 'elexoir'
    }
];

const SpaContext = createContext<SpaContextType | undefined>(undefined);

export function SpaProvider({ children, brand }: { children: ReactNode, brand?: string }) {
    const [treatments, setTreatments] = useState<Treatment[]>(() => {
        if (typeof window !== 'undefined') {
            try {
                const cached = localStorage.getItem('spa_treatments');
                if (cached) return JSON.parse(cached);
            } catch(e) {}
        }
        return [];
    });
    const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
        if (typeof window !== 'undefined') {
            try {
                const cached = localStorage.getItem('spa_campaigns');
                if (cached) {
                    const parsed = JSON.parse(cached);
                    if (Array.isArray(parsed) && parsed.length > 0) return sortCampaigns(parsed);
                }
            } catch(e) {}
        }
        return [];
    });
    const [campaign, setCampaign] = useState<Campaign | null>(() => {
        if (typeof window !== 'undefined') {
            try {
                const cached = localStorage.getItem('spa_campaign');
                if (cached) {
                    const parsed = JSON.parse(cached);
                    if (parsed) return parsed;
                }
            } catch(e) {}
        }
        return null;
    });
    const [products, setProducts] = useState<Product[]>(() => {
        if (typeof window !== 'undefined') {
            try {
                const cached = localStorage.getItem('spa_products');
                if (cached) return JSON.parse(cached);
            } catch(e) {}
        }
        return [];
    });
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [savedProducts, setSavedProducts] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [siteBrandFilter, setSiteBrandFilter] = useState<string>(brand || process.env.NEXT_PUBLIC_SITE_BRAND || 'elexoir');
    const [therapists, setTherapists] = useState<Therapist[]>([]);

    useEffect(() => {
        async function loadData() {
            let hasCache = false;
            try {
                const cachedTreatments = localStorage.getItem('spa_treatments');
                const cachedProducts = localStorage.getItem('spa_products');
                const cachedCampaigns = localStorage.getItem('spa_campaigns');
                const cachedCampaign = localStorage.getItem('spa_campaign');

                if (cachedTreatments) {
                    setTreatments(JSON.parse(cachedTreatments));
                    hasCache = true;
                }
                if (cachedProducts) {
                    setProducts(JSON.parse(cachedProducts));
                    hasCache = true;
                }
                if (cachedCampaigns !== null) {
                    const parsed = JSON.parse(cachedCampaigns);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        const sorted = sortCampaigns(parsed);
                        setCampaigns(sorted);
                        setCampaign(sorted[0] || null);
                        hasCache = true;
                    }
                } else if (cachedCampaign !== null) {
                    const single = JSON.parse(cachedCampaign);
                    if (single) {
                        setCampaigns([single]);
                        setCampaign(single);
                        hasCache = true;
                    }
                }

                // Wait for Supabase to finish before dismissing loader
                // if (hasCache) {
                //     setIsLoading(false);
                // }
            } catch (e) {
                console.error("Error reading from localStorage", e);
            }

            try {
                const siteBrand = siteBrandFilter;
                // Query campaigns directly across brands or fallback smoothly in parallel
                let [treatmentsRes, productsRes, campaignsRes, therapistsRes] = await Promise.all([
                    supabase.from('treatments').select('*').eq('is_published', true).eq('brand', siteBrand).order('created_at', { ascending: false }),
                    supabase.from('products').select('*').eq('is_published', true).eq('brand', siteBrand).order('created_at', { ascending: false }),
                    supabase.from('campaigns').select('*').eq('is_published', true).order('created_at', { ascending: false }),
                    supabase.from('therapists').select('*').eq('is_active', true).eq('brand', siteBrand).order('created_at', { ascending: false })
                ]);

                // Fallback to 'elexoir' if current brand has no treatments
                if (siteBrand !== 'elexoir' && (!treatmentsRes.data || treatmentsRes.data.length === 0)) {
                    const fallbackRes = await Promise.all([
                        supabase.from('treatments').select('*').eq('is_published', true).eq('brand', 'elexoir').order('created_at', { ascending: false }),
                        supabase.from('products').select('*').eq('is_published', true).eq('brand', 'elexoir').order('created_at', { ascending: false }),
                        supabase.from('therapists').select('*').eq('is_active', true).eq('brand', 'elexoir').order('created_at', { ascending: false })
                    ]);
                    treatmentsRes = fallbackRes[0];
                    productsRes = fallbackRes[1];
                    therapistsRes = fallbackRes[2];
                }

                if (treatmentsRes.data && treatmentsRes.data.length > 0) {
                    setTreatments(treatmentsRes.data);
                    try { localStorage.setItem('spa_treatments', JSON.stringify(treatmentsRes.data)); } catch (e) { console.warn("Cache full"); }
                }

                if (productsRes.data && productsRes.data.length > 0) {
                    setProducts(productsRes.data);
                    try { localStorage.setItem('spa_products', JSON.stringify(productsRes.data)); } catch (e) { console.warn("Cache full"); }
                }

                // If DB has campaigns, update state and local cache
                if (campaignsRes.data && campaignsRes.data.length > 0) {
                    const fetchedCampaigns = sortCampaigns(campaignsRes.data as Campaign[]);
                    setCampaigns(fetchedCampaigns);
                    setCampaign(fetchedCampaigns[0] || null);
                    try { 
                        localStorage.setItem('spa_campaigns', JSON.stringify(fetchedCampaigns));
                        localStorage.setItem('spa_campaign', JSON.stringify(fetchedCampaigns[0] || null));
                    } catch(e) {}
                }

                if (therapistsRes.data) {
                    setTherapists(therapistsRes.data);
                }
            } catch (error) {
                console.error("Error fetching data from Supabase:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();

        // Listen for realtime sync across tabs or admin updates
        const handleSync = () => {
            try {
                const stored = localStorage.getItem('spa_campaigns');
                if (stored !== null) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed)) {
                        const sorted = sortCampaigns(parsed);
                        setCampaigns(sorted);
                        setCampaign(sorted[0] || null);
                    }
                }
            } catch (e) {}
        };

        window.addEventListener('storage', handleSync);
        window.addEventListener('spa_campaigns_updated', handleSync);

        return () => {
            window.removeEventListener('storage', handleSync);
            window.removeEventListener('spa_campaigns_updated', handleSync);
        };
    }, [siteBrandFilter]);

    const toggleSavedProduct = (productId: string) => {
        setSavedProducts(prev =>
            prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
        );
    };

    const addToCart = (product: Product, quantity: number) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
            }
            return [...prev, { product, quantity }];
        });
    };

    const updateCartQuantity = (productId: string, quantity: number) => {
        setCartItems(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
    };

    const removeFromCart = (productId: string) => {
        setCartItems(prev => prev.filter(item => item.product.id !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <SpaContext.Provider value={{
            treatments, setTreatments, campaign, setCampaign, campaigns, setCampaigns, products, setProducts,
            cartItems, addToCart, updateCartQuantity, removeFromCart, clearCart,
            savedProducts, toggleSavedProduct,
            isLoading,
            siteBrandFilter,
            setSiteBrandFilter,
            therapists, setTherapists
        }}>
            {children}
        </SpaContext.Provider>
    );
}

export function useSpa() {
    const context = useContext(SpaContext);
    if (context === undefined) {
        throw new Error('useSpa must be used within a SpaProvider');
    }
    return context;
}
