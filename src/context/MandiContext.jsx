import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_BOOKINGS, PROCUREMENT_CENTERS, CROPS_CONFIG } from '../data/mockData';
import { TRANSLATIONS } from '../utils/translations';
import confetti from 'canvas-confetti';

const MandiContext = createContext(null);

const API_BASE = 'http://localhost:5000/api';

const STORAGE_KEY_USER = 'kisansetu_user_v2';
const STORAGE_KEY_ACTIVE_TOKEN = 'kisansetu_active_token_v2';
const STORAGE_KEY_LANG = 'kisansetu_lang_v2';

const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('kisansetu_sync_channel')
  : null;

export const MandiProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem(STORAGE_KEY_LANG) || 'en');
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Authenticated User: { id, name, mobile, role: 'farmer' | 'officer', village, district, aadhaar_last4 }
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [activeTokenId, setActiveTokenId] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_TOKEN) || 'tok-102';
  });
  const [smsMessages, setSmsMessages] = useState([]);

  // Fetch from SQLite API
  const refreshFromBackend = useCallback(async () => {
    try {
      const [bookingsRes, smsRes] = await Promise.all([
        fetch(`${API_BASE}/bookings`).then(r => r.ok ? r.json() : null),
        fetch(`${API_BASE}/sms`).then(r => r.ok ? r.json() : null)
      ]);

      if (bookingsRes && Array.isArray(bookingsRes) && bookingsRes.length > 0) {
        setBookings(bookingsRes);
      }
      if (smsRes && Array.isArray(smsRes)) {
        setSmsMessages(smsRes);
      }
    } catch (err) {
      console.warn('Backend SQLite sync note (using fallback):', err.message);
    }
  }, []);

  useEffect(() => {
    refreshFromBackend();
  }, [refreshFromBackend]);

  // Persist user and settings
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    if (activeTokenId) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_TOKEN, activeTokenId);
    }
  }, [activeTokenId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LANG, lang);
  }, [lang]);

  // Cross-tab broadcast channel
  useEffect(() => {
    if (!syncChannel) return;

    const handleMessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'SYNC_BOOKINGS') {
        refreshFromBackend();
      } else if (type === 'AUDIO_ANNOUNCE') {
        playAudioChime();
        speakAnnouncement(payload.text);
      }
    };

    syncChannel.onmessage = handleMessage;
    return () => {
      syncChannel.onmessage = null;
    };
  }, [refreshFromBackend]);

  // Web Audio chime generator
  const playAudioChime = useCallback(() => {
    if (!audioEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
      gain1.gain.setValueAtTime(0.15, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn('Audio chime unavailable', e);
    }
  }, [audioEnabled]);

  // Speech synthesis announcement
  const speakAnnouncement = useCallback((text) => {
    if (!audioEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error', e);
    }
  }, [audioEnabled]);

  // AUTH ACTIONS
  const login = async (mobile, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      setCurrentUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      setCurrentUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // BOOKING ACTIONS
  const createBooking = async (formData) => {
    const center = PROCUREMENT_CENTERS.find(c => c.id === formData.centerId) || PROCUREMENT_CENTERS[0];
    const crop = CROPS_CONFIG.find(c => c.id === formData.cropId) || CROPS_CONFIG[0];
    
    const prefix = center.id === 'pc-01' ? 'A' : 'T';
    const nextNum = 100 + bookings.length + 1;
    const tokenNumber = `${prefix}${nextNum}`;
    const id = 'tok-' + Date.now();

    const newBooking = {
      id,
      tokenNumber,
      userId: currentUser?.id || null,
      farmerName: formData.farmerName,
      mobile: formData.mobile,
      village: formData.village,
      district: formData.district || center.district,
      aadhaarLast4: formData.aadhaarLast4 || '8821',
      centerId: center.id,
      centerName: center.name,
      crop: crop.name,
      cropId: crop.id,
      quantity: Number(formData.quantity),
      quantityKg: Number(formData.quantity) * 100,
      unit: 'Quintals',
      bookingDate: formData.bookingDate || new Date().toISOString().split('T')[0],
      timeSlot: formData.timeSlot,
      timeSlotId: formData.timeSlotId,
      status: 'Booked',
      qualityMoisture: null,
      qualityGrade: null,
      mspPerQuintal: crop.mspPerQuintal,
      totalPmt: Number(formData.quantity) * crop.mspPerQuintal,
      paymentUtr: null,
      servingCounter: null,
      estimatedTurn: '02:15 PM',
      createdAt: new Date().toISOString()
    };

    // Optimistic UI update
    setBookings(prev => [newBooking, ...prev]);
    setActiveTokenId(newBooking.id);

    // Save to SQLite
    try {
      await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking)
      });
      refreshFromBackend();
    } catch (e) {
      console.warn('Saved locally', e);
    }

    if (syncChannel) {
      syncChannel.postMessage({ type: 'SYNC_BOOKINGS' });
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    return newBooking;
  };

  const updateStatus = async (tokenId, newStatus, extra = {}) => {
    // Optimistic UI update
    setBookings(prev => prev.map(b => {
      if (b.id !== tokenId) return b;
      return {
        ...b,
        status: newStatus,
        ...extra
      };
    }));

    // Update SQLite
    try {
      await fetch(`${API_BASE}/bookings/${tokenId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          qualityMoisture: extra.qualityMoisture,
          qualityGrade: extra.qualityGrade,
          paymentUtr: extra.paymentUtr,
          servingCounter: extra.servingCounter,
          rejectionReason: extra.rejectionReason
        })
      });
      refreshFromBackend();
    } catch (e) {
      console.warn('Updated locally', e);
    }

    if (syncChannel) {
      syncChannel.postMessage({ type: 'SYNC_BOOKINGS' });
    }

    if (newStatus === 'Accepted' || newStatus === 'Paid') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const callTokenOnPA = (tokenNumber, counter = 'Counter 1') => {
    const text = `Attention please. Token Number ${tokenNumber}, please report to ${counter}.`;
    playAudioChime();
    speakAnnouncement(text);

    if (syncChannel) {
      syncChannel.postMessage({
        type: 'AUDIO_ANNOUNCE',
        payload: { text }
      });
    }
  };

  const resetDemoData = async () => {
    try {
      await fetch(`${API_BASE}/reset`, { method: 'POST' });
      await refreshFromBackend();
    } catch (e) {
      setBookings(INITIAL_BOOKINGS);
    }
    setActiveTokenId('tok-102');
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <MandiContext.Provider
      value={{
        lang,
        setLang,
        t,
        audioEnabled,
        setAudioEnabled,
        currentUser,
        login,
        register,
        logout,
        bookings,
        activeTokenId,
        setActiveTokenId,
        activeBooking: bookings.find(b => b.id === activeTokenId) || bookings[0],
        smsMessages,
        createBooking,
        updateStatus,
        callTokenOnPA,
        resetDemoData,
        refreshFromBackend,
        playAudioChime,
        speakAnnouncement
      }}
    >
      {children}
    </MandiContext.Provider>
  );
};

export const useMandi = () => {
  const context = useContext(MandiContext);
  if (!context) {
    throw new Error('useMandi must be used within a MandiProvider');
  }
  return context;
};
