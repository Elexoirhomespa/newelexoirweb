'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, PlusCircle, Settings, LogOut, UploadCloud, CheckCircle, Store, Sparkles, Plus, Trash2, Megaphone, Edit3, Pin, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { useSpa, SelectedCampaignTreatment, Treatment, Product, TherapistFee } from '@/context/SpaContext';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {

    const [activeTab, setActiveTab] = useState<'treatment' | 'campaign' | 'list' | 'settings' | 'store' | 'fees' | 'therapists'>('treatment');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    
    // File input ref for pinning treatments
    const pinImageInputRef = useRef<HTMLInputElement>(null);
    const [pendingPinId, setPendingPinId] = useState<string | null>(null);

    const { treatments, setTreatments, campaign, setCampaign, products, setProducts, siteBrandFilter, setSiteBrandFilter, therapists, setTherapists } = useSpa();

    // Local state for Therapist Fees (private to admin dashboard)
    const [therapistFees, setTherapistFees] = useState<TherapistFee[]>([]);

    useEffect(() => {
        async function fetchFees() {
            const { data } = await supabase.from('therapist_fees').select('*').eq('brand', 'elexoir').order('created_at', { ascending: false });
            if (data) {
                setTherapistFees(data);
            }
        }
        fetchFees();
    }, []);

    // Campaign specific fields
    const [campaignTitle, setCampaignTitle] = useState(campaign?.title || '');
    const [campaignLabel, setCampaignLabel] = useState(campaign?.label || '');
    const [campaignDesc, setCampaignDesc] = useState(campaign?.description || '');
    const [campaignDuration, setCampaignDuration] = useState(campaign?.duration || '');
    const [discountPercentage, setDiscountPercentage] = useState<number>(campaign?.discountPercentage || 20);
    const [campaignTreatments, setCampaignTreatments] = useState<SelectedCampaignTreatment[]>(campaign?.selectedTreatments || []);
    const [campaignImage, setCampaignImage] = useState<string>(campaign?.image || '');

    const toggleCampaignTreatmentDuration = (treatmentId: string, duration: string) => {
        setCampaignTreatments(prev => {
            const existing = prev.find(t => t.treatmentId === treatmentId);
            if (existing) {
                // If duration already exists, remove it
                if (existing.durations.includes(duration)) {
                    const newDurations = existing.durations.filter(d => d !== duration);
                    if (newDurations.length === 0) {
                        return prev.filter(t => t.treatmentId !== treatmentId); // Remove treatment if no durations left
                    }
                    return prev.map(t => t.treatmentId === treatmentId ? { ...t, durations: newDurations } : t);
                }
                // Add duration
                return prev.map(t => t.treatmentId === treatmentId ? { ...t, durations: [...t.durations, duration] } : t);
            }
            // Add new treatment with this duration
            return [...prev, { treatmentId, durations: [duration] }];
        });
    };

    // Dynamic fields for Treatment
    const [treatmentTitle, setTreatmentTitle] = useState('');
    const [treatmentCategory, setTreatmentCategory] = useState('massage');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [treatmentDesc, setTreatmentDesc] = useState('');
    const [editingTreatmentId, setEditingTreatmentId] = useState<string | null>(null);

    // Dynamic fields for Store
    const [productTitle, setProductTitle] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productImage, setProductImage] = useState('');
    const [productStock, setProductStock] = useState(10);
    const [productDesc, setProductDesc] = useState('');
    const [productHowToUse, setProductHowToUse] = useState('');
    const [productIngredients, setProductIngredients] = useState('');
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);

    // Dynamic fields for Therapist Fees
    const [feeInputs, setFeeInputs] = useState<{ [key: string]: string }>({});
    const [feeSearch, setFeeSearch] = useState('');
    const [expandedFees, setExpandedFees] = useState<{ [key: string]: boolean }>({});
    
    // Initialize feeInputs from therapistFees whenever therapistFees load
    useEffect(() => {
        const initial: { [key: string]: string } = {};
        therapistFees.forEach(f => {
            initial[`${f.treatment_id}-${f.duration}`] = f.fee;
        });
        setFeeInputs(initial);
    }, [therapistFees]);

    const [listView, setListView] = useState<'campaign' | 'treatments' | 'store' | 'fees'>('campaign');

    const [pricingOptions, setPricingOptions] = useState([{ duration: '', price: '' }]);
    const [benefits, setBenefits] = useState(['']);

    const handleAddPricing = () => setPricingOptions([...pricingOptions, { duration: '', price: '' }]);
    const handleRemovePricing = (index: number) => {
        if (pricingOptions.length > 1) {
            setPricingOptions(pricingOptions.filter((_, i) => i !== index));
        }
    };
    const handlePricingChange = (index: number, field: 'duration' | 'price', value: string) => {
        const newOptions = [...pricingOptions];
        newOptions[index][field] = value;
        setPricingOptions(newOptions);
    };

    const handleAddBenefit = () => setBenefits([...benefits, '']);
    const handleRemoveBenefit = (index: number) => {
        if (benefits.length > 1) {
            setBenefits(benefits.filter((_, i) => i !== index));
        }
    };
    const handleBenefitChange = (index: number, value: string) => {
        const newBenefits = [...benefits];
        newBenefits[index] = value;
        setBenefits(newBenefits);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            if (activeTab === 'campaign') {
                const campaignData = {
                    title: campaignTitle,
                    label: campaignLabel,
                    description: campaignDesc,
                    image: campaignImage || 'https://images.pexels.com/photos/3951375/pexels-photo-3951375.jpeg',
                    duration: campaignDuration,
                    discountPercentage,
                    selectedTreatments: campaignTreatments,
                    is_published: true
                };
                if (editingCampaignId) {
                    await supabase.from('campaigns').update(campaignData).eq('id', editingCampaignId);
                    setCampaign({ ...campaignData, id: editingCampaignId } as any);
                } else {
                    const { data } = await supabase.from('campaigns').insert([campaignData]).select();
                    if (data && data.length > 0) {
                        setCampaign(data[0] as any);
                    } else {
                        setCampaign(campaignData as any);
                    }
                }
                setEditingCampaignId(null);
            } else if (activeTab === 'treatment') {
                const treatmentData = {
                    title: treatmentTitle,
                    category: treatmentCategory,
                    desc: treatmentDesc,
                    benefits: benefits.filter(b => b.trim() !== ''),
                    bgPattern: 'from-secondary/10 via-white to-white',
                    options: pricingOptions.map(o => ({ duration: o.duration, price: o.price })),
                    is_published: true
                };
                
                if (editingTreatmentId) {
                    await supabase.from('treatments').update(treatmentData).eq('id', editingTreatmentId);
                    setTreatments(prev => prev.map(t => t.id === editingTreatmentId ? { ...t, ...treatmentData } : t));
                } else {
                    const { data } = await supabase.from('treatments').insert([treatmentData]).select();
                    if (data && data.length > 0) {
                        setTreatments(prev => [...prev, data[0] as Treatment]);
                    }
                }
                setEditingTreatmentId(null);
                setTreatmentTitle('');
                setTreatmentDesc('');
                setBenefits(['']);
                setPricingOptions([{ duration: '', price: '' }]);
            } else if (activeTab === 'store') {
                const productData = {
                    title: productTitle,
                    category: productCategory || 'Accessories',
                    price: productPrice,
                    image: productImage || 'https://images.pexels.com/photos/6724391/pexels-photo-6724391.jpeg',
                    description: productDesc,
                    stock: productStock,
                    howToUse: productHowToUse,
                    ingredients: productIngredients,
                    is_published: true
                };
                
                if (editingProductId) {
                    await supabase.from('products').update(productData).eq('id', editingProductId);
                    setProducts(prev => prev.map(p => p.id === editingProductId ? { ...p, ...productData } : p));
                } else {
                    const { data } = await supabase.from('products').insert([productData]).select();
                    if (data && data.length > 0) {
                        setProducts(prev => [...prev, data[0] as Product]);
                    }
                }
                setEditingProductId(null);
                setProductTitle('');
                setProductCategory('');
                setProductPrice('');
                setProductImage('');
                setProductStock(10);
                setProductDesc('');
                setProductHowToUse('');
                setProductIngredients('');
            }

            setIsSubmitting(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Error saving data:", error);
            setIsSubmitting(false);
        }
    };

    const handleEditTreatment = (t: Treatment) => {
        setEditingTreatmentId(t.id);
        setTreatmentTitle(t.title);
        setTreatmentCategory(t.category);
        setTreatmentDesc(t.desc);
        setBenefits(t.benefits && t.benefits.length > 0 ? t.benefits : ['']);
        setPricingOptions(t.options.map(o => ({ duration: o.duration, price: o.price })));
        setActiveTab('treatment');
    };

    const handleRemoveTreatment = (id: string) => {
        setTreatments(prev => prev.filter(t => t.id !== id));
        if (campaign) {
            setCampaign({
                ...campaign,
                selectedTreatments: campaign.selectedTreatments.filter(t => t.treatmentId !== id)
            });
        }
    };

    const handleEditCampaign = () => {
        if (!campaign) return;
        setEditingCampaignId(campaign.id || null);
        setCampaignTitle(campaign.title);
        setCampaignLabel(campaign.label);
        setCampaignDesc(campaign.description);
        setCampaignImage(campaign.image || '');
        setCampaignDuration(campaign.duration);
        setDiscountPercentage(campaign.discountPercentage);
        setCampaignTreatments(campaign.selectedTreatments);
        setActiveTab('campaign');
    };

    const handleRemoveCampaign = () => {
        setCampaign(null);
    };

    const handleEditProduct = (p: Product) => {
        setEditingProductId(p.id);
        setProductTitle(p.title);
        setProductCategory(p.category);
        setProductPrice(p.price);
        setProductImage(p.image);
        setProductStock(p.stock || 10);
        setProductDesc(p.description);
        setProductHowToUse(p.howToUse || '');
        setProductIngredients(p.ingredients || '');
        setActiveTab('store');
    };

    const handleRemoveProduct = (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const handleEditFee = (f: TherapistFee) => {
        // Obsolete
    };

    const handleRemoveFee = async (id: string) => {
        // Obsolete
    };

    const handleFeeChange = (treatmentId: string, duration: string, value: string) => {
        const numericValue = value.replace(/\D/g, '');
        const formattedValue = numericValue ? parseInt(numericValue).toLocaleString('en-US') : '';
        setFeeInputs(prev => ({
            ...prev,
            [`${treatmentId}-${duration}`]: formattedValue
        }));
    };

    const handleSaveFees = async (treatmentId: string, options: {duration: string}[]) => {
        setIsSubmitting(true);
        for (const opt of options) {
            const feeValue = feeInputs[`${treatmentId}-${opt.duration}`];
            if (feeValue) {
                // Check if exists
                const existing = therapistFees.find(f => f.treatment_id === treatmentId && f.duration === opt.duration);
                if (existing) {
                    await supabase.from('therapist_fees').update({ fee: feeValue }).eq('id', existing.id);
                    setTherapistFees(prev => prev.map(f => f.id === existing.id ? { ...f, fee: feeValue } : f));
                } else {
                    const { data } = await supabase.from('therapist_fees').insert([{ treatment_id: treatmentId, duration: opt.duration, fee: feeValue }]).select();
                    if (data && data.length > 0) {
                        setTherapistFees(prev => [...prev, data[0] as TherapistFee]);
                    }
                }
            }
        }
        setIsSubmitting(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    const resizeImage = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let { width, height } = img;
                    const MAX_WIDTH = 600;
                    const MAX_HEIGHT = 600;
                    
                    if (width > height && width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    } else if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const resizedUrl = await resizeImage(file);
            setter(resizedUrl);
        }
    };

    const handlePinImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && pendingPinId) {
            const file = e.target.files[0];
            try {
                const dataUrl = await resizeImage(file);
                
                // Optimistic update
                setTreatments(prev => prev.map(trt => trt.id === pendingPinId ? { ...trt, is_pinned: true, pinned_image: dataUrl } : trt));
                
                const { error } = await supabase.from('treatments').update({ is_pinned: true, pinned_image: dataUrl }).eq('id', pendingPinId);
                if (error) throw error;
            } catch (err: any) {
                console.error("Failed to pin with image:", err);
                setTreatments(prev => prev.map(trt => trt.id === pendingPinId ? { ...trt, is_pinned: false, pinned_image: undefined } : trt));
                alert(`Error saving image: ${err.message || 'Unknown error'}. Try using a smaller photo.`);
            }
            
            setPendingPinId(null);
            if (pinImageInputRef.current) {
                pinImageInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="min-h-screen bg-black flex overflow-hidden font-sans text-white/90">
            
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] border-r border-white/20/50 shadow-soft z-20">
                <div className="p-8">
                    <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
                        <Store size={20} strokeWidth={2.5} />
                        <span className="text-[13px] font-bold tracking-widest uppercase mt-1">Elexoir Admin</span>
                    </Link>
                </div>
                
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <button 
                        onClick={() => setActiveTab('treatment')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'treatment' ? 'bg-white/20 text-white' : 'text-white/90-muted hover:bg-white/5 hover:text-white'}`}
                    >
                        <PlusCircle size={18} />
                        Create Treatment
                    </button>
                    <button 
                        onClick={() => setActiveTab('campaign')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'campaign' ? 'bg-white/20 text-white' : 'text-white/90-muted hover:bg-white/5 hover:text-white'}`}
                    >
                        <Megaphone size={18} />
                        Create Campaign
                    </button>
                    <button 
                        onClick={() => setActiveTab('store')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'store' ? 'bg-white/20 text-white' : 'text-white/90-muted hover:bg-white/5 hover:text-white'}`}
                    >
                        <Store size={18} />
                        Store Product
                    </button>
                    <button 
                        onClick={() => setActiveTab('fees')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'fees' ? 'bg-white/20 text-white' : 'text-white/90-muted hover:bg-white/5 hover:text-white'}`}
                    >
                        <Settings size={18} />
                        Therapist Fees
                    </button>
                    <button 
                        onClick={() => setActiveTab('list')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'list' ? 'bg-white/20 text-white' : 'text-white/90-muted hover:bg-white/5 hover:text-white'}`}
                    >
                        <LayoutDashboard size={18} />
                        Overview
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-white/90-muted hover:bg-white/5 hover:text-white rounded-xl text-sm font-semibold transition-colors">
                        <Settings size={18} />
                        Settings
                    </button>
                </nav>

                <div className="p-4 space-y-2">
                    <button onClick={() => setSelectedAdminBrand(null)} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-text hover:bg-white/5 rounded-xl text-sm font-semibold transition-colors border border-white/10">
                        <Store size={18} />
                        Switch Brand
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl text-sm font-semibold transition-colors">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative overflow-y-auto">
                {/* Background Details */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-highlight/20 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-4xl mx-auto p-6 md:p-12 relative z-10 pt-12 md:pt-12 pb-32 md:pb-12">
                    
                    {/* Mobile Header (Hidden on Desktop) */}
                    <div className="md:hidden flex items-center justify-between mb-8">
                        <Link href="/" className="flex items-center gap-2 text-white">
                            <Store size={20} strokeWidth={2.5} />
                            <span className="text-[13px] font-bold tracking-widest uppercase mt-1">Elexoir</span>
                        </Link>
                        {/* Tab buttons removed in favor of bottom nav bar */}
                    </div>

                    <header className="mb-10">
                        <h1 className="font-serif text-3xl md:text-4xl text-white font-medium mb-2">
                            {activeTab === 'treatment' ? (editingTreatmentId ? 'Edit Treatment' : 'Create New Treatment') : 
                             activeTab === 'campaign' ? 'Create Campaign Card' : 
                             activeTab === 'store' ? (editingProductId ? 'Edit Product' : 'Add New Product') : 
                             activeTab === 'fees' ? 'Set Therapist Fee' :
                             activeTab === 'list' ? 'Menu & Offers Management' : 'Settings'}
                        </h1>
                        <p className="text-white/90-muted text-sm">
                            {activeTab === 'treatment' ? 'Add or edit a massage or ritual to your spa menu.' : 
                             activeTab === 'campaign' ? 'Design a stunning new promotional banner for the homepage.' :
                             activeTab === 'store' ? 'Add physical products like oils or candles to the Elexoir Boutique.' :
                             activeTab === 'fees' ? 'Configure fees paid to therapists based on the duration of the treatment.' :
                             activeTab === 'list' ? 'Manage your published treatments, campaigns, and store products.' : ''}
                        </p>
                    </header>

                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="md:bg-white/5 md:backdrop-blur-2xl md:border md:border-white/10 md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:rounded-[32px] md:p-10"
                        >
                            <form onSubmit={handleSubmit} className="space-y-8">
                                
                                {activeTab === 'treatment' && (
                                    <>
                                        {/* Title & Category */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Treatment Title</label>
                                                <input 
                                                    type="text" required placeholder="e.g. Deep Tissue Flow" 
                                                    value={treatmentTitle} onChange={e => setTreatmentTitle(e.target.value)}
                                                    className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/90-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/20 transition-all shadow-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Category</label>
                                                <select 
                                                    value={treatmentCategory} onChange={e => setTreatmentCategory(e.target.value)}
                                                    className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/20 transition-all shadow-sm appearance-none"
                                                >
                                                    <option value="Massage">Massage</option>
                                                    <option value="Facial">Facial</option>
                                                    <option value="Package">Package</option>
                                                    <option value="Ritual">Ritual</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Dynamic Duration & Pricing */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Duration & Pricing</label>
                                                <button type="button" onClick={handleAddPricing} className="text-xs font-bold text-white flex items-center gap-1 hover:opacity-70 transition-opacity">
                                                    <Plus size={14} /> Add Option
                                                </button>
                                            </div>
                                            {pricingOptions.map((option, idx) => (
                                                <div key={idx} className="flex items-center gap-4">
                                                    <div className="flex-1 relative">
                                                        <input 
                                                            type="number" required placeholder="60" value={option.duration} onChange={(e) => handlePricingChange(idx, 'duration', e.target.value)}
                                                            className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-2xl px-5 py-4 pr-16 text-sm text-white placeholder:text-white/90-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/20 transition-all shadow-sm"
                                                        />
                                                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-semibold text-white/90-muted">MINS</span>
                                                    </div>
                                                    <div className="flex-[2] relative">
                                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-white/90-muted">Rp</span>
                                                        <input 
                                                            type="text" required placeholder="450,000" value={option.price} onChange={(e) => handlePricingChange(idx, 'price', e.target.value)}
                                                            className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-2xl px-12 py-4 text-sm text-white placeholder:text-white/90-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/20 transition-all shadow-sm"
                                                        />
                                                    </div>
                                                    {pricingOptions.length > 1 && (
                                                        <button type="button" onClick={() => handleRemovePricing(idx)} className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 hover:bg-red-100 transition-colors">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Description</label>
                                            <textarea 
                                                required rows={3} placeholder="Write a captivating description about the treatment..." 
                                                value={treatmentDesc} onChange={e => setTreatmentDesc(e.target.value)}
                                                className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/90-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/20 transition-all shadow-sm resize-none"
                                            />
                                        </div>

                                        {/* Dynamic Benefits */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Key Benefits</label>
                                                <button type="button" onClick={handleAddBenefit} className="text-xs font-bold text-white flex items-center gap-1 hover:opacity-70 transition-opacity">
                                                    <Plus size={14} /> Add Benefit
                                                </button>
                                            </div>
                                            {benefits.map((benefit, idx) => (
                                                <div key={idx} className="flex items-center gap-4">
                                                    <input 
                                                        type="text" required placeholder="e.g. Relieves deep muscle tension" value={benefit} onChange={(e) => handleBenefitChange(idx, e.target.value)}
                                                        className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/90-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/20 transition-all shadow-sm"
                                                    />
                                                    {benefits.length > 1 && (
                                                        <button type="button" onClick={() => handleRemoveBenefit(idx)} className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 hover:bg-red-100 transition-colors">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {activeTab === 'campaign' && (
                                    <>
                                        {/* Campaign Title & Label */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Campaign Title</label>
                                                <input 
                                                    type="text" required placeholder="e.g. Summer Retreat" 
                                                    value={campaignTitle} onChange={e => setCampaignTitle(e.target.value)}
                                                    className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/90-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/20 transition-all shadow-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Offer Label</label>
                                                <input 
                                                    type="text" required placeholder="e.g. Limited Offer" 
                                                    value={campaignLabel} onChange={e => setCampaignLabel(e.target.value)}
                                                    className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/90-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/20 transition-all shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Image Upload Area for Campaign */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Cinematic Background Image</label>
                                            <label className="w-full border-2 border-dashed border-white/20/50 rounded-[24px] bg-white/30 hover:bg-white/50 transition-colors flex flex-col items-center justify-center py-12 cursor-pointer group relative overflow-hidden">
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="hidden" 
                                                    onChange={(e) => handleImageUpload(e, setCampaignImage)} 
                                                />
                                                {campaignImage ? (
                                                    <img src={campaignImage} alt="Campaign Background" className="absolute inset-0 w-full h-full object-contain bg-black/5 opacity-90" />
                                                ) : (
                                                    <>
                                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                                                            <UploadCloud size={24} />
                                                        </div>
                                                        <p className="text-sm font-medium text-white mb-1">Click to upload landscape image</p>
                                                        <p className="text-xs text-white/90-muted">High resolution JPG or PNG</p>
                                                    </>
                                                )}
                                            </label>
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Subtext / Description</label>
                                            <textarea 
                                                required rows={3} placeholder="Enjoy up to 20% off all signature treatments this month..." 
                                                value={campaignDesc} onChange={e => setCampaignDesc(e.target.value)}
                                                className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/90-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/20 transition-all shadow-sm resize-none"
                                            />
                                        </div>

                                        {/* Campaign Duration */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Campaign Duration</label>
                                                <div className="relative">
                                                    <select 
                                                        className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/20 transition-all shadow-sm appearance-none"
                                                        value={campaignDuration}
                                                        onChange={(e) => setCampaignDuration(e.target.value)}
                                                    >
                                                        <option value="" disabled>Select how long the offer lasts</option>
                                                        <option value="1_week">1 Week</option>
                                                        <option value="2_weeks">2 Weeks</option>
                                                        <option value="1_month">1 Month</option>
                                                        <option value="custom">Custom Date Range</option>
                                                    </select>
                                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/90-muted">
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Discount Percentage (%)</label>
                                                <input 
                                                    type="number" required min="1" max="100" placeholder="20" 
                                                    value={discountPercentage} onChange={e => setDiscountPercentage(Number(e.target.value))}
                                                    className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/90-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/20 transition-all shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Treatments Selection for Campaign */}
                                        <div className="space-y-3 pt-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Select Treatments & Durations for Offer</label>
                                            <div className="grid grid-cols-1 gap-3">
                                                {treatments.map((t) => {
                                                    const selectedT = campaignTreatments.find(ct => ct.treatmentId === t.id);
                                                    const isSelectedAny = !!selectedT;
                                                    return (
                                                        <div 
                                                            key={t.id} 
                                                            className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col gap-3 ${
                                                                isSelectedAny 
                                                                ? 'bg-white/5 border-primary shadow-sm' 
                                                                : 'bg-white/50 border-white/20/50'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <h4 className={`text-sm font-bold ${isSelectedAny ? 'text-white' : 'text-white/90-muted'}`}>{t.title}</h4>
                                                                    <p className="text-[10px] uppercase tracking-widest font-semibold text-white/90-muted/70">{t.category}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 mt-1">
                                                                {t.options.map((opt) => {
                                                                    const isDurationSelected = selectedT?.durations.includes(opt.duration);
                                                                    return (
                                                                        <button
                                                                            type="button"
                                                                            key={opt.duration}
                                                                            onClick={() => toggleCampaignTreatmentDuration(t.id, opt.duration)}
                                                                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
                                                                                isDurationSelected 
                                                                                ? 'bg-white border-primary text-white shadow-sm scale-105' 
                                                                                : 'bg-white/10 border-white/20/60 text-white/90-muted hover:bg-white/20'
                                                                            }`}
                                                                        >
                                                                            {opt.duration} - Rp {opt.price}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'store' && (
                                    <>
                                        {/* Product Title & Category */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Product Title</label>
                                                <input 
                                                    type="text" required placeholder="e.g. Signature Massage Oil" 
                                                    value={productTitle} onChange={e => setProductTitle(e.target.value)}
                                                    className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/90-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/20 transition-all shadow-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Category</label>
                                                <input 
                                                    type="text" required placeholder="e.g. Oils" 
                                                    value={productCategory} onChange={e => setProductCategory(e.target.value)}
                                                    className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/90-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/20 transition-all shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Product Price & Stock */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Price (Rp)</label>
                                                <input 
                                                    type="text" required placeholder="e.g. 350,000" 
                                                    value={productPrice} onChange={e => setProductPrice(e.target.value)}
                                                    className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/90-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/20 transition-all shadow-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Stock Quantity</label>
                                                <input 
                                                    type="number" required min="0" placeholder="e.g. 10" 
                                                    value={productStock} onChange={e => setProductStock(parseInt(e.target.value) || 0)}
                                                    className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/90-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/20 transition-all shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Product Image */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Upload Image</label>
                                            <div className="relative w-full h-48 bg-white/50 border-2 border-dashed border-white/20/50 rounded-2xl overflow-hidden hover:bg-white/80 transition-all flex flex-col items-center justify-center group cursor-pointer">
                                                <input 
                                                    type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setProductImage)}
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                />
                                                {productImage ? (
                                                    <>
                                                        <img src={productImage} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                            <span className="bg-white/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase">Change Image</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-center text-white/90-muted group-hover:text-white transition-colors">
                                                        <UploadCloud className="mx-auto mb-2 opacity-50 group-hover:opacity-100" size={24} />
                                                        <p className="text-sm font-semibold">Click or drag image to upload</p>
                                                        <p className="text-xs opacity-70 mt-1">PNG, JPG up to 5MB</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Description</label>
                                            <textarea 
                                                required rows={4} placeholder="Write a captivating description about the product..." 
                                                value={productDesc} onChange={e => setProductDesc(e.target.value)}
                                                className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/90-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/20 transition-all shadow-sm resize-none"
                                            />
                                        </div>

                                        {/* How to Use */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">How to Use</label>
                                            <textarea 
                                                rows={4} placeholder="Instructions on how to use..." 
                                                value={productHowToUse} onChange={e => setProductHowToUse(e.target.value)}
                                                className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/90-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/20 transition-all shadow-sm resize-none"
                                            />
                                        </div>

                                        {/* Ingredients */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Ingredients</label>
                                            <textarea 
                                                rows={3} placeholder="Comma-separated ingredients..." 
                                                value={productIngredients} onChange={e => setProductIngredients(e.target.value)}
                                                className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/90-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/20 transition-all shadow-sm resize-none"
                                            />
                                        </div>
                                    </>
                                )}

                        {activeTab === 'fees' && (
                                    <div className="space-y-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                                <Store size={20} className="text-secondary" /> Therapist Fees Setup
                                            </h2>
                                            <div className="flex items-center gap-4">
                                                <input 
                                                    type="text"
                                                    placeholder="Search treatments..."
                                                    value={feeSearch}
                                                    onChange={(e) => setFeeSearch(e.target.value)}
                                                    className="w-full md:w-64 bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/90-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                                />
                                                <span className="text-xs font-semibold text-white/90-muted bg-white/10 px-3 py-1 rounded-full whitespace-nowrap">
                                                    {treatments.filter(t => t.title.toLowerCase().includes(feeSearch.toLowerCase()) || t.category.toLowerCase().includes(feeSearch.toLowerCase())).length} Treatments
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6">
                                            {treatments.filter(t => t.title.toLowerCase().includes(feeSearch.toLowerCase()) || t.category.toLowerCase().includes(feeSearch.toLowerCase())).map((t) => {
                                                const isExpanded = expandedFees[t.id] || false;
                                                return (
                                                <div key={t.id} className="bg-white/5 border border-white/20/50 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:border-primary/20">
                                                    {/* Header Section (Always Visible) */}
                                                    <div 
                                                        className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-white/40 transition-colors"
                                                        onClick={() => setExpandedFees(prev => ({...prev, [t.id]: !isExpanded}))}
                                                    >
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <h3 className="font-bold text-white text-base">{t.title}</h3>
                                                                <span className="text-[10px] font-bold text-white/90-muted bg-white/10 px-2 py-0.5 rounded-md uppercase tracking-widest">{t.category}</span>
                                                            </div>
                                                            <p className="text-xs text-white/90-muted">{t.options.length} duration options</p>
                                                        </div>
                                                        <div className="flex items-center justify-between md:justify-end gap-6">
                                                            {isExpanded ? <ChevronUp className="text-white/90-muted" size={20}/> : <ChevronDown className="text-white/90-muted" size={20}/>}
                                                        </div>
                                                    </div>

                                                    {/* Expanded Content */}
                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <motion.div 
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="p-5 pt-0 border-t border-white/20/20 mt-2 space-y-4">
                                                                    <div className="space-y-3">
                                                                        {t.options.map(opt => (
                                                                            <div key={opt.duration} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-xl gap-4 hover:border-primary/20 transition-colors">
                                                                                <div className="flex items-center justify-between sm:justify-start gap-4">
                                                                                    <span className="text-sm font-bold text-white bg-white/5 px-3 py-1.5 rounded-md">{opt.duration}</span>
                                                                                    <span className="text-xs font-semibold text-white/90-muted">Cust. Price: Rp {opt.price}</span>
                                                                                </div>
                                                                                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t border-white/20/30 pt-3 sm:border-0 sm:pt-0">
                                                                                    <label className="text-xs font-bold text-white/90-muted">Therapist Fee:</label>
                                                                                    <div className="relative">
                                                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/90-muted text-xs font-bold">Rp.</span>
                                                                                        <input 
                                                                                            type="text"
                                                                                            placeholder="0"
                                                                                            value={feeInputs[`${t.id}-${opt.duration}`] || ''}
                                                                                            onChange={(e) => handleFeeChange(t.id, opt.duration, e.target.value)}
                                                                                            className="w-32 bg-white/10 border border-white/20/50 rounded-lg pl-9 pr-3 py-2 text-sm font-bold text-white placeholder:text-white/90-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-right"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <div className="flex justify-end pt-2">
                                                                        <button 
                                                                            type="button"
                                                                            onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleSaveFees(t.id, t.options); }}
                                                                            className="flex items-center gap-2 px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                            disabled={isSubmitting}
                                                                        >
                                                                            <CheckCircle size={14} /> Save {t.title} Fees
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            )})}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'list' && (
                                    <div className="space-y-8">
                                        {/* Segmented Control for View Selection */}
                                        <div className="flex bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] p-1.5 rounded-2xl w-full max-w-xl shadow-sm mb-6">
                                            {['campaign', 'treatments', 'store'].map((view) => (
                                                <button
                                                    key={view}
                                                    onClick={() => setListView(view as 'campaign' | 'treatments' | 'store')}
                                                    type="button"
                                                    className={`flex-1 py-3 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${listView === view ? 'bg-white text-black shadow-md' : 'text-white/90-muted hover:text-white hover:bg-white/40'}`}
                                                >
                                                    {view === 'campaign' ? 'Active Campaign' : view === 'treatments' ? 'Treatments' : 'Elexoir Boutique'}
                                                </button>
                                            ))}
                                        </div>

                                        {listView === 'campaign' && (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                {/* Campaigns Section */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                                        <Megaphone size={20} className="text-accent" /> Active Campaign
                                                    </h2>
                                                    {campaign && (
                                                        <span className="text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">Live on Homepage</span>
                                                    )}
                                                </div>
                                                {campaign ? (
                                                    <div className="p-5 bg-gradient-to-br from-primary/5 to-white/60 border border-primary/20 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="font-bold text-white text-base">{campaign.title}</h3>
                                                                <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-white/10 px-2 py-0.5 rounded">{campaign.label}</span>
                                                            </div>
                                                            <p className="text-xs text-white/90-muted mb-3 max-w-sm">{campaign.description}</p>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[11px] font-bold text-accent">-{campaign.discountPercentage}% Discount</span>
                                                                <span className="text-[11px] text-white/90-muted">{campaign.selectedTreatments.length} Treatments included</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 self-start md:self-center">
                                                            <button 
                                                                onClick={handleEditCampaign}
                                                                type="button"
                                                                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] text-white/90-muted hover:text-white hover:bg-white/20 flex items-center justify-center transition-colors"
                                                            >
                                                                <Edit3 size={16} />
                                                            </button>
                                                            <button 
                                                                onClick={handleRemoveCampaign}
                                                                type="button"
                                                                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] text-red-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="p-8 text-center border-2 border-dashed border-white/20/50 rounded-2xl">
                                                        <p className="text-sm text-white/90-muted mb-4">No active campaign running.</p>
                                                        <button 
                                                            onClick={() => setActiveTab('campaign')}
                                                            type="button"
                                                            className="text-xs font-bold text-white bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
                                                        >
                                                            Create Campaign
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {listView === 'treatments' && (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                {/* Treatments Section */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                                        <Store size={20} className="text-secondary" /> Published Treatments
                                                    </h2>
                                                    <span className="text-xs font-semibold text-white/90-muted bg-white/10 px-3 py-1 rounded-full">{treatments.length} Active</span>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 gap-4">
                                                    {treatments.map((t) => (
                                                        <div key={t.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white/5 border border-white/20/50 rounded-2xl shadow-sm gap-4">
                                                            <div className="flex-1">
                                                                <h3 className="font-bold text-white text-sm mb-1">{t.title}</h3>
                                                                <p className="text-[11px] font-semibold text-white/90-muted uppercase tracking-widest mb-2">{t.category}</p>
                                                                <p className="text-xs text-white/90-muted/80 line-clamp-1">{t.desc}</p>
                                                            </div>
                                                            <div className="flex items-center justify-between md:justify-end gap-6 md:w-[250px]">
                                                                <div className="flex flex-col items-start md:items-end gap-1">
                                                                    {t.options.map(opt => (
                                                                        <span key={opt.duration} className="text-[11px] font-bold text-white bg-white/5 px-2 py-0.5 rounded-md">
                                                                            {opt.duration} • Rp {opt.price}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <button 
                                                                        type="button"
                                                                        onClick={async (e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            
                                                                            if (t.is_pinned) {
                                                                                // Unpin
                                                                                setTreatments(prev => prev.map(trt => trt.id === t.id ? { ...trt, is_pinned: false, pinned_image: undefined } : trt));
                                                                                try {
                                                                                    const { error } = await supabase.from('treatments').update({ is_pinned: false, pinned_image: null }).eq('id', t.id);
                                                                                    if (error) throw error;
                                                                                } catch (err) {
                                                                                    console.error("Failed to unpin:", err);
                                                                                    setTreatments(prev => prev.map(trt => trt.id === t.id ? { ...trt, is_pinned: true } : trt));
                                                                                    alert("Failed to update database.");
                                                                                }
                                                                            } else {
                                                                                // Start Pin process (requires image)
                                                                                setPendingPinId(t.id);
                                                                                if (pinImageInputRef.current) {
                                                                                    pinImageInputRef.current.value = '';
                                                                                }
                                                                                pinImageInputRef.current?.click();
                                                                            }
                                                                        }}
                                                                        title={t.is_pinned ? "Unpin Treatment" : "Pin Treatment (Requires Cover Image)"}
                                                                        className={`w-10 h-10 rounded-full border border-white/20/50 flex items-center justify-center transition-colors relative z-10 cursor-pointer ${t.is_pinned ? 'bg-white text-black border-primary' : 'bg-white text-white/90-muted hover:text-white hover:bg-white/20'}`}
                                                                    >
                                                                        <Pin size={16} className={t.is_pinned ? 'fill-current' : ''} />
                                                                    </button>
                                                                    <button 
                                                                        type="button"
                                                                        onClick={() => handleEditTreatment(t)}
                                                                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] text-white/90-muted hover:text-white hover:bg-white/20 flex items-center justify-center transition-colors"
                                                                    >
                                                                        <Edit3 size={16} />
                                                                    </button>
                                                                    <button 
                                                                        type="button"
                                                                        onClick={() => handleRemoveTreatment(t.id)}
                                                                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] text-red-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {treatments.length === 0 && (
                                                        <div className="p-8 text-center border-2 border-dashed border-white/20/50 rounded-2xl">
                                                            <p className="text-sm text-white/90-muted mb-4">No treatments added yet.</p>
                                                            <button 
                                                                onClick={() => setActiveTab('treatment')}
                                                                type="button"
                                                                className="text-xs font-bold text-white bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
                                                            >
                                                                Create Treatment
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {listView === 'store' && (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                {/* Store Section */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                                        <Store size={20} className="text-white" /> Elexoir Boutique
                                                    </h2>
                                                    <span className="text-xs font-semibold text-white/90-muted bg-white/10 px-3 py-1 rounded-full">{products.length} Products</span>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {products.map((p) => (
                                                        <div key={p.id} className="flex flex-col p-5 bg-white/5 border border-white/20/50 rounded-2xl shadow-sm gap-4">
                                                            <div className="flex items-start gap-4">
                                                                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/20/50 bg-white/10">
                                                                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex justify-between items-start">
                                                                        <h3 className="font-bold text-white text-sm mb-1 line-clamp-1">{p.title}</h3>
                                                                        <span className="text-[10px] font-bold text-white/90-muted bg-white/10 px-2 py-0.5 rounded-full whitespace-nowrap">Stock: {p.stock || 0}</span>
                                                                    </div>
                                                                    <p className="text-[10px] font-semibold text-white/90-muted uppercase tracking-widest mb-1">{p.category}</p>
                                                                    <span className="text-xs font-bold text-accent">Rp {p.price}</span>
                                                                </div>
                                                            </div>
                                                            <p className="text-xs text-white/90-muted/80 line-clamp-2 mb-2">{p.description}</p>
                                                            <div className="mt-auto flex items-center justify-end gap-2 pt-2 border-t border-white/20/30">
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => handleEditProduct(p)}
                                                                    className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] text-white/90-muted hover:text-white hover:bg-white/20 flex items-center justify-center transition-colors"
                                                                >
                                                                    <Edit3 size={14} />
                                                                </button>
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => handleRemoveProduct(p.id)}
                                                                    className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] text-red-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {products.length === 0 && (
                                                        <div className="col-span-1 md:col-span-2 p-8 text-center border-2 border-dashed border-white/20/50 rounded-2xl">
                                                            <p className="text-sm text-white/90-muted mb-4">No products in store.</p>
                                                            <button 
                                                                onClick={() => setActiveTab('store')}
                                                                type="button"
                                                                className="text-xs font-bold text-white bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
                                                            >
                                                                Add Product
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'settings' && (
                                    <div className="flex flex-col items-center justify-center py-20 text-white/90-muted">
                                        <Sparkles className="mb-4 opacity-50" size={32} />
                                        <p className="text-sm font-medium">This section is coming soon.</p>
                                    </div>
                                )}

                                {/* Submit Area */}
                                {activeTab !== 'fees' && (
                                    <div className="pt-6 border-t border-white/20/30 flex items-center justify-end gap-4">
                                        {success && (
                                        <motion.span 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center gap-1.5 text-xs font-bold text-green-600 uppercase tracking-wider"
                                        >
                                            <CheckCircle size={16} /> Saved Successfully
                                        </motion.span>
                                    )}
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="bg-white text-black px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider hover:bg-white/90 hover:scale-[1.02] transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Saving...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Sparkles size={16} /> {activeTab === 'treatment' ? (editingTreatmentId ? 'Update Treatment' : 'Publish Treatment') : 
                                                                        activeTab === 'campaign' ? 'Launch Campaign' :
                                                                        activeTab === 'store' ? (editingProductId ? 'Update Product' : 'Add Product') : 'Save'}
                                            </span>
                                        )}
                                    </button>
                                </div>
                                )}

                            </form>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Mobile Bottom Navigation Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-2xl border-t border-white/20/50 z-50 px-6 pb-safe">
                <div className="flex items-center justify-between h-full max-w-md mx-auto">
                    {[
                        { id: 'treatment', icon: PlusCircle, label: 'Add' },
                        { id: 'store', icon: Store, label: 'Store' },
                        { id: 'campaign', icon: Megaphone, label: 'Promo' },
                        { id: 'fees', icon: Settings, label: 'Fees' },
                        { id: 'list', icon: LayoutDashboard, label: 'Menu' },
                    ].map((tab) => {
                        const isActive = activeTab === tab.id;
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${
                                    isActive ? 'text-white' : 'text-white/90-muted hover:text-white/70'
                                }`}
                            >
                                <div className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${isActive ? 'bg-white/10 scale-110' : 'bg-transparent'}`}>
                                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className={`text-[10px] font-bold tracking-wider ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Hidden File Input for Pinning Images */}
            <input 
                type="file" 
                accept="image/*" 
                ref={pinImageInputRef} 
                onChange={handlePinImageUpload} 
                className="hidden" 
            />
        </div>
    );
}
