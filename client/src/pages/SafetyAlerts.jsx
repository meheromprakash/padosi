import { useState } from 'react';
import { Bell } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import TopBar from '../components/TopBar';
import AlertCard from '../components/AlertCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { useAlerts } from '../hooks/useAlerts';

const SEVERITY_FILTERS = [
  { label: 'All Alerts', value: 'all', icon: 'grid_view' },
  { label: 'Critical', value: 'critical', icon: 'warning' },
  { label: 'High', value: 'high', icon: 'report' },
  { label: 'Medium', value: 'medium', icon: 'info' },
  { label: 'Info', value: 'low', icon: 'campaign' },
];

export default function SafetyAlerts() {
  const { alerts: apiAlerts, loading, error, createAlert, fetchAlerts } = useAlerts();
  const [severity, setSeverity] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', severity: 'medium', type: 'general' });
  const [submitting, setSubmitting] = useState(false);

  // Fallback mock alerts if api empty
  const MOCK_ALERTS = [
    { 
      _id: 'mock-1', 
      title: 'Theft reported near D-block', 
      description: 'A motorcycle theft was reported near D-block parking today around 4:00 PM. Neighbors are advised to double-check security cameras and ensure vehicles are locked.', 
      severity: 'critical', 
      isOfficial: true, 
      notifiedCount: 243, 
      createdAt: new Date(Date.now() - 1000 * 60 * 24).toISOString() 
    },
    { 
      _id: 'mock-2', 
      title: 'Power Outage scheduled tomorrow', 
      description: 'B-Block will have scheduled power outage from 2-4 PM for water pump repairs.', 
      severity: 'high', 
      isOfficial: false, 
      notifiedCount: 87, 
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() 
    }
  ];

  const alerts = apiAlerts.length > 0 ? apiAlerts : MOCK_ALERTS;
  const filtered = severity === 'all' ? alerts : alerts.filter((a) => a.severity === severity);

  const handleCreateAlert = async () => {
    if (!form.title.trim() || !form.description.trim()) return;
    setSubmitting(true);
    await createAlert(form);
    setSubmitting(false);
    setShowCreate(false);
    setForm({ title: '', description: '', severity: 'medium', type: 'general' });
  };

  return (
    <AppLayout>
      <TopBar />

      <div className="flex-1 max-w-[700px] px-stack-lg py-stack-lg flex flex-col gap-stack-lg border-r border-outline-variant/10 md:pt-20 pb-24 md:pb-8">
        {/* Title bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Colony Alerts</h1>
            <p className="font-label-sm text-label-sm text-outline mt-0.5">{alerts.length} active announcements</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-error text-white font-bold px-6 py-2.5 rounded-xl text-label-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 shadow-lg shadow-error/15"
            id="create-alert-btn"
          >
            <span className="material-symbols-outlined text-[18px]">add_alert</span>
            <span>Post Alert</span>
          </button>
        </div>

        {/* Filter chips bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {SEVERITY_FILTERS.map((c) => (
            <button
              key={c.value}
              onClick={() => setSeverity(c.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                severity === c.value
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* Alerts List */}
        {loading && <LoadingSkeleton type="card" count={3} />}
        {error && <ErrorState message={error} onRetry={fetchAlerts} />}
        
        {!loading && !error && filtered.length === 0 && (
          <EmptyState icon={Bell} title="No alerts" description="Your colony is safe! No active alerts." />
        )}

        {!loading && !error && (
          <div className="flex flex-col gap-4">
            {filtered.map((alert) => (
              <AlertCard key={alert._id} alert={alert} />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Post Safety Alert"
        footer={
          <button
            onClick={handleCreateAlert}
            disabled={submitting || !form.title || !form.description}
            className="bg-primary text-on-primary font-bold px-6 py-3.5 rounded-xl text-label-md hover:opacity-90 active:scale-95 transition-all w-full flex items-center justify-center gap-1.5"
          >
            {submitting ? 'Posting...' : 'Post Alert'}
            <span className="material-symbols-outlined">send</span>
          </button>
        }
      >
        <div className="space-y-4">
          <div className="space-y-unit">
            <label className="text-xs font-bold text-on-surface-variant">Alert Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Power cut, Suspicious activity..."
              className="w-full bg-[#F3F5F4] border-none rounded-xl py-3 px-4 font-body-sm text-body-sm focus:ring-2 focus:ring-primary transition-all text-on-surface"
            />
          </div>
          <div className="space-y-unit">
            <label className="text-xs font-bold text-on-surface-variant">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the situation in detail..."
              rows={4}
              className="w-full bg-[#F3F5F4] border-none rounded-xl py-3 px-4 font-body-sm text-body-sm focus:ring-2 focus:ring-primary transition-all resize-none text-on-surface"
            />
          </div>
          <div className="space-y-unit">
            <label className="text-xs font-bold text-on-surface-variant">Severity</label>
            <select
              value={form.severity}
              onChange={(e) => setForm({ ...form, severity: e.target.value })}
              className="w-full bg-[#F3F5F4] border-none rounded-xl py-3 px-4 font-body-sm text-body-sm focus:ring-2 focus:ring-primary transition-all text-on-surface"
            >
              {['critical', 'high', 'medium', 'low'].map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
