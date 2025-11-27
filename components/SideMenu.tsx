import React from 'react';
import { X, User, Clock, CreditCard, Settings, HelpCircle, Car, ChevronRight, LogOut, Gift } from 'lucide-react';
import { ViewName } from '../types';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewName) => void;
  userRating: number;
  userName: string;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, onNavigate, userRating, userName }) => {
  const menuItems = [
    { icon: Clock, label: 'As minhas viagens', view: 'HISTORY' as ViewName },
    { icon: CreditCard, label: 'Pagamento', view: 'WALLET' as ViewName },
    { icon: Gift, label: 'Convida amigos', view: 'HOME' as ViewName, action: () => alert("Partilha o código MBORA24 para ganhares kwanzas!") },
    { icon: Settings, label: 'Definições', view: 'SETTINGS' as ViewName },
    { icon: HelpCircle, label: 'Suporte Mbora', view: 'SUPPORT' as ViewName },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white z-50 transform transition-transform duration-300 shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header - Professional Dark Theme */}
        <div className="bg-gray-900 text-white p-6 pt-12 relative overflow-hidden">
           {/* Abstract Carbon shapes */}
           <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-bl-[100px]"></div>
           <div className="absolute right-4 top-4 opacity-20">
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
             </svg>
           </div>

          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="w-16 h-16 bg-white p-0.5 rounded-full shadow-lg">
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-white">
                   <User className="w-8 h-8 text-gray-400" />
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          
          <div className="relative z-10">
              <h2 className="text-2xl font-black tracking-tight">{userName}</h2>
              <div className="flex items-center gap-3 mt-2">
                <div className="bg-white/10 backdrop-blur px-2 py-1 rounded text-xs font-bold text-yellow-400 flex items-center gap-1 border border-white/5">
                    ★ {userRating.toFixed(1)}
                </div>
                <span className="text-gray-400 text-xs uppercase tracking-wide font-bold">Membro VIP</span>
              </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-2">
           {menuItems.map((item, idx) => (
             <button 
                key={idx}
                onClick={() => {
                   if (item.action) item.action();
                   else onNavigate(item.view);
                   onClose();
                }}
                className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group"
             >
                <div className="bg-gray-100 group-hover:bg-gray-200 p-2 rounded-lg mr-4 transition-colors">
                    <item.icon className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
                </div>
                <span className="text-gray-700 font-bold flex-1 text-left group-hover:text-gray-900">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
             </button>
           ))}

           {/* Call to Action for Drivers */}
           <div className="mt-4 p-4">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-2xl shadow-lg text-white relative overflow-hidden group">
                 <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-white opacity-5 rounded-full group-hover:opacity-10 transition-opacity"></div>
                 <h3 className="font-bold text-lg mb-1 flex items-center gap-2 relative z-10">
                    <Car className="w-5 h-5 text-violet-400" />
                    Mbora Drive
                 </h3>
                 <p className="text-xs text-gray-300 mb-3 relative z-10">Faz kwanzas extra com o teu carro. Tu controlas o teu tempo.</p>
                 <button className="w-full py-2.5 bg-white text-gray-900 rounded-lg text-sm font-black shadow-sm relative z-10 hover:bg-gray-50 transition-colors">
                    Ser Motorista
                 </button>
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
           <button className="flex items-center justify-center text-gray-500 text-sm font-bold w-full p-3 hover:bg-gray-200 rounded-xl transition-colors">
              <LogOut className="w-4 h-4 mr-2" />
              Sair da conta
           </button>
           <p className="text-center text-[10px] text-gray-300 mt-4 font-mono">Mbora App v6.0 • Feito em Angola</p>
        </div>
      </div>
    </>
  );
};

export default SideMenu;