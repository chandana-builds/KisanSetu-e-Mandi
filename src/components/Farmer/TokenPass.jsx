import React, { useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { useMandi } from '../../context/MandiContext';
import { 
  QrCode, 
  Download, 
  Share2, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Building, 
  Printer, 
  Sparkles,
  PhoneCall
} from 'lucide-react';

export const TokenPass = ({ booking }) => {
  const { t } = useMandi();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && booking) {
      const qrData = JSON.stringify({
        token: booking.tokenNumber,
        farmer: booking.farmerName,
        mobile: booking.mobile,
        center: booking.centerName,
        crop: booking.crop,
        quantity: booking.quantity,
        date: booking.bookingDate,
        slot: booking.timeSlot
      });

      QRCode.toCanvas(canvasRef.current, qrData, {
        width: 130,
        margin: 1,
        color: {
          dark: '#1e293b',
          light: '#ffffff'
        }
      }, (error) => {
        if (error) console.error('QR code error', error);
      });
    }
  }, [booking]);

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = `*KisanSetu Mandi Token Pass*%0A*Token:* ${booking.tokenNumber}%0A*Farmer:* ${booking.farmerName}%0A*Center:* ${booking.centerName}%0A*Crop:* ${booking.crop} (${booking.quantity} Quintals)%0A*Slot:* ${booking.bookingDate} (${booking.timeSlot})%0APlease arrive on time to avoid gate delay.`;
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print:border-none print:shadow-none">
      
      {/* Top Pass Header */}
      <div className="bg-slate-900 text-white p-4 sm:p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-krishi-600 flex items-center justify-center text-white font-bold">
            KS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base sm:text-lg">Digital Mandi Gate Pass</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-400">Department of Agriculture & Food Procurement</p>
          </div>
        </div>

        {/* Big Token Number */}
        <div className="text-right">
          <span className="text-[11px] text-slate-400 block uppercase tracking-wider font-semibold">
            {t.tokenNumber}
          </span>
          <div className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-amber-400 animate-pulse-subtle">
            {booking.tokenNumber}
          </div>
        </div>
      </div>

      {/* Main Ticket Body */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-dashed border-slate-200">
          
          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 w-full">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Farmer Name</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{booking.farmerName}</p>
              <p className="text-xs text-slate-500">📱 +91 {booking.mobile}</p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Village / District</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{booking.village}</p>
              <p className="text-xs text-slate-500">{booking.district}</p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Crop & Quantity</span>
              <p className="text-sm font-bold text-krishi-700 mt-0.5">{booking.crop}</p>
              <p className="text-xs font-semibold text-slate-700">{booking.quantity} Quintals ({booking.quantityKg || booking.quantity * 100} kg)</p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Scheduled Date</span>
              <div className="flex items-center gap-1.5 mt-0.5 text-sm font-bold text-slate-900">
                <Calendar className="w-3.5 h-3.5 text-krishi-600" />
                <span>{booking.bookingDate}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Allocated Time Slot</span>
              <div className="flex items-center gap-1.5 mt-0.5 text-sm font-bold text-slate-900">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{booking.timeSlot}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Estimated Payout (MSP)</span>
              <p className="text-base font-extrabold text-emerald-700 mt-0.5 font-display">
                ₹{booking.totalPmt?.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-slate-400">@ ₹{booking.mspPerQuintal}/Qtl</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="shrink-0 flex flex-col items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
            <canvas ref={canvasRef} className="rounded-lg shadow-xs" />
            <span className="text-[10px] text-slate-500 font-medium mt-1.5 flex items-center gap-1">
              <QrCode className="w-3 h-3" /> Gate Scanner Code
            </span>
          </div>

        </div>

        {/* Center Venue Info */}
        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <div>
              <span className="font-bold text-slate-900">{booking.centerName}</span>
              <span className="text-slate-400 ml-1.5 hidden md:inline">Show this digital token at weighbridge gate entry</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto print:hidden">
            <button
              onClick={handleWhatsAppShare}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs border border-emerald-200 transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
