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
    is_published?: boolean;
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

type SpaContextType = {
    treatments: Treatment[];
    setTreatments: React.Dispatch<React.SetStateAction<Treatment[]>>;
    campaign: Campaign | null;
    setCampaign: (c: Campaign | null) => void;
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



const SpaContext = createContext<SpaContextType | undefined>(undefined);

export function SpaProvider({ children }: { children: ReactNode }) {
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [savedProducts, setSavedProducts] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [siteBrandFilter, setSiteBrandFilter] = useState<string>(process.env.NEXT_PUBLIC_SITE_BRAND || 'elexoir');
    const [therapists, setTherapists] = useState<Therapist[]>([]);

    useEffect(() => {
        async function loadData() {
            let hasCache = false;
            try {
                const cachedTreatments = localStorage.getItem(`spa_treatments_${siteBrandFilter}`);
                const cachedProducts = localStorage.getItem(`spa_products_${siteBrandFilter}`);
                const cachedCampaign = localStorage.getItem(`spa_campaign_${siteBrandFilter}`);

                if (cachedTreatments) {
                    setTreatments(JSON.parse(cachedTreatments));
                    hasCache = true;
                }
                if (cachedProducts) {
                    setProducts(JSON.parse(cachedProducts));
                    hasCache = true;
                }
                if (cachedCampaign) {
                    setCampaign(JSON.parse(cachedCampaign));
                    hasCache = true;
                }

                if (hasCache) {
                    setIsLoading(false); // Hide skeleton if we have cached data
                }
            } catch (e) {
                console.error("Error reading from localStorage", e);
            }

            try {
                const siteBrand = siteBrandFilter;
                const [treatmentsRes, productsRes, campaignsRes, therapistsRes] = await Promise.all([
                    supabase.from('treatments').select('*').eq('is_published', true).eq('brand', siteBrand).order('created_at', { ascending: false }),
                    supabase.from('products').select('*').eq('is_published', true).eq('brand', siteBrand).order('created_at', { ascending: false }),
                    supabase.from('campaigns').select('*').eq('is_published', true).eq('brand', siteBrand).order('created_at', { ascending: false }),
                    supabase.from('therapists').select('*').eq('is_active', true).eq('brand', siteBrand).order('created_at', { ascending: false })
                ]);

                let fetchedTreatments = treatmentsRes.data;

                if (fetchedTreatments && fetchedTreatments.length > 0) {
                    setTreatments(fetchedTreatments);
                    try { localStorage.setItem(`spa_treatments_${siteBrandFilter}`, JSON.stringify(fetchedTreatments)); } catch(e) { console.warn("Cache full"); }
                }
                if (productsRes.data && productsRes.data.length > 0) {
                    setProducts(productsRes.data);
                    try { localStorage.setItem(`spa_products_${siteBrandFilter}`, JSON.stringify(productsRes.data)); } catch(e) { console.warn("Cache full"); }
                }
                if (campaignsRes.data && campaignsRes.data.length > 0) {
                    setCampaign(campaignsRes.data[0] as Campaign);
                    localStorage.setItem(`spa_campaign_${siteBrandFilter}`, JSON.stringify(campaignsRes.data[0]));
                }
                
                if (therapistsRes.data) {
                    setTherapists(therapistsRes.data);
                }

                if (hasCache) {
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error fetching data from Supabase:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
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
            treatments, setTreatments, campaign, setCampaign, products, setProducts,
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
