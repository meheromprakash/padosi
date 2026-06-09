import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const POPULAR_LOCALITIES = [
  { name: 'Shreeji Residency', locality: 'Gotri', city: 'Vadodara', pincode: '390021' },
  { name: 'Nilamber Circle Residency', locality: 'Gorwa', city: 'Vadodara', pincode: '390016' },
  { name: 'Sunflower Heights', locality: 'Alkapuri', city: 'Vadodara', pincode: '390005' },
  { name: 'Green Avenue Society', locality: 'Karelibaug', city: 'Vadodara', pincode: '390018' },
  { name: 'Rajhans Residency', locality: 'Harni', city: 'Vadodara', pincode: '390022' },
];

export default function AddressVerification() {
  const navigate = useNavigate();
  const { setOnboardingData } = useAuth();

  const [address, setAddress] = useState('');
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState({});

  const filtered = POPULAR_LOCALITIES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.locality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectLocality = (loc) => {
    setAddress(loc.name);
    setLocality(loc.locality);
    setCity(loc.city);
    setPincode(loc.pincode);
    setSearchQuery(loc.name);
    setShowSuggestions(false);
  };

  const validate = () => {
    const e = {};
    if (!address.trim()) e.address = 'House / Flat number is required';
    if (!locality.trim()) e.locality = 'Locality is required';
    if (!city.trim()) e.city = 'City is required';
    if (!pincode.trim() || !/^\d{6}$/.test(pincode)) e.pincode = 'Valid 6-digit pincode required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;
    setOnboardingData((prev) => ({ ...prev, address, locality, city, pincode }));
    navigate('/signup/email');
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
                <h1 className="font-headline-lg text-headline-lg text-on-surface mb-stack-sm">Where do you live?</h1>
                <p className="font-body-md text-body-md text-on-surface-variant mb-stack-xl">
                  Your exact address is never shared with neighbors. We use it only to verify your residency in the Greenwood Estates community.
                </p>
                <form className="space-y-stack-lg" onSubmit={handleNext}>
                  {/* Locality Search */}
                  <div className="space-y-unit relative">
                    <label className="font-label-md text-label-md text-primary font-bold">Search Locality or Society</label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
                      <input 
                        className="w-full bg-[#F3F5F4] border-none rounded-xl py-4 pl-12 pr-4 font-body-md text-body-md focus:ring-2 focus:ring-primary-container transition-all" 
                        placeholder="e.g. Greenwood Estates, Alkapuri" 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                        onFocus={() => setShowSuggestions(true)}
                        id="colony-search"
                      />
                    </div>
                    {/* Suggestions Popover */}
                    {showSuggestions && searchQuery && filtered.length > 0 && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-lg border border-outline-variant/30 overflow-hidden z-10">
                        {filtered.map((loc) => (
                          <div 
                            key={loc.name}
                            onClick={() => selectLocality(loc)}
                            className="p-3 hover:bg-surface-container-low cursor-pointer flex items-center gap-3 transition-colors border-b border-outline-variant/10"
                          >
                            <span className="material-symbols-outlined text-outline">location_on</span>
                            <div>
                              <p className="font-label-md text-label-md text-on-surface"><strong>{loc.name}</strong></p>
                              <p className="text-[12px] text-on-surface-variant">{loc.locality}, {loc.city} — {loc.pincode}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* House / Flat / Plot Number */}
                  <div className="space-y-unit">
                    <label className="font-label-md text-label-md text-on-surface-variant">House / Flat / Plot Number</label>
                    <input 
                      className={`w-full bg-[#F3F5F4] border-none rounded-xl py-4 px-4 font-body-md text-body-md focus:ring-2 focus:ring-primary-container transition-all ${errors.address ? 'border-red-400 ring-2 ring-red-400' : ''}`} 
                      placeholder="e.g. Villa 402, Block C" 
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      id="address"
                    />
                    {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                  </div>

                  {/* Manual Fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-unit">
                      <label className="font-label-md text-label-md text-on-surface-variant">Locality</label>
                      <input 
                        className={`w-full bg-[#F3F5F4] border-none rounded-xl py-3 px-4 font-body-sm text-body-sm focus:ring-2 focus:ring-primary-container transition-all ${errors.locality ? 'border-red-400 ring-2 ring-red-400' : ''}`}
                        placeholder="e.g. Gotri" 
                        type="text"
                        value={locality}
                        onChange={(e) => setLocality(e.target.value)}
                        id="locality"
                      />
                      {errors.locality && <p className="text-xs text-red-500 mt-1">{errors.locality}</p>}
                    </div>
                    <div className="space-y-unit">
                      <label className="font-label-md text-label-md text-on-surface-variant">City</label>
                      <input 
                        className={`w-full bg-[#F3F5F4] border-none rounded-xl py-3 px-4 font-body-sm text-body-sm focus:ring-2 focus:ring-primary-container transition-all ${errors.city ? 'border-red-400 ring-2 ring-red-400' : ''}`}
                        placeholder="e.g. Vadodara" 
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        id="city"
                      />
                      {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                    </div>
                  </div>

                  <div className="space-y-unit">
                    <label className="font-label-md text-label-md text-on-surface-variant">Pincode</label>
                    <input 
                      className={`w-full bg-[#F3F5F4] border-none rounded-xl py-3 px-4 font-body-sm text-body-sm focus:ring-2 focus:ring-primary-container transition-all ${errors.pincode ? 'border-red-400 ring-2 ring-red-400' : ''}`}
                      placeholder="e.g. 390021" 
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      id="pincode"
                    />
                    {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary-container text-white py-4 px-8 rounded-full font-headline-sm text-headline-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md flex items-center justify-center gap-2 group"
                    id="address-next-btn"
                  >
                    Send verification code
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </form>
                <div className="mt-stack-xl pt-stack-md border-t border-outline-variant/20 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Verified by 12,000+ residents in Vadodara</p>
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
            onClick={() => navigate('/')}
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
              Where do you live?
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              We use this to connect you with your actual neighbors and show you what's happening right on your street.
            </p>
          </section>

          {/* Search input */}
          <section className="mb-stack-lg">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <input 
                className="w-full h-14 pl-12 pr-4 bg-surface-container-low border-none rounded-xl font-body-md text-body-md focus:ring-2 focus:ring-primary transition-all placeholder:text-outline" 
                placeholder="Search for your apartment or street" 
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
              />
            </div>
            {showSuggestions && searchQuery && filtered.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-2xl shadow-float border border-surface-container overflow-hidden">
                {filtered.map((loc) => (
                  <button 
                    key={loc.name}
                    onClick={() => selectLocality(loc)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-low text-left transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-surface-container">
                      <span className="material-symbols-outlined text-primary">location_on</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{loc.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{loc.locality}, {loc.city} — {loc.pincode}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Manual inputs on mobile if user wants */}
          <section className="mb-stack-lg space-y-3">
            <div className="space-y-unit">
              <label className="text-xs font-semibold text-on-surface-variant">House / Flat / Block</label>
              <input 
                className={`w-full bg-[#F3F5F4] border-none rounded-xl py-3 px-4 font-body-sm text-body-sm focus:ring-2 focus:ring-primary transition-all ${errors.address ? 'border-red-400 ring-2 ring-red-400' : ''}`}
                placeholder="e.g. Flat 101, Block B"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-unit">
                <label className="text-xs font-semibold text-on-surface-variant">Locality</label>
                <input 
                  className={`w-full bg-[#F3F5F4] border-none rounded-xl py-3 px-4 font-body-sm text-body-sm focus:ring-2 focus:ring-primary transition-all ${errors.locality ? 'border-red-400 ring-2 ring-red-400' : ''}`}
                  placeholder="e.g. Gotri"
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                />
              </div>
              <div className="space-y-unit">
                <label className="text-xs font-semibold text-on-surface-variant">City</label>
                <input 
                  className={`w-full bg-[#F3F5F4] border-none rounded-xl py-3 px-4 font-body-sm text-body-sm focus:ring-2 focus:ring-primary transition-all ${errors.city ? 'border-red-400 ring-2 ring-red-400' : ''}`}
                  placeholder="e.g. Vadodara"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-unit">
              <label className="text-xs font-semibold text-on-surface-variant">Pincode</label>
              <input 
                className={`w-full bg-[#F3F5F4] border-none rounded-xl py-3 px-4 font-body-sm text-body-sm focus:ring-2 focus:ring-primary transition-all ${errors.pincode ? 'border-red-400 ring-2 ring-red-400' : ''}`}
                placeholder="e.g. 390021"
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
              />
            </div>
          </section>

          {/* Suggested List */}
          <section className="mb-stack-xl">
            <h2 className="font-label-md text-label-md text-on-surface-variant mb-stack-md uppercase tracking-tight">Suggested near you</h2>
            <div className="space-y-unit">
              {POPULAR_LOCALITIES.slice(0, 2).map((loc) => (
                <button 
                  key={loc.name}
                  onClick={() => selectLocality(loc)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-high transition-all text-left group"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest group-hover:bg-primary-fixed transition-colors">
                    <span className="material-symbols-outlined text-primary">apartment</span>
                  </div>
                  <div>
                    <p className="font-body-md text-body-md font-semibold text-on-surface">{loc.name}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{loc.locality}, {loc.city}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Popular Localities Chips */}
          <section className="mb-stack-xl">
            <h2 className="font-label-md text-label-md text-on-surface-variant mb-stack-md uppercase tracking-tight">Popular localities</h2>
            <div className="flex flex-wrap gap-stack-sm">
              {['Gorwa', 'Gotri', 'Alkapuri', 'Vasna'].map((l) => (
                <button 
                  key={l}
                  onClick={() => {
                    setLocality(l);
                    setCity('Vadodara');
                    setPincode('390021');
                  }}
                  className={`px-5 py-2.5 rounded-full font-label-md text-label-md transition-all ${locality === l ? 'bg-primary text-white' : 'bg-surface-container-highest hover:bg-secondary-container text-on-surface-variant hover:text-on-secondary-container'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </section>

          {/* Visual Map */}
          <section className="relative h-48 w-full rounded-2xl overflow-hidden shadow-sm mb-stack-xl">
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_0L5XsKTBGtGXv-H6mOV8RadeyxglIq1SJuYIL0rGtdyRaiL-JN5Mg0HrCTuapNOighwdzLETTGCRu4Zl4W-mZ-fZHLO09yFSGmLz7_9RRwkv4Zzvt829Rc-K88FfPjOVH9XDp6dVZpnyq99uwssZDVj706Svf6FcA3vxvaydODJ7KfRHtl2B73_SPk0TsafO72GB4_nHVU34y1UlDDWMyMS7Z3DMdWsFpKvidt9rFztwiyDwZpDR4DVnXgxKMPi3cVX8JrAG-mo"
              alt="Map view"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <span className="bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-full text-primary font-label-sm text-label-sm shadow-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">explore</span> 
                Browsing Vadodara
              </span>
            </div>
          </section>
        </main>

        <footer className="mt-auto p-margin-mobile max-w-[600px] mx-auto w-full">
          <div className="flex flex-col items-center gap-stack-md">
            <div className="flex items-center gap-2 text-on-surface-variant opacity-80">
              <span className="material-symbols-outlined text-primary text-[18px] fill-icon" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              <span className="font-body-sm text-body-sm">Your address stays private</span>
            </div>
            <button 
              onClick={handleNext}
              className="w-full h-14 bg-primary text-on-primary rounded-xl font-headline-sm text-headline-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
              id="mobile-address-next-btn"
            >
              Send verification code
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button onClick={() => navigate('/')} className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors py-2">
              I'll do this later
            </button>
          </div>
        </footer>
      </div>
    </>
  );
}
