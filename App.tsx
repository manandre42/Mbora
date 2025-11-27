
import React, { useState, useEffect } from 'react';
import ClientApp from './modules/client/ClientApp';
import DriverApp from './modules/driver/DriverApp';
import AdminApp from './modules/admin/AdminApp';
import { Car, User, ArrowRight, LayoutDashboard } from 'lucide-react';

type AppMode = 'LANDING' | 'CLIENT' | 'DRIVER' | 'ADMIN';

// New Custom 'M' Logo for Mbora based on user feedback
const MboraLogo = ({ className = "w-24 h-24" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="28" fill="url(#logo_gradient)" />
    {/* Stylized M */}
    <path 
      d="M28 72 V 38 L 50 58 L 72 38 V 72" 
      stroke="white" 
      strokeWidth="10" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="drop-shadow-md"
    />
    {/* Accent dot/dash */}
    <circle cx="50" cy="25" r="4" fill="white" className="animate-pulse" />
    
    <defs>
      <linearGradient id="logo_gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8b5cf6" />
        <stop offset="1" stopColor="#5b21b6" />
      </linearGradient>
    </defs>
  </svg>
);

// Splash Screen Component
const SplashScreen = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#18181b] overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
    <div className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] bg-violet-600/30 rounded-full blur-[100px] animate-pulse"></div>
    
    <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-1000">
      <div className="mb-6 relative">
         <div className="absolute inset-0 bg-violet-500 blur-2xl opacity-40 rounded-full"></div>
         <MboraLogo className="w-32 h-32 relative z-10 shadow-2xl" />
      </div>
      <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Mbora<span className="text-violet-500">.</span></h1>
      <p className="text-gray-400 font-medium tracking-widest text-xs uppercase">Angola em movimento</p>
    </div>
    
    <div className="absolute bottom-10 w-full flex justify-center">
       <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('LANDING');
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Splash screen timer
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (mode === 'CLIENT') {
    return <ClientApp onBackToHome={() => setMode('LANDING')} />;
  }

  if (mode === 'DRIVER') {
    return <DriverApp onBackToHome={() => setMode('LANDING')} />;
  }

  if (mode === 'ADMIN') {
    return <AdminApp onBackToHome={() => setMode('LANDING')} />;
  }

  return (
    <div className="min-h-screen bg-[#1e1b4b] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-white">
        
        {/* Background Effects matching screenshot vibe */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2e1065] via-[#1e1b4b] to-[#0f172a]"></div>
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>

        {/* Large glow behind logo area */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10 w-full max-w-sm flex flex-col items-center animate-in fade-in slide-in-from-bottom-10 duration-700">
            
            {/* Logo Section */}
            <div className="mb-12 text-center flex flex-col items-center">
                <div className="mb-6 transform hover:scale-105 transition-transform duration-500 cursor-pointer">
                    <div className="absolute inset-4 bg-violet-500 blur-xl opacity-40 rounded-full"></div>
                    <MboraLogo className="w-28 h-28 relative z-10 drop-shadow-2xl" />
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter mb-2 drop-shadow-md">
                  Mbora<span className="text-violet-400">.</span>
                </h1>
                <p className="text-violet-200/80 text-sm font-medium tracking-wide uppercase">Angola em movimento.</p>
            </div>

            {/* Selection Cards */}
            <div className="w-full space-y-5">
                
                {/* Passenger Card - White Glass Style */}
                <button 
                    onClick={() => setMode('CLIENT')}
                    className="w-full relative group shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-all duration-300"
                >
                    <div className="absolute inset-0 bg-white rounded-[2rem]"></div>
                    <div className="relative bg-white/90 backdrop-blur-xl p-1 rounded-[2rem] border border-white/50">
                        <div className="flex items-center justify-between p-5">
                           <div className="flex items-center gap-4">
                               <div className="bg-violet-100 p-3.5 rounded-2xl text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
                                   <User className="w-6 h-6" />
                                </div>
                               <div className="text-left">
                                   <h3 className="font-bold text-xl text-gray-900">Passageiro</h3>
                                   <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">Pedir uma boleia</p>
                               </div>
                           </div>
                           <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-violet-500 transition-colors">
                               <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-violet-600" />
                           </div>
                        </div>
                    </div>
                </button>

                {/* Driver Card - Dark Style */}
                <button 
                    onClick={() => setMode('DRIVER')}
                    className="w-full relative group shadow-lg hover:scale-[1.02] transition-all duration-300"
                >
                     <div className="bg-[#0f172a]/80 backdrop-blur-md p-1 rounded-[2rem] border border-white/5 group-hover:border-white/20">
                        <div className="flex items-center justify-between p-5">
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-800 p-3.5 rounded-2xl text-gray-400 group-hover:text-white transition-colors duration-300">
                                    <Car className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-xl text-white">Motorista</h3>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">Ganhar kwanzas</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
                                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
                            </div>
                        </div>
                     </div>
                </button>

                 {/* Admin Card (Subtle Footer Link) */}
                 <button 
                    onClick={() => setMode('ADMIN')}
                    className="mt-8 flex items-center justify-center gap-2 px-6 py-2 rounded-full text-white/30 hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest"
                >
                     <LayoutDashboard className="w-3 h-3" />
                     Administração
                </button>
            </div>
            
            <div className="mt-12 text-center">
                 <div className="h-1 w-12 bg-white/10 rounded-full mx-auto mb-4"></div>
                 <p className="text-white/20 text-[10px] font-mono">v5.0 Alpha • Luanda, AO</p>
            </div>
        </div>
    </div>
  );
};

export default App;
