import React, { useState, useEffect } from 'react';
import { useMandi } from '../../context/MandiContext';
import { RegisterAndBook } from './RegisterAndBook';
import { TokenPass } from './TokenPass';
import { LiveQueueTracker } from './LiveQueueTracker';
import { 
  CalendarPlus, 
  Ticket, 
  Volume2, 
  User, 
  Sparkles, 
  PlusCircle,
  MapPin,
  Clock
} from 'lucide-react';

export const FarmerPortal = () => {
  const { 
    currentUser, 
    bookings, 
    activeTokenId, 
    setActiveTokenId, 
    speakAnnouncement, 
    lang 
  } = useMandi();

  // Filter ONLY this farmer's real bookings (by userId or mobile)
  const myBookings = bookings.filter(b => 
    (currentUser?.id && b.userId === currentUser.id) || 
    (currentUser?.mobile && b.mobile === currentUser.mobile)
  );

  const [activeTab, setActiveTab] = useState(myBookings.length > 0 ? 'tracker' : 'book');

  // Active booking for this user
  const currentFarmerBooking = myBookings.find(b => b.id === activeTokenId) || myBookings[0] || null;

  useEffect(() => {
    if (myBookings.length > 0 && (!activeTokenId || !myBookings.some(b => b.id === activeTokenId))) {
      setActiveTokenId(myBookings[0].id);
    }
  }, [myBookings, activeTokenId, setActiveTokenId]);

  const handleBookingSuccess = (newBooking) => {
    setActiveTokenId(newBooking.id);
    setActiveTab('tracker');
  };

  const handleVoiceGuidance = () => {
    if (!currentFarmerBooking) return;
    
    let speechText = '';
    if (lang === 'hi') {
      speechText = `नमस्ते ${currentUser?.name || currentFarmerBooking.farmerName} जी। आपका टोकन नंबर ${currentFarmerBooking.tokenNumber} है। आपकी स्थिति ${currentFarmerBooking.status} है।`;
    } else if (lang === 'te') {
      speechText = `నమస్కారం ${currentUser?.name || currentFarmerBooking.farmerName} గారు. మీ టోకెన్ సంఖ్య ${currentFarmerBooking.tokenNumber}. మీ స్థితి ${currentFarmerBooking.status}.`;
    } else {
      speechText = `Hello ${currentUser?.name || currentFarmerBooking.farmerName}. Your token number is ${currentFarmerBooking.tokenNumber}. Status is ${currentFarmerBooking.status}.`;
    }
    
    speakAnnouncement(speechText);
  };

  return (
    <div className="space-y-6">
      
      {/* Personalized Greeting Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-krishi-700">Farmer Dashboard</span>
          </div>
          <h2 className="text-2xl font-black font-display text-slate-900 mt-0.5">
            Welcome, {currentUser?.name || 'Farmer'} 👋
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
            <span>📱 +91 {currentUser?.mobile}</span>
            {currentUser?.village && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {currentUser.village}, {currentUser.district || 'District HQ'}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Action Controls & Voice Assist */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* My Tokens Selector if multiple bookings exist */}
          {myBookings.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">My Bookings:</span>
              <select
                value={currentFarmerBooking?.id || ''}
                onChange={(e) => {
                  setActiveTokenId(e.target.value);
                  setActiveTab('tracker');
                }}
                className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none"
              >
                {myBookings.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.tokenNumber} - {b.crop} ({b.status})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Voice Guidance */}
          {currentFarmerBooking && (
            <button
              onClick={handleVoiceGuidance}
              title="Voice Assistant for Rural Accessibility"
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Voice Assist</span>
            </button>
          )}

          {/* New Booking Button */}
          <button
            onClick={() => setActiveTab('book')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'book'
                ? 'bg-krishi-700 text-white shadow-xs'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Book Mandi Slot</span>
          </button>

          {/* Live Queue Tab */}
          {myBookings.length > 0 && (
            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'tracker'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Ticket className="w-4 h-4 text-amber-400" />
              <span>Live Queue & Gate Pass</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'book' ? (
        <RegisterAndBook onBookingSuccess={handleBookingSuccess} />
      ) : currentFarmerBooking ? (
        <div className="space-y-6">
          <LiveQueueTracker booking={currentFarmerBooking} />
          <TokenPass booking={currentFarmerBooking} />
        </div>
      ) : (
        /* Empty State for user with no bookings */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-krishi-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black font-display text-slate-900">
            No Active Mandi Bookings Yet
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
            Welcome to KisanSetu, {currentUser?.name || 'Farmer'}! Pre-book your vehicle slot at your nearest procurement center to get your digital token and eliminate waiting in lines.
          </p>
          <button
            onClick={() => setActiveTab('book')}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-krishi-600 to-krishi-700 hover:from-krishi-700 hover:to-krishi-800 text-white font-extrabold text-sm shadow-md shadow-krishi-600/25 transition cursor-pointer inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book Your First Slot Now</span>
          </button>
        </div>
      )}

    </div>
  );
};
