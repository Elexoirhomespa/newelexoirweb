'use client';

import React, { useState } from 'react';
import { 
    Compass, Ship, MapPin, Clock, Users, DollarSign, Check, Copy, 
    Send, Sparkles, Plus, Car, Fuel, Waves, CheckCircle2, 
    ArrowRight, MessageSquare, Megaphone, Calendar
} from 'lucide-react';
import { useSpa, DayTripPackage, NusaPenidaTrip } from '@/context/SpaContext';

interface AdminDayTripManagerProps {
    brand: string;
}

// Preset Bali Day Trips
const BALI_DAY_TRIP_PRESETS: Omit<DayTripPackage, 'id' | 'brand'>[] = [
    {
        title: 'Ubud Cultural & Jungle Waterfall Tour',
        subtitle: 'Sacred Monkey Forest, Tegallalang Rice Terraces & Hidden Waterfalls',
        region: 'Ubud & Central Bali',
        highlights: [
            'Tegenungan or Kanto Lampo Scenic Waterfall',
            'Sacred Monkey Forest Sanctuary',
            'Tegallalang Iconic Green Rice Terraces & Swing',
            'Traditional Coffee Plantation & Luwak Tasting',
            'Ubud Art Market & Royal Palace'
        ],
        durationHours: 10,
        carType: 'Private 5-Seater MPV (Avanza / Xpander)',
        includesDriver: true,
        includesFuel: true,
        includesTickets: true,
        includesWater: true,
        spaTreatmentAddon: {
            enabled: true,
            treatmentTitle: 'Balinese Herbal Deep Tissue Massage',
            duration: '90 Min',
            price: 450000
        },
        customerPrice: 950000,
        driverFee: 500000,
        ticketCost: 150000,
        image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop'
    },
    {
        title: 'Uluwatu Sunset, Beaches & Kecak Fire Dance',
        subtitle: 'Melasti Beach, Padang Padang & Cliffside Kecak Dance',
        region: 'South Bali & Peninsula',
        highlights: [
            'Melasti Beach with stunning limestone cliff road',
            'Padang Padang or Suluban Beach',
            'Uluwatu Cliffside Temple with ocean panorama',
            'Sacred Kecak & Fire Dance Performance at Sunset',
            'Fresh Seafood Dinner at Jimbaran Bay (Optional)'
        ],
        durationHours: 10,
        carType: 'Private 5-Seater MPV (Avanza / Xpander)',
        includesDriver: true,
        includesFuel: true,
        includesTickets: true,
        includesWater: true,
        spaTreatmentAddon: {
            enabled: true,
            treatmentTitle: 'Sunset Aromatherapy Relaxation Massage',
            duration: '90 Min',
            price: 450000
        },
        customerPrice: 1050000,
        driverFee: 550000,
        ticketCost: 200000,
        image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop'
    },
    {
        title: 'Bedugul, Lake Beratan & North Bali Temples',
        subtitle: 'Floating Lake Temple, Iconic Handara Gate & Twin Waterfalls',
        region: 'Bedugul & North Bali',
        highlights: [
            'Ulun Danu Beratan Floating Temple on the Lake',
            'Handara Iconic Gate photo spot',
            'Wanagiri Hidden Hills with Twin Lake Views',
            'Banyumala Twin Waterfall in lush jungle'
        ],
        durationHours: 10,
        carType: 'Private 5-Seater MPV (Avanza / Xpander)',
        includesDriver: true,
        includesFuel: true,
        includesTickets: true,
        includesWater: true,
        spaTreatmentAddon: {
            enabled: false,
            treatmentTitle: 'Warm Stone Revitalizing Therapy',
            duration: '90 Min',
            price: 500000
        },
        customerPrice: 1100000,
        driverFee: 600000,
        ticketCost: 200000,
        image: 'https://images.pexels.com/photos/3889855/pexels-photo-3889855.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop'
    },
    {
        title: 'Kintamani Volcano & Natural Hot Springs',
        subtitle: 'Mount Batur Panorama, Toya Devasya Hot Springs & Coffee Agro',
        region: 'Kintamani & Highlands',
        highlights: [
            'Breathtaking Mount Batur & Lake Batur Panorama',
            'Toya Devasya Natural Volcanic Hot Spring Soak',
            'Kintamani Specialty Cafe & Coffee Plantation',
            'Tegallalang Valley Drive'
        ],
        durationHours: 9,
        carType: 'Private 5-Seater MPV',
        includesDriver: true,
        includesFuel: true,
        includesTickets: true,
        includesWater: true,
        spaTreatmentAddon: {
            enabled: true,
            treatmentTitle: 'Post-Volcano Muscle Recovery Massage',
            duration: '90 Min',
            price: 450000
        },
        customerPrice: 1150000,
        driverFee: 600000,
        ticketCost: 250000,
        image: 'https://images.pexels.com/photos/2873990/pexels-photo-2873990.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop'
    }
];

// Preset Nusa Penida Trips
const NUSA_PENIDA_PRESETS: Omit<NusaPenidaTrip, 'id' | 'brand'>[] = [
    {
        title: 'West Nusa Penida Spectacular Day Tour',
        routeType: 'west',
        boatPort: 'Sanur Harbor ⇄ Banjar Nyuh Port',
        boatDepartureTime: '07:30 AM',
        boatReturnTime: '16:30 PM',
        hotelPickupArea: 'Seminyak, Canggu, Ubud, Sanur, Kuta, Nusa Dua',
        passengerCount: 2,
        includesFastboat: true,
        includesBaliTransfer: true,
        includesIslandCar: true,
        includesSnorkeling: false,
        includesLunch: true,
        spaTreatmentAddon: {
            enabled: true,
            treatmentTitle: 'Post-Penida Rejuvenation In-Villa Massage',
            duration: '90 Min',
            price: 450000
        },
        pricePerPerson: 850000,
        fastboatCostPerPerson: 200000,
        islandCarCost: 550000,
        baliTransferCost: 300000,
        snorkelingCostPerPerson: 0,
        notes: 'Includes Kelingking Beach (T-Rex Cliff), Broken Beach (Pasih Uug), Angel’s Billabong, and Crystal Bay.',
        image: 'https://images.pexels.com/photos/3385662/pexels-photo-3385662.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop'
    },
    {
        title: 'East Nusa Penida Diamond Beach & Treehouse',
        routeType: 'east',
        boatPort: 'Sanur Harbor ⇄ Banjar Nyuh Port',
        boatDepartureTime: '07:30 AM',
        boatReturnTime: '16:30 PM',
        hotelPickupArea: 'Seminyak, Canggu, Ubud, Sanur, Kuta, Nusa Dua',
        passengerCount: 2,
        includesFastboat: true,
        includesBaliTransfer: true,
        includesIslandCar: true,
        includesSnorkeling: false,
        includesLunch: true,
        spaTreatmentAddon: {
            enabled: true,
            treatmentTitle: 'Post-Penida In-Villa Body Recovery',
            duration: '90 Min',
            price: 450000
        },
        pricePerPerson: 900000,
        fastboatCostPerPerson: 200000,
        islandCarCost: 600000,
        baliTransferCost: 300000,
        snorkelingCostPerPerson: 0,
        notes: 'Includes Diamond Beach Stairway, Atuh Beach, Thousand Islands Viewpoint, and Rumah Pohon Molenteng Tree House.',
        image: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop'
    },
    {
        title: 'Manta Ray & Coral Snorkeling Safari + West Tour',
        routeType: 'snorkeling',
        boatPort: 'Sanur Harbor ⇄ Banjar Nyuh Port',
        boatDepartureTime: '07:30 AM',
        boatReturnTime: '16:30 PM',
        hotelPickupArea: 'Seminyak, Canggu, Ubud, Sanur, Kuta, Nusa Dua',
        passengerCount: 2,
        includesFastboat: true,
        includesBaliTransfer: true,
        includesIslandCar: true,
        includesSnorkeling: true,
        includesLunch: true,
        spaTreatmentAddon: {
            enabled: true,
            treatmentTitle: 'Sun-Soothing Aloe & Balinese Massage',
            duration: '90 Min',
            price: 450000
        },
        pricePerPerson: 1150000,
        fastboatCostPerPerson: 200000,
        islandCarCost: 550000,
        baliTransferCost: 300000,
        snorkelingCostPerPerson: 175000,
        notes: 'Snorkeling boat charter with guide & gear at Manta Bay, Crystal Bay & Gamat Bay. Land visit to Kelingking Cliff.',
        image: 'https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop'
    }
];

export default function AdminDayTripManager({ brand }: AdminDayTripManagerProps) {
    const { setCampaign } = useSpa();

    const [activeTab, setActiveTab] = useState<'daytrip' | 'nusapenida'>('daytrip');
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    // ==========================================
    // BALI DAY TRIP FORM STATE
    // ==========================================
    const [dtGuestName, setDtGuestName] = useState('');
    const [dtGuestPhone, setDtGuestPhone] = useState('');
    const [dtTourDate, setDtTourDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [dtPickupTime, setDtPickupTime] = useState('08:30');
    const [dtPickupLocation, setDtPickupLocation] = useState('');
    const [dtSelectedPreset, setDtSelectedPreset] = useState<number>(0);
    const [dtPackage, setDtPackage] = useState<Omit<DayTripPackage, 'id' | 'brand'>>(BALI_DAY_TRIP_PRESETS[0]);
    const [dtCustomHighlights, setDtCustomHighlights] = useState<string>(BALI_DAY_TRIP_PRESETS[0].highlights.join('\n'));

    // Apply preset for Bali Day Trip
    const handleSelectDtPreset = (index: number) => {
        setDtSelectedPreset(index);
        const preset = BALI_DAY_TRIP_PRESETS[index];
        setDtPackage(preset);
        setDtCustomHighlights(preset.highlights.join('\n'));
    };

    // Day Trip Financials
    const dtCustomerTotal = dtPackage.customerPrice + (dtPackage.spaTreatmentAddon?.enabled ? (dtPackage.spaTreatmentAddon.price || 0) : 0);
    const dtTotalCosts = dtPackage.driverFee + dtPackage.ticketCost + (dtPackage.spaTreatmentAddon?.enabled ? 200000 : 0);
    const dtNetProfit = dtCustomerTotal - dtTotalCosts;

    // Generate WhatsApp for Day Trip Customer
    const generateDtCustomerWA = () => {
        const brandTitle = brand === 'elexoir' ? 'ELEXOIR LUXURY PRIVATE DAY TOURS' : 'BALI PRIVATE DAY TOURS';
        const highlightsArray = dtCustomHighlights.split('\n').filter(Boolean);

        return `🌴 *${brandTitle} - TOUR CONFIRMATION* 🌴\n\n` +
            `Dear *${dtGuestName || 'Valued Guest'}*,\n` +
            `Your private Bali day excursion has been reserved with full private transportation and concierge service:\n\n` +
            `🚗 *PACKAGE:* ${dtPackage.title}\n` +
            `📍 *REGION:* ${dtPackage.region}\n` +
            `🗓 *DATE:* ${dtTourDate}\n` +
            `⏰ *PICKUP TIME:* ${dtPickupTime} AM\n` +
            `🏨 *PICKUP LOCATION:* ${dtPickupLocation || 'Hotel/Villa'}\n\n` +
            `🗺 *PLANNED HIGHLIGHTS:*\n` +
            highlightsArray.map(h => `• ${h}`).join('\n') + `\n\n` +
            `✨ *INCLUSIONS:*\n` +
            `• ${dtPackage.carType}\n` +
            `• Professional English-Speaking Driver & Guide\n` +
            `• Petrol & All Parking Fees Included\n` +
            `• Complimentary Chilled Mineral Water\n` +
            (dtPackage.spaTreatmentAddon?.enabled ? `• 💆‍♀️ *BONUS SPA:* ${dtPackage.spaTreatmentAddon.duration} ${dtPackage.spaTreatmentAddon.treatmentTitle} (In-Villa after tour)\n` : '') +
            `\n💵 *TOTAL PRICE: Rp ${dtCustomerTotal.toLocaleString('en-US')} (Per Private Car)*\n\n` +
            `Our driver will greet you at the lobby/entrance at ${dtPickupTime} AM. We wish you an unforgettable Bali adventure! 🙏`;
    };

    // Generate WhatsApp for Day Trip Driver Dispatch
    const generateDtDriverWA = () => {
        return `🚨 *DRIVER DISPATCH - BALI PRIVATE TOUR* 🚨\n\n` +
            `🗓 *DATE:* ${dtTourDate}\n` +
            `⏰ *PICKUP TIME:* ${dtPickupTime} AM (Please arrive 10 mins early)\n` +
            `🏨 *PICKUP LOCATION:* ${dtPickupLocation || 'Hotel/Villa'}\n` +
            `👤 *GUEST:* ${dtGuestName || 'Guest'} (${dtGuestPhone || '-'})\n\n` +
            `🗺 *TOUR ROUTE:*\n${dtPackage.title}\n` +
            `${dtCustomHighlights}\n\n` +
            `💰 *DRIVER FEE + FUEL: Rp ${dtPackage.driverFee.toLocaleString('en-US')}*\n` +
            `💵 *COLLECT FROM GUEST: Rp ${dtCustomerTotal.toLocaleString('en-US')}*\n\n` +
            `Please keep car AC cool, provide mineral water, and ensure safe driving. Confirm with "RECEIVED".`;
    };

    // ==========================================
    // NUSA PENIDA FORM STATE
    // ==========================================
    const [npGuestName, setNpGuestName] = useState('');
    const [npGuestPhone, setNpGuestPhone] = useState('');
    const [npTripDate, setNpTripDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [npHotelPickupLocation, setNpHotelPickupLocation] = useState('');
    const [npSelectedPreset, setNpSelectedPreset] = useState<number>(0);
    const [npPackage, setNpPackage] = useState<Omit<NusaPenidaTrip, 'id' | 'brand'>>(NUSA_PENIDA_PRESETS[0]);

    // Apply preset for Nusa Penida
    const handleSelectNpPreset = (index: number) => {
        setNpSelectedPreset(index);
        setNpPackage(NUSA_PENIDA_PRESETS[index]);
    };

    // Nusa Penida Financials
    const npPax = npPackage.passengerCount || 2;
    const npPerPersonPrice = npPackage.pricePerPerson + (npPackage.spaTreatmentAddon?.enabled ? (npPackage.spaTreatmentAddon.price || 0) : 0);
    const npCustomerTotal = npPerPersonPrice * npPax;
    
    const npTotalFastboatCost = npPackage.fastboatCostPerPerson * npPax;
    const npTotalSnorkelingCost = (npPackage.includesSnorkeling ? npPackage.snorkelingCostPerPerson : 0) * npPax;
    const npTotalSpaCost = (npPackage.spaTreatmentAddon?.enabled ? 200000 : 0) * npPax;
    const npTotalCosts = npTotalFastboatCost + npPackage.islandCarCost + npPackage.baliTransferCost + npTotalSnorkelingCost + npTotalSpaCost;
    const npNetProfit = npCustomerTotal - npTotalCosts;

    // Generate WhatsApp for Nusa Penida Passenger
    const generateNpPassengerWA = () => {
        const brandTitle = brand === 'elexoir' ? 'ELEXOIR NUSA PENIDA EXPEDITIONS' : 'NUSA PENIDA DAY TOURS';

        return `🚤 *${brandTitle} - VOUCHER & ITINERARY* 🚤\n\n` +
            `Dear *${npGuestName || 'Valued Guest'}*,\n` +
            `Your all-inclusive Nusa Penida Island Day Trip & Fastboat package is confirmed:\n\n` +
            `🗓 *DATE:* ${npTripDate}\n` +
            `👥 *PASSENGERS:* ${npPax} Person(s)\n` +
            `🏝 *EXCURSION:* ${npPackage.title}\n` +
            `🏨 *HOTEL PICKUP:* ${npHotelPickupLocation || 'Hotel/Villa'}\n\n` +
            `⏱ *DAILY SCHEDULE & TIMELINE:*\n` +
            `• 06:15 AM - Hotel Pick-up in Bali via Private AC Car\n` +
            `• 07:00 AM - Arrive at Sanur Harbor & Collect Boarding Passes\n` +
            `• 07:30 AM - Fastboat departs Sanur to Nusa Penida\n` +
            `• 08:15 AM - Arrive at Nusa Penida & Meet Private Island Driver\n` +
            `• 08:30 AM - 15:30 PM - Island Tour Highlights & Lunch\n` +
            `• 16:30 PM - Fastboat departs Nusa Penida back to Sanur Harbor\n` +
            `• 17:15 PM - Transfer back to your Bali accommodation\n` +
            (npPackage.spaTreatmentAddon?.enabled ? `• 18:30 PM - 💆‍♀️ In-Villa Post-Penida Recovery Massage (${npPackage.spaTreatmentAddon.duration})\n` : '') +
            `\n✨ *PACKAGE INCLUDES:*\n` +
            `• Return Fastboat Tickets (Sanur ⇄ Nusa Penida)\n` +
            `• Private Hotel Transfers in Bali\n` +
            `• Private Island AC Car & Driver/Guide in Nusa Penida\n` +
            `• All Retribution & Island Parking Fees\n` +
            (npPackage.includesSnorkeling ? `• Snorkeling Boat & Gear (Manta Bay, Crystal Bay, Gamat Bay)\n` : '') +
            (npPackage.includesLunch ? `• Lunch at Island Viewpoint Restaurant\n` : '') +
            `\n💵 *TOTAL PAYMENT: Rp ${npCustomerTotal.toLocaleString('en-US')} (${npPax} Pax)*\n\n` +
            `Please bring sunscreen, sunglasses, comfortable footwear, and a swimsuit! Enjoy Paradise! 🌴🌊`;
    };

    // Generate WhatsApp for Nusa Penida Boat / Driver Dispatch
    const generateNpDispatchWA = () => {
        return `🚨 *DISPATCH - NUSA PENIDA ALL-INCLUSIVE* 🚨\n\n` +
            `🗓 *DATE:* ${npTripDate}\n` +
            `👥 *TOTAL PAX:* ${npPax} Person(s)\n` +
            `👤 *LEAD GUEST:* ${npGuestName || 'Guest'} (${npGuestPhone || '-'})\n` +
            `🏨 *BALI PICKUP:* ${npHotelPickupLocation || 'Hotel/Villa'}\n\n` +
            `🚤 *FASTBOAT DETAILS:*\n` +
            `• Port: Sanur Harbor\n` +
            `• Depart: ${npPackage.boatDepartureTime} | Return: ${npPackage.boatReturnTime}\n` +
            `• Island Route: ${npPackage.routeType.toUpperCase()} PENIDA\n` +
            (npPackage.includesSnorkeling ? `• Snorkeling Safari: YES (Manta Bay)\n` : `• Snorkeling Safari: NO\n`) +
            `\n💰 *FINANCIAL DISPATCH:*\n` +
            `• Fastboat Tickets (${npPax} pax): Rp ${npTotalFastboatCost.toLocaleString('en-US')}\n` +
            `• Island Private Car: Rp ${npPackage.islandCarCost.toLocaleString('en-US')}\n` +
            `• Bali Hotel Transfer: Rp ${npPackage.baliTransferCost.toLocaleString('en-US')}\n` +
            `💵 *COLLECT FROM GUEST: Rp ${npCustomerTotal.toLocaleString('en-US')}*\n\n` +
            `Please acknowledge and dispatch team. Reply "CONFIRMED".`;
    };

    // Helper to copy text
    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2500);
    };

    // Publish Day Trip / Nusa Penida as Homepage Promotional Campaign
    const handlePublishAsCampaign = (type: 'daytrip' | 'nusapenida') => {
        const title = type === 'daytrip' ? dtPackage.title : npPackage.title;
        const label = type === 'daytrip' ? 'Exclusive Private Bali Day Trip' : 'Nusa Penida & Fastboat Island Tour';
        const desc = type === 'daytrip' 
            ? `${dtPackage.region} private tour with private driver, air-conditioned transport, scenic highlights, and optional end-of-day in-villa spa treatment.`
            : `All-inclusive island excursion with return fastboat tickets, private island car, guided tour, and optional post-trip recovery massage.`;
        const img = type === 'daytrip' ? dtPackage.image : npPackage.image;

        setCampaign({
            title,
            label,
            description: desc,
            image: img || 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg',
            duration: '1_month',
            discountPercentage: 15,
            selectedTreatments: [],
            is_published: true
        });

        alert(`🎉 Successfully published "${title}" as the active promotional campaign on the homepage!`);
    };

    return (
        <div className="space-y-6">
            {/* Header & Tour Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/80 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80 block mb-1">
                        Excursions & Fastboat Logistics
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Compass className="w-5 h-5 text-emerald-600" />
                        Day Trips & Nusa Penida Fastboat Suite
                    </h2>
                </div>

                <div className="flex items-center bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => setActiveTab('daytrip')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            activeTab === 'daytrip'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        <Car className="w-3.5 h-3.5" /> Bali Day Trips
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('nusapenida')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            activeTab === 'nusapenida'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        <Ship className="w-3.5 h-3.5" /> Nusa Penida & Fastboat
                    </button>
                </div>
            </div>

            {/* TAB 1: BALI PRIVATE DAY TRIPS */}
            {activeTab === 'daytrip' && (
                <div className="space-y-6">
                    {/* Preset Selector Chips */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 space-y-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                            Select Itinerary Preset
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {BALI_DAY_TRIP_PRESETS.map((preset, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleSelectDtPreset(idx)}
                                    className={`p-3.5 rounded-xl border text-left transition-all ${
                                        dtSelectedPreset === idx
                                            ? 'border-primary bg-primary/[0.04] ring-2 ring-primary/20 shadow-sm'
                                            : 'border-gray-200 bg-gray-50/60 hover:bg-white'
                                    }`}
                                >
                                    <h4 className="font-bold text-xs text-gray-900 line-clamp-1">{preset.title}</h4>
                                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{preset.region}</p>
                                    <span className="text-xs font-black text-primary block mt-2">
                                        Rp {preset.customerPrice.toLocaleString('en-US')}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Booking & Passenger Info */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                            <Users className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">1. Passenger & Pickup Logistics</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                    Lead Guest Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. David & Sarah Connor"
                                    value={dtGuestName}
                                    onChange={e => setDtGuestName(e.target.value)}
                                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                    WhatsApp / Phone
                                </label>
                                <input
                                    type="tel"
                                    placeholder="e.g. 6281999888777"
                                    value={dtGuestPhone}
                                    onChange={e => setDtGuestPhone(e.target.value)}
                                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                    Tour Date
                                </label>
                                <input
                                    type="date"
                                    value={dtTourDate}
                                    onChange={e => setDtTourDate(e.target.value)}
                                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                    Pickup Time (AM)
                                </label>
                                <input
                                    type="time"
                                    value={dtPickupTime}
                                    onChange={e => setDtPickupTime(e.target.value)}
                                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-none"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                    Pickup Villa / Hotel Location & Area
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Maya Ubud Resort & Spa, Jl. Gunung Sari, Peliatan, Ubud"
                                    value={dtPickupLocation}
                                    onChange={e => setDtPickupLocation(e.target.value)}
                                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Day Trip Itinerary & Spa Add-on */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                            <Compass className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">2. Itinerary & Spa Add-on</h3>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                Tour Title
                            </label>
                            <input
                                type="text"
                                value={dtPackage.title}
                                onChange={e => setDtPackage({ ...dtPackage, title: e.target.value })}
                                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                Planned Highlights (One per line)
                            </label>
                            <textarea
                                rows={4}
                                value={dtCustomHighlights}
                                onChange={e => setDtCustomHighlights(e.target.value)}
                                className="w-full bg-gray-50/70 border border-gray-200 rounded-xl p-3 text-xs sm:text-sm text-gray-900 font-mono focus:bg-white focus:outline-none"
                            />
                        </div>

                        {/* Signature End-of-Tour Spa Treatment Add-on */}
                        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-xs font-bold text-amber-950 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={dtPackage.spaTreatmentAddon?.enabled || false}
                                        onChange={e => setDtPackage({
                                            ...dtPackage,
                                            spaTreatmentAddon: {
                                                enabled: e.target.checked,
                                                treatmentTitle: dtPackage.spaTreatmentAddon?.treatmentTitle || 'Balinese Herbal Recovery Massage',
                                                duration: dtPackage.spaTreatmentAddon?.duration || '90 Min',
                                                price: dtPackage.spaTreatmentAddon?.price || 450000
                                            }
                                        })}
                                        className="w-4 h-4 rounded text-primary focus:ring-primary"
                                    />
                                    <span>💆‍♀️ In-Villa Post-Tour Spa Massage Add-on</span>
                                </label>
                                <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                                    Signature Combo
                                </span>
                            </div>

                            {dtPackage.spaTreatmentAddon?.enabled && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Treatment Title</label>
                                        <input
                                            type="text"
                                            value={dtPackage.spaTreatmentAddon.treatmentTitle}
                                            onChange={e => setDtPackage({
                                                ...dtPackage,
                                                spaTreatmentAddon: { ...dtPackage.spaTreatmentAddon!, treatmentTitle: e.target.value }
                                            })}
                                            className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Duration</label>
                                        <input
                                            type="text"
                                            value={dtPackage.spaTreatmentAddon.duration}
                                            onChange={e => setDtPackage({
                                                ...dtPackage,
                                                spaTreatmentAddon: { ...dtPackage.spaTreatmentAddon!, duration: e.target.value }
                                            })}
                                            className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Add-on Price (Rp)</label>
                                        <input
                                            type="number"
                                            value={dtPackage.spaTreatmentAddon.price}
                                            onChange={e => setDtPackage({
                                                ...dtPackage,
                                                spaTreatmentAddon: { ...dtPackage.spaTreatmentAddon!, price: Number(e.target.value) || 0 }
                                            })}
                                            className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pricing & Driver Fee Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                    Customer Tour Price (Rp)
                                </label>
                                <input
                                    type="number"
                                    value={dtPackage.customerPrice}
                                    onChange={e => setDtPackage({ ...dtPackage, customerPrice: Number(e.target.value) || 0 })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                    Driver Fee & Fuel Cost (Rp)
                                </label>
                                <input
                                    type="number"
                                    value={dtPackage.driverFee}
                                    onChange={e => setDtPackage({ ...dtPackage, driverFee: Number(e.target.value) || 0 })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-red-600 font-bold"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                    Entrance Tickets Cost (Rp)
                                </label>
                                <input
                                    type="number"
                                    value={dtPackage.ticketCost}
                                    onChange={e => setDtPackage({ ...dtPackage, ticketCost: Number(e.target.value) || 0 })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Day Trip Summary & Dispatch */}
                    <div className="bg-gray-900 text-white rounded-2xl shadow-xl p-5 sm:p-8 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-white/15">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">
                                    Financial Breakdown
                                </span>
                                <h3 className="text-lg font-bold text-white">Day Trip Profit Summary</h3>
                            </div>
                            <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-mono text-white/90">
                                1 Private Car • {dtPackage.durationHours} Hours
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                <span className="text-[10px] font-bold uppercase text-white/60 block">Customer Price</span>
                                <span className="text-base sm:text-lg font-bold text-white">Rp {dtCustomerTotal.toLocaleString('en-US')}</span>
                            </div>

                            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                <span className="text-[10px] font-bold uppercase text-white/60 block">Driver Fee</span>
                                <span className="text-base sm:text-lg font-bold text-red-400">- Rp {dtPackage.driverFee.toLocaleString('en-US')}</span>
                            </div>

                            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                <span className="text-[10px] font-bold uppercase text-white/60 block">Tickets & Spa Cost</span>
                                <span className="text-base sm:text-lg font-bold text-amber-300">- Rp {(dtPackage.ticketCost + (dtPackage.spaTreatmentAddon?.enabled ? 200000 : 0)).toLocaleString('en-US')}</span>
                            </div>

                            <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-500/30">
                                <span className="text-[10px] font-bold uppercase text-emerald-400 block">Net Trip Profit</span>
                                <span className="text-lg sm:text-xl font-black text-emerald-400">Rp {dtNetProfit.toLocaleString('en-US')}</span>
                            </div>
                        </div>

                        {/* Dispatch & Launch Actions */}
                        <div className="pt-2 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Customer WA */}
                                <div className="flex gap-2">
                                    <a
                                        href={`https://wa.me/${dtGuestPhone.replace(/\D/g, '')}?text=${encodeURIComponent(generateDtCustomerWA())}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                                    >
                                        <MessageSquare size={16} /> Send Itinerary to Guest (WA)
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(generateDtCustomerWA(), 'dt_guest')}
                                        className="bg-white/10 hover:bg-white/20 text-white px-3.5 rounded-xl text-xs transition-colors flex items-center justify-center"
                                        title="Copy Itinerary"
                                    >
                                        {copiedKey === 'dt_guest' ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                    </button>
                                </div>

                                {/* Driver WA */}
                                <div className="flex gap-2">
                                    <a
                                        href={`https://wa.me/?text=${encodeURIComponent(generateDtDriverWA())}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                                    >
                                        <Send size={16} /> Dispatch Driver (WA)
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(generateDtDriverWA(), 'dt_driver')}
                                        className="bg-white/10 hover:bg-white/20 text-white px-3.5 rounded-xl text-xs transition-colors flex items-center justify-center"
                                        title="Copy Driver Dispatch"
                                    >
                                        {copiedKey === 'dt_driver' ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Publish as Promo Campaign Banner */}
                            <button
                                type="button"
                                onClick={() => handlePublishAsCampaign('daytrip')}
                                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                <Megaphone size={18} />
                                Publish as Featured Promo Campaign on Website
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: NUSA PENIDA & FASTBOAT ARRANGE */}
            {activeTab === 'nusapenida' && (
                <div className="space-y-6">
                    {/* Preset Selector Chips */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 space-y-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                            Select Nusa Penida Tour Preset
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {NUSA_PENIDA_PRESETS.map((preset, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleSelectNpPreset(idx)}
                                    className={`p-3.5 rounded-xl border text-left transition-all ${
                                        npSelectedPreset === idx
                                            ? 'border-primary bg-primary/[0.04] ring-2 ring-primary/20 shadow-sm'
                                            : 'border-gray-200 bg-gray-50/60 hover:bg-white'
                                    }`}
                                >
                                    <h4 className="font-bold text-xs text-gray-900 line-clamp-1">{preset.title}</h4>
                                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{preset.boatPort}</p>
                                    <span className="text-xs font-black text-primary block mt-2">
                                        Rp {preset.pricePerPerson.toLocaleString('en-US')} / Person
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Passenger & Schedule Setup */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                            <Users className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">1. Passenger & Fastboat Logistics</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                    Lead Guest Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Michael Smith"
                                    value={npGuestName}
                                    onChange={e => setNpGuestName(e.target.value)}
                                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                    WhatsApp Number
                                </label>
                                <input
                                    type="tel"
                                    placeholder="e.g. 6281234567890"
                                    value={npGuestPhone}
                                    onChange={e => setNpGuestPhone(e.target.value)}
                                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                    Excursion Date
                                </label>
                                <input
                                    type="date"
                                    value={npTripDate}
                                    onChange={e => setNpTripDate(e.target.value)}
                                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-none"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                    Bali Hotel / Villa Pickup Location
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. W Bali Seminyak / The Kayon Jungle Resort Ubud"
                                    value={npHotelPickupLocation}
                                    onChange={e => setNpHotelPickupLocation(e.target.value)}
                                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                    Total Passengers
                                </label>
                                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 h-[42px]">
                                    <button
                                        type="button"
                                        onClick={() => setNpPackage({ ...npPackage, passengerCount: Math.max(1, (npPackage.passengerCount || 2) - 1) })}
                                        className="w-8 h-full rounded-lg bg-gray-50 hover:bg-gray-100 font-bold text-gray-700"
                                    >
                                        -
                                    </button>
                                    <span className="text-sm font-bold flex-1 text-center text-gray-900">{npPackage.passengerCount || 2} Pax</span>
                                    <button
                                        type="button"
                                        onClick={() => setNpPackage({ ...npPackage, passengerCount: (npPackage.passengerCount || 2) + 1 })}
                                        className="w-8 h-full rounded-lg bg-gray-50 hover:bg-gray-100 font-bold text-gray-700"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Fastboat Schedule Slots */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                    Sanur Harbor Fastboat Departure Time
                                </label>
                                <select
                                    value={npPackage.boatDepartureTime}
                                    onChange={e => setNpPackage({ ...npPackage, boatDepartureTime: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 font-bold"
                                >
                                    <option value="07:30 AM">07:30 AM (Recommended - Full Day)</option>
                                    <option value="08:30 AM">08:30 AM (Morning Slot)</option>
                                    <option value="09:15 AM">09:15 AM (Mid-Morning Slot)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                    Nusa Penida Fastboat Return Time
                                </label>
                                <select
                                    value={npPackage.boatReturnTime}
                                    onChange={e => setNpPackage({ ...npPackage, boatReturnTime: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 font-bold"
                                >
                                    <option value="16:30 PM">16:30 PM (Standard Sunset Return)</option>
                                    <option value="17:00 PM">17:00 PM (Late Afternoon Return)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Nusa Penida Inclusions & Recovery Spa */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                            <Ship className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">2. Package Details & Spa Recovery</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 p-2.5 bg-gray-50 rounded-xl cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={npPackage.includesFastboat}
                                    onChange={e => setNpPackage({ ...npPackage, includesFastboat: e.target.checked })}
                                    className="w-4 h-4 rounded text-primary"
                                />
                                <span>Return Fastboat Tickets (Sanur ⇄ Penida)</span>
                            </label>

                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 p-2.5 bg-gray-50 rounded-xl cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={npPackage.includesBaliTransfer}
                                    onChange={e => setNpPackage({ ...npPackage, includesBaliTransfer: e.target.checked })}
                                    className="w-4 h-4 rounded text-primary"
                                />
                                <span>Hotel Pick-up & Drop-off Transfer in Bali</span>
                            </label>

                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 p-2.5 bg-gray-50 rounded-xl cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={npPackage.includesIslandCar}
                                    onChange={e => setNpPackage({ ...npPackage, includesIslandCar: e.target.checked })}
                                    className="w-4 h-4 rounded text-primary"
                                />
                                <span>Private AC Island Car & Driver in Penida</span>
                            </label>

                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 p-2.5 bg-gray-50 rounded-xl cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={npPackage.includesSnorkeling}
                                    onChange={e => setNpPackage({ ...npPackage, includesSnorkeling: e.target.checked })}
                                    className="w-4 h-4 rounded text-primary"
                                />
                                <span>Snorkeling Boat & Gear (Manta Bay + Gamat)</span>
                            </label>
                        </div>

                        {/* Signature Recovery Spa Add-on */}
                        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-xs font-bold text-emerald-950 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={npPackage.spaTreatmentAddon?.enabled || false}
                                        onChange={e => setNpPackage({
                                            ...npPackage,
                                            spaTreatmentAddon: {
                                                enabled: e.target.checked,
                                                treatmentTitle: npPackage.spaTreatmentAddon?.treatmentTitle || 'Post-Penida Rejuvenation In-Villa Massage',
                                                duration: npPackage.spaTreatmentAddon?.duration || '90 Min',
                                                price: npPackage.spaTreatmentAddon?.price || 450000
                                            }
                                        })}
                                        className="w-4 h-4 rounded text-primary"
                                    />
                                    <span>💆‍♀️ In-Villa Post-Penida Massage (After Hotel Drop-off)</span>
                                </label>
                                <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                                    Ultimate Relaxation
                                </span>
                            </div>

                            {npPackage.spaTreatmentAddon?.enabled && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Treatment Title</label>
                                        <input
                                            type="text"
                                            value={npPackage.spaTreatmentAddon.treatmentTitle}
                                            onChange={e => setNpPackage({
                                                ...npPackage,
                                                spaTreatmentAddon: { ...npPackage.spaTreatmentAddon!, treatmentTitle: e.target.value }
                                            })}
                                            className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Price / Person (Rp)</label>
                                        <input
                                            type="number"
                                            value={npPackage.spaTreatmentAddon.price}
                                            onChange={e => setNpPackage({
                                                ...npPackage,
                                                spaTreatmentAddon: { ...npPackage.spaTreatmentAddon!, price: Number(e.target.value) || 0 }
                                            })}
                                            className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Price & Cost Breakdown Inputs */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                                    Price / Pax (Rp)
                                </label>
                                <input
                                    type="number"
                                    value={npPackage.pricePerPerson}
                                    onChange={e => setNpPackage({ ...npPackage, pricePerPerson: Number(e.target.value) || 0 })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                                    Boat Cost / Pax (Rp)
                                </label>
                                <input
                                    type="number"
                                    value={npPackage.fastboatCostPerPerson}
                                    onChange={e => setNpPackage({ ...npPackage, fastboatCostPerPerson: Number(e.target.value) || 0 })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-red-500 font-bold"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                                    Island Car Cost (Rp)
                                </label>
                                <input
                                    type="number"
                                    value={npPackage.islandCarCost}
                                    onChange={e => setNpPackage({ ...npPackage, islandCarCost: Number(e.target.value) || 0 })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-red-500 font-bold"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                                    Bali Transfer (Rp)
                                </label>
                                <input
                                    type="number"
                                    value={npPackage.baliTransferCost}
                                    onChange={e => setNpPackage({ ...npPackage, baliTransferCost: Number(e.target.value) || 0 })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-red-500 font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Nusa Penida Summary & Dispatch */}
                    <div className="bg-gray-900 text-white rounded-2xl shadow-xl p-5 sm:p-8 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-white/15">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 block">
                                    Logistics & Profit Calculation
                                </span>
                                <h3 className="text-lg font-bold text-white">Nusa Penida Package Total</h3>
                            </div>
                            <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-mono text-white/90">
                                {npPax} Pax • Fastboat + Island Logistics
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                <span className="text-[10px] font-bold uppercase text-white/60 block">Total Revenue</span>
                                <span className="text-base sm:text-lg font-bold text-white">Rp {npCustomerTotal.toLocaleString('en-US')}</span>
                            </div>

                            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                <span className="text-[10px] font-bold uppercase text-white/60 block">Fastboat Costs</span>
                                <span className="text-base sm:text-lg font-bold text-red-400">- Rp {npTotalFastboatCost.toLocaleString('en-US')}</span>
                            </div>

                            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                <span className="text-[10px] font-bold uppercase text-white/60 block">Car & Transfer Costs</span>
                                <span className="text-base sm:text-lg font-bold text-amber-300">- Rp {(npPackage.islandCarCost + npPackage.baliTransferCost).toLocaleString('en-US')}</span>
                            </div>

                            <div className="bg-cyan-950/60 p-3 rounded-xl border border-cyan-500/30">
                                <span className="text-[10px] font-bold uppercase text-cyan-400 block">Net Package Profit</span>
                                <span className="text-lg sm:text-xl font-black text-cyan-400">Rp {npNetProfit.toLocaleString('en-US')}</span>
                            </div>
                        </div>

                        {/* Dispatch & Launch Actions */}
                        <div className="pt-2 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Passenger WA */}
                                <div className="flex gap-2">
                                    <a
                                        href={`https://wa.me/${npGuestPhone.replace(/\D/g, '')}?text=${encodeURIComponent(generateNpPassengerWA())}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                                    >
                                        <MessageSquare size={16} /> Send Voucher to Guest (WA)
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(generateNpPassengerWA(), 'np_guest')}
                                        className="bg-white/10 hover:bg-white/20 text-white px-3.5 rounded-xl text-xs transition-colors flex items-center justify-center"
                                        title="Copy Voucher"
                                    >
                                        {copiedKey === 'np_guest' ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                    </button>
                                </div>

                                {/* Boat / Driver WA */}
                                <div className="flex gap-2">
                                    <a
                                        href={`https://wa.me/?text=${encodeURIComponent(generateNpDispatchWA())}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                                    >
                                        <Send size={16} /> Dispatch Boat & Driver (WA)
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(generateNpDispatchWA(), 'np_dispatch')}
                                        className="bg-white/10 hover:bg-white/20 text-white px-3.5 rounded-xl text-xs transition-colors flex items-center justify-center"
                                        title="Copy Dispatch"
                                    >
                                        {copiedKey === 'np_dispatch' ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Publish as Promo Campaign Banner */}
                            <button
                                type="button"
                                onClick={() => handlePublishAsCampaign('nusapenida')}
                                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                <Megaphone size={18} />
                                Publish as Featured Nusa Penida Campaign on Website
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
