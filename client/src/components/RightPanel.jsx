import { useNavigate } from 'react-router-dom';

const MOCK_ALERTS = [
  { id: 1, title: 'Power Outage', desc: 'B-Block, Scheduled 2-4 PM', border: 'border-error' },
  { id: 2, title: 'Water Tank Cleaning', desc: 'All blocks, Tomorrow 8 AM', border: 'border-tertiary' },
];

const TRENDING = [
  { id: 1, topic: 'New Cafe Opening on 30ft Road', category: 'Food & Dining', count: '42 neighbors talking about this' },
  { id: 2, topic: 'Street Light Repair Update', category: 'Safety', count: '12 neighbors interested' },
  { id: 3, topic: 'Domestic Help Registry', category: 'Services', count: '85 neighbors active' },
];

export default function RightPanel({ stats }) {
  const navigate = useNavigate();
  const neighborsCount = stats?.memberCount || 1200;
  const activeDaily = stats?.activeDaily || 98;

  return (
    <aside className="w-80 px-stack-lg py-stack-lg flex flex-col gap-stack-lg bg-surface border-l border-outline-variant/30 min-h-screen overflow-y-auto">
      {/* Community Stats */}
      <div className="bg-primary text-on-primary rounded-2xl p-stack-lg relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-label-md text-label-md font-bold mb-stack-md opacity-80 uppercase tracking-widest text-white">Community Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-3xl font-bold text-white">{(neighborsCount / 1000).toFixed(1)}k</p>
              <p className="text-xs opacity-70 text-white">Neighbors</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{activeDaily}</p>
              <p className="text-xs opacity-70 text-white">Active Daily</p>
            </div>
            <div className="col-span-2 pt-2">
              <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                <div className="bg-white h-full w-3/4"></div>
              </div>
              <p className="text-[10px] mt-1 opacity-70 text-white">75% of your block is online</p>
            </div>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* Urgent Alerts Widget */}
      <div className="bg-surface-container-lowest rounded-2xl p-stack-md border border-outline-variant/20">
        <div className="flex items-center gap-2 mb-stack-md">
          <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
          <h3 className="font-label-md text-label-md font-bold uppercase tracking-widest text-on-surface-variant">Urgent Alerts</h3>
        </div>
        <div className="flex flex-col gap-3">
          {MOCK_ALERTS.map((alert) => (
            <div 
              key={alert.id}
              onClick={() => navigate('/alerts')}
              className={`p-3 bg-surface rounded-xl flex gap-3 border-l-4 cursor-pointer hover:bg-surface-container-low transition-colors ${alert.border}`}
            >
              <div className="flex-1">
                <p className="font-label-sm text-label-sm font-bold text-on-surface">{alert.title}</p>
                <p className="text-[12px] text-outline">{alert.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending in Gotri */}
      <div className="bg-surface-container-lowest rounded-2xl p-stack-lg shadow-[0px_4px_12px_rgba(31,41,55,0.05)] border border-outline-variant/10">
        <h3 className="font-label-md text-label-md font-bold mb-stack-md border-b border-outline-variant/10 pb-2 text-on-surface">Trending Nearby</h3>
        <div className="flex flex-col gap-4">
          {TRENDING.map((item) => (
            <div key={item.id} className="group cursor-pointer" onClick={() => navigate('/feed')}>
              <p className="text-xs text-outline font-bold uppercase tracking-wider">{item.category}</p>
              <h4 className="font-label-md text-label-md group-hover:text-primary transition-colors text-on-surface">{item.topic}</h4>
              <p className="text-[12px] text-on-surface-variant">{item.count}</p>
            </div>
          ))}
        </div>
        <button 
          onClick={() => navigate('/feed')}
          className="w-full mt-stack-md text-primary font-bold text-label-sm hover:underline text-left"
        >
          See all trending
        </button>
      </div>

      {/* Footer Links */}
      <div className="px-4 text-[10px] text-outline flex flex-wrap gap-2 leading-tight">
        <a className="hover:text-primary cursor-pointer">About</a>
        <span>•</span>
        <a className="hover:text-primary cursor-pointer">Help Center</a>
        <span>•</span>
        <a className="hover:text-primary cursor-pointer">Privacy Policy</a>
        <span>•</span>
        <a className="hover:text-primary cursor-pointer">Terms</a>
        <p className="mt-2 w-full">© 2025 Padosi Communities Inc.</p>
      </div>
    </aside>
  );
}
