import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import MapBackground from '../../components/MapBackground';
import RidePanel from '../../components/RidePanel';
import SupportChat from '../../components/SupportChat';
import SideMenu from '../../components/SideMenu';
import HistoryView from '../../components/HistoryView';
import WalletView from '../../components/WalletView';
import { RideStatus, Location, RideOption, LUANDA_CENTER, ViewName, RidePreferences, Notification, MusicTrack } from '../../types';
import { analyzeRideRequest } from '../../services/geminiService';

// Updated with distinct 3D assets for Moto, Mini, VIP
const RIDE_OPTIONS: RideOption[] = [
  { 
    id: 'moto', 
    name: 'Mbora Moto', 
    priceMultiplier: 0.6, 
    eta: 2, 
    // 3D Scooter
    image: 'https://cdn-icons-png.flaticon.com/512/9423/9423778.png',
    description: 'Finta o trânsito'
  },
  { 
    id: 'economy', 
    name: 'Mbora Mini', 
    priceMultiplier: 1.0, 
    eta: 4, 
    // Red Hatchback (Compact)
    image: 'https://cdn-icons-png.flaticon.com/512/5385/5385966.png',
    description: 'Econômico e ágil'
  },
  { 
    id: 'comfort', 
    name: 'Mbora VIP', 
    priceMultiplier: 1.5, 
    eta: 6, 
    // Luxury Black SUV/Sedan
    image: 'https://cdn-icons-png.flaticon.com/512/3085/3085330.png',
    description: 'Luxo e conforto'
  },
];

const MOCK_PLAYLIST: MusicTrack[] = [
  { id: '1', title: 'Vibe de Luanda', artist: 'Afro House Mix', genre: 'Afro House', coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=150&auto=format&fit=crop' },
  { id: '2', title: 'Kizomba Suave', artist: 'Clássicos AO', genre: 'Kizomba', coverUrl: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=150&auto=format&fit=crop' },
  { id: '3', title: 'Semba no Pé', artist: 'Kota Mbora', genre: 'Semba', coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?q=80&w=150&auto=format&fit=crop' },
];

const isValidLocation = (loc: Location | null): boolean => {
  return !!loc && typeof loc.lat === 'number' && !isNaN(loc.lat) && isFinite(loc.lat) && typeof loc.lng === 'number' && !isNaN(loc.lng) && isFinite(loc.lng);
};

const calculateDistance = (loc1: Location, loc2: Location) => {
  if (!isValidLocation(loc1) || !isValidLocation(loc2)) return 0;
  
  const R = 6371; 
  const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
  const dLng = (loc2.lng - loc1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

interface ClientAppProps {
  onBackToHome: () => void;
}

const ClientApp: React.FC<ClientAppProps> = ({ onBackToHome }) => {
  // State
  const [status, setStatus] = useState<RideStatus>(RideStatus.IDLE);
  const [userLocation, setUserLocation] = useState<Location>(LUANDA_CENTER);
  const [destination, setDestination] = useState<Location | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('economy');
  const [driverLocation, setDriverLocation] = useState<Location | null>(null);
  const [priceEstimate, setPriceEstimate] = useState<number>(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [currentView, setCurrentView] = useState<ViewName>('HOME');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const [aiTip, setAiTip] = useState<string>("");
  const [preferences, setPreferences] = useState<RidePreferences>({
    quiet: false,
    ac: false,
    music: false
  });

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const addNotification = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!isNaN(position.coords.latitude) && !isNaN(position.coords.longitude)) {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              address: "Minha Localização"
            });
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Don't set userLocation to bad values on error, keep default
        }
      );
    }
  }, []);

  useEffect(() => {
    if (destination && isValidLocation(userLocation) && isValidLocation(destination)) {
      const dist = calculateDistance(userLocation, destination);
      const basePrice = 500 + (Math.round(dist * 200)); 
      setPriceEstimate(isNaN(basePrice) ? 500 : basePrice);
      
      if (status === RideStatus.CHOOSING_DESTINATION) {
         const fetchTip = async () => {
           const tip = await analyzeRideRequest("local atual", "destino selecionado");
           setAiTip(tip);
         };
         fetchTip();
      }
    }
  }, [destination, userLocation, status]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;

    if (status === RideStatus.REQUESTING) {
      timeout = setTimeout(() => {
        if (!isValidLocation(userLocation)) return;
        
        setStatus(RideStatus.MATCHED);
        addNotification("Mbora a caminho! Tio Mateus aceitou o pedido.", "success");
        setDriverLocation({
          lat: userLocation.lat + 0.003,
          lng: userLocation.lng + 0.003
        });
      }, 3000);

    } else if (status === RideStatus.MATCHED) {
      interval = setInterval(() => {
        setDriverLocation(prev => {
          if (!prev) return null;
          if (!isValidLocation(userLocation)) return prev;

          const dLat = userLocation.lat - prev.lat;
          const dLng = userLocation.lng - prev.lng;
          
          if (Math.abs(dLat) < 0.0002 && Math.abs(dLng) < 0.0002) {
            clearInterval(interval);
            setStatus(RideStatus.IN_PROGRESS);
            addNotification("O teu Mbora chegou! Podes entrar.", "info");
            return userLocation;
          }
          
          const newLat = prev.lat + dLat * 0.1;
          const newLng = prev.lng + dLng * 0.1;

          if (isNaN(newLat) || isNaN(newLng)) return prev;

          return {
            lat: newLat,
            lng: newLng
          };
        });
      }, 1000);

    } else if (status === RideStatus.IN_PROGRESS) {
       if (isValidLocation(destination)) {
         interval = setInterval(() => {
          setDriverLocation(prev => {
            if (!prev) return null;
            if (!isValidLocation(destination)) return prev;

            // @ts-ignore
            const dLat = destination.lat - prev.lat;
            // @ts-ignore
            const dLng = destination.lng - prev.lng;
            
            if (Math.abs(dLat) < 0.0002 && Math.abs(dLng) < 0.0002) {
              clearInterval(interval);
              setStatus(RideStatus.COMPLETED);
              addNotification("Chegaste ao destino!", "success");
              setTimeout(() => {
                  setStatus(RideStatus.IDLE);
                  setDestination(null);
                  setDriverLocation(null);
                  setPreferences({ quiet: false, ac: false, music: false });
                  setIsPlaying(false);
                  alert("Viagem finalizada! Obrigado por viajares com a Mbora.");
              }, 2000);
              return destination;
            }
            
            const newLat = prev.lat + dLat * 0.05;
            const newLng = prev.lng + dLng * 0.05;
            
            if (isNaN(newLat) || isNaN(newLng)) return prev;

            return {
              lat: newLat,
              lng: newLng
            };
          });
        }, 1000);
      }
    }

    return () => {
      if (timeout) clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [status, userLocation, destination]);

  const handleMapClick = (loc: Location) => {
    if (isValidLocation(loc) && (status === RideStatus.IDLE || status === RideStatus.CHOOSING_DESTINATION)) {
      setDestination(loc);
      if (status === RideStatus.IDLE) setStatus(RideStatus.CHOOSING_DESTINATION);
    }
  };

  const handleRequestRide = () => {
    if (isValidLocation(userLocation) && isValidLocation(destination)) {
      setStatus(RideStatus.REQUESTING);
    } else {
      addNotification("Localização inválida. Tente novamente.", "warning");
    }
  };

  const handleCancelRide = () => {
    setStatus(RideStatus.IDLE);
    setDestination(null);
    setDriverLocation(null);
    setIsPlaying(false);
    addNotification("Viagem cancelada.", "warning");
  };

  const handleSetDestinationMode = () => {
      setStatus(RideStatus.CHOOSING_DESTINATION);
  }

  const handleShortcut = (type: 'HOME' | 'WORK') => {
      if (!isValidLocation(userLocation)) return;
      
      let latOffset = type === 'HOME' ? 0.01 : -0.01;
      let lngOffset = type === 'HOME' ? 0.01 : -0.005;

      const newDest = {
          lat: userLocation.lat + latOffset,
          lng: userLocation.lng + lngOffset,
          address: type === 'HOME' ? 'Casa' : 'Trabalho'
      };
      
      setDestination(newDest);
      setStatus(RideStatus.CHOOSING_DESTINATION);
  }

  const handleNavigate = (view: ViewName) => {
      if (view === 'SUPPORT') {
          setIsChatOpen(true);
      } else {
          setCurrentView(view);
      }
  };

  const togglePreference = (key: keyof RidePreferences) => {
      if (key === 'music') {
          const newState = !preferences.music;
          setPreferences(prev => ({ ...prev, music: newState }));
          
          if (newState) {
              addNotification("Mbora DJ: A conectar ao carro...", "info");
              setTimeout(() => {
                  setIsPlaying(true);
                  addNotification("Conectado! Tu controlas o som.", "success");
              }, 1500);
          } else {
              setIsPlaying(false);
          }
      } else {
          setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
          if (status === RideStatus.IN_PROGRESS) {
             const text = key === 'quiet' ? "Modo silêncio atualizado." : "Ar condicionado solicitado.";
             addNotification(text, "info");
          }
      }
  }

  return (
    <div className="relative w-full h-full bg-gray-100 flex flex-col overflow-hidden font-sans">
      
      {/* Toast Notifications */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
        {notifications.map(n => (
            <div key={n.id} className={`p-3 rounded-2xl shadow-xl backdrop-blur-md text-sm font-bold animate-in fade-in slide-in-from-top-2 flex items-center justify-center pointer-events-auto border-white/10 border ${n.type === 'success' ? 'bg-green-500/90 text-white' : n.type === 'warning' ? 'bg-amber-500/90 text-white' : 'bg-gray-800/90 text-white'}`}>
                {n.message}
            </div>
        ))}
      </div>

      {/* --- Main Home View --- */}
      <div className={`absolute inset-0 flex flex-col transition-transform duration-300 ${currentView === 'HOME' ? 'scale-100' : 'scale-95 opacity-50'}`}>
          
          {/* Menu Button */}
          <div className="absolute top-4 left-4 z-20">
            <button onClick={() => setIsMenuOpen(true)} className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors active:scale-95">
              <Menu className="w-6 h-6 text-gray-900" />
            </button>
          </div>

          {/* Exit Client Mode (Dev Only) */}
          <div className="absolute top-4 right-4 z-20 flex gap-2">
             <button onClick={onBackToHome} className="bg-black/80 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur shadow-lg">
                Sair
             </button>
          </div>

          {/* Map Layer */}
          <MapBackground 
            userLocation={userLocation}
            destination={destination}
            driverLocation={driverLocation}
            status={status}
            onMapClick={handleMapClick}
          />

          {/* Ride UI Panel */}
          <RidePanel 
            status={status}
            destination={destination}
            selectedOption={selectedOption}
            options={RIDE_OPTIONS}
            priceEstimate={priceEstimate}
            onSelectOption={setSelectedOption}
            onRequestRide={handleRequestRide}
            onCancelRide={handleCancelRide}
            onSetDestinationMode={handleSetDestinationMode}
            onSelectShortcut={handleShortcut}
            aiTip={aiTip}
            driverName="Tio Mateus"
            carModel="Hyundai i10"
            plate="LD-88-22-HG"
            openChat={() => setIsChatOpen(true)}
            preferences={preferences}
            onTogglePreference={togglePreference}
          />
      </div>

      <SideMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onNavigate={handleNavigate}
        userName="Mauro Silva"
        userRating={4.9}
      />

      {currentView === 'HISTORY' && (
          <HistoryView onBack={() => setCurrentView('HOME')} />
      )}

      {currentView === 'WALLET' && (
          <WalletView onBack={() => setCurrentView('HOME')} />
      )}

      {currentView === 'SETTINGS' && (
          <div className="absolute inset-0 bg-white z-30 flex flex-col animate-in slide-in-from-right">
             <div className="p-4 shadow flex items-center">
                <button onClick={() => setCurrentView('HOME')} className="mr-4 text-xl p-2 rounded-full hover:bg-gray-100">←</button>
                <h2 className="font-bold text-lg">Definições</h2>
             </div>
             <div className="p-6 text-gray-500">
                <p>Configurações de conta e app.</p>
             </div>
          </div>
      )}

      <SupportChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default ClientApp;