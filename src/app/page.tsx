'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Heart, Cloud, Sparkles, Droplet, User, Flame, Clock, ArrowRight, X, ShoppingBag, Plus, Minus, MessageCircle, ChevronLeft, ChevronRight, ChevronDown, Bitcoin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSpa, Campaign, Treatment, sortCampaigns } from '@/context/SpaContext';
import SeoExpandedContent from '@/components/SeoExpandedContent';
import WhyChooseUs from '@/components/WhyChooseUs';
import ServiceAreas from '@/components/ServiceAreas';
import FaqSection from '@/components/FaqSection';

// Dummy data for redesign structure
const CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'massage', label: 'Massage' },
    { id: 'package', label: 'Package' },
    { id: 'facial', label: 'Facial' },
    { id: 'treatment', label: 'Treatment' },
];


export default function Home() {
    const { treatments, campaign, campaigns, products, isLoading } = useSpa();

    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [maxPrice, setMaxPrice] = useState(1500000); // default max price
    const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);
    const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
    const [selectedCampaignModal, setSelectedCampaignModal] = useState<Campaign | null>(null);
    const [currentCampaignIndex, setCurrentCampaignIndex] = useState(0);
    const campaignCarouselRef = useRef<HTMLDivElement>(null);
    const [showStory, setShowStory] = useState(false);
    const [domain, setDomain] = useState('ubud');

    const activeCampaigns = sortCampaigns(
        (campaigns && campaigns.length > 0)
            ? campaigns.filter(c => c.is_published !== false)
            : (campaign ? [campaign] : [])
    );

    const scrollCampaignCarousel = (direction: 'left' | 'right') => {
        if (campaignCarouselRef.current) {
            const offset = 360;
            campaignCarouselRef.current.scrollBy({
                left: direction === 'left' ? -offset : offset,
                behavior: 'smooth'
            });
        }
    };

    const handleCarouselScroll = () => {
        if (campaignCarouselRef.current) {
            const scrollLeft = campaignCarouselRef.current.scrollLeft;
            const width = campaignCarouselRef.current.offsetWidth;
            const index = Math.round(scrollLeft / (width * 0.85));
            setCurrentCampaignIndex(Math.min(Math.max(0, index), activeCampaigns.length - 1));
        }
    };
    
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const host = window.location.hostname;
            setDomain((host.includes('homespaubud') || host.includes('ubudhomespa')) && !host.includes('elexoir') ? 'bali' : 'ubud');
        }
    }, []);
    
    // Show only if there is at least one pinned treatment in the database
    const showPinnedTreatments = treatments.some(t => t.is_pinned);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
        }
    };
    
    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
        }
    };
    
    // Booking Form State for Campaign
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [isSelectingMore, setIsSelectingMore] = useState(false);
    const [expandedTreatmentId, setExpandedTreatmentId] = useState<string | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedCampaignDurations, setSelectedCampaignDurations] = useState<Record<string, string>>({});
    
    // Initialize date and time
    const getInitialDateTime = () => {
        const now = new Date();
        const date = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0].substring(0, 5);
        return { date, time };
    };
    
    const [formData, setFormData] = useState({ name: '', location: '', room: '', ...getInitialDateTime() });

    const filteredAndSortedTreatments = React.useMemo(() => {
        let result = treatments.filter(t => {
            const matchesCategory = activeCategory === 'all' || t.category.toLowerCase() === activeCategory.toLowerCase();
            const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase());
            
            const getLowestPrice = (options: any[]) => {
                if (!options || options.length === 0) return 0;
                return Math.min(...options.map(o => parseInt(o.price.replace(/,/g, '') || '0')));
            };
            
            const matchesPrice = getLowestPrice(t.options) <= maxPrice;
            
            return matchesCategory && matchesSearch && matchesPrice;
        });

        // Always sort from lowest to highest naturally
        result.sort((a, b) => {
            const getLowestPrice = (options: any[]) => {
                if (!options || options.length === 0) return 0;
                return Math.min(...options.map(o => parseInt(o.price.replace(/,/g, '') || '0')));
            };
            return getLowestPrice(a.options) - getLowestPrice(b.options);
        });

        return result;
    }, [treatments, activeCategory, searchQuery, maxPrice]);

    const handleCampaignBooking = async (e: React.FormEvent, ) => {
        e.preventDefault();
        
        if (!formData.name || !formData.date || !formData.time || !formData.location) {
            alert('Please fill in all required fields (Name, Date, Time, Location).');
            return;
        }

        // Open window synchronously to bypass popup blockers
        const newWindow = window.open('', '_blank');

        setIsProcessing(true);
        
        try {
            const totalPrice = cartItems.reduce((acc, item) => {
                const isCouple = ['couple', 'four hand'].some(k => item.title.toLowerCase().includes(k));
                const multiplier = isCouple ? (item.guests / 2) : item.guests;
                return acc + (item.price * multiplier);
            }, 0);

            const treatmentsListStr = cartItems.map(item => `${item.title} (${item.duration} MINS)`).join(', ');

            const waNumber = '6285174119423';
            
            const treatmentsList = cartItems.map(item => {
                const isCouple = ['couple', 'four hand'].some(k => item.title.toLowerCase().includes(k));
                const multiplier = isCouple ? (item.guests / 2) : item.guests;
                const price = (item.price * multiplier).toLocaleString('en-US');
                const itemTreatment = treatments.find(t => t.id === item.treatmentId);
                
                let whatsIncludedText = '';
                if (itemTreatment && itemTreatment.desc) {
                    const parts = itemTreatment.desc.split(/What's Included\s*:?\s*/i);
                    if (parts.length > 1) {
                        const cleanIncluded = parts[1].trim();
                        whatsIncludedText = `\n\n*WHAT'S INCLUDED:*\n${cleanIncluded}`;
                    }
                }

                if (item.isCampaign) {
                    const hasSpaDiscount = item.discountPercentage && Number(item.discountPercentage) > 0;
                    const originalPriceNum = hasSpaDiscount ? item.price / (1 - (item.discountPercentage / 100)) : item.price;
                    const isCouple = ['couple', 'four hand'].some(k => item.title.toLowerCase().includes(k));
                    const multiplier = isCouple ? (item.guests / 2) : item.guests;
                    const originalPrice = (originalPriceNum * multiplier).toLocaleString('en-US');
                    const discountTag = hasSpaDiscount ? ` [${item.discountPercentage}% OFF SPA]` : '';
                    const priceText = hasSpaDiscount ? `IDR ${price} ~IDR ${originalPrice}~` : `IDR ${price}`;
                    const tripOfferText = item.tripOffer ? `\n*TRAVEL BENEFIT:* ${item.tripOffer}` : '';
                    return `*CAMPAIGN: ${item.campaignTitle.trim().toUpperCase()}*${tripOfferText}\n*${item.title.toUpperCase()}*\nDURATION ${item.duration} MINS\n${item.guests} PERSON${discountTag}\n${priceText}${whatsIncludedText}`;
                }
                return `*${item.title.toUpperCase()}*\nDURATION ${item.duration} MINS\n${item.guests} PERSON IDR ${price}${whatsIncludedText}`;
            }).join('\n\n------------------------\n\n');
            
            const websiteSource = typeof window !== 'undefined' ? window.location.hostname : 'Unknown';
            const baseMessage = `*NEW SPA BOOKING*\n${websiteSource}\n\n*TREATMENTS:*\n${treatmentsList}\n\n*TOTAL PRICE:* IDR ${totalPrice.toLocaleString('en-US')}\n\n*CLIENT DETAILS:*\n- Name: ${formData.name}\n- Date: ${formData.date}\n- Time: ${formData.time}\n- Location/Villa: ${formData.location}\n- Room Number: ${formData.room || 'N/A'}\n\nHello! I would like to confirm this booking.`;
            const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(baseMessage)}`;
            if (newWindow) {
                newWindow.location.href = waUrl;
            } else {
                window.location.href = waUrl;
            }
            
            setCartItems([]);
            setIsBookingModalOpen(false);
        } catch (error) {
            console.error(error);
            if (newWindow) newWindow.close();
            alert('An error occurred while generating the booking message. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden font-sans text-text">
            
            {/* Top Gradient Background */}
            <div className="absolute top-0 left-0 right-0 h-[600px] md:h-[800px] bg-gradient-to-b from-[#D2F34C] via-[#D2F34C] to-[#FDFBF7] z-0 pointer-events-none"></div>

            {/* Luxurious Ambient Background */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[120%] md:w-[800px] h-[600px] bg-secondary/30 blur-[120px] rounded-full z-0 pointer-events-none opacity-60 mix-blend-multiply" />
            <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-accent/20 blur-[100px] rounded-full z-0 pointer-events-none opacity-50" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 md:pt-36">
                
                {/* Slogan */}
                <div className="md:hidden mt-4 mb-6">
                    <h1 className="font-serif text-3xl text-primary font-medium tracking-tight">
                        {domain === 'bali' ? (
                            <>
                                Awaken Your <br/>
                                <span className="italic opacity-80">Senses</span>
                            </>
                        ) : (
                            <>
                                The Art of <br/>
                                <span className="italic opacity-80">Wellbeing</span>
                            </>
                        )}
                    </h1>
                </div>

                {/* Search Bar (Mobile Only - Above Campaign) */}
                <div className="md:hidden relative w-full mb-6 z-20">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none h-[54px]">
                        <Search className="h-5 w-5 text-text-muted" />
                    </div>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search your favourite treatment..." 
                        className="w-full bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl h-[54px] pl-11 pr-12 text-sm text-primary shadow-soft focus:outline-none focus:ring-2 focus:ring-secondary/50 placeholder:text-text-muted"
                    />
                    <button 
                        onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
                        title="Filter by price"
                        className={`absolute top-2 right-2 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isPriceFilterOpen ? 'bg-primary text-white shadow-md' : 'bg-secondary/30 text-primary hover:bg-secondary/50'}`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    </button>

                    <AnimatePresence>
                        {isPriceFilterOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full right-0 mt-3 w-64 md:w-72 bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-[0_20px_40px_rgb(0,0,0,0.12)] z-30"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Max Price</span>
                                    <span className="text-sm font-serif text-primary font-medium">IDR {maxPrice.toLocaleString('en-US')}</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="150000" 
                                    max="1500000" 
                                    step="50000"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                                    className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] text-text-muted mt-2 font-medium tracking-wider">
                                    <span>150k</span>
                                    <span>1.5m</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Cinematic Multi-Campaign Carousel */}
                {activeCampaigns.length > 0 && (
                    <div className="mb-8 w-full relative">
                        {/* Section Title matching 'Most Booked' styling */}
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Special Offers</h3>
                            {/* Navigation Controls (when multiple campaigns exist) */}
                            {activeCampaigns.length > 1 && (
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => scrollCampaignCarousel('left')}
                                        className="w-7 h-7 rounded-full border border-black/15 bg-white flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors shadow-sm"
                                        aria-label="Previous Campaign"
                                    >
                                        <ChevronLeft size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => scrollCampaignCarousel('right')}
                                        className="w-7 h-7 rounded-full border border-black/15 bg-white flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors shadow-sm"
                                        aria-label="Next Campaign"
                                    >
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Scrollable Container with Peek Effect */}
                        <div 
                            ref={campaignCarouselRef}
                            onScroll={handleCarouselScroll}
                            className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory w-full pb-1"
                        >
                            {activeCampaigns.map((camp, idx) => (
                                <div
                                    key={camp.id || idx}
                                    onClick={() => {
                                        setSelectedCampaignModal(camp);
                                        setIsCampaignModalOpen(true);
                                    }}
                                    className={`shrink-0 snap-start cursor-pointer block outline-none transition-transform active:scale-[0.99] ${
                                        activeCampaigns.length > 1
                                            ? 'w-[88vw] sm:w-[380px] md:w-[480px]'
                                            : 'w-full'
                                    }`}
                                >
                                    <div className="relative w-full h-[220px] sm:h-[250px] md:h-[280px] rounded-[24px] md:rounded-[28px] overflow-hidden shadow-lg group bg-gradient-to-br from-neutral-900 via-stone-900 to-black border border-black/15">
                                        {/* Background Image (if available) */}
                                        {camp.image && (
                                            <Image 
                                                src={camp.image} 
                                                alt={camp.title}
                                                fill 
                                                className="object-cover opacity-85 group-hover:scale-105 transition-transform duration-700 ease-out"
                                            />
                                        )}
                                        
                                        {/* Cinematic Contrast Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/20"></div>
                                        
                                        {/* Card Content */}
                                        <div className="absolute inset-0 p-4 sm:p-5 md:p-6 flex flex-col justify-between z-10 text-white">
                                            {/* Top Badge */}
                                            <div className="flex items-center justify-start">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[8px] md:text-[9px] font-bold tracking-[0.2em] uppercase border border-white/30 text-white shadow-sm">
                                                    {camp.label || 'SPECIAL PROMO'}
                                                </span>
                                            </div>

                                            {/* Bottom Text & Original Frosted Icon */}
                                            <div className="flex items-end justify-between gap-3">
                                                <div className="min-w-0 pr-2">
                                                    {camp.tripOffer && (
                                                        <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-white/90 block mb-0.5 drop-shadow-sm line-clamp-1">
                                                            {camp.tripOffer}
                                                        </span>
                                                    )}
                                                    <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold leading-tight text-white drop-shadow-md tracking-tight line-clamp-1">
                                                        {camp.title}
                                                    </h3>
                                                    {camp.description && (
                                                        <p className="text-white/85 text-[11px] sm:text-xs line-clamp-2 font-light mt-1 drop-shadow-sm leading-snug">
                                                            {camp.description}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Original Frosted Round Icon Button */}
                                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white flex items-center justify-center shrink-0 shadow-[0_8px_32px_rgb(0,0,0,0.15)] group-hover:bg-white/30 group-hover:scale-105 group-active:scale-95 transition-all duration-500">
                                                    <ArrowRight size={18} strokeWidth={2.5} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Swipe Dots Indicator (when > 1 campaign) */}
                        {activeCampaigns.length > 1 && (
                            <div className="flex items-center justify-center gap-1.5 mt-3">
                                {activeCampaigns.map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => {
                                            if (campaignCarouselRef.current) {
                                                const width = campaignCarouselRef.current.offsetWidth * 0.85;
                                                campaignCarouselRef.current.scrollTo({
                                                    left: i * width,
                                                    behavior: 'smooth'
                                                });
                                            }
                                        }}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                            currentCampaignIndex === i 
                                                ? 'w-6 bg-black' 
                                                : 'w-1.5 bg-black/20 hover:bg-black/40'
                                        }`}
                                        aria-label={`Go to slide ${i + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Pinned / Most Booked Treatments */}
                {showPinnedTreatments && (
                    <div className="mb-8 w-full relative z-20">
                        <h3 className="text-xs font-semibold text-text-muted mb-3 uppercase tracking-wider">Most Booked</h3>
                        <div className="flex overflow-x-auto gap-4 no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 pb-4 snap-x snap-mandatory">
                            {treatments.filter(t => t.is_pinned).map(treatment => (
                                <a href={`/rituals/${treatment.id}`} key={treatment.id} className="w-[65vw] sm:w-[220px] md:w-[280px] shrink-0 snap-center md:snap-align-none outline-none">
                                    <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-2 flex flex-col h-full hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative group">
                                        <div className="aspect-[4/3] relative bg-[#F5F5F7] overflow-hidden rounded-[16px]">
                                            {treatment.pinned_image ? (
                                                <Image src={treatment.pinned_image} alt={treatment.title} width={400} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className={`w-full h-full bg-gradient-to-br ${treatment.bgPattern} opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
                                            )}
                                        </div>
                                        <div className="flex flex-col flex-grow px-2 pt-3 pb-2">
                                            <p className="text-gray-400 text-[10px] font-bold mb-1 line-clamp-1 uppercase tracking-widest">{treatment.category}</p>
                                            <h4 className="font-bold text-gray-900 text-[13px] line-clamp-1 mb-3">{treatment.title}</h4>
                                            <div className="flex items-center justify-between bg-gray-50 rounded-full p-1 pl-3 mt-auto border border-gray-100">
                                                <span className="font-semibold text-gray-900 text-[12px]">
                                                    IDR {parseInt((treatment.options[0]?.price || '0').replace(/,/g, '')).toLocaleString('en-US')}
                                                </span>
                                                <div className="w-7 h-7 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center hover:bg-black transition-colors shrink-0 shadow-sm">
                                                    <Plus size={14} strokeWidth={2.5} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search & Categories Row */}
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-start gap-6 md:gap-4 relative z-20">
                    <div className="max-w-full overflow-hidden">
                        <h3 className="text-xs font-semibold text-text-muted mb-3 uppercase tracking-wider">Popular Category</h3>
                        <div className="flex overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 gap-3 no-scrollbar">
                            {CATEGORIES.map((cat) => {
                                const isActive = activeCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`flex items-center justify-center px-6 py-3 rounded-full whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                            isActive 
                                                ? 'bg-primary text-white shadow-[0_8px_20px_rgb(0,0,0,0.12)] scale-[1.02] border border-primary' 
                                                : 'bg-white/40 backdrop-blur-md text-primary border border-white/60 hover:bg-white/80 hover:scale-[1.02]'
                                        }`}
                                    >
                                        <span className="text-sm font-semibold tracking-wide">{cat.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Search Bar (Desktop Only - Next to Categories) */}
                    <div className="hidden md:block relative w-full md:w-80 shrink-0 md:mb-4">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none h-[54px]">
                            <Search className="h-5 w-5 text-text-muted" />
                        </div>
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search your favourite treatment..." 
                            className="w-full bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl h-[54px] pl-12 pr-12 text-sm text-primary shadow-soft focus:outline-none focus:ring-2 focus:ring-secondary/50 placeholder:text-text-muted"
                        />
                        <button 
                            onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
                            title="Filter by price"
                            className={`absolute top-2 right-2 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isPriceFilterOpen ? 'bg-primary text-white shadow-md' : 'bg-secondary/30 text-primary hover:bg-secondary/50'}`}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        </button>

                        {/* Price Filter Dropdown */}
                        <AnimatePresence>
                            {isPriceFilterOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full right-0 mt-3 w-64 md:w-72 bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-[0_20px_40px_rgb(0,0,0,0.12)] z-30"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Max Price</span>
                                        <span className="text-sm font-serif text-primary font-medium">Rp {maxPrice.toLocaleString('en-US')}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="150000" 
                                        max="1500000" 
                                        step="50000"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                                        className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] text-text-muted mt-2 font-medium tracking-wider">
                                        <span>150k</span>
                                        <span>1.5m</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Popular Treatments Scroll */}
                <div className="mb-24 relative group">
                    {/* Navigation Buttons (Desktop only) */}
                    <button 
                        onClick={scrollLeft}
                        className="hidden md:flex absolute left-[-20px] lg:left-[-40px] top-[40%] -translate-y-1/2 w-12 h-12 bg-white border border-border/50 rounded-full shadow-lg items-center justify-center z-20 text-primary hover:scale-105 transition-transform"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <button 
                        onClick={scrollRight}
                        className="hidden md:flex absolute right-[-20px] lg:right-[-40px] top-[40%] -translate-y-1/2 w-12 h-12 bg-white border border-border/50 rounded-full shadow-lg items-center justify-center z-20 text-primary hover:scale-105 transition-transform"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>

                    {isLoading ? (
                        <div className="flex overflow-x-auto pb-10 -mx-6 px-6 md:mx-0 md:px-0 gap-6 no-scrollbar">
                            {[1,2,3].map((skeleton) => (
                                <div key={skeleton} className="w-72 md:w-80 h-96 shrink-0 rounded-[32px] md:rounded-[40px] bg-border/40 animate-pulse"></div>
                            ))}
                        </div>
                    ) : treatments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center relative overflow-hidden rounded-[40px] bg-[#F5F5F7] mx-6 md:mx-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 pointer-events-none"></div>
                            <div className="relative z-10 flex flex-col items-center">
                                <span className="bg-white/80 backdrop-blur-md border border-white/60 text-[#86868B] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm mb-4">Coming Soon</span>
                                <h3 className="text-2xl md:text-3xl font-medium text-[#1D1D1F] tracking-tight mb-2">Signature Treatments</h3>
                                <p className="text-[#86868B] max-w-sm mx-auto text-sm font-medium px-4">We are preparing our exclusive spa experiences.</p>
                            </div>
                        </div>
                    ) : (
                    <div ref={scrollContainerRef} className="flex overflow-x-auto pb-10 -mx-6 px-6 md:mx-0 md:px-0 gap-6 no-scrollbar scroll-smooth">
                        {filteredAndSortedTreatments.map((item, idx) => (
                            <Link href={`/rituals/${item.id}`} key={item.id} className="w-72 md:w-80 shrink-0 block group outline-none">
                                <div className={`rounded-[32px] md:rounded-[40px] bg-gradient-to-br ${item.bgPattern} border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-700 flex flex-col h-full relative overflow-hidden group-hover:-translate-y-2 p-6 md:p-8`}>
                                    
                                    {/* Subtle glowing orb for spa ambiance */}
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/60 blur-[30px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150"></div>

                                    <div className="mb-8 flex items-start justify-between relative z-10">
                                        <div className="bg-white/60 backdrop-blur-sm border border-primary/10 text-primary px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
                                            {item.category}
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex-grow flex flex-col">
                                        <h4 className="font-serif text-xl font-medium text-primary mb-3 leading-tight">{item.title}</h4>
                                        <p className="text-xs text-text-muted leading-relaxed font-light mb-6 flex-grow line-clamp-4">{item.desc.charAt(0).toUpperCase() + item.desc.slice(1).toLowerCase()}</p>
                                        
                                        <div className="mt-auto pt-5 border-t border-border/50">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted mb-3 uppercase tracking-widest">
                                                <Clock className="w-3.5 h-3.5" /> {item.options[0]?.duration} MINS
                                            </div>
                                            <div className="flex items-center justify-between bg-gray-50/80 backdrop-blur-sm rounded-full p-1 pl-4 border border-gray-100">
                                                <span className="font-semibold text-gray-900 text-[14px]">IDR {parseInt(item.options[0]?.price.replace(/,/g, '') || '0').toLocaleString('en-US')}</span>
                                                <button className="w-10 h-10 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center hover:bg-black transition-colors shrink-0 shadow-sm">
                                                    <Plus size={20} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    )}
                </div>

                {/* The Elexoir Boutique Section */}
                {products.length > 0 && (
                <div className="mb-32">
                    <div className="flex items-center justify-between mb-8 px-6 md:px-0">
                        <div>
                            <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-primary/50 mb-1 block">Take the Spa Home</span>
                            <h3 className="font-serif text-2xl md:text-3xl text-primary font-medium leading-tight">Spa Boutique</h3>
                        </div>
                        <a href="/store" className="inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-xs font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap shrink-0">
                            Shop Now
                        </a>
                    </div>
                    
                    {/* Swipeable Products */}
                    <div className="flex overflow-x-auto pb-10 -mx-6 px-6 md:mx-0 md:px-0 gap-6 no-scrollbar">
                        {products.map((product) => (
                            <a href="/store" key={product.id} className="w-48 md:w-52 shrink-0 block outline-none">
                                <div className="bg-white border border-[#E5E7EB] rounded-[24px] flex flex-col h-full hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative group p-2">
                                    
                                    {/* Image */}
                                    <div className="aspect-[4/5] relative bg-[#F5F5F7] overflow-hidden rounded-[16px]">
                                        <Image src={product.image} alt={product.title} width={400} height={500} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    
                                    {/* Text Info */}
                                    <div className="flex flex-col flex-grow px-2 md:px-3 pt-3 pb-2">
                                        <p className="text-gray-400 text-[11px] font-medium mb-1 line-clamp-1">{product.category || 'Elexoir'}</p>
                                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1 mb-4">{product.title}</h4>
                                        
                                        {/* Price and Add Button */}
                                        <div className="flex items-center justify-between bg-gray-50 rounded-full p-1 pl-3 mt-auto border border-gray-100">
                                            <span className="font-semibold text-gray-900 text-[13px]">Rp {parseInt(product.price.replace(/,/g, '')).toLocaleString('id-ID')}</span>
                                            <div className="w-8 h-8 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center hover:bg-black transition-colors shrink-0 shadow-sm">
                                                <Plus size={16} strokeWidth={2.5} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
                )}
            </div>
            
            <div className="pb-16 md:pb-24">
                {/* About Us / Our Philosophy */}
                <div className="mb-16 md:mb-24 flex flex-col md:flex-row gap-10 md:gap-20 items-center max-w-7xl mx-auto px-6">
                    <div className="flex-1 w-full">
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/60 mb-2 md:mb-4 block">Our Philosophy</span>
                        <h3 className="font-serif text-3xl md:text-5xl text-primary font-medium mb-4 md:mb-6 leading-tight domain-ubud-only">
                            Sanctuary for the Soul
                        </h3>
                        <h3 className="font-serif text-3xl md:text-5xl text-primary font-medium mb-4 md:mb-6 leading-tight domain-bali-only">
                            Bespoke Tranquility at <span className="italic">Your Doorstep</span>
                        </h3>
                        <p className="text-sm md:text-base text-text-muted leading-relaxed mb-6 md:mb-8 font-light domain-ubud-only">
                            Born from the ancient healing traditions of Bali, Elexoir Home Spa was created with a singular vision: to bring unparalleled luxury and profound relaxation directly to your sanctuary. We believe that true wellness requires an environment where you feel completely at ease—your own home or villa.
                        </p>
                        <p className="text-sm md:text-base text-text-muted leading-relaxed mb-6 md:mb-8 font-light domain-bali-only">
                            Born from the ancient healing traditions of Bali, Home Spa Ubud was created with a singular vision: to bring unparalleled luxury and profound relaxation directly to your sanctuary. We believe that true wellness requires an environment where you feel completely at ease—your own home or villa.
                        </p>
                        <AnimatePresence>
                            {showStory && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden mb-6 md:mb-8"
                                >
                                    <h4 className="font-serif text-xl md:text-2xl text-primary mb-3 md:mb-4 leading-tight">
                                        The Ultimate <span className="italic">Luxury Home Spa</span> in Bali
                                    </h4>
                                    <div className="text-sm md:text-base text-text-muted leading-relaxed font-light mb-6 space-y-4">
                                        <p className="domain-ubud-only">
                                            Elevate your wellness journey with Elexoir Home Spa, Bali's premier mobile spa and in-villa massage service. Whether you are staying in the lush jungles of Ubud, the vibrant coasts of Canggu and Seminyak, or the breathtaking cliffs of Uluwatu, our certified professional therapists bring the ultimate 5-star spa experience directly to your doorstep.
                                        </p>
                                        <p className="domain-bali-only">
                                            Elevate your wellness journey with Home Spa Ubud, Bali's premier mobile spa and in-villa massage service. Whether you are staying in the lush jungles of Ubud, the vibrant coasts of Canggu and Seminyak, or the breathtaking cliffs of Uluwatu, our certified professional therapists bring the ultimate 5-star spa experience directly to your doorstep.
                                        </p>
                                        <p>
                                            We specialize in traditional Balinese Massage, Deep Tissue therapies, and exclusive Couples Massage packages designed for absolute relaxation. Using only premium, organic massage oils and authentic holistic healing techniques, our bespoke spa treatments in Bali transform your private villa or hotel room into a tranquil sanctuary of rejuvenation.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!showStory && (
                            <button 
                                onClick={() => setShowStory(true)}
                                className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest bg-white/70 hover:bg-white border border-border/60 px-5 py-3 rounded-full transition-all shadow-sm hover:shadow active:scale-95"
                            >
                                Discover Our Story <ArrowRight size={14} />
                            </button>
                        )}
                    </div>
                    <div className="flex-1 w-full relative">
                        <div className="aspect-[16/10] sm:aspect-[4/3] rounded-[28px] md:rounded-[40px] overflow-hidden bg-gradient-to-br from-highlight/60 to-surface border border-white/80 shadow-soft relative flex items-center justify-center p-6 md:p-10 text-center">
                             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8),transparent_100%)] pointer-events-none"></div>
                             <div className="relative z-10">
                                 <h4 className="font-serif text-2xl md:text-3xl text-primary mb-2 md:mb-3 italic">"A journey to pure tranquility."</h4>
                                 <p className="text-[9px] md:text-[10px] text-primary/60 uppercase tracking-widest font-bold">Vogue Wellness</p>
                             </div>
                        </div>
                        {/* Decorative element */}
                        <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 w-20 md:w-24 h-20 md:h-24 bg-secondary/30 rounded-full blur-2xl pointer-events-none"></div>
                    </div>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16 md:space-y-24">
                    <WhyChooseUs />
                    <ServiceAreas />
                    <FaqSection />
                </div>
            </div>

            {/* Campaign Modal */}
            {isCampaignModalOpen && selectedCampaignModal && (
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-md overflow-x-hidden max-w-[100vw]">
                    <motion.div 
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="bg-white w-full h-[90dvh] md:h-auto md:max-h-[85vh] md:max-w-3xl md:rounded-[32px] rounded-t-[32px] shadow-2xl relative overflow-hidden flex flex-col border border-black/10 text-black font-sans"
                    >
                        {/* Modal Header */}
                        <div className="p-5 md:p-7 border-b border-black/10 bg-white shrink-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-black text-white text-[9px] font-bold tracking-widest uppercase">
                                        {selectedCampaignModal.label || 'EXCLUSIVE OFFER'}
                                    </span>
                                    {Number(selectedCampaignModal.discountPercentage) > 0 ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-black/5 text-black text-[9px] font-bold uppercase tracking-wider border border-black/10">
                                            -{selectedCampaignModal.discountPercentage}% OFF SPA
                                        </span>
                                    ) : selectedCampaignModal.tripOffer ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[9px] font-bold uppercase tracking-wider border border-emerald-200">
                                            Travel Benefit Included
                                        </span>
                                    ) : null}
                                </div>
                                <button 
                                    onClick={() => {
                                        setIsCampaignModalOpen(false);
                                        setSelectedCampaignModal(null);
                                    }}
                                    className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <h2 className="font-serif text-xl md:text-2xl font-bold text-black mt-1">{selectedCampaignModal.title}</h2>
                            {selectedCampaignModal.description && (
                                <p className="text-xs md:text-sm text-black/70 mt-1.5 leading-relaxed font-light">
                                    {selectedCampaignModal.description}
                                </p>
                            )}
                        </div>
                        
                        {/* Modal Content (Campaign Treatments) */}
                        <div className="p-5 md:p-7 overflow-y-auto bg-white space-y-6">
                            
                            {/* Travel Benefit / Tour Voucher Banner */}
                            {selectedCampaignModal.tripOffer && (
                                <div className="p-4 rounded-2xl bg-[#faf9f6] border border-black/10 flex items-center gap-3.5 shadow-sm">
                                    {/* Small image for travel perk without generic icon overlay */}
                                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-black/10 bg-black/5 shadow-inner">
                                        <img 
                                            src={
                                                selectedCampaignModal.tripImage ||
                                                selectedCampaignModal.image ||
                                                'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=300&q=80'
                                            }
                                            alt="Bali Travel Privilege"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded inline-block mb-1 border border-emerald-200">
                                            Exclusive Travel Benefit
                                        </span>
                                        <h4 className="text-sm sm:text-base font-bold text-black leading-tight line-clamp-2">
                                            {selectedCampaignModal.tripOffer}
                                        </h4>
                                        <p className="text-xs text-black/60 mt-0.5 font-light leading-snug">
                                            Book any signature treatment below to receive your excursion voucher with your booking confirmation.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <div className="mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-black">
                                        {Number(selectedCampaignModal.discountPercentage) > 0 
                                            ? 'Select Treatment to Activate Discount & Benefit' 
                                            : 'Select Treatment to Unlock Travel Benefit'}
                                    </span>
                                </div>

                                {(() => {
                                    type UniqueTreatmentItem = {
                                        treatment: Treatment;
                                        allowedOptions: { duration: string; price: string }[];
                                    };
                                    const uniqueTreatmentItems: UniqueTreatmentItem[] = [];
                                    const discount = Number(selectedCampaignModal.discountPercentage) || 0;
                                    const hasSpaDiscount = discount > 0;

                                    if (selectedCampaignModal.selectedTreatments && selectedCampaignModal.selectedTreatments.length > 0) {
                                        selectedCampaignModal.selectedTreatments.forEach(ct => {
                                            const treatment = treatments.find(t => 
                                                String(t.id).trim().toLowerCase() === String(ct.treatmentId).trim().toLowerCase() ||
                                                t.title.trim().toLowerCase() === String(ct.treatmentId).trim().toLowerCase()
                                            );
                                            if (!treatment) return;

                                            const allowedOptions = (ct.durations && ct.durations.length > 0)
                                                ? treatment.options.filter(o => 
                                                    ct.durations.some(d => 
                                                        d.replace(/MINS/gi, '').trim() === o.duration.replace(/MINS/gi, '').trim() ||
                                                        d.trim() === o.duration.trim()
                                                    )
                                                )
                                                : treatment.options;

                                            if (allowedOptions.length > 0) {
                                                uniqueTreatmentItems.push({
                                                    treatment,
                                                    allowedOptions
                                                });
                                            }
                                        });
                                    }

                                    // Fallback if no specific treatments were selected or matched: show all treatments
                                    if (uniqueTreatmentItems.length === 0) {
                                        treatments.forEach(treatment => {
                                            if (treatment.options && treatment.options.length > 0) {
                                                uniqueTreatmentItems.push({
                                                    treatment,
                                                    allowedOptions: treatment.options
                                                });
                                            }
                                        });
                                    }

                                    return (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {uniqueTreatmentItems.map(({ treatment, allowedOptions }) => {
                                                const currentDuration = selectedCampaignDurations[treatment.id] || allowedOptions[0]?.duration;
                                                const activeOption = allowedOptions.find(o => 
                                                    o.duration === currentDuration ||
                                                    o.duration.replace(/MINS/gi, '').trim() === String(currentDuration).replace(/MINS/gi, '').trim()
                                                ) || allowedOptions[0];

                                                const originalPriceNum = parseInt(String(activeOption.price).replace(/[^0-9]/g, '') || '0', 10);
                                                const discountedPriceNum = hasSpaDiscount 
                                                    ? Math.round(originalPriceNum * (1 - (discount / 100)))
                                                    : originalPriceNum;

                                                const isCouple = ['couple', 'four hand'].some(k => treatment.title.toLowerCase().includes(k));
                                                const handleBookTreatment = () => {
                                                    setCartItems([{
                                                        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                                                        treatmentId: treatment.id,
                                                        campaignTitle: selectedCampaignModal.title,
                                                        tripOffer: selectedCampaignModal.tripOffer || '',
                                                        title: treatment.title,
                                                        duration: activeOption.duration,
                                                        price: discountedPriceNum,
                                                        guests: isCouple ? 2 : 1,
                                                        isCampaign: true,
                                                        discountPercentage: discount
                                                    }]);
                                                    setIsCampaignModalOpen(false);
                                                    setIsBookingModalOpen(true);
                                                };

                                                return (
                                                    <div 
                                                        key={treatment.id} 
                                                        className="p-5 rounded-2xl border border-black/15 hover:border-black bg-white hover:bg-black/[0.01] shadow-sm transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                                                        onClick={handleBookTreatment}
                                                    >
                                                        <div>
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-black/5 text-black border border-black/10">
                                                                    {treatment.category}
                                                                </span>
                                                                {hasSpaDiscount ? (
                                                                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black text-white">
                                                                        -{discount}%
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-black/5 text-black/60 border border-black/10">
                                                                        Standard Rate
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h4 className="text-base font-bold text-black mb-1">{treatment.title}</h4>
                                                            <p className="text-xs text-black/60 line-clamp-2 mb-4 font-light leading-relaxed">{treatment.desc}</p>
                                                        </div>

                                                        <div className="pt-3 border-t border-black/10 flex items-end justify-between gap-3">
                                                            <div className="flex-1 min-w-0">
                                                                {/* Duration Selection Dropdown */}
                                                                <div 
                                                                    className="flex items-center gap-1.5 mb-2" 
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <div className="relative inline-flex items-center">
                                                                        <Clock className="w-3.5 h-3.5 text-black/60 absolute left-2 pointer-events-none" />
                                                                        <select
                                                                            value={activeOption.duration}
                                                                            onChange={(e) => {
                                                                                setSelectedCampaignDurations(prev => ({
                                                                                    ...prev,
                                                                                    [treatment.id]: e.target.value
                                                                                }));
                                                                            }}
                                                                            className="appearance-none bg-black/5 hover:bg-black/10 focus:bg-white text-[11px] font-bold text-black uppercase tracking-wider pl-7 pr-6 py-1.5 rounded-lg border border-black/15 cursor-pointer focus:outline-none focus:ring-1 focus:ring-black transition-all"
                                                                        >
                                                                            {allowedOptions.map(opt => (
                                                                                <option key={opt.duration} value={opt.duration} className="text-black bg-white font-semibold">
                                                                                    {opt.duration.toUpperCase().includes('MIN') ? opt.duration : `${opt.duration} MINS`}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                        <ChevronDown size={12} className="absolute right-2 pointer-events-none text-black/60" />
                                                                    </div>
                                                                </div>

                                                                {/* Dynamic Price Display */}
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    {hasSpaDiscount ? (
                                                                        <>
                                                                            <span className="text-[11px] text-black/40 line-through font-medium">
                                                                                IDR {originalPriceNum.toLocaleString('en-US')}
                                                                            </span>
                                                                            <span className="text-base font-bold text-black">
                                                                                IDR {discountedPriceNum.toLocaleString('en-US')}
                                                                            </span>
                                                                        </>
                                                                    ) : (
                                                                        <span className="text-base font-bold text-black">
                                                                            IDR {originalPriceNum.toLocaleString('en-US')}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleBookTreatment();
                                                                }}
                                                                className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shrink-0"
                                                                aria-label="Book Treatment"
                                                            >
                                                                <ArrowRight size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Complete Booking Modal */}
            <AnimatePresence>
                {isBookingModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm overflow-x-hidden overflow-y-auto w-full max-w-[100vw]"
                    >
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="bg-white rounded-none sm:rounded-[28px] p-5 sm:p-7 md:p-8 w-full max-w-full sm:max-w-lg min-h-[100dvh] sm:min-h-0 sm:max-h-[90vh] shadow-2xl relative overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col justify-between box-border"
                        >
                            <button 
                                onClick={() => setIsBookingModalOpen(false)}
                                className="absolute top-5 right-5 sm:top-6 sm:right-6 w-8 h-8 rounded-full bg-surface flex items-center justify-center text-text-muted hover:bg-border transition-colors z-10 shadow-sm"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            
                            {isSelectingMore ? (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300 pb-4">
                                    <div className="flex items-center gap-4 mb-6">
                                        <button onClick={() => setIsSelectingMore(false)} className="w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors shrink-0">
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <h2 className="font-serif text-2xl text-primary">Select Treatment</h2>
                                    </div>
                                    
                                    <div className="space-y-3 max-h-[calc(100dvh-110px)] md:max-h-[70vh] overflow-y-auto pr-2 pb-16 no-scrollbar">
                                        {treatments.map(t => (
                                            <div 
                                                key={t.id} 
                                                className={`bg-surface border ${expandedTreatmentId === t.id ? 'border-primary' : 'border-border/50'} rounded-2xl overflow-hidden shadow-sm transition-all`}
                                            >
                                                <div 
                                                    onClick={() => setExpandedTreatmentId(expandedTreatmentId === t.id ? null : t.id)}
                                                    className="p-3 flex gap-4 hover:bg-black/[0.02] cursor-pointer group"
                                                >
                                                    <div className="flex-1 py-1 pl-2">
                                                        <div className="text-[9px] font-bold tracking-widest text-primary/50 uppercase mb-1">{t.category}</div>
                                                        <h4 className="font-bold text-sm text-primary mb-1 line-clamp-1">{t.title}</h4>
                                                        <div className="text-[10px] text-text-muted"><Clock className="w-3 h-3 inline mr-1" />{t.options.length} Options</div>
                                                    </div>
                                                    <div className="flex items-center pr-2">
                                                        <div className={`w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-primary transition-all duration-300 ${expandedTreatmentId === t.id ? 'rotate-45 bg-primary text-white' : 'group-hover:bg-primary group-hover:text-white'}`}>
                                                            <Plus className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <AnimatePresence>
                                                    {expandedTreatmentId === t.id && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="border-t border-border/50 bg-[#FDFBF7]"
                                                        >
                                                            <div className="p-4 space-y-4">
                                                                <p className="text-xs text-text-muted leading-relaxed">{t.desc}</p>
                                                                <div className="space-y-2">
                                                                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-2">Select Duration</div>
                                                                    {t.options.map((opt, idx) => (
                                                                        <button
                                                                            key={idx}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                const isCouple = ['couple', 'four hand'].some(k => t.title.toLowerCase().includes(k));
                                                                                setCartItems([...cartItems, {
                                                                                    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                                                                                    treatmentId: t.id,
                                                                                    title: t.title,
                                                                                    duration: opt.duration,
                                                                                    price: parseInt(opt.price.replace(/,/g, '') || '0'),
                                                                                    guests: isCouple ? 2 : 1,
                                                                                    isCampaign: false
                                                                                }]);
                                                                                setExpandedTreatmentId(null);
                                                                                setIsSelectingMore(false);
                                                                            }}
                                                                            className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                                                                        >
                                                                            <span className="text-sm font-bold text-primary group-hover:text-primary transition-colors">{opt.duration} Mins</span>
                                                                            <span className="text-sm font-serif text-primary">IDR {parseInt(opt.price.replace(/,/g, '') || '0').toLocaleString('en-US')}</span>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))}
                                        <div className="text-center pt-2 pb-8">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted/50 flex items-center justify-center gap-2">
                                                Scroll for more treatments <ArrowRight className="w-3 h-3 rotate-90" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                    <h2 className="font-serif text-2xl text-primary mb-1 pr-8">Complete Booking</h2>
                                    <p className="text-xs text-text-muted mb-6">Your request will be sent securely via WhatsApp.</p>

                                    {/* Cart Items List */}
                                    <div className="space-y-3 mb-4 max-h-[40vh] overflow-y-auto pr-1 no-scrollbar">
                                        {cartItems.map(item => (
                                            <div key={item.id} className="bg-surface border border-border/50 rounded-2xl p-4 shadow-sm relative">
                                                {cartItems.length > 1 && (
                                                    <button 
                                                        onClick={() => setCartItems(cartItems.filter(i => i.id !== item.id))}
                                                        className="absolute top-3 right-3 text-text-muted hover:text-red-500 transition-colors p-1"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                                <div className="flex items-start justify-between mb-4 pr-6">
                                                    <div>
                                                        {item.isCampaign && (
                                                            <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                                                                <span className="bg-black text-white px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm">
                                                                    {item.campaignTitle}
                                                                </span>
                                                                {item.discountPercentage && Number(item.discountPercentage) > 0 ? (
                                                                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                                                                        {item.discountPercentage}% OFF SPA
                                                                    </span>
                                                                ) : null}
                                                                {item.tripOffer ? (
                                                                    <span className="bg-stone-100 text-stone-700 border border-stone-200/80 px-2.5 py-0.5 rounded-full text-[9px] font-medium tracking-wide">
                                                                        {item.tripOffer}
                                                                    </span>
                                                                ) : null}
                                                            </div>
                                                        )}
                                                        <h3 className="font-bold text-sm text-primary leading-tight">{item.title}</h3>
                                                        <p className="text-xs text-text-muted flex items-center gap-1 mt-1">
                                                            <Clock className="w-3 h-3" /> {item.duration} Mins
                                                        </p>
                                                    </div>
                                                    <span className="font-serif text-primary font-medium text-right flex flex-col shrink-0">
                                                        IDR {item.price.toLocaleString('en-US')}
                                                        <span className="text-[10px] font-sans text-text-muted font-normal uppercase tracking-wider">
                                                            {['couple', 'four hand'].some(k => item.title.toLowerCase().includes(k)) ? 'For 2 Persons' : 'Per Person'}
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Guests</span>
                                                    <div className="flex items-center gap-3">
                                                        <button 
                                                            type="button"
                                                            onClick={() => setCartItems(cartItems.map(i => {
                                                                if (i.id !== item.id) return i;
                                                                const isCouple = ['couple', 'four hand'].some(k => i.title.toLowerCase().includes(k));
                                                                const step = isCouple ? 2 : 1;
                                                                return { ...i, guests: Math.max(step, i.guests - step) };
                                                            }))}
                                                            className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-primary hover:bg-border transition-colors shadow-sm"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="font-bold text-sm text-primary w-4 text-center">{item.guests}</span>
                                                        <button 
                                                            type="button"
                                                            onClick={() => setCartItems(cartItems.map(i => {
                                                                if (i.id !== item.id) return i;
                                                                const isCouple = ['couple', 'four hand'].some(k => i.title.toLowerCase().includes(k));
                                                                const step = isCouple ? 2 : 1;
                                                                return { ...i, guests: i.guests + step };
                                                            }))}
                                                            className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-primary hover:bg-border transition-colors shadow-sm"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <button 
                                        type="button"
                                        onClick={() => setIsSelectingMore(true)}
                                        className="w-full bg-transparent text-primary border border-border/50 px-6 py-3 rounded-xl text-xs font-bold hover:bg-surface transition-colors mb-6 tracking-widest"
                                    >
                                        + ADD ANOTHER TREATMENT
                                    </button>

                                    <form className="space-y-5 pb-8 md:pb-0">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/80 ml-1">Guest Name</label>
                                            <input 
                                                type="text" required placeholder="John Doe"
                                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                                className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3.5 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-5">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/80 ml-1">Date</label>
                                                <input 
                                                    type="date" required 
                                                    value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                                                    className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3.5 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/80 ml-1">Time</label>
                                                <input 
                                                    type="time" required 
                                                    value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}
                                                    className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3.5 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/80 ml-1">Villa / Hotel Name</label>
                                            <input 
                                                type="text" required placeholder="e.g. Four Seasons Sayan"
                                                value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                                                className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3.5 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/80 ml-1">Room Number (Optional)</label>
                                            <input 
                                                type="text" placeholder="e.g. Villa 12"
                                                value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})}
                                                className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3.5 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            />
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-border/50">
                                            <div className="flex items-end justify-between mb-6">
                                                <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Total Price</span>
                                                <span className="text-2xl font-serif text-primary">
                                                    IDR {cartItems.reduce((acc, item) => {
                                                        const isCouple = ['couple', 'four hand'].some(k => item.title.toLowerCase().includes(k));
                                                        const multiplier = isCouple ? (item.guests / 2) : item.guests;
                                                        return acc + (item.price * multiplier);
                                                    }, 0).toLocaleString('en-US')}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <button 
                                                    type="button"
                                                    onClick={(e) => handleCampaignBooking(e)}
                                                    disabled={isProcessing}
                                                    className="w-full bg-primary text-white px-6 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300 shadow-[0_8px_24px_rgb(0,0,0,0.15)] uppercase tracking-widest disabled:opacity-70"
                                                >
                                                    {isProcessing ? 'PROCESSING...' : 'CONFIRM ON WHATSAPP'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
            </div>
        </div>
    );
}
