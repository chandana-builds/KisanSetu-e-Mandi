import React, { useState } from 'react';
import { useMandi } from '../../context/MandiContext';
import { 
  User, 
  Lock, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Building2, 
  Sprout, 
  ArrowRight, 
  AlertCircle,
  X 
} from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, initialRole = 'farmer', onLoginSuccess }) => {
  const { login, register } = useMandi();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState(initialRole); // 'farmer' | 'officer'
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    village: '',
    district: 'Ranga Reddy',
    aadhaar_last4: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!formData.name.trim() || !formData.mobile.trim() || !formData.password) {
          setError('Please fill in Name, Mobile number, and Password.');
          setLoading(false);
          return;
        }

        const res = await register({
          name: formData.name.trim(),
          mobile: formData.mobile.trim(),
          village: formData.village.trim(),
          district: formData.district.trim(),
          aadhaar_last4: formData.aadhaar_last4.trim(),
          role,
          password: formData.password
        });

        if (res.success) {
          if (onLoginSuccess) onLoginSuccess(res.user);
          if (onClose) onClose();
        } else {
          setError(res.error || 'Registration failed');
        }
      } else {
        if (!formData.mobile.trim() || !formData.password) {
          setError('Please enter your registered Mobile number and Password.');
          setLoading(false);
          return;
        }

        const res = await login(formData.mobile.trim(), formData.password);
        if (res.success) {
          if (onLoginSuccess) onLoginSuccess(res.user);
          if (onClose) onClose();
        } else {
          setError(res.error || 'Invalid credentials');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="max-w-md w-full mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Top Brand Banner */}
        <div className="bg-gradient-to-br from-krishi-800 via-krishi-900 to-slate-950 text-white p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-krishi-600/40 border border-krishi-400/40 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Sprout className="w-6 h-6 text-emerald-300" />
          </div>
          <h2 className="text-2xl font-black font-display tracking-tight text-white">
            KisanSetu (कृषि सेतु)
          </h2>
          <p className="text-xs text-krishi-200 mt-1">
            Government e-Mandi Portal
          </p>

          {/* Role Selector */}
          <div className="flex bg-white/10 p-1 rounded-xl mt-5 border border-white/15">
            <button
              type="button"
              onClick={() => { setRole('farmer'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                role === 'farmer' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sprout className="w-3.5 h-3.5 text-krishi-600" />
              <span>Farmer</span>
            </button>

            <button
              type="button"
              onClick={() => { setRole('officer'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                role === 'officer' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Mandi Officer</span>
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-6">
          
          {/* Sign In vs Sign Up Toggle */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="font-display font-bold text-base text-slate-900">
              {isSignUp 
                ? `New ${role === 'farmer' ? 'Farmer' : 'Officer'} Registration` 
                : `${role === 'farmer' ? 'Farmer' : 'Mandi Officer'} Sign In`}
            </h3>
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="text-xs font-bold text-krishi-700 hover:text-krishi-800 underline cursor-pointer"
            >
              {isSignUp ? 'Already have account? Sign In' : 'New User? Sign Up'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* If Sign Up: Name */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-krishi-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={e => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-krishi-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* If Sign Up and Farmer: Village and Aadhaar */}
            {isSignUp && role === 'farmer' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Village / Mandal
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Chevella"
                      value={formData.village}
                      onChange={e => setFormData({ ...formData, village: e.target.value })}
                      className="w-full pl-8 pr-2 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-krishi-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Aadhaar Last 4
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="e.g. 7842"
                    value={formData.aadhaar_last4}
                    onChange={e => setFormData({ ...formData, aadhaar_last4: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-krishi-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-krishi-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-krishi-600 to-krishi-700 hover:from-krishi-700 hover:to-krishi-800 text-white font-bold text-sm shadow-md shadow-krishi-600/25 transition cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Please wait...</span>
              ) : (
                <>
                  <span>{isSignUp ? 'Register Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
