
import React, { useState } from 'react';
import { RideStatus, RidePreferences, Location } from '../../types';
import { 
  Phone, MessageSquare, ShieldCheck, Share2, AlertTriangle, 
  Wind, Music, MicOff, Star, Play, Pause, SkipForward, SkipBack, Bluetooth, Car
} from 'lucide-react';
import CarbonButton from '../ui/CarbonButton';

interface ActiveRideSheetProps {
  status: RideStatus;
  driverName?: string;
  carModel?: string;
  plate?: string;
  price: number;
  preferences: RidePreferences;
  onTogglePreference: (key: keyof RidePreferences) => void;
  onCancel: () => void;
  openChat: () => void;
}

const ActiveRideSheet: React.FC<ActiveRideSheetProps> = ({
  status,
  driverName,
  carModel,
  plate,
  price,
  preferences,
  onTogglePreference,
  onCancel,
  openChat
}) => {
  const [showSafety, setShowSafety] = useState(false);
  
  // Local Mock State for Music Player (In a real app, this would come from props/context)
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const PLAYLIST = [
      { title: 'Vibe de Luanda', artist: 'Afro House Mix', cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=150&auto=format&fit=crop' },
      { title: 'Kizomba Suave', artist: 'Clássicos AO', cover: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=150&auto=format&fit=crop' },
  ];
  
  const currentTrack = PLAYLIST[trackIndex % PLAYLIST.length];

  // Derive status text
  const isArriving = status === RideStatus.MATCHED;
  const statusTitle = isArriving ? 'Motorista a chegar' : 'Em viagem';
  const statusTime = isArriving ? '2 min' : '15 min';

  const handleMusicToggle = () => {
      onTogglePreference('music');
      if (!preferences.music) {
          setIsPlaying(true); // Auto play on connect
      } else {
          setIsPlaying(false);
      }
  }

  const handleNextTrack = () => {
      setTrackIndex(prev => prev + 1);
  }

  return (
    <div className="flex flex-col h-full">
      
      {/* Header Info */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isArriving ? 'bg-green-400' : 'bg-violet-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isArriving ? 'bg-green-500' : 'bg-violet-500'}`}></span>
            </span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{statusTitle}</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">{statusTime}</h2>
        </div>
        <div className="bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
           <span className="text-sm font-bold text-gray-900">{price.toLocaleString('pt-AO')} Kz</span>
        </div>
      </div>

      {/* Enhanced Driver & Vehicle Card */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 mb-6 shadow-sm">
         <div className="flex items-start justify-between mb-3">
             <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl border-2 border-gray-100 shadow-sm">
                        👨🏾
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full px-1.5 py-0.5 shadow-sm border border-gray-100 flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                        <span className="text-[10px] font-bold">4.9</span>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 leading-tight">{driverName}</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Motorista Expert</p>
                </div>
             </div>
             
             {/* License Plate - Highly Visible */}
             <div className="flex flex-col items-end">
                 <div className="bg-yellow-400 text-black px-2 py-1 rounded border-2 border-black/10 font-mono font-bold text-sm shadow-sm mb-1 tracking-wider">
                     {plate}
                 </div>
                 <div className="text-[10px] font-bold text-gray-400 uppercase">Matrícula</div>
             </div>
         </div>

         <div className="flex items-center justify-between pt-3 border-t border-gray-200/60">
             <div className="flex items-center gap-2">
                 <div className="p-1.5 bg-white rounded-lg shadow-sm">
                     <Car className="w-4 h-4 text-gray-700" />
                 </div>
                 <span className="text-sm font-bold text-gray-700">{carModel} <span className="text-gray-400 font-normal">• Vermelho</span></span>
             </div>
             
             <div className="flex gap-2">
                <button onClick={openChat} className="p-2 bg-violet-100 text-violet-600 rounded-xl hover:bg-violet-200 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                </button>
                <button className="p-2 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 transition-colors">
                    <Phone className="w-4 h-4" />
                </button>
            </div>
         </div>
      </div>

      {/* Mbora DJ / Vibe Controls */}
      <div className="mb-6">
         <div className="flex items-center justify-between mb-2">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mbora DJ - Controla o Som</h4>
            {preferences.music && (
                <div className="flex items-center gap-1 text-[10px] text-violet-500 font-bold animate-pulse">
                    <Bluetooth className="w-3 h-3" /> Conectado
                </div>
            )}
         </div>

         {/* If Music Mode is ON, Show Player */}
         {preferences.music ? (
            <div className="bg-gray-900 rounded-2xl p-4 text-white shadow-xl shadow-violet-900/20 relative overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Background Blur */}
                <div className="absolute inset-0 bg-violet-600 opacity-20 blur-xl"></div>
                
                <div className="relative z-10 flex items-center gap-3">
                    <img src={currentTrack.cover} alt="Cover" className={`w-12 h-12 rounded-lg object-cover ${isPlaying ? 'animate-spin-slow' : ''}`} />
                    <div className="flex-1 overflow-hidden">
                        <p className="font-bold text-sm truncate">{currentTrack.title}</p>
                        <p className="text-xs text-gray-400 truncate">{currentTrack.artist}</p>
                    </div>
                    
                    {/* Controls */}
                    <div className="flex items-center gap-2">
                        <button onClick={() => setTrackIndex(prev => prev - 1)} className="p-1 hover:text-violet-300 transition-colors"><SkipBack className="w-5 h-5" /></button>
                        <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                        >
                            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                        </button>
                        <button onClick={handleNextTrack} className="p-1 hover:text-violet-300 transition-colors"><SkipForward className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* Progress Bar Mock */}
                <div className="mt-3 h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 w-1/3 animate-pulse"></div>
                </div>
                
                {/* Close DJ Mode */}
                <button onClick={handleMusicToggle} className="absolute top-1 right-1 p-2 text-gray-500 hover:text-white">
                    <div className="w-1 h-1 rounded-full bg-current"></div>
                </button>
            </div>
         ) : (
             /* Regular Controls Grid */
             <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => onTogglePreference('ac')}
                  className={`flex flex-col items-center justify-center gap-1 py-3 rounded-2xl border transition-all duration-200 ${preferences.ac ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                >
                   <Wind className="w-5 h-5" />
                   <span className="text-[10px] font-bold">Fresco</span>
                </button>
                
                <button 
                  onClick={handleMusicToggle}
                  className={`flex flex-col items-center justify-center gap-1 py-3 rounded-2xl border transition-all duration-200 bg-white border-gray-100 text-gray-400 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 group`}
                >
                   <Music className="w-5 h-5 group-hover:scale-110 transition-transform" />
                   <span className="text-[10px] font-bold">Mbora DJ</span>
                </button>

                <button 
                  onClick={() => onTogglePreference('quiet')}
                  className={`flex flex-col items-center justify-center gap-1 py-3 rounded-2xl border transition-all duration-200 ${preferences.quiet ? 'bg-violet-50 border-violet-200 text-violet-700' : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                >
                   <MicOff className="w-5 h-5" />
                   <span className="text-[10px] font-bold">Shhh!</span>
                </button>
             </div>
         )}
      </div>

      {/* Safety & Actions */}
      <div className="grid grid-cols-2 gap-3 mt-auto">
         <div className="relative">
            <CarbonButton 
               variant="secondary" 
               fullWidth
               className={`h-full ${showSafety ? 'bg-red-50 text-red-600' : ''}`}
               onClick={() => setShowSafety(!showSafety)}
               icon={ShieldCheck}
            >
               Segurança
            </CarbonButton>

            {showSafety && (
               <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-2 z-50 p-1">
                  <button className="w-full text-left px-4 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl flex items-center mb-1">
                     <Share2 className="w-4 h-4 mr-3 text-violet-600" /> Partilhar Rota
                  </button>
                  <button className="w-full text-left px-4 py-3 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl flex items-center shadow-red-200 shadow-md">
                     <AlertTriangle className="w-4 h-4 mr-3" /> SOS Polícia
                  </button>
               </div>
            )}
         </div>

         <CarbonButton 
           variant="ghost" 
           fullWidth
           onClick={onCancel}
           className="h-full text-red-500 hover:bg-red-50 hover:text-red-600"
         >
           Cancelar
         </CarbonButton>
      </div>
    </div>
  );
};

export default ActiveRideSheet;
