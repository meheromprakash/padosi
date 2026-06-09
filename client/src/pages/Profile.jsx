import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Modal from '../components/Modal';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/dateUtils';
import TopBar from '../components/TopBar';

export default function Profile() {
  const { user, logout, setupProfile } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState(user?.firstName || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const fd = new FormData();
    fd.append('firstName', editName);
    fd.append('bio', editBio);
    await setupProfile(fd);
    setSaving(false);
    setShowEdit(false);
  };

  const displayUser = user || {
    firstName: 'Demo User',
    email: 'demo@padosi.app',
    bio: 'Resident of Shreeji Residency',
    trustScore: 85,
    createdAt: new Date().toISOString(),
    localityId: { name: 'Shreeji Residency, Gotri' },
    verification: { verified: true },
  };

  const initials = displayUser.firstName.charAt(0).toUpperCase();

  return (
    <AppLayout>
      <TopBar />

      <div className="flex-1 max-w-[700px] px-stack-lg py-stack-lg flex flex-col gap-stack-lg border-r border-outline-variant/10 md:pt-20 pb-24 md:pb-8">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">My Profile</h1>
          <p className="font-label-sm text-label-sm text-outline mt-0.5">Manage your details and settings</p>
        </div>

        {/* Profile Card Block */}
        <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl overflow-hidden shadow-[0px_4px_12px_rgba(31,41,55,0.05)]">
          <div className="bg-gradient-to-r from-primary/10 to-primary/30 h-32 relative"></div>
          <div className="px-6 pb-6 relative">
            {/* Avatar positioning */}
            <div className="flex justify-between items-end -mt-10 mb-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-white bg-surface-container-high flex items-center justify-center font-bold text-primary text-2xl overflow-hidden shadow-md">
                  {displayUser.avatar ? (
                    <img src={displayUser.avatar} alt={displayUser.firstName} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary text-on-primary rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:opacity-90 transition-all">
                  <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                </button>
              </div>
              <button
                onClick={() => setShowEdit(true)}
                className="bg-[#F3F5F4] text-on-surface font-bold px-4 py-2 rounded-xl text-xs hover:bg-[#EAEAEA] active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                <span>Edit Profile</span>
              </button>
            </div>

            {/* User details */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">{displayUser.firstName}</h2>
                {displayUser.verification?.verified && (
                  <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                )}
              </div>
              {displayUser.bio && (
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {displayUser.bio}
                </p>
              )}
              <div className="flex flex-col gap-1 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-outline font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                  <span>{displayUser.localityId?.name || 'Colony not set'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-outline font-medium">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  <span>Member since {formatDate(displayUser.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Score Block */}
        <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-6 shadow-[0px_4px_12px_rgba(31,41,55,0.05)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#F2994A]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              <span className="font-bold text-sm text-on-surface">Community Trust Score</span>
            </div>
            <span className="text-2xl font-bold text-primary">{displayUser.trustScore || 70}/100</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${displayUser.trustScore || 70}%` }} />
          </div>
          <p className="text-xs text-outline mt-3 leading-relaxed">Complete your profile details or verify your address to boost your trust score in the community.</p>
        </div>

        {/* Settings options */}
        <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl overflow-hidden shadow-[0px_4px_12px_rgba(31,41,55,0.05)] divide-y divide-outline-variant/10">
          <button className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#F3F5F4]/30 text-left transition-colors">
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined">shield</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-on-surface">Privacy &amp; Safety</p>
              <p className="text-xs text-outline mt-0.5">Control visibility and active alerts notifications</p>
            </div>
            <span className="material-symbols-outlined text-outline">chevron_right</span>
          </button>
          <button className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#F3F5F4]/30 text-left transition-colors">
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined">settings</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-on-surface">Account Settings</p>
              <p className="text-xs text-outline mt-0.5">Password, emails, and locality setup</p>
            </div>
            <span className="material-symbols-outlined text-outline">chevron_right</span>
          </button>
        </div>

        <button
          onClick={logout}
          className="bg-error text-white font-bold py-3.5 px-6 rounded-xl text-label-md hover:opacity-90 active:scale-95 transition-all w-full flex items-center justify-center gap-1.5 shadow-lg shadow-error/10"
          id="logout-btn"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Sign Out</span>
        </button>
      </div>

      <Modal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Profile"
        footer={
          <button onClick={handleSave} disabled={saving} className="bg-primary text-on-primary font-bold px-6 py-3.5 rounded-xl text-label-md hover:opacity-90 active:scale-95 transition-all w-full">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        }
      >
        <div className="space-y-4 text-on-surface">
          <div className="space-y-unit">
            <label className="text-xs font-bold text-on-surface-variant">First Name</label>
            <input 
              value={editName} 
              onChange={(e) => setEditName(e.target.value)} 
              className="w-full bg-[#F3F5F4] border-none rounded-xl py-3 px-4 font-body-sm text-body-sm focus:ring-2 focus:ring-primary transition-all text-on-surface" 
            />
          </div>
          <div className="space-y-unit">
            <label className="text-xs font-bold text-on-surface-variant">Bio</label>
            <textarea 
              value={editBio} 
              onChange={(e) => setEditBio(e.target.value)} 
              rows={3} 
              maxLength={200} 
              className="w-full bg-[#F3F5F4] border-none rounded-xl py-3 px-4 font-body-sm text-body-sm focus:ring-2 focus:ring-primary transition-all resize-none text-on-surface" 
            />
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
