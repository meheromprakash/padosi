import Sidebar from './Sidebar';
import RightPanel from './RightPanel';
import MobileNav from './MobileNav';

/**
 * AppLayout — Stitch 3-column desktop layout
 *   Sidebar (240px fixed) | Main Content | Right Panel (320px fixed)
 * On mobile: full-width + bottom nav
 */
export default function AppLayout({ children, rightPanel, noRightPanel = false }) {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className={noRightPanel ? 'main-content-full' : 'main-content'}>
        {children}
      </main>

      {!noRightPanel && (
        <RightPanel />
      )}

      {noRightPanel && rightPanel && (
        <aside className="right-panel px-5 py-6">
          {rightPanel}
        </aside>
      )}

      <MobileNav />
    </div>
  );
}
