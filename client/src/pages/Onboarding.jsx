import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate('/signup/address');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <>
      {/* ── DESKTOP VIEW ── */}
      <div className="hidden md:block text-on-surface bg-background min-h-screen">
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center h-20 px-margin-desktop bg-surface/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>potted_plant</span>
            </div>
            <span className="font-headline-md text-headline-md text-primary tracking-tight">Padosi</span>
          </div>
          <div className="flex items-center gap-stack-lg">
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">How it works</a>
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Neighborhoods</a>
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Safety</a>
            <button 
              onClick={handleLogin}
              className="bg-primary px-6 py-2.5 rounded-full text-white font-label-md text-label-md hover:scale-[1.05] transition-transform active:scale-[0.98]"
              id="desktop-login-btn"
            >
              Login
            </button>
          </div>
        </nav>
        
        <main className="flex flex-row pt-20 overflow-hidden min-h-[calc(100vh-80px)]">
          <section className="w-1/2 flex flex-col justify-center px-margin-desktop py-stack-xl">
            <div className="max-w-[580px] flex flex-col gap-stack-md">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container/30 text-secondary w-fit rounded-full">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span className="font-label-sm text-label-sm">Verified Resident Network</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-primary leading-tight">
                Connect with your colony in a meaningful way.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Padosi brings the warmth of traditional neighborhoods to the digital age. Join thousands of verified neighbors in Greenwood Estates for local updates, services, and trust.
              </p>
              <div className="flex flex-col sm:flex-row gap-stack-sm mt-stack-md">
                <button 
                  onClick={handleJoin}
                  className="bg-primary text-white font-label-md text-label-md px-8 py-4 rounded-xl shadow-[0px_8px_24px_rgba(45,106,79,0.2)] hover:scale-[1.02] transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
                  id="desktop-join-btn"
                >
                  Join your neighborhood
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button 
                  onClick={() => navigate('/directory')}
                  className="bg-surface-container-high text-primary font-label-md text-label-md px-8 py-4 rounded-xl hover:bg-surface-container-highest transition-colors flex items-center justify-center"
                >
                  Explore Local Directory
                </button>
              </div>
              <div className="grid grid-cols-2 gap-stack-lg mt-stack-xl pt-stack-xl border-t border-outline-variant/30">
                <div>
                  <p className="font-headline-sm text-headline-sm text-primary">12,000+</p>
                  <p className="font-label-md text-label-md text-on-surface-variant">Neighbors connected</p>
                </div>
                <div>
                  <p className="font-headline-sm text-headline-sm text-primary">450+</p>
                  <p className="font-label-md text-label-md text-on-surface-variant">Local colonies active</p>
                </div>
              </div>
              <div className="mt-stack-xl p-stack-md bg-surface-container-low rounded-2xl border border-outline-variant/20 flex gap-stack-md">
                <img 
                  alt="Resident testimonial" 
                  className="w-12 h-12 rounded-full object-cover shrink-0" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoC_aWJ94OJAqc1-xc6B-OnuiZc0GJnUTmSdc_UghpGQ-bdaT_kH-YqNh30ZwuMek1Bg2AqPJ0vGQgYbfJ4RCf2Wunx9r8mWSohBn7di_MabyvkzVh_LzM8mI-jQTJh7buueFTXrdqqDpPsuu_Av-NvI5hhRuwpinq0iEwMWCGCR5GdgUqb-krtrSTzDJhWdxAHiD--YurDrNAJbe7kH0emprvYZ-a9U3CBBO1_jo9ABNk7DEThAK_myFw2RCcurjj1muXjphCaww"
                />
                <div>
                  <p className="font-body-md text-body-md italic text-on-surface">"Padosi helped me find a trusted nanny within hours. It feels like the old days when we actually knew our neighbors."</p>
                  <p className="font-label-sm text-label-sm text-primary mt-1">— Ananya S., Orchid Tower</p>
                </div>
              </div>
            </div>
          </section>
          <section className="w-1/2 relative bg-surface-container-low">
            <div className="absolute inset-0 z-0">
              <img 
                alt="Modern Indian urban neighborhood" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8sYvw9yfyeV94Jx5ThnatH8EAY2KQZzbIkKdKwx691ZspvtRbKWMMq8O6E_xTz90ghRbrbWsjq_F4lPNZ9T68nTPKMcnACkiuc-DDbwz6B1NbJQCZhJhGuHvoa-0p2QcQbAhJWUKgnhlDDKAHa4h99TlNL34bpUVOaGQaj7ruf1QhITQAn3NVkFrf1pAL0nqbOYCHDE-uAb9EzmZ9PJ-VET-XHqmX2w4MKmF8lBvpq1_j59VVYKBf_dTOri6N-Lncl5KmTgykQHo"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent"></div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-margin-mobile z-10 gap-stack-md pointer-events-none">
              <div className="glass-card w-full max-w-[340px] p-stack-md rounded-2xl shadow-xl animate-[float_4s_ease-in-out_infinite] pointer-events-auto bg-white/70 backdrop-blur-md border border-white/30">
                <div className="flex items-center gap-2 mb-stack-sm">
                  <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                    <span className="material-symbols-outlined text-[18px]">group</span>
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm leading-none">Security Alert</p>
                    <p className="text-[10px] text-on-surface-variant">2 mins ago • My Colony</p>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm mb-2 text-on-surface">Street lamp at Gate 3 is flickering. Reported to RWA!</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-surface-container-high rounded-full text-[10px] font-label-sm text-on-surface-variant">12 Thanks</span>
                  <span className="px-2 py-1 bg-surface-container-high rounded-full text-[10px] font-label-sm text-on-surface-variant">4 Replies</span>
                </div>
              </div>
              <div className="glass-card w-full max-w-[340px] p-stack-md rounded-2xl shadow-xl animate-[float_4s_ease-in-out_2s_infinite] ml-12 pointer-events-auto bg-white/70 backdrop-blur-md border border-white/30">
                <div className="flex items-center gap-2 mb-stack-sm">
                  <img 
                    alt="Post author" 
                    className="w-8 h-8 rounded-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiYbGHp6_1DYnS5duenj4EliP_e4AAUEHgR1_TGimJmkAoOXokmbtJAQDO7cX6rPisxLyio9nmurIsqijOBo5OEpAN9pFWoz3-R0JldyRUfPzFMZUOXQY46iseMAQGQ8xPElUgNsVA29VOWbIwn9wAtvatTr4EzjpQYWUPqP0YFNFyQdVCwIV4fN9iPMzplmzxiWa8aaXh4zj0LLahPeJLN2cujtBncIodV6nGokelMrn4OqdHwxTOxlNCAnGnXozU-8pBE83x75Y"
                  />
                  <div>
                    <p className="font-label-sm text-label-sm leading-none">Rajiv Malhotra</p>
                    <p className="text-[10px] text-on-surface-variant">1 hour ago • Recommendations</p>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface">Anyone have a contact for a reliable plumber? The one from last week didn't show up.</p>
                <div className="mt-3 p-2 bg-primary/5 rounded-lg border border-primary/10">
                  <p className="text-[11px] font-label-sm text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">lightbulb</span>
                    Anil's Repairs is highly rated nearby!
                  </p>
                </div>
              </div>
              <div className="glass-card w-full max-w-[340px] p-stack-md rounded-2xl shadow-xl animate-[float_4s_ease-in-out_infinite] -ml-8 pointer-events-auto bg-white/70 backdrop-blur-md border border-white/30">
                <div className="flex items-center gap-2 mb-stack-sm">
                  <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                    <span className="material-symbols-outlined text-[18px]">celebration</span>
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm leading-none">Community Event</p>
                    <p className="text-[10px] text-on-surface-variant">Tomorrow • Clubhouse</p>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface">Diwali potluck planning session at 6 PM. Bring ideas!</p>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-surface-container-lowest py-stack-xl px-margin-desktop border-t border-outline-variant/30">
          <div className="max-w-[1200px] mx-auto flex flex-row justify-between items-start gap-stack-xl">
            <div className="max-w-[300px]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>potted_plant</span>
                </div>
                <span className="font-headline-sm text-headline-sm text-primary tracking-tight">Padosi</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Creating safer, friendlier, and more connected neighborhoods across India. Join the movement.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-stack-xl">
              <div className="flex flex-col gap-2">
                <p className="font-label-md text-label-md text-on-surface font-bold">Company</p>
                <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary" href="#">About Us</a>
                <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary" href="#">Careers</a>
                <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary" href="#">Privacy</a>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-label-md text-label-md text-on-surface font-bold">Community</p>
                <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary" href="#">Guidelines</a>
                <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary" href="#">Safety</a>
                <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary" href="#">Support</a>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-label-md text-label-md text-on-surface font-bold">Legal</p>
                <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary" href="#">Terms</a>
                <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary" href="#">Cookie Policy</a>
              </div>
            </div>
          </div>
          <div className="max-w-[1200px] mx-auto mt-stack-xl pt-stack-md border-t border-outline-variant/20 flex flex-row justify-between items-center gap-stack-md">
            <p className="font-label-sm text-label-sm text-on-surface-variant">© 2024 Padosi Community Private Limited. All rights reserved.</p>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">social_leaderboard</span>
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">nest_eco_leaf</span>
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">alternate_email</span>
            </div>
          </div>
        </footer>
      </div>

      {/* ── MOBILE VIEW ── */}
      <div className="block md:hidden font-body-md text-on-surface bg-background min-h-screen">
        <main className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden">
          {/* Top: Hero Illustration Section */}
          <section className="relative w-full h-[397px] flex items-center justify-center pt-8 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[20%] right-[-5%] w-72 h-72 bg-secondary/5 rounded-full blur-3xl"></div>
            <div className="relative w-full max-w-4xl px-margin-mobile flex justify-center items-center">
              <img 
                alt="Modern Indian residential colony" 
                className="w-full max-h-full object-contain rounded-[40px] drop-shadow-2xl z-10 animate-[float_6s_ease-in-out_infinite]" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFaFvmgO8tZNtCKW8VfV3l1_454wY74St_1qNv5fWWJf6v1UHRNqTmquZLZXNUUZ9kAmt7MLY0EOXyanTfCbVByVXx-NSnXCle4d8B5FXInkPOGS-97qbQF05zJ7QOUJgT3z1l61M2NZKoQlTe4gz9tBieQUduKmPnKOJtEK9OTS0pL0DAapv6Uk-sAlH232vR588uhmch8gw32kuZb4qCnjfA3ppunKZwurf0TlrHaWDzqFqKRjeLy4kow6ShlJ-Hub_4dz9uLrA"
              />
              <div className="absolute top-10 left-10 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-sm z-20 flex items-center gap-3 animate-pulse">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Verified Society</span>
              </div>
              <div className="absolute bottom-10 right-10 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-sm z-20 flex items-center gap-3 animate-bounce">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Safety First</span>
              </div>
            </div>
          </section>

          {/* Middle: Headline & Content */}
          <section className="flex-1 flex flex-col items-center justify-center text-center px-margin-mobile z-20 max-w-lg w-full py-stack-lg">
            <div className="animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-stack-sm tracking-tight">
                Connect with your colony
              </h1>
              <p className="font-body-md text-body-md text-outline mb-stack-xl max-w-xs mx-auto">
                Only real verified neighbors, no strangers. Building trust in every street.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full mb-8 px-4 opacity-70">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">diversity_3</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Community</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">security</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Secure</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">location_city</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Local</span>
              </div>
            </div>
          </section>

          {/* Bottom: Action Section */}
          <section className="w-full max-w-md px-margin-mobile pb-12 flex flex-col items-center gap-6 z-30">
            <div className="w-full animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] [animation-delay:0.1s]">
              <button 
                onClick={handleJoin}
                className="w-full bg-primary-container text-white py-4 rounded-full font-label-md text-label-md shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group"
                id="mobile-get-started-btn"
              >
                Get Started
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
            <div className="animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] [animation-delay:0.2s]">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Already a member? 
                <button onClick={handleLogin} className="text-primary font-bold hover:underline ml-1 underline-offset-4" id="mobile-login-btn">Sign in</button>
              </p>
            </div>
          </section>
        </main>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </>
  );
}
