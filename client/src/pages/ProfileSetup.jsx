import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { setupProfile, loading } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!firstName.trim()) { setError('Please enter your first name'); return; }
    setError('');
    const formData = new FormData();
    formData.append('firstName', firstName.trim());
    if (bio.trim()) formData.append('bio', bio.trim());
    if (avatar) formData.append('avatar', avatar);
    const result = await setupProfile(formData);
    if (result.success) navigate('/feed');
    else setError(result.error);
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
              <div className="max-w-[420px] space-y-4">
                <h1 className="font-headline-lg text-headline-lg text-on-surface">Introduce yourself</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Choose a profile picture and name so your neighbors can easily recognize you in feed and messages. Only verified residents will see this information.
                </p>
                <form className="space-y-stack-lg" onSubmit={handleSubmit}>
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="relative group focus:outline-none"
                      aria-label="Upload avatar"
                    >
                      <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-surface-container bg-[#F3F5F4] flex items-center justify-center shadow-md">
                        {preview ? (
                          <img src={preview} alt="Avatar preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-outline text-[48px]">person</span>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-md border-2 border-white bg-primary text-white hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                      </div>
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarSelect} className="hidden" />
                    <p className="text-xs text-gray-400 font-semibold">Upload Photo</p>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-unit">
                    <label className="font-label-md text-label-md text-primary font-bold">First Name / Display Name *</label>
                    <input 
                      className={`w-full bg-[#F3F5F4] border-none rounded-xl py-4 px-4 font-body-md text-body-md focus:ring-2 focus:ring-primary-container transition-all ${error ? 'border-red-400 ring-2 ring-red-400' : ''}`}
                      placeholder="What should neighbors call you?" 
                      type="text"
                      value={firstName}
                      onChange={(e) => { setFirstName(e.target.value); setError(''); }}
                      id="firstName"
                      autoComplete="given-name"
                    />
                    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                  </div>

                  {/* Bio Input */}
                  <div className="space-y-unit">
                    <label className="font-label-md text-label-md text-on-surface-variant">About yourself</label>
                    <textarea 
                      className="w-full bg-[#F3F5F4] border-none rounded-xl py-4 px-4 font-body-md text-body-md focus:ring-2 focus:ring-primary-container transition-all resize-none"
                      placeholder="Describe your house number, interests or occupation..." 
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      maxLength={200}
                      id="bio"
                    />
                    <p className="text-xs text-gray-400 text-right mt-1">{bio.length}/200</p>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-primary-container text-white py-4 px-8 rounded-full font-headline-sm text-headline-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md flex items-center justify-center gap-2 group"
                      id="complete-profile-btn"
                    >
                      {loading ? 'Completing...' : 'Complete Setup'}
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">check</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => navigate('/feed')}
                      className="px-6 py-4 rounded-full border border-outline hover:bg-surface-container transition-all font-label-md text-label-md"
                    >
                      Skip
                    </button>
                  </div>
                </form>
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
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">Step 3 of 3</span>
            <div className="w-24 h-1.5 rounded-full bg-surface-container-highest mt-1 overflow-hidden">
              <div className="w-2/3 h-full bg-primary rounded-full"></div>
            </div>
          </div>
          <div className="w-10"></div>
        </header>

        <main className="flex-1 w-full max-w-[600px] mx-auto px-margin-mobile pt-stack-lg pb-stack-xl">
          <section className="mb-stack-xl">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-stack-sm">
              Introduce yourself
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Choose a profile picture and name so your neighbors can easily recognize you.
            </p>
          </section>

          {/* Avatar upload */}
          <section className="mb-stack-lg flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative group focus:outline-none"
              aria-label="Upload avatar"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-surface-container bg-[#F3F5F4] flex items-center justify-center shadow-md">
                {preview ? (
                  <img src={preview} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-outline text-[48px]">person</span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-md border-2 border-white bg-primary text-white hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              </div>
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarSelect} className="hidden" />
          </section>

          <section className="mb-stack-lg space-y-3">
            <div className="space-y-unit">
              <label className="text-xs font-semibold text-on-surface-variant">First Name / Display Name *</label>
              <input 
                className={`w-full bg-[#F3F5F4] border-none rounded-xl py-3 px-4 font-body-sm text-body-sm focus:ring-2 focus:ring-primary transition-all ${error ? 'border-red-400 ring-2 ring-red-400' : ''}`}
                placeholder="What should neighbors call you?"
                type="text"
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value); setError(''); }}
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>
            <div className="space-y-unit">
              <label className="text-xs font-semibold text-on-surface-variant">About yourself</label>
              <textarea 
                className="w-full bg-[#F3F5F4] border-none rounded-xl py-3 px-4 font-body-sm text-body-sm focus:ring-2 focus:ring-primary transition-all resize-none"
                placeholder="Describe your house number, interests or occupation..."
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={200}
              />
              <p className="text-xs text-gray-400 text-right mt-1">{bio.length}/200</p>
            </div>
          </section>
        </main>

        <footer className="mt-auto p-margin-mobile max-w-[600px] mx-auto w-full">
          <div className="flex flex-col gap-2">
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-14 bg-primary text-on-primary rounded-xl font-headline-sm text-headline-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
              id="mobile-complete-profile-btn"
            >
              {loading ? 'Completing...' : 'Complete Setup'}
              <span className="material-symbols-outlined">check</span>
            </button>
            <button 
              onClick={() => navigate('/feed')}
              className="w-full text-center text-sm font-semibold hover:underline py-2 text-on-surface-variant"
            >
              Skip profile setup
            </button>
          </div>
        </footer>
      </div>
    </>
  );
}
