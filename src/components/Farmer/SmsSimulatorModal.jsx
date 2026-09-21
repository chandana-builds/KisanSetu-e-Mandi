import React, { useState } from 'react';
import { useMandi } from '../../context/MandiContext';
import { 
  X, 
  Smartphone, 
  MessageSquare, 
  Clock, 
  Send, 
  CheckCheck, 
  ShieldCheck, 
  Trash2,
  Bell
} from 'lucide-react';

export const SmsSimulatorModal = ({ isOpen, onClose }) => {
  const { smsMessages, activeBooking } = useMandi();
  const [filterTokenOnly, setFilterTokenOnly] = useState(false);

  if (!isOpen) return null;

  const displayedMessages = filterTokenOnly && activeBooking
    ? smsMessages.filter(s => s.tokenNumber === activeBooking.tokenNumber || s.recipient === activeBooking.mobile)
    : smsMessages;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
      
      {/* Mobile Device Frame */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-700">
        
        {/* Phone Notch & Speaker */}
        <div className="flex justify-center mb-2">
          <div className="w-24 h-4 bg-slate-800 rounded-full flex items-center justify-center">
            <div className="w-10 h-1 bg-slate-700 rounded-full" />
            <div className="w-2 h-2 rounded-full bg-slate-900 ml-2" />
          </div>
        </div>

        {/* Phone Screen */}
        <div className="bg-slate-100 rounded-[2rem] overflow-hidden flex flex-col h-[560px] border border-slate-300">
          
          {/* Phone Status Bar */}
          <div className="bg-slate-900 text-slate-300 px-5 py-2 flex items-center justify-between text-[11px] font-semibold">
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-4 h-2 border border-slate-400 rounded-xs flex items-center p-0.5">
                <div className="w-full h-full bg-emerald-400 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* SMS App Header */}
          <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                GOI
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-slate-900">GOI-KRISHI</h3>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <p className="text-[10px] text-slate-500">Official SMS Mandi Gateway</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Bar */}
          {activeBooking && (
            <div className="bg-slate-200/80 px-3 py-1.5 flex items-center justify-between text-[11px]">
              <span className="text-slate-600">
                Viewing Token: <strong className="text-slate-900">{activeBooking.tokenNumber}</strong>
              </span>
              <button
                onClick={() => setFilterTokenOnly(!filterTokenOnly)}
                className="text-emerald-700 font-semibold hover:underline cursor-pointer"
              >
                {filterTokenOnly ? 'Show All SMS' : 'Filter My Token'}
              </button>
            </div>
          )}

          {/* SMS Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {displayedMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400">
                <MessageSquare className="w-10 h-10 text-slate-300 mb-2 stroke-1" />
                <p className="text-xs font-medium">No SMS messages yet.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Book a slot or advance status from Admin to receive real-time alerts.
                </p>
              </div>
            ) : (
              displayedMessages.map((sms) => (
                <div
                  key={sms.id}
                  className="bg-white rounded-2xl rounded-tl-xs p-3.5 shadow-xs border border-slate-200/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-1">
                      <Bell className="w-3 h-3" />
                      {sms.title}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {sms.timestamp}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    {sms.body}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 border-t border-slate-50">
                    <span>To: +91 {sms.recipient}</span>
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCheck className="w-3.5 h-3.5" /> Delivered
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* SMS App Bottom Bar */}
          <div className="bg-white px-3 py-2 border-t border-slate-200 text-center text-[11px] text-slate-400">
            Automated SMS & WhatsApp Alerts powered by NIC & GOI-Krishi
          </div>

        </div>

        {/* Home bar button indicator */}
        <div className="w-28 h-1 bg-slate-600 rounded-full mx-auto mt-3" />
      </div>

    </div>
  );
};
