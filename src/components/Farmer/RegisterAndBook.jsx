import React, { useState } from 'react';
import { useMandi } from '../../context/MandiContext';
import { PROCUREMENT_CENTERS, CROPS_CONFIG, TIME_SLOTS } from '../../data/mockData';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Scale, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2 
} from 'lucide-react';

export const RegisterAndBook = ({ onBookingSuccess }) => {
  const { t, createBooking, currentUser } = useMandi();

  const [formData, setFormData] = useState({
    farmerName: currentUser?.name || '',
    mobile: currentUser?.mobile || '',
    village: currentUser?.village || '',
    district: currentUser?.district || 'Ranga Reddy',
    aadhaarLast4: currentUser?.aadhaar_last4 || '',
    cropId: 'paddy',
    quantity: '15',
    centerId: 'pc-01',
    bookingDate: new Date().toISOString().split('T')[0],
    timeSlotId: 'slot-2'
  });

  const [formErrors, setFormErrors] = useState({});

  const selectedCrop = CROPS_CONFIG.find(c => c.id === formData.cropId) || CROPS_CONFIG[0];
  const selectedCenter = PROCUREMENT_CENTERS.find(c => c.id === formData.centerId) || PROCUREMENT_CENTERS[0];
  const selectedSlot = TIME_SLOTS.find(s => s.id === formData.timeSlotId) || TIME_SLOTS[0];

  const estimatedMspTotal = (Number(formData.quantity) || 0) * (selectedCrop?.mspPerQuintal || 0);

  const validate = () => {
    const errors = {};
    if (!formData.farmerName.trim()) errors.farmerName = 'Please enter farmer name';
    if (!formData.mobile.trim() || formData.mobile.length < 10) errors.mobile = 'Enter valid 10-digit mobile number';
    if (!formData.village.trim()) errors.village = 'Please enter village';
    if (!formData.quantity || Number(formData.quantity) <= 0) errors.quantity = 'Enter valid quantity in quintals';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newBooking = await createBooking({
      ...formData,
      userId: currentUser?.id || null,
      timeSlot: selectedSlot.label
    });

    if (onBookingSuccess) {
      onBookingSuccess(newBooking);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-krishi-700 via-krishi-800 to-emerald-900 text-white p-6 md:p-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-krishi-500/30 text-emerald-200 text-xs font-semibold backdrop-blur-xs mb-3 border border-krishi-400/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Direct MSP Procurement • Anti-Congestion System</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-display tracking-tight">
          Book Procurement Slot
        </h2>
        <p className="text-sm text-krishi-100/90 mt-1 max-w-2xl">
          Reserve your preferred time window at the nearest mandi center to avoid physical gate waiting.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        
        {/* Step 1: Farmer Personal Details */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <span className="w-6 h-6 rounded-full bg-krishi-100 text-krishi-700 font-bold text-xs flex items-center justify-center">1</span>
            <h3 className="font-display font-bold text-slate-900 text-base sm:text-lg">Farmer Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.fullName} *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Farmer name"
                  value={formData.farmerName}
                  onChange={e => setFormData({ ...formData, farmerName: e.target.value })}
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border ${
                    formErrors.farmerName ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  } focus:ring-2 focus:ring-krishi-500 focus:outline-none transition`}
                />
              </div>
              {formErrors.farmerName && <p className="text-red-500 text-[11px] mt-1">{formErrors.farmerName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.mobileNumber} *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="10-digit mobile"
                  value={formData.mobile}
                  onChange={e => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border ${
                    formErrors.mobile ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  } focus:ring-2 focus:ring-krishi-500 focus:outline-none transition`}
                />
              </div>
              {formErrors.mobile && <p className="text-red-500 text-[11px] mt-1">{formErrors.mobile}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.village} *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Village / Tehsil"
                  value={formData.village}
                  onChange={e => setFormData({ ...formData, village: e.target.value })}
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border ${
                    formErrors.village ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  } focus:ring-2 focus:ring-krishi-500 focus:outline-none transition`}
                />
              </div>
              {formErrors.village && <p className="text-red-500 text-[11px] mt-1">{formErrors.village}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Aadhaar Last 4 Digits
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="e.g. 7482"
                value={formData.aadhaarLast4}
                onChange={e => setFormData({ ...formData, aadhaarLast4: e.target.value.replace(/\D/g, '') })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-krishi-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">For DBT payment verification</span>
            </div>
          </div>
        </div>

        {/* Step 2: Crop & Quantity Details */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <span className="w-6 h-6 rounded-full bg-krishi-100 text-krishi-700 font-bold text-xs flex items-center justify-center">2</span>
            <h3 className="font-display font-bold text-slate-900 text-base sm:text-lg">Crop & Produce Details</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Crop Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {t.cropType}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CROPS_CONFIG.map(crop => (
                  <button
                    type="button"
                    key={crop.id}
                    onClick={() => setFormData({ ...formData, cropId: crop.id })}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                      formData.cropId === crop.id
                        ? 'border-krishi-600 bg-krishi-50 text-krishi-900 font-semibold ring-1 ring-krishi-600 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span className="text-xl">{crop.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{crop.name.split(' ')[0]}</p>
                      <p className="text-[11px] text-emerald-700 font-semibold">₹{crop.mspPerQuintal}/Q</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {t.quantityQuintals} *
              </label>
              <div className="relative">
                <Scale className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  min="1"
                  max="500"
                  step="0.5"
                  value={formData.quantity}
                  onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                  className={`w-full pl-9 pr-14 py-2.5 text-sm rounded-xl border ${
                    formErrors.quantity ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  } focus:ring-2 focus:ring-krishi-500 focus:outline-none`}
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-500">Quintals</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                <span>= {(Number(formData.quantity) || 0) * 100} kg</span>
                <span className="text-slate-400">({t.quintalsHelp})</span>
              </div>
            </div>

            {/* Estimated MSP Value Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200/80 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Government MSP Valuation</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200/60 text-emerald-800 font-bold">Guaranteed</span>
              </div>
              <div className="my-2">
                <div className="text-2xl font-extrabold text-emerald-950 font-display">
                  ₹{estimatedMspTotal.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-emerald-700 mt-0.5">
                  ₹{selectedCrop.mspPerQuintal}/Quintal • Permissible Moisture: ≤{selectedCrop.maxMoisturePct}%
                </p>
              </div>
              <p className="text-[10px] text-emerald-800/80">
                DBT will be credited to linked bank account post quality verification.
              </p>
            </div>

          </div>
        </div>

        {/* Step 3: Procurement Center & Time Slot */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <span className="w-6 h-6 rounded-full bg-krishi-100 text-krishi-700 font-bold text-xs flex items-center justify-center">3</span>
            <h3 className="font-display font-bold text-slate-900 text-base sm:text-lg">Mandi Center & Slot Selection</h3>
          </div>

          <div className="space-y-3 mb-6">
            <label className="block text-xs font-semibold text-slate-700">
              {t.selectCenter}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PROCUREMENT_CENTERS.map(center => {
                const isSelected = formData.centerId === center.id;
                return (
                  <div
                    key={center.id}
                    onClick={() => setFormData({ ...formData, centerId: center.id })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-krishi-600 bg-krishi-50/50 shadow-xs ring-1 ring-krishi-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{center.name}</h4>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-krishi-600 shrink-0" />}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{center.address}</p>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold shrink-0">
                        ~{center.currentWaitMinutes}m wait
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2.5 pt-2 border-t border-slate-100">
                      <span>🚪 {center.activeCounters} Counters</span>
                      <span>⚡ Daily Cap: {center.dailyCapacityQuintals} Qtl</span>
                      <span>🕒 {center.openingHours}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.bookingDate}
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="date"
                  value={formData.bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setFormData({ ...formData, bookingDate: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-krishi-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.selectTimeSlot}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map(slot => {
                  const isSelected = formData.timeSlotId === slot.id;
                  return (
                    <button
                      type="button"
                      key={slot.id}
                      onClick={() => setFormData({ ...formData, timeSlotId: slot.id })}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        isSelected
                          ? 'border-krishi-600 bg-krishi-600 text-white font-semibold shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{slot.label}</span>
                        <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                      </div>
                      <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-krishi-100' : 'text-slate-500'}`}>
                        {slot.period} • Capacity Available
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Government Fair Average Quality (FAQ) standards apply. Bring produce with moisture ≤ 17%.</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-krishi-600 to-krishi-700 hover:from-krishi-700 hover:to-krishi-800 text-white font-bold text-sm shadow-md shadow-krishi-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Confirm Booking & Generate Token</span>
          </button>
        </div>

      </form>
    </div>
  );
};
