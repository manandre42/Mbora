
import React from 'react';
import { RideOption, RidePreferences } from '../../types';
import { Navigation, UserPlus, Wind, Music, MicOff } from 'lucide-react';
import CarbonButton from '../ui/CarbonButton';

interface RideSelectorProps {
  options: RideOption[];
  selectedOption: string;
  priceEstimate: number;
  preferences: RidePreferences;
  onSelectOption: (id: string) => void;
  onTogglePreference: (key: keyof RidePreferences) => void;
  onRequestRide: () => void;
}

const RideSelector: React.FC<RideSelectorProps> = ({
  options,
  selectedOption,
  priceEstimate,
  preferences,
  onSelectOption,
  onTogglePreference,
  onRequestRide
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
      
      {/* Vehicle Carousel */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-4 pt-2 -mx-5 px-5 snap-x scrollbar-hide">
        {options.map((opt) => {
          const currentPrice = Math.round(priceEstimate * opt.priceMultiplier);
          const isSelected = selectedOption === opt.id;
          
          return (
            <div 
              key={opt.id}
              onClick={() => onSelectOption(opt.id)}
              className={`
                snap-center relative flex flex-col items-center justify-between
                min-w-[140px] p-4 rounded-3xl cursor-pointer transition-all duration-300
                ${isSelected 
                  ? 'bg-violet-50 ring-2 ring-violet-500 shadow-xl shadow-violet-100/50 scale-100' 
                  : 'bg-white border border-gray-100 hover:bg-gray-50 shadow-sm opacity-80 hover:opacity-100 scale-95'
                }
              `}
            >
              {/* ETA Tag */}
              <div className={`
                absolute top-3 right-3 text-[10px] font-black px-2 py-1 rounded-full
                ${isSelected ? 'bg-violet-200 text-violet-800' : 'bg-gray-100 text-gray-500'}
              `}>
                {opt.eta} min
              </div>

              {/* 3D Image */}
              <div className="relative w-28 h-20 mb-2 flex items-center justify-center">
                <img 
                  src={opt.image} 
                  alt={opt.name} 
                  className={`
                    w-full h-full object-contain drop-shadow-md transition-transform duration-500
                    ${isSelected ? 'scale-110 -rotate-3' : 'scale-100'}
                  `} 
                />
              </div>

              {/* Info */}
              <div className="text-center w-full">
                <span className={`block font-bold text-sm mb-1 ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                  {opt.name}
                </span>
                <span className="block text-[10px] text-gray-400 font-medium mb-2 leading-tight">
                  {opt.description}
                </span>
                <div className="text-lg font-black text-gray-900">
                  {currentPrice.toLocaleString('pt-AO')} Kz
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Initial Vibe Check (Optional pre-selection) */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
         <button 
           onClick={() => onTogglePreference('ac')}
           className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all ${preferences.ac ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-500'}`}
         >
           <Wind className="w-3 h-3" /> Ar condicionado
         </button>
         <button 
           onClick={() => onTogglePreference('quiet')}
           className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all ${preferences.quiet ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white border-gray-200 text-gray-500'}`}
         >
           <MicOff className="w-3 h-3" /> Silêncio
         </button>
      </div>

      {/* Main Action */}
      <div className="space-y-3">
        <CarbonButton 
          variant="primary" 
          fullWidth 
          onClick={onRequestRide}
          icon={Navigation}
          className="text-lg py-5 shadow-violet-500/20"
        >
          BAZA AGORA
        </CarbonButton>

        <CarbonButton variant="ghost" fullWidth className="text-xs h-auto py-2">
           <UserPlus className="w-3 h-3 mr-1" /> Pedir para outra pessoa
        </CarbonButton>
      </div>
    </div>
  );
};

export default RideSelector;
