import React, { useState } from 'react';
import { RideStatus, RideOption, Location, RidePreferences } from '../types';
import { MapPin, Home, Briefcase, Star } from 'lucide-react';
import RideSelector from './rides/RideSelector';
import ActiveRideSheet from './rides/ActiveRideSheet';

interface RidePanelProps {
  status: RideStatus;
  destination: Location | null;
  selectedOption: string;
  options: RideOption[];
  priceEstimate: number;
  onSelectOption: (id: string) => void;
  onRequestRide: () => void;
  onCancelRide: () => void;
  onSetDestinationMode: () => void;
  onSelectShortcut: (type: 'HOME' | 'WORK') => void;
  aiTip?: string;
  driverName?: string;
  carModel?: string;
  plate?: string;
  openChat: () => void;
  preferences: RidePreferences;
  onTogglePreference: (key: keyof RidePreferences) => void;
}

const RidePanel: React.FC<RidePanelProps> = ({
  status,
  destination,
  selectedOption,
  options,
  priceEstimate,
  onSelectOption,
  onRequestRide,
  onCancelRide,
  onSetDestinationMode,
  onSelectShortcut,
  aiTip,
  driverName,
  carModel,
  plate,
  openChat,
  preferences,
  onTogglePreference
}) => {
  
  // 1. Searching/Connecting State
  if (status === RideStatus.REQUESTING) {
    return (
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl rounded-t-[2.5rem] shadow-2xl p-8 z-20 pb-12">
        <div className="flex flex-col items-center">
           <div className="relative mb-6 w-24 h-24">
              <div className="absolute inset-0 bg-violet-500 rounded-full opacity-20 animate-ping"></div>
              <div className="absolute inset-4 bg-white rounded-full z-10 flex items-center justify-center shadow-sm">
                   <img src={options.find(o => o.id === selectedOption)?.image} className="w-12 h-10 object-contain" />
              </div>
              <div className="absolute inset-0 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
           </div>
           <h3 className="text-xl font-bold mb-1 text-gray-900">A processar...</h3>
           <p className="text-gray-500 text-sm font-medium mb-8">Estamos a chamar um Mbora para ti.</p>
           <button onClick={onCancelRide} className="text-red-500 font-bold text-sm bg-red-50 px-6 py-3 rounded-full hover:bg-red-100 transition-colors">
             Cancelar pedido
           </button>
        </div>
      </div>
    );
  }

  // 2. Active Trip State (Matched or In Progress)
  if (status === RideStatus.MATCHED || status === RideStatus.IN_PROGRESS) {
    const selectedRideOption = options.find(o => o.id === selectedOption);
    const finalPrice = selectedRideOption ? Math.round(priceEstimate * selectedRideOption.priceMultiplier) : 0;

    return (
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md rounded-t-[2.5rem] shadow-[0_-10px_60px_rgba(0,0,0,0.15)] z-20 transition-all duration-300">
         {/* Handle */}
         <div className="w-full pt-3 pb-2 flex justify-center cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
         </div>
         <div className="px-6 pb-8">
            <ActiveRideSheet 
              status={status}
              driverName={driverName}
              carModel={carModel}
              plate={plate}
              price={finalPrice}
              preferences={preferences}
              onTogglePreference={onTogglePreference}
              onCancel={onCancelRide}
              openChat={openChat}
            />
         </div>
      </div>
    );
  }

  // 3. Selection / Idle State
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md rounded-t-[2.5rem] shadow-[0_-10px_50px_rgba(0,0,0,0.1)] z-20 transition-all duration-500 ease-out">
      
      {/* Handle */}
      <div className="w-full pt-3 pb-2 flex justify-center">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
      </div>
      
      <div className="px-6 pb-8">
        {/* Destination Input - Carbon Style */}
        <div 
          onClick={onSetDestinationMode}
          className="flex items-center p-4 bg-gray-50 border border-gray-100 rounded-3xl mb-6 cursor-pointer hover:bg-gray-100 transition-all active:scale-[0.99]"
        >
          <div className="bg-gray-900 text-white p-3 rounded-2xl mr-4 shadow-md">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className={`font-bold text-lg leading-tight ${destination ? 'text-gray-900' : 'text-gray-400'}`}>
              {destination ? "Destino Definido" : "Para onde vamos?"}
            </p>
            {destination && <p className="text-xs text-gray-500 font-medium truncate mt-0.5">Toque para alterar</p>}
          </div>
        </div>

        {/* Shortcuts (Only visible if no destination) */}
        {!destination && (
          <div className="grid grid-cols-2 gap-3 mb-4 animate-in fade-in slide-in-from-bottom-4">
            <button 
                onClick={() => onSelectShortcut('HOME')}
                className="flex items-center gap-3 p-4 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-violet-100 transition-all text-left group"
            >
                <div className="bg-violet-50 p-2.5 rounded-full group-hover:bg-violet-100 transition-colors"><Home className="w-5 h-5 text-violet-600" /></div>
                <div>
                  <p className="font-bold text-sm text-gray-800">Casa</p>
                </div>
            </button>
            <button 
                onClick={() => onSelectShortcut('WORK')}
                className="flex items-center gap-3 p-4 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-violet-100 transition-all text-left group"
            >
                <div className="bg-violet-50 p-2.5 rounded-full group-hover:bg-violet-100 transition-colors"><Briefcase className="w-5 h-5 text-violet-600" /></div>
                <div>
                  <p className="font-bold text-sm text-gray-800">Trabalho</p>
                </div>
            </button>
          </div>
        )}

        {/* Ride Selector (Visible when destination set) */}
        {destination && (
          <>
            <RideSelector 
              options={options}
              selectedOption={selectedOption}
              priceEstimate={priceEstimate}
              preferences={preferences}
              onSelectOption={onSelectOption}
              onTogglePreference={onTogglePreference}
              onRequestRide={onRequestRide}
            />

            {aiTip && (
              <div className="mt-6 p-4 bg-yellow-50/50 border border-yellow-100 rounded-2xl flex gap-3 animate-in fade-in">
                <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <p className="text-xs text-yellow-800 font-medium leading-relaxed">
                  <span className="font-bold block mb-1">Dica Mbora:</span>
                  {aiTip}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RidePanel;