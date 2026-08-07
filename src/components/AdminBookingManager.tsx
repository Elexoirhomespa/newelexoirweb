'use client';

import React, { useState, useEffect } from 'react';
import { 
    Calendar, Clock, User, Phone, MapPin, Plus, Trash2, Send, 
    CheckCircle2, Sparkles, Navigation, Copy, Check, 
    ListFilter, MessageSquare
} from 'lucide-react';
import { useSpa, TherapistFee, AdminBooking, AdminBookingItem } from '@/context/SpaContext';

interface AdminBookingManagerProps {
    brand: string;
    therapistFees: TherapistFee[];
    feeInputs: { [key: string]: string };
}

export default function AdminBookingManager({ brand, feeInputs }: AdminBookingManagerProps) {
    const { treatments } = useSpa();

    const [activeSection, setActiveSection] = useState<'create' | 'manage'>('create');
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    // Form State
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [bookingDate, setBookingDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [bookingTime, setBookingTime] = useState('14:00');
    const [villaName, setVillaName] = useState('');
    const [address, setAddress] = useState('');
    const [roomNumber, setRoomNumber] = useState('');
    const [googleMapsUrl, setGoogleMapsUrl] = useState('');
    const [transportFee, setTransportFee] = useState<number>(0);
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [notes, setNotes] = useState('');
    
    // Multi-treatment items
    const [items, setItems] = useState<AdminBookingItem[]>([
        {
            id: 'item-1',
            treatmentId: treatments[0]?.id || '',
            duration: treatments[0]?.options[0]?.duration || '60 Min',
            treatmentsCount: 1,
            therapistsCount: 1,
            therapistNames: '',
        }
    ]);

    // Saved Bookings list
    const [savedBookings, setSavedBookings] = useState<AdminBooking[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Load saved bookings from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem('spa_admin_bookings');
            if (stored) {
                setSavedBookings(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Error loading bookings', e);
        }
    }, []);

    // Save bookings helper
    const persistBookings = (newList: AdminBooking[]) => {
        setSavedBookings(newList);
        try {
            localStorage.setItem('spa_admin_bookings', JSON.stringify(newList));
        } catch (e) {
            console.error('Error saving bookings', e);
        }
    };

    // Preset Date Handler
    const setDatePreset = (daysAhead: number) => {
        const d = new Date();
        d.setDate(d.getDate() + daysAhead);
        setBookingDate(d.toISOString().split('T')[0]);
    };

    // Item modifiers
    const handleAddItem = () => {
        const firstTreatment = treatments[0];
        setItems(prev => [
            ...prev,
            {
                id: `item-${Date.now()}-${Math.random()}`,
                treatmentId: firstTreatment?.id || '',
                duration: firstTreatment?.options[0]?.duration || '60 Min',
                treatmentsCount: 1,
                therapistsCount: 1,
                therapistNames: ''
            }
        ]);
    };

    const handleRemoveItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(i => i.id !== id));
        }
    };

    const handleItemChange = (id: string, updates: Partial<AdminBookingItem>) => {
        setItems(items.map(item => {
            if (item.id !== id) return item;
            const updated = { ...item, ...updates };

            // If treatment changed, reset duration to first available
            if (updates.treatmentId && updates.treatmentId !== item.treatmentId) {
                const tr = treatments.find(t => t.id === updates.treatmentId);
                if (tr && tr.options.length > 0) {
                    updated.duration = tr.options[0].duration;
                }
            }
            return updated;
        }));
    };

    // Financial calculations
    const getFinancials = () => {
        let totalRevenue = 0;
        let totalTherapistFee = 0;

        items.forEach(item => {
            const tr = treatments.find(t => t.id === item.treatmentId);
            const opt = tr?.options.find(o => o.duration === item.duration);
            
            const rawPrice = opt ? parseInt(opt.price.replace(/\D/g, '')) || 0 : 0;
            const price = item.priceOverride !== undefined && item.priceOverride >= 0 ? item.priceOverride : rawPrice;

            const feeKey = `${item.treatmentId}-${item.duration}`;
            const rawFeeStr = feeInputs[feeKey] || '0';
            const rawFee = parseInt(rawFeeStr.replace(/\D/g, '')) || 0;
            const fee = item.feeOverride !== undefined && item.feeOverride >= 0 ? item.feeOverride : rawFee;

            totalRevenue += price * item.treatmentsCount;
            totalTherapistFee += fee * item.therapistsCount;
        });

        const grossRevenue = totalRevenue + Number(transportFee || 0) - Number(discountAmount || 0);
        const netProfit = grossRevenue - totalTherapistFee;

        return {
            totalRevenue,
            grossRevenue,
            totalTherapistFee,
            transportFee: Number(transportFee || 0),
            discountAmount: Number(discountAmount || 0),
            netProfit
        };
    };

    const financials = getFinancials();

    // Generate WhatsApp Text for Client
    const generateClientWhatsAppText = () => {
        const brandTitle = brand === 'elexoir' ? 'ELEXOIR HOME SPA UBUD' : 'HOME SPA BALI';
        
        let treatmentsListText = '';
        items.forEach((item, idx) => {
            const tr = treatments.find(t => t.id === item.treatmentId);
            const opt = tr?.options.find(o => o.duration === item.duration);
            const price = item.priceOverride ?? (opt ? parseInt(opt.price.replace(/\D/g, '')) || 0 : 0);
            
            treatmentsListText += `${idx + 1}. *${tr?.title?.toUpperCase() || 'MASSAGE RITUAL'}*\n`;
            treatmentsListText += `   • Duration: ${item.duration}\n`;
            treatmentsListText += `   • Guests: ${item.treatmentsCount} Person(s)\n`;
            treatmentsListText += `   • Price: Rp ${(price * item.treatmentsCount).toLocaleString('en-US')}\n`;
        });

        let summaryCostText = `*TOTAL PAYMENT: Rp ${financials.grossRevenue.toLocaleString('en-US')}*`;
        if (financials.transportFee > 0) {
            summaryCostText += `\n(Includes Remote Transport Fee: Rp ${financials.transportFee.toLocaleString('en-US')})`;
        }
        if (financials.discountAmount > 0) {
            summaryCostText += `\n(Discount Applied: -Rp ${financials.discountAmount.toLocaleString('en-US')})`;
        }

        return `✨ *${brandTitle} - BOOKING CONFIRMATION* ✨\n\n` +
            `Dear *${clientName || 'Valued Guest'}*,\n` +
            `Thank you for choosing our private in-villa wellness sanctuary. Your reservation is scheduled:\n\n` +
            `🗓 *DATE:* ${bookingDate}\n` +
            `⏰ *TIME:* ${bookingTime}\n` +
            `📍 *LOCATION:* ${villaName || 'Villa/Hotel'}\n` +
            (roomNumber ? `🚪 *ROOM/VILLA NO:* ${roomNumber}\n` : '') +
            (address ? `🗺 *ADDRESS:* ${address}\n` : '') +
            `\n💆‍♀️ *SELECTED RITUALS:*\n${treatmentsListText}\n` +
            `💵 ${summaryCostText}\n\n` +
            `🌿 *WHAT WE PROVIDE:*\n` +
            `• Professional Massage Table/Mat & Fresh Linen\n` +
            `• 100% Organic Essential Oils & Aromatherapy\n` +
            `• Calming Spa Ambiance & Ambient Music\n\n` +
            `Our therapists will arrive 10-15 minutes prior to set up your sanctuary. If you need any adjustments, please let us know! 🙏`;
    };

    // Generate WhatsApp Text for Therapist Dispatch
    const generateTherapistWhatsAppText = () => {
        const brandTitle = brand === 'elexoir' ? 'ELEXOIR SPA' : 'HOME SPA BALI';
        
        let treatmentsListText = '';
        items.forEach((item, idx) => {
            const tr = treatments.find(t => t.id === item.treatmentId);
            const feeKey = `${item.treatmentId}-${item.duration}`;
            const rawFee = parseInt(feeInputs[feeKey]?.replace(/\D/g, '') || '0');
            const fee = item.feeOverride ?? rawFee;

            treatmentsListText += `${idx + 1}. *${tr?.title?.toUpperCase()}* (${item.duration})\n`;
            treatmentsListText += `   • Guests: ${item.treatmentsCount} Person(s)\n`;
            treatmentsListText += `   • Therapist Payout: Rp ${(fee * item.therapistsCount).toLocaleString('en-US')}\n`;
            if (item.therapistNames) {
                treatmentsListText += `   • Assigned: ${item.therapistNames}\n`;
            }
        });

        return `🚨 *JOB DISPATCH - ${brandTitle}* 🚨\n\n` +
            `🗓 *DATE:* ${bookingDate}\n` +
            `⏰ *START TIME:* ${bookingTime} (Arrive by 15 mins prior)\n` +
            `📍 *LOCATION:* ${villaName || 'Villa/Hotel'}\n` +
            (roomNumber ? `🚪 *ROOM/VILLA:* ${roomNumber}\n` : '') +
            (address ? `🗺 *ADDRESS:* ${address}\n` : '') +
            (googleMapsUrl ? `📍 *MAPS LINK:* ${googleMapsUrl}\n` : '') +
            `\n👤 *GUEST:* ${clientName || 'Guest'} (${clientPhone || '-'})\n\n` +
            `💆‍♀️ *TREATMENTS:*\n${treatmentsListText}\n` +
            `💰 *TOTAL THERAPIST FEE: Rp ${financials.totalTherapistFee.toLocaleString('en-US')}*\n` +
            `💵 *COLLECT FROM CLIENT: Rp ${financials.grossRevenue.toLocaleString('en-US')}*\n\n` +
            (notes ? `📝 *SPECIAL NOTES:* ${notes}\n\n` : '') +
            `✅ *EQUIPMENT CHECKLIST:*\n` +
            `[ ] Clean Uniform & Apron\n` +
            `[ ] Organic Massage Oils & Balms\n` +
            `[ ] Sanitized Linens & Face Towels\n` +
            `[ ] Aromatherapy Diffuser / Essential Oil\n` +
            `[ ] Bluetooth Spa Speaker\n\n` +
            `Please confirm receipt of this job by replying "RECEIVED". Thank you!`;
    };

    // Copy to clipboard helper
    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2500);
    };

    // Save Booking
    const handleSaveBooking = (status: AdminBooking['status'] = 'confirmed') => {
        if (!clientName && !villaName) {
            alert('Please enter at least Client Name or Villa Name.');
            return;
        }

        const newBooking: AdminBooking = {
            id: `bk-${Date.now()}`,
            clientName: clientName || 'Guest',
            clientPhone: clientPhone || '',
            bookingDate,
            bookingTime,
            villaName: villaName || 'Private Villa',
            address,
            roomNumber,
            googleMapsUrl,
            items,
            transportFee: Number(transportFee || 0),
            discountAmount: Number(discountAmount || 0),
            notes,
            status,
            brand,
            created_at: new Date().toISOString()
        };

        persistBookings([newBooking, ...savedBookings]);
        alert('Booking saved successfully to Active Bookings log!');
        setActiveSection('manage');
    };

    // Update Status
    const handleUpdateStatus = (bookingId: string, newStatus: AdminBooking['status']) => {
        const updated = savedBookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b);
        persistBookings(updated);
    };

    // Delete Booking
    const handleDeleteBooking = (bookingId: string) => {
        if (confirm('Are you sure you want to delete this booking record?')) {
            persistBookings(savedBookings.filter(b => b.id !== bookingId));
        }
    };

    // Filtered bookings
    const filteredBookings = savedBookings.filter(b => {
        if (b.brand !== brand) return false;
        if (statusFilter === 'all') return true;
        return b.status === statusFilter;
    });

    return (
        <div className="space-y-6">
            {/* Header & Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/80 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80 block mb-1">
                        Dispatch & Reservation Hub
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        Massage Booking & Dispatch
                    </h2>
                </div>

                <div className="flex items-center bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => setActiveSection('create')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            activeSection === 'create'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        <Plus className="w-3.5 h-3.5 inline mr-1" /> New Booking
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveSection('manage')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            activeSection === 'manage'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        <ListFilter className="w-3.5 h-3.5" /> 
                        Bookings Log
                        {savedBookings.filter(b => b.brand === brand).length > 0 && (
                            <span className="bg-primary text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                                {savedBookings.filter(b => b.brand === brand).length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {activeSection === 'create' ? (
                <div className="space-y-6">
                    {/* Section 1: Client & Schedule Information */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                            <User className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">1. Guest & Sanctuary Details</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                                    Guest Name
                                </label>
                                <div className="relative">
                                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                    <input
                                        type="text"
                                        placeholder="e.g. Jessica Miller"
                                        value={clientName}
                                        onChange={e => setClientName(e.target.value)}
                                        className="w-full bg-gray-50/70 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                                    WhatsApp / Phone
                                </label>
                                <div className="relative">
                                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                    <input
                                        type="tel"
                                        placeholder="e.g. 6281234567890"
                                        value={clientPhone}
                                        onChange={e => setClientPhone(e.target.value)}
                                        className="w-full bg-gray-50/70 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                                    Villa / Hotel Name
                                </label>
                                <div className="relative">
                                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                    <input
                                        type="text"
                                        placeholder="e.g. Mandapa Reserve / Villa Alam Ubud"
                                        value={villaName}
                                        onChange={e => setVillaName(e.target.value)}
                                        className="w-full bg-gray-50/70 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                                    Room / Villa Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Villa #4 / Suite 202"
                                    value={roomNumber}
                                    onChange={e => setRoomNumber(e.target.value)}
                                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                                    Full Address / Area
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Jl. Raya Kedewatan, Ubud, Gianyar, Bali"
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                                    Google Maps Link (For Therapist Directions)
                                </label>
                                <div className="relative">
                                    <Navigation className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                    <input
                                        type="url"
                                        placeholder="https://maps.app.goo.gl/..."
                                        value={googleMapsUrl}
                                        onChange={e => setGoogleMapsUrl(e.target.value)}
                                        className="w-full bg-gray-50/70 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Date & Time Slot Row */}
                        <div className="pt-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                            Booking Date
                                        </label>
                                        <div className="flex gap-1 text-[10px]">
                                            <button 
                                                type="button" 
                                                onClick={() => setDatePreset(0)}
                                                className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition-colors"
                                            >
                                                Today
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => setDatePreset(1)}
                                                className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition-colors"
                                            >
                                                Tomorrow
                                            </button>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                        <input
                                            type="date"
                                            value={bookingDate}
                                            onChange={e => setBookingDate(e.target.value)}
                                            className="w-full bg-gray-50/70 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                                        Start Time Slot
                                    </label>
                                    <div className="relative">
                                        <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                        <input
                                            type="time"
                                            value={bookingTime}
                                            onChange={e => setBookingTime(e.target.value)}
                                            className="w-full bg-gray-50/70 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Massage Treatments & Therapists */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">2. Treatments & Therapists</h3>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddItem}
                                className="text-xs font-bold text-primary bg-secondary/30 hover:bg-secondary/50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                            >
                                <Plus size={14} /> Add Ritual
                            </button>
                        </div>

                        <div className="space-y-4">
                            {items.map((item, idx) => {
                                const tr = treatments.find(t => t.id === item.treatmentId);
                                const opt = tr?.options.find(o => o.duration === item.duration);
                                const rawPrice = opt ? parseInt(opt.price.replace(/\D/g, '')) || 0 : 0;
                                const feeKey = `${item.treatmentId}-${item.duration}`;
                                const rawFee = parseInt(feeInputs[feeKey]?.replace(/\D/g, '') || '0');

                                return (
                                    <div key={item.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 relative space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                                Ritual #{idx + 1}
                                            </span>
                                            {items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="text-red-400 hover:text-red-600 p-1 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-1">
                                                    Treatment
                                                </label>
                                                <select
                                                    value={item.treatmentId}
                                                    onChange={e => handleItemChange(item.id, { treatmentId: e.target.value })}
                                                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                                                >
                                                    {treatments.map(t => (
                                                        <option key={t.id} value={t.id}>{t.title}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-1">
                                                    Duration
                                                </label>
                                                <select
                                                    value={item.duration}
                                                    onChange={e => handleItemChange(item.id, { duration: e.target.value })}
                                                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                                                >
                                                    {tr?.options.map(o => (
                                                        <option key={o.duration} value={o.duration}>{o.duration} - {o.price}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                                            <div>
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-1">
                                                    Guests / Treatments
                                                </label>
                                                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 h-[34px]">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleItemChange(item.id, { treatmentsCount: Math.max(1, item.treatmentsCount - 1) })}
                                                        className="w-7 h-full rounded bg-gray-50 hover:bg-gray-100 font-bold text-gray-700"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-xs font-bold w-6 text-center text-gray-900">{item.treatmentsCount}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleItemChange(item.id, { treatmentsCount: item.treatmentsCount + 1 })}
                                                        className="w-7 h-full rounded bg-gray-50 hover:bg-gray-100 font-bold text-gray-700"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-1">
                                                    Therapists Needed
                                                </label>
                                                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 h-[34px]">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleItemChange(item.id, { therapistsCount: Math.max(1, item.therapistsCount - 1) })}
                                                        className="w-7 h-full rounded bg-gray-50 hover:bg-gray-100 font-bold text-gray-700"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-xs font-bold w-6 text-center text-gray-900">{item.therapistsCount}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleItemChange(item.id, { therapistsCount: item.therapistsCount + 1 })}
                                                        className="w-7 h-full rounded bg-gray-50 hover:bg-gray-100 font-bold text-gray-700"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="col-span-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-1">
                                                    Assigned Therapist(s)
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Wayan & Kadek"
                                                    value={item.therapistNames || ''}
                                                    onChange={e => handleItemChange(item.id, { therapistNames: e.target.value })}
                                                    className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Financial sub-breakdown */}
                                        <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-200 text-gray-600">
                                            <span>Subtotal: <strong className="text-gray-900">Rp {(rawPrice * item.treatmentsCount).toLocaleString('en-US')}</strong></span>
                                            <span>Therapist Fee: <strong className="text-red-500">Rp {(rawFee * item.therapistsCount).toLocaleString('en-US')}</strong></span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Extra Adjustments (Transport Fee, Discount, Notes) */}
                        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                    Transport / Remote Villa Surcharge (Rp)
                                </label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={transportFee || ''}
                                    onChange={e => setTransportFee(Number(e.target.value) || 0)}
                                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:bg-white focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                    Discount / Promo Deducted (Rp)
                                </label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={discountAmount || ''}
                                    onChange={e => setDiscountAmount(Number(e.target.value) || 0)}
                                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:bg-white focus:outline-none"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                    Special Notes / Therapist Instructions
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="e.g. Medium to strong pressure, guest has shoulder tension, upstairs gazebo setup"
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:bg-white focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Live Financial Summary & Dispatch Box */}
                    <div className="bg-gray-900 text-white rounded-2xl shadow-xl p-5 sm:p-8 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-white/15">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
                                    Live Financial Calculation
                                </span>
                                <h3 className="text-lg font-bold text-white">Booking Summary</h3>
                            </div>
                            <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-mono text-white/90">
                                {items.reduce((acc, i) => acc + i.treatmentsCount, 0)} Ritual(s) • {items.reduce((acc, i) => acc + i.therapistsCount, 0)} Therapist(s)
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                <span className="text-[10px] font-bold uppercase text-white/60 block">Customer Total</span>
                                <span className="text-base sm:text-lg font-bold text-white">Rp {financials.grossRevenue.toLocaleString('en-US')}</span>
                            </div>

                            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                <span className="text-[10px] font-bold uppercase text-white/60 block">Therapist Fees</span>
                                <span className="text-base sm:text-lg font-bold text-red-400">- Rp {financials.totalTherapistFee.toLocaleString('en-US')}</span>
                            </div>

                            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                <span className="text-[10px] font-bold uppercase text-white/60 block">Transport Surcharge</span>
                                <span className="text-base sm:text-lg font-bold text-amber-300">+ Rp {financials.transportFee.toLocaleString('en-US')}</span>
                            </div>

                            <div className="bg-green-950/60 p-3 rounded-xl border border-green-500/30">
                                <span className="text-[10px] font-bold uppercase text-green-400 block">Net Spa Profit</span>
                                <span className="text-lg sm:text-xl font-black text-green-400">Rp {financials.netProfit.toLocaleString('en-US')}</span>
                            </div>
                        </div>

                        {/* Dispatch Action Buttons */}
                        <div className="pt-2 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* WhatsApp Client */}
                                <div className="flex gap-2">
                                    <a
                                        href={`https://wa.me/${clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(generateClientWhatsAppText())}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                                    >
                                        <MessageSquare size={16} /> Send to Client (WA)
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(generateClientWhatsAppText(), 'client')}
                                        className="bg-white/10 hover:bg-white/20 text-white px-3.5 rounded-xl text-xs transition-colors flex items-center justify-center"
                                        title="Copy Client Text"
                                    >
                                        {copiedKey === 'client' ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                    </button>
                                </div>

                                {/* WhatsApp Therapist */}
                                <div className="flex gap-2">
                                    <a
                                        href={`https://wa.me/?text=${encodeURIComponent(generateTherapistWhatsAppText())}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                                    >
                                        <Send size={16} /> Dispatch Therapist (WA)
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(generateTherapistWhatsAppText(), 'therapist')}
                                        className="bg-white/10 hover:bg-white/20 text-white px-3.5 rounded-xl text-xs transition-colors flex items-center justify-center"
                                        title="Copy Therapist Text"
                                    >
                                        {copiedKey === 'therapist' ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Save to Log */}
                            <button
                                type="button"
                                onClick={() => handleSaveBooking('confirmed')}
                                className="w-full bg-white text-gray-900 hover:bg-gray-100 font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 size={18} className="text-primary" />
                                Save Reservation & Add to Log
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Manage Saved Bookings View */
                <div className="space-y-4">
                    <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Status:</span>
                            <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
                                {['all', 'pending', 'confirmed', 'in_transit', 'completed', 'cancelled'].map(st => (
                                    <button
                                        key={st}
                                        type="button"
                                        onClick={() => setStatusFilter(st)}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors ${
                                            statusFilter === st
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {st.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setActiveSection('create')}
                            className="text-xs font-bold text-primary bg-secondary/30 hover:bg-secondary/50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                        >
                            <Plus size={14} /> New
                        </button>
                    </div>

                    {filteredBookings.length === 0 ? (
                        <div className="text-center p-12 bg-white rounded-2xl border border-gray-200 text-gray-500">
                            <p className="text-sm font-medium">No bookings found for the selected status.</p>
                            <button
                                type="button"
                                onClick={() => setActiveSection('create')}
                                className="mt-3 text-xs font-bold bg-primary text-white px-4 py-2 rounded-xl"
                            >
                                Create First Booking
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredBookings.map(bk => {
                                const totalRevenue = bk.items.reduce((sum, item) => {
                                    const tr = treatments.find(t => t.id === item.treatmentId);
                                    const opt = tr?.options.find(o => o.duration === item.duration);
                                    const price = item.priceOverride ?? (opt ? parseInt(opt.price.replace(/\D/g, '')) || 0 : 0);
                                    return sum + (price * item.treatmentsCount);
                                }, 0) + (bk.transportFee || 0) - (bk.discountAmount || 0);

                                const statusColors: { [key: string]: string } = {
                                    pending: 'bg-amber-100 text-amber-800 border-amber-200',
                                    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
                                    in_transit: 'bg-purple-100 text-purple-800 border-purple-200',
                                    completed: 'bg-green-100 text-green-800 border-green-200',
                                    cancelled: 'bg-red-100 text-red-800 border-red-200',
                                };

                                return (
                                    <div key={bk.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-base text-gray-900">{bk.clientName}</h4>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${statusColors[bk.status] || 'bg-gray-100'}`}>
                                                        {bk.status.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {bk.villaName} {bk.roomNumber ? `(${bk.roomNumber})` : ''} • {bk.bookingDate} at {bk.bookingTime}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={bk.status}
                                                    onChange={e => handleUpdateStatus(bk.id, e.target.value as any)}
                                                    className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="in_transit">In Transit</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteBooking(bk.id)}
                                                    className="p-1.5 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-xs text-gray-600 space-y-1">
                                            {bk.items.map((item, i) => {
                                                const tr = treatments.find(t => t.id === item.treatmentId);
                                                return (
                                                    <div key={i} className="flex justify-between">
                                                        <span>{tr?.title || 'Ritual'} ({item.duration}) x{item.treatmentsCount}</span>
                                                        <span className="font-mono text-gray-500">{item.therapistNames ? `Assigned: ${item.therapistNames}` : ''}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                            <span className="text-xs font-bold text-gray-900">
                                                Total: Rp {totalRevenue.toLocaleString('en-US')}
                                            </span>
                                            {bk.clientPhone && (
                                                <a
                                                    href={`https://wa.me/${bk.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${bk.clientName}, regarding your spa booking at ${bk.villaName}...`)}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-xs font-bold text-green-600 hover:text-green-700 flex items-center gap-1"
                                                >
                                                    <MessageSquare size={13} /> Chat Client
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
