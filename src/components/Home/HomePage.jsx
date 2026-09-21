import React from 'react';
import { PROCUREMENT_CENTERS, CROPS_CONFIG } from '../../data/mockData';
import { 
  Sprout, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  Users, 
  CheckCircle2, 
  Building2, 
  Tv, 
  Scale, 
  Banknote, 
  QrCode, 
  FileText, 
  Calendar 
} from 'lucide-react';

export const HomePage = ({ onOpenAuth, onOpenYardDisplay }) => {
  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-krishi-800 via-krishi-900 to-slate-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-krishi-700/50">
        {/* Background decorative glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-krishi-600/30 text-emerald-300 text-xs font-bold border border-krishi-500/30 mb-6 backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Government of India • Ministry of Agriculture & Farmers Welfare</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-tight">
            KisanSetu <span className="text-amber-400 font-serif font-normal">(कृषि सेतु)</span>
          </h1>
          <p className="text-lg sm:text-xl font-bold text-emerald-200 mt-2 font-display">
            Smart Mandi Slot Booking & Real-Time Queue Management Platform
          </p>

          <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed max-w-2xl">
            Eliminate long waiting lines, crop spoilage, and payment uncertainty. Pre-book your vehicle arrival, track your queue position live from your phone, and receive guaranteed MSP payment directly to your bank account.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <button
              onClick={() => onOpenAuth('farmer')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-krishi-600 hover:from-emerald-600 hover:to-krishi-700 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sprout className="w-5 h-5 text-slate-950" />
              <span>Book Mandi Slot as Farmer</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenAuth('officer')}
              className="px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700 transition cursor-pointer flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Mandi Officer Portal</span>
            </button>

            <button
              onClick={onOpenYardDisplay}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 font-medium text-xs sm:text-sm border border-white/10 transition cursor-pointer flex items-center gap-2"
            >
              <Tv className="w-4 h-4 text-emerald-400" />
              <span>Mandi Yard TV Screen</span>
            </button>
          </div>
        </div>

        {/* Floating Quick Key Stats */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl sm:text-3xl font-black font-display text-white">0 Hours</div>
            <p className="text-xs text-slate-400 mt-0.5">Physical Gate Waiting</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-display text-amber-400">100%</div>
            <p className="text-xs text-slate-400 mt-0.5">Direct Benefit Transfer (DBT)</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-display text-emerald-400">Real-Time</div>
            <p className="text-xs text-slate-400 mt-0.5">Live Queue Position & Turn</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-display text-white">NIC / SMS</div>
            <p className="text-xs text-slate-400 mt-0.5">Automated Mobile Alerts</p>
          </div>
        </div>
      </section>

      {/* Live Procurement Centers Status */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-krishi-700">Real-Time Yard Telemetry</span>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 tracking-tight">
              Active Government Procurement Centers
            </h2>
          </div>
          <p className="text-xs text-slate-500">Live capacity status & current waiting indicators</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROCUREMENT_CENTERS.map((center) => (
            <div
              key={center.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-krishi-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">{center.name}</h3>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0 mt-1" />
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{center.district}, {center.state}</span>
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Weigh Counters:</span>
                  <strong className="text-slate-900">{center.activeCounters} Active</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Daily Cap:</span>
                  <strong className="text-slate-900">{center.dailyCapacityQuintals} Qtl</strong>
                </div>
                <div className="flex justify-between items-center bg-emerald-50 p-2 rounded-xl text-emerald-800">
                  <span className="font-medium text-[11px]">Average Queue Delay:</span>
                  <strong className="font-bold font-display">~{center.currentWaitMinutes} mins</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-100 rounded-3xl p-8 sm:p-12 space-y-8 border border-slate-200">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-krishi-700">Digital Procurement Process</span>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 tracking-tight mt-1">
            How KisanSetu Works for Farmers
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            A seamless four-step journey designed to ensure zero congestion and guaranteed fair price.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-krishi-100 text-krishi-700 font-black text-lg flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">Book Slot Online</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Select your crop, quantity, nearest mandi center, and choose your convenient date and arrival time window.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 font-black text-lg flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">Get Digital Token & QR</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Instant boarding pass with QR code generated and sent via SMS. Arrive only during your allotted slot.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 font-black text-lg flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">Gate Entry & Quality Test</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Instant gate weighbridge verification. Moisture analyzer checks compliance with FAQ standards (≤17%).
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 font-black text-lg flex items-center justify-center mb-4">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-base">Direct Benefit Transfer</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Government Minimum Support Price (MSP) payment credited directly to Aadhaar-linked bank account with PFMS UTR.
            </p>
          </div>

        </div>
      </section>

      {/* Official Government MSP Rates */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-krishi-700">Procurement Rates</span>
          <h2 className="text-2xl font-black font-display text-slate-900 tracking-tight">
            Government Fair Average Quality (FAQ) MSP Rates
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CROPS_CONFIG.map(crop => (
            <div key={crop.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
              <span className="text-3xl block mb-1">{crop.icon}</span>
              <h4 className="text-xs font-bold text-slate-900">{crop.name}</h4>
              <div className="text-base font-extrabold text-emerald-700 font-display mt-1">
                ₹{crop.mspPerQuintal}
              </div>
              <span className="text-[10px] text-slate-400">per Quintal • Max {crop.maxMoisturePct}% Moist</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
