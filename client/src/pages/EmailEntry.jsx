import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function EmailEntry() {
  const navigate = useNavigate();
  const { startSignup, loading, onboardingData } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    if (!email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address';
    return null;
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');

    const result = await startSignup({
      email,
      address: onboardingData.address,
      locality: onboardingData.locality,
      city: onboardingData.city,
      pincode: onboardingData.pincode,
    });

    if (result.success) {
      navigate('/signup/otp', { state: { email } });
    } else {
      setError(result.error);
    }
  };

  return (
    <>
      {/* ── DESKTOP VIEW ── */}
      <div className="hidden md:flex text-on-surface bg-[#FAF7F2] min-h-screen items-center justify-center p-6 md:p-12 overflow-x-hidden w-full">
        {/* Top Logo Anchor */}
        <div className="fixed top-8 left-8 flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>potted_plant</span>
          </div>
          <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">Padosi</span>
        </div>

        {/* Main Content Canvas */}
        <main className="w-full max-w-[1100px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0px_8px_24px_rgba(31,41,55,0.06)] flex flex-col md:flex-row min-h-[600px] border border-outline-variant/20">
            {/* Left Column: Form Section */}
            <div className="flex-1 p-margin-desktop flex flex-col justify-center">
              <div className="max-w-[420px]">
                <h1 className="font-headline-lg text-headline-lg text-on-surface mb-stack-sm">Verify your email</h1>
                <p className="font-body-md text-body-md text-on-surface-variant mb-stack-xl">
                  We require verified email addresses to keep the neighborhood secure from bots and anonymous accounts.
                </p>
                <form className="space-y-stack-lg" onSubmit={handleSendOtp}>
                  <div className="space-y-unit">
                    <label className="font-label-md text-label-md text-primary font-bold">Email Address</label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">mail</span>
                      <input 
                        className={`w-full bg-[#F3F5F4] border-none rounded-xl py-4 pl-12 pr-4 font-body-md text-body-md focus:ring-2 focus:ring-primary-container transition-all ${error ? 'border-red-400 ring-2 ring-red-400' : ''}`}
                        placeholder="yourname@gmail.com" 
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        id="email"
                        autoComplete="email"
                      />
                    </div>
                    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-container text-white py-4 px-8 rounded-full font-headline-sm text-headline-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md flex items-center justify-center gap-2 group"
                    id="send-otp-btn"
                  >
                    {loading ? 'Sending OTP...' : 'Send verification code'}
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </form>
                <div className="mt-stack-xl pt-stack-md border-t border-outline-variant/20 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Your email is kept confidential.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Trust Panel */}
            <div className="w-[440px] bg-primary relative flex flex-col p-margin-desktop overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"></path>
                    </pattern>
                  </defs>
                  <rect fill="url(#grid)" height="100%" width="100%"></rect>
                </svg>
              </div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex-grow flex items-center justify-center mb-stack-xl">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-secondary-container/20 rounded-full blur-2xl group-hover:blur-3xl transition-all"></div>
                    <img 
                      alt="Verified Society Gate" 
                      className="w-full aspect-square object-cover rounded-2xl shadow-2xl border-4 border-white/10" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuALqVT-MZmcneuzoBQ65r3O7tRkela3OmzTvYXacbs5TVjF9jOZZ6iwnR1Mrj6JZZKEgHh-ZMVEyy9ljX2PLX478E1wCrn2PFr42gP9CH6Hxq3TTgw6LArfdcsqns4m0h4SmYBDpLbUusNdMrdwjMvdYdOoW0TI6mhW6b-TJXijLRtoHAXecMkkGEWeudhWNUGsSOrcdYH_Aa81riHiVldgr_vZDA3e3IR_KTPuwjFNcZO-uZPnU6wPUkrftKIqhppbAFsQCL_aLpE"
                    />
                    <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                      </div>
                      <div>
                        <p className="font-label-md text-label-md text-on-surface font-bold">End-to-End Privacy</p>
                        <p className="text-[12px] text-on-surface-variant">AES-256 Encrypted</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-white space-y-stack-md">
                  <h2 className="font-headline-md text-headline-md leading-tight">Your safety is our only priority.</h2>
                  <ul className="space-y-stack-sm">
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary-fixed mt-1">check_circle</span>
                      <p className="font-body-md text-body-md text-white/90">Exclusive access for verified residents only</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary-fixed mt-1">check_circle</span>
                      <p className="font-body-md text-body-md text-white/90">Encrypted data storage that never leaves Padosi</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary-fixed mt-1">check_circle</span>
                      <p className="font-body-md text-body-md text-white/90">Identity protection for every household</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── MOBILE VIEW ── */}
      <div className="block md:hidden font-body-md text-on-surface bg-background min-h-screen">
        <header className="sticky top-0 z-50 bg-surface px-margin-mobile h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-high transition-colors text-primary"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex flex-col items-center">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">Step 2 of 3</span>
            <div className="w-24 h-1.5 rounded-full bg-surface-container-highest mt-1 overflow-hidden">
              <div className="w-2/3 h-full bg-primary rounded-full"></div>
            </div>
          </div>
          <div className="w-10"></div>
        </header>

        <main className="flex-1 w-full max-w-[600px] mx-auto px-margin-mobile pt-stack-lg pb-stack-xl">
          <section className="mb-stack-xl">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-stack-sm">
              Verify email
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Confirm your email address to secure your account.
            </p>
          </section>

          <section className="mb-stack-lg">
            <div className="space-y-unit">
              <label className="text-xs font-semibold text-on-surface-variant">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <input 
                  className="w-full h-14 pl-12 pr-4 bg-surface-container-low border-none rounded-xl font-body-md text-body-md focus:ring-2 focus:ring-primary transition-all placeholder:text-outline" 
                  placeholder="yourname@gmail.com" 
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  id="mobile-email"
                />
              </div>
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>
          </section>

          <div className="flex items-start gap-2.5 rounded-xl p-3.5 bg-surface-low border border-surface-container mt-6">
            <span className="material-symbols-outlined text-primary text-[18px]">shield</span>
            <p className="text-xs text-gray-600 leading-relaxed">
              Your email is used for verification only. We never sell, spam, or share your data.
            </p>
          </div>
        </main>

        <footer className="mt-auto p-margin-mobile max-w-[600px] mx-auto w-full">
          <div className="flex flex-col items-center gap-stack-md">
            <div className="flex items-center gap-2 text-on-surface-variant opacity-80">
              <span className="material-symbols-outlined text-primary text-[18px] fill-icon" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              <span className="font-body-sm text-body-sm">Your email stays private</span>
            </div>
            <button 
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full h-14 bg-primary text-on-primary rounded-xl font-headline-sm text-headline-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
              id="mobile-send-otp-btn"
            >
              {loading ? 'Sending OTP...' : 'Send verification code'}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </footer>
      </div>
    </>
  );
}
