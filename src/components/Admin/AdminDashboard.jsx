import React, { useState, useEffect } from 'react';
import { useMandi } from '../../context/MandiContext';
import { PROCUREMENT_CENTERS } from '../../data/mockData';
import { QualityModal } from './QualityModal';
import { PaymentModal } from './PaymentModal';
import { 
  Building2, 
  Search, 
  Users, 
  Clock, 
  Volume2, 
  Scale, 
  Banknote, 
  RefreshCw,
  Sparkles,
  ChevronRight,
  MapPin
} from 'lucide-react';

export const AdminDashboard = () => {
  const { 
    t, 
    bookings, 
    updateStatus, 
    callTokenOnPA, 
    refreshFromBackend 
  } = useMandi();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCenter, setSelectedCenter] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modals state
  const [inspectBooking, setInspectBooking] = useState(null);
  const [paymentBooking, setPaymentBooking] = useState(null);

  // Auto poll backend every 2.5s for instant updates when farmers book
  useEffect(() => {
    const interval = setInterval(() => {
      refreshFromBackend();
    }, 2500);
    return () => clearInterval(interval);
  }, [refreshFromBackend]);

  // Compute live analytics from real SQLite bookings
  const totalBookings = bookings.length;
  const inYard = bookings.filter(b => ['Arrived', 'Quality Check'].includes(b.status)).length;
  const totalQuintalsProcured = bookings
    .filter(b => ['Accepted', 'Payment Pending', 'Paid'].includes(b.status))
    .reduce((acc, b) => acc + Number(b.quantity || 0), 0);
  const totalMetricTonnes = (totalQuintalsProcured / 10).toFixed(1);
  const totalDisbursedAmount = bookings
    .filter(b => b.status === 'Paid')
    .reduce((acc, b) => acc + Number(b.totalPmt || 0), 0);

  // Filter bookings list
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.tokenNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.farmerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.mobile?.includes(searchQuery);

    const matchesCenter = selectedCenter === 'all' || b.centerId === selectedCenter;
    const matchesStatus = selectedStatus === 'all' || b.status === selectedStatus;

    return matchesSearch && matchesCenter && matchesStatus;
  });

  const handleCallNext = () => {
    const nextInLine = bookings.find(b => b.status === 'Arrived' || b.status === 'Booked');
    if (nextInLine) {
      callTokenOnPA(nextInLine.tokenNumber, 'Counter 1');
      if (nextInLine.status === 'Booked') {
        updateStatus(nextInLine.id, 'Arrived');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Bookings */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Today's Bookings
            </span>
            <div className="text-3xl font-black text-slate-900 font-display mt-1">
              {totalBookings}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Real-Time Sync
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* In Mandi Yard */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Farmers In Yard
            </span>
            <div className="text-3xl font-black text-amber-600 font-display mt-1">
              {inYard}
            </div>
            <span className="text-[11px] text-amber-600 font-medium">At Weighbridge / Quality Bay</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Total Procured */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Total Procured
            </span>
            <div className="text-3xl font-black text-emerald-600 font-display mt-1">
              {totalQuintalsProcured} <span className="text-sm font-semibold text-slate-500">Qtl</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">({totalMetricTonnes} Metric Tonnes)</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
        </div>

        {/* Disbursed via DBT */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Disbursed via DBT
            </span>
            <div className="text-2xl font-black text-emerald-800 font-display mt-1">
              ₹{totalDisbursedAmount.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">NPCI / PFMS Direct</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Banknote className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Control Bar: Filters, Search, and Action Call */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Token (e.g. A101), Farmer Name, or Mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-krishi-500 focus:outline-none"
            />
          </div>

          {/* Center Selector & Loudspeaker Announcement */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCenter}
              onChange={(e) => setSelectedCenter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none"
            >
              <option value="all">All Procurement Centers</option>
              {PROCUREMENT_CENTERS.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <button
              onClick={handleCallNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition cursor-pointer whitespace-nowrap"
            >
              <Volume2 className="w-4 h-4" />
              <span>Call Next Token</span>
            </button>
          </div>

        </div>

        {/* Status Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold mr-1 shrink-0">Filter:</span>
          {['all', 'Booked', 'Arrived', 'Quality Check', 'Accepted', 'Payment Pending', 'Paid', 'Rejected'].map((statusKey) => (
            <button
              key={statusKey}
              onClick={() => setSelectedStatus(statusKey)}
              className={`px-3 py-1 rounded-lg font-semibold transition whitespace-nowrap cursor-pointer ${
                selectedStatus === statusKey
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {statusKey === 'all' ? 'All Records' : statusKey}
              {statusKey !== 'all' && (
                <span className="ml-1.5 text-[10px] opacity-75">
                  ({bookings.filter(b => b.status === statusKey).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Queue & Procurement Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Token #</th>
                <th className="py-3 px-4">Farmer Details</th>
                <th className="py-3 px-4">Produce & Qty</th>
                <th className="py-3 px-4">Center & Slot</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Moisture %</th>
                <th className="py-3 px-4 text-right">Queue Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-sm">No bookings in queue yet.</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      When a farmer books a slot, it will appear here in real time.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      
                      {/* Token # */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base text-krishi-700 font-display">{b.tokenNumber}</span>
                          <button
                            onClick={() => callTokenOnPA(b.tokenNumber, b.servingCounter || 'Counter 1')}
                            title="Call on loudspeaker"
                            className="p-1 rounded text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Farmer Details */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{b.farmerName}</div>
                        <div className="text-[11px] text-slate-500">
                          {b.village} • 📱 +91 {b.mobile}
                        </div>
                      </td>

                      {/* Crop & Qty */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{b.crop}</div>
                        <div className="text-[11px] text-emerald-700 font-bold">
                          {b.quantity} Quintals ({b.quantity * 100} kg)
                        </div>
                      </td>

                      {/* Center & Slot */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="truncate max-w-[150px] font-medium">{b.centerName}</div>
                        <div className="text-[11px] text-slate-400">{b.timeSlot}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          b.status === 'Booked' ? 'bg-blue-100 text-blue-800' :
                          b.status === 'Arrived' ? 'bg-indigo-100 text-indigo-800' :
                          b.status === 'Quality Check' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                          b.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' :
                          b.status === 'Payment Pending' ? 'bg-purple-100 text-purple-800' :
                          b.status === 'Paid' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {b.status}
                        </span>
                      </td>

                      {/* Quality Info */}
                      <td className="py-3.5 px-4 text-xs">
                        {b.qualityMoisture ? (
                          <div>
                            <span className="font-semibold text-slate-800">{b.qualityMoisture}%</span>
                            <span className="block text-[10px] text-slate-500">{b.qualityGrade}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Pending</span>
                        )}
                      </td>

                      {/* Queue Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {b.status === 'Booked' && (
                            <button
                              onClick={() => updateStatus(b.id, 'Arrived')}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition cursor-pointer"
                            >
                              Gate Check-In
                            </button>
                          )}

                          {b.status === 'Arrived' && (
                            <button
                              onClick={() => {
                                updateStatus(b.id, 'Quality Check', { servingCounter: 'Counter 2' });
                                setInspectBooking(b);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200 transition cursor-pointer"
                            >
                              Quality Check
                            </button>
                          )}

                          {b.status === 'Quality Check' && (
                            <button
                              onClick={() => setInspectBooking(b)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs shadow-xs transition cursor-pointer"
                            >
                              Enter Moisture
                            </button>
                          )}

                          {b.status === 'Accepted' && (
                            <button
                              onClick={() => setPaymentBooking(b)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1"
                            >
                              <Banknote className="w-3.5 h-3.5" />
                              <span>Disburse DBT</span>
                            </button>
                          )}

                          {b.status === 'Paid' && (
                            <div className="text-[11px] text-emerald-700 font-bold">
                              ✓ Paid ({b.paymentUtr?.slice(0, 14)}...)
                            </div>
                          )}

                          {b.status === 'Rejected' && (
                            <button
                              onClick={() => updateStatus(b.id, 'Arrived')}
                              className="px-2 py-1 rounded text-slate-500 hover:text-slate-800 text-[11px] underline cursor-pointer"
                            >
                              Re-evaluate
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <QualityModal
        booking={inspectBooking}
        isOpen={Boolean(inspectBooking)}
        onClose={() => setInspectBooking(null)}
      />

      <PaymentModal
        booking={paymentBooking}
        isOpen={Boolean(paymentBooking)}
        onClose={() => setPaymentBooking(null)}
      />

    </div>
  );
};
