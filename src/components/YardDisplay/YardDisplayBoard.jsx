import React, { useState, useEffect } from 'react';
import { useMandi } from '../../context/MandiContext';
import { PROCUREMENT_CENTERS } from '../../data/mockData';
import { 
  Tv, 
  Clock, 
  Volume2, 
  Users, 
  Maximize, 
  Minimize, 
  Sparkles, 
  CheckCircle,
  Building2,
  Calendar
} from 'lucide-react';

export const YardDisplayBoard = () => {
  const { bookings, callTokenOnPA, t } = useMandi();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCenterId, setSelectedCenterId] = useState('pc-01');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const center = PROCUREMENT_CENTERS.find(c => c.id === selectedCenterId) || PROCUREMENT_CENTERS[0];

  // Active center tokens
  const centerTokens = bookings.filter(b => b.centerId === center.id);

  // Tokens currently being served (Quality Check or Accepted)
  const nowServingTokens = centerTokens.filter(b => 
    ['Quality Check', 'Accepted'].includes(b.status)
  ).slice(0, 3);

  // Next in line (Arrived or Booked)
  const upcomingTokens = centerTokens.filter(b => 
    ['Arrived', 'Booked'].includes(b.status)
  ).slice(0, 6);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
      
      {/* Top Header Bar for TV Display */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-krishi-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Tv className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
                LIVE MANDI QUEUE DISPLAY
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Broadcast
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {center.name} • {center.address}
            </p>
          </div>
        </div>

        {/* Center Picker, Clock & Fullscreen Toggle */}
        <div className="flex items-center gap-3">
          <select
            value={selectedCenterId}
            onChange={(e) => setSelectedCenterId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 focus:outline-none"
          >
            {PROCUREMENT_CENTERS.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-right">
            <div className="text-xs text-slate-400 font-medium">
              {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
            <div className="text-base sm:text-lg font-extrabold text-amber-400 font-mono">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>

          <button
            onClick={toggleFullscreen}
            title="Toggle TV Fullscreen Mode"
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition cursor-pointer"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Big TV Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left / Major: Now Serving Counters */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-sm sm:text-base font-bold text-slate-300 tracking-wider uppercase font-display">
                {t.nowServing}
              </h3>
            </div>
            <span className="text-xs text-slate-400">Proceed to Weighbridge Counter</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {nowServingTokens.length === 0 ? (
              <div className="col-span-2 bg-slate-900/60 rounded-2xl p-8 text-center border border-slate-800 text-slate-400">
                Next token being assigned by Mandi Officer...
              </div>
            ) : (
              nowServingTokens.map((tok, idx) => (
                <div
                  key={tok.id}
                  className="bg-gradient-to-br from-slate-900 to-slate-900/90 rounded-2xl p-5 border-2 border-emerald-500/60 shadow-xl shadow-emerald-950/40 relative overflow-hidden"
                >
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => callTokenOnPA(tok.tokenNumber, tok.servingCounter || `Counter ${idx + 1}`)}
                      title="Audio Call"
                      className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 transition cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60">
                    {tok.servingCounter || `Weigh Counter ${idx + 1}`}
                  </span>

                  <div className="my-3">
                    <div className="text-4xl sm:text-5xl font-black font-display tracking-tight text-amber-400">
                      {tok.tokenNumber}
                    </div>
                    <div className="text-base font-bold text-white mt-1">
                      {tok.farmerName}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 pt-3 border-t border-slate-800">
                    <span>🌾 {tok.crop}</span>
                    <span className="font-semibold text-emerald-400">{tok.quantity} Quintals</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Next In Line / Upcoming Tokens */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-slate-300 tracking-wider uppercase font-display">
              {t.upcomingTokens}
            </h3>
            <span className="text-xs text-slate-400">Keep gate pass ready</span>
          </div>

          <div className="space-y-2.5">
            {upcomingTokens.length === 0 ? (
              <div className="bg-slate-900/60 rounded-xl p-6 text-center text-slate-500 text-xs border border-slate-800">
                No waiting tokens in line for this center.
              </div>
            ) : (
              upcomingTokens.map((tok, idx) => (
                <div
                  key={tok.id}
                  className="bg-slate-900/70 hover:bg-slate-900 rounded-xl p-3 border border-slate-800 flex items-center justify-between transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-extrabold text-amber-400">
                          {tok.tokenNumber}
                        </span>
                        <span className="text-xs font-semibold text-white">
                          {tok.farmerName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {tok.village} • {tok.crop} ({tok.quantity} Q)
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                      {tok.status}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-1">
                      Est. {tok.estimatedTurn || 'Shortly'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Bottom Continuous Scrolling Ticker */}
      <div className="bg-slate-900 rounded-2xl p-3 border border-slate-800 overflow-hidden flex items-center gap-3">
        <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs uppercase shrink-0">
          MANDI ANNOUNCEMENT
        </span>
        <div className="overflow-hidden whitespace-nowrap flex-1 text-xs text-slate-300">
          <div className="inline-block animate-marquee">
            🌾 Fair Average Quality (FAQ) MSP: Paddy Common ₹2,300/Q, Paddy Grade A ₹2,320/Q, Wheat ₹2,275/Q, Cotton ₹7,121/Q • Moisture content must be below 17% • Direct Benefit Transfer (DBT) credited within 24-48 hours via PFMS.
          </div>
        </div>
      </div>

    </div>
  );
};
