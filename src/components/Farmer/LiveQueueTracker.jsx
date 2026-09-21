import React from 'react';
import { useMandi } from '../../context/MandiContext';
import { STATUS_FLOW } from '../../data/mockData';
import { 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  Banknote, 
  Building2, 
  Scale, 
  FileCheck2, 
  Volume2 
} from 'lucide-react';

export const LiveQueueTracker = ({ booking }) => {
  const { t, bookings, callTokenOnPA, audioEnabled } = useMandi();

  if (!booking) return null;

  // Calculate live position ahead in queue
  // People who booked at same center and haven't completed (i.e. not Paid or Rejected) and arrived before or higher priority
  const centerQueue = bookings.filter(b => 
    b.centerId === booking.centerId && 
    !['Paid', 'Rejected'].includes(b.status)
  );

  const myIndex = centerQueue.findIndex(b => b.id === booking.id);
  const peopleAhead = myIndex >= 0 ? myIndex : 0;
  
  // Dynamic wait time estimate: 10 mins per person ahead
  const estimatedWaitMinutes = peopleAhead > 0 ? peopleAhead * 10 : 5;

  // Find active step index
  const currentStepIndex = STATUS_FLOW.findIndex(s => s.key === booking.status);

  // Status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Booked':
        return { bg: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-500' };
      case 'Arrived':
        return { bg: 'bg-indigo-100 text-indigo-800 border-indigo-200', dot: 'bg-indigo-500' };
      case 'Quality Check':
        return { bg: 'bg-amber-100 text-amber-800 border-amber-200 animate-pulse', dot: 'bg-amber-500' };
      case 'Accepted':
        return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' };
      case 'Payment Pending':
        return { bg: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-500' };
      case 'Paid':
        return { bg: 'bg-green-100 text-green-800 border-green-200', dot: 'bg-green-500' };
      case 'Rejected':
        return { bg: 'bg-red-100 text-red-800 border-red-200', dot: 'bg-red-500' };
      default:
        return { bg: 'bg-slate-100 text-slate-800 border-slate-200', dot: 'bg-slate-500' };
    }
  };

  const badgeStyle = getStatusBadge(booking.status);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      
      {/* Top Banner: Greeting & Active Token Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
              {t.welcome}, {booking.farmerName} 👋
            </h2>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeStyle.bg}`}>
              <span className={`w-2 h-2 rounded-full ${badgeStyle.dot}`}></span>
              {booking.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            📍 {booking.centerName} • 🌾 {booking.crop} ({booking.quantity} Quintals)
          </p>
        </div>

        {/* Live Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          
          {/* People Ahead */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-center">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
              {t.peopleAhead}
            </span>
            <div className="flex items-center justify-center gap-1 text-2xl font-extrabold text-amber-900 font-display mt-0.5">
              <Users className="w-5 h-5 text-amber-600" />
              <span>{peopleAhead}</span>
            </div>
            <span className="text-[10px] text-amber-700">farmers in line</span>
          </div>

          {/* Estimated Wait */}
          <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-3 text-center">
            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
              {t.estimatedWait}
            </span>
            <div className="flex items-center justify-center gap-1 text-2xl font-extrabold text-blue-900 font-display mt-0.5">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>{estimatedWaitMinutes}</span>
              <span className="text-xs font-semibold">{t.minutes}</span>
            </div>
            <span className="text-[10px] text-blue-700">dynamic estimate</span>
          </div>

          {/* Estimated Turn Time */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              {t.estimatedTurn}
            </span>
            <div className="text-xl font-extrabold text-emerald-900 font-display mt-1">
              {booking.estimatedTurn || '11:30 AM'}
            </div>
            <span className="text-[10px] text-emerald-700">{booking.servingCounter || 'Weighbridge 1'}</span>
          </div>

        </div>
      </div>

      {/* Real-Time Stepper Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Procurement Lifecycle Timeline
          </h3>
          <span className="text-xs font-semibold text-krishi-700">
            Step {Math.max(1, currentStepIndex + 1)} of 6
          </span>
        </div>

        {/* Stepper Flow */}
        <div className="relative">
          {/* Progress Connecting Line */}
          <div className="absolute top-5 left-6 right-6 h-1 bg-slate-200 hidden md:block" />
          <div 
            className="absolute top-5 left-6 h-1 bg-krishi-600 transition-all duration-500 hidden md:block"
            style={{ 
              width: `${Math.min(100, Math.max(0, (currentStepIndex / (STATUS_FLOW.length - 2)) * 100))}%` 
            }}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 relative z-10">
            {STATUS_FLOW.filter(s => s.key !== 'Rejected').map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isFuture = idx > currentStepIndex;

              return (
                <div 
                  key={step.key}
                  className={`flex flex-col items-center text-center p-3 rounded-xl transition-all ${
                    isCurrent 
                      ? 'bg-krishi-50/80 border border-krishi-300 ring-2 ring-krishi-500/30' 
                      : isPast 
                        ? 'bg-slate-50/80 border border-slate-200' 
                        : 'opacity-60 bg-white border border-dashed border-slate-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                    isPast 
                      ? 'bg-krishi-600 text-white' 
                      : isCurrent 
                        ? 'bg-krishi-600 text-white shadow-md shadow-krishi-600/30 scale-110' 
                        : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-xs font-bold ${isCurrent ? 'text-krishi-900' : 'text-slate-700'}`}>
                    {step.label}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                    {step.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Status Action Card & Guidance */}
      <div className="rounded-xl p-4 bg-slate-50 border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-krishi-100 text-krishi-700 flex items-center justify-center shrink-0 mt-0.5">
              {booking.status === 'Paid' ? (
                <Banknote className="w-5 h-5 text-emerald-600" />
              ) : booking.status === 'Quality Check' ? (
                <FileCheck2 className="w-5 h-5 text-amber-600" />
              ) : (
                <Building2 className="w-5 h-5 text-krishi-600" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {booking.status === 'Booked' && 'Please arrive 15 minutes before your time slot.'}
                {booking.status === 'Arrived' && 'Vehicle checked in at gate. Please move to weighbridge.'}
                {booking.status === 'Quality Check' && 'Inspection officers are currently analyzing moisture percentage.'}
                {booking.status === 'Accepted' && 'Crop approved! Unloading authorized at Shed 3.'}
                {booking.status === 'Payment Pending' && 'DBT sanction generated. Awaiting RBI bank clearance.'}
                {booking.status === 'Paid' && 'Payment Disbursed! Funds deposited via Direct Benefit Transfer.'}
                {booking.status === 'Rejected' && 'Moisture level too high. Please sun-dry produce.'}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {booking.status === 'Paid' ? (
                  <span className="text-emerald-700 font-medium">UTR Reference: {booking.paymentUtr || 'DBT-GOI-2026-981044'}</span>
                ) : (
                  <span>Real-time SMS notification will be automatically delivered upon next advancement.</span>
                )}
              </p>
            </div>
          </div>

          {/* Test PA voice call */}
          <button
            onClick={() => callTokenOnPA(booking.tokenNumber, booking.servingCounter || 'Counter 1')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Volume2 className="w-3.5 h-3.5 text-krishi-600" />
            <span>Hear PA Voice Announcement</span>
          </button>
        </div>
      </div>

    </div>
  );
};
