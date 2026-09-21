import React, { useState } from 'react';
import { useMandi } from '../../context/MandiContext';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Droplet, 
  Scale, 
  ShieldCheck, 
  Calculator 
} from 'lucide-react';

export const QualityModal = ({ booking, isOpen, onClose }) => {
  const { updateStatus } = useMandi();

  const [moisture, setMoisture] = useState(booking?.qualityMoisture || 13.5);
  const [foreignMatter, setForeignMatter] = useState(1.2);
  const [brokenGrains, setBrokenGrains] = useState(2.0);
  const [grade, setGrade] = useState('Grade A');

  if (!isOpen || !booking) return null;

  // Permissible moisture threshold is typically 17% for Paddy, 12% for Wheat
  const isMoistureExceeded = Number(moisture) > 17;
  const totalAmount = Number(booking.quantity) * Number(booking.mspPerQuintal);

  const handleApprove = () => {
    updateStatus(booking.id, 'Accepted', {
      qualityMoisture: Number(moisture),
      qualityGrade: grade,
      servingCounter: 'Counter 1'
    });
    onClose();
  };

  const handleReject = () => {
    updateStatus(booking.id, 'Rejected', {
      qualityMoisture: Number(moisture),
      rejectionReason: `Moisture content ${moisture}% exceeds permissible 17% FAQ limit.`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-900 flex items-center justify-center font-bold">
              <Droplet className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base">Quality & Moisture Inspection</h3>
              <p className="text-xs text-slate-400">
                Token: <strong className="text-amber-400">{booking.tokenNumber}</strong> • {booking.farmerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <div className="p-6 space-y-5">
          
          {/* Produce Summary */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block">Produce</span>
              <strong className="text-slate-900 text-sm">{booking.crop}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Weighed Quantity</span>
              <strong className="text-slate-900 text-sm">{booking.quantity} Quintals</strong>
            </div>
            <div>
              <span className="text-slate-500 block">MSP Rate</span>
              <strong className="text-emerald-700 text-sm">₹{booking.mspPerQuintal}/Qtl</strong>
            </div>
          </div>

          {/* Moisture % Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-blue-500" />
                <span>Moisture Content Percentage (%)</span>
              </label>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                isMoistureExceeded ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isMoistureExceeded ? 'Exceeds FAQ Norm (Max 17%)' : 'Within FAQ Norms'}
              </span>
            </div>
            <input
              type="number"
              step="0.1"
              min="5"
              max="30"
              value={moisture}
              onChange={(e) => setMoisture(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-xl border text-base font-bold ${
                isMoistureExceeded ? 'border-red-400 bg-red-50 text-red-900' : 'border-slate-300 focus:ring-2 focus:ring-krishi-500'
              } focus:outline-none`}
            />
            <p className="text-[11px] text-slate-500 mt-1">Standard Government FAQ tolerance: 12% to 17% max.</p>
          </div>

          {/* Foreign Matter & Broken Grain Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Foreign Matter / Dust (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={foreignMatter}
                onChange={(e) => setForeignMatter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Broken / Discolored (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={brokenGrains}
                onChange={(e) => setBrokenGrains(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none"
              />
            </div>
          </div>

          {/* Quality Grade Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Assigned Procurement Grade
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Grade A', 'FAQ Standard'].map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    grade === g
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Total Calculated Amount */}
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-700" />
              <div>
                <span className="text-[11px] text-emerald-800 font-semibold block uppercase">Total Procurement Value</span>
                <span className="text-lg font-extrabold text-emerald-950 font-display">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <span className="text-xs text-emerald-700 font-medium">Auto MSP Calculation</span>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReject}
            className="px-4 py-2.5 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 font-bold text-xs transition cursor-pointer"
          >
            Reject Produce
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApprove}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve & Accept Crop</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
