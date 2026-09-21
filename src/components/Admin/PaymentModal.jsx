import React, { useState } from 'react';
import { useMandi } from '../../context/MandiContext';
import { 
  X, 
  Banknote, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  CreditCard, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const PaymentModal = ({ booking, isOpen, onClose }) => {
  const { updateStatus } = useMandi();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !booking) return null;

  const generatedUtr = `DBT-PFMS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleDisburse = () => {
    setIsProcessing(true);
    setTimeout(() => {
      updateStatus(booking.id, 'Paid', {
        paymentUtr: generatedUtr,
        paidAt: new Date().toISOString()
      });
      setIsProcessing(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-emerald-300">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base">Direct Benefit Transfer (DBT)</h3>
              <p className="text-xs text-emerald-200/80">Public Financial Management System (PFMS)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Amount Callout */}
          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 text-center">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
              Procurement Payment Payable
            </span>
            <div className="text-3xl font-extrabold text-emerald-950 font-display mt-1">
              ₹{booking.totalPmt?.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-emerald-700 mt-1">
              {booking.crop} • {booking.quantity} Quintals @ ₹{booking.mspPerQuintal}/Qtl
            </p>
          </div>

          {/* Bank & Beneficiary Info */}
          <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Beneficiary Farmer</span>
              <span className="font-bold text-slate-800">{booking.farmerName}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Registered Mobile</span>
              <span className="font-semibold text-slate-800">+91 {booking.mobile}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Aadhaar Linked Bank</span>
              <span className="font-semibold text-slate-800">State Bank of India (SBI)</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Account (Masked)</span>
              <span className="font-mono text-slate-800">XXXX-XXXX-4592</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">System Generated UTR</span>
              <span className="font-mono font-bold text-emerald-700">{generatedUtr}</span>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Fund transfer is processed via NPCI / Aadhaar Payment Bridge (APB) directly to farmer's primary bank account.</span>
          </div>

        </div>

        {/* Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleDisburse}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center gap-1.5"
          >
            {isProcessing ? (
              <span>Dispatching DBT...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Confirm & Disburse ₹{booking.totalPmt?.toLocaleString('en-IN')}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
