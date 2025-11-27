
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Power, Navigation, User, MapPin, DollarSign, Star } from 'lucide-react';
import MapBackground from '../../components/MapBackground';
import { Location, RideStatus, DriverStatus, RideRequest, LUANDA_CENTER } from '../../types';
import CarbonButton from '../../components/ui/CarbonButton';

interface DriverAppProps {
  onBackToHome: () => void;
}

const isValidLocation = (loc: Location | null): boolean => {
  return !!loc && typeof loc.lat === 'number' && !isNaN(loc.lat) && isFinite(loc.lat) && typeof loc.lng === 'number' && !isNaN(loc.lng) && isFinite(loc.lng);
};

const DriverApp: React.FC<DriverAppProps> = ({ onBackToHome }) => {
  const [status, setStatus] = useState<DriverStatus>('OFFLINE');
  const [driverLocation, setDriverLocation] = useState<Location>(LUANDA_CENTER);
  const [incomingRequest, setIncomingRequest] = useState<RideRequest | null>(null);
  const [activeRide, setActiveRide] = useState<RideRequest | null>(null);
  const [earnings, setEarnings] = useState(12500); // Mock daily earnings

  // Simulate GPS
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        if (!isNaN(pos.coords.latitude) && !isNaN(pos.coords.longitude)) {
            setDriverLocation({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            });
        }
      });
    }
  }, []);

  // Simulate Incoming Requests
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    if (status === 'ONLINE' && !incomingRequest && !activeRide) {
      // Randomly trigger a request after 3-8 seconds
      const delay = Math.random() * 5000 + 3000;
      timeout = setTimeout(() => {
        if (!isValidLocation(driverLocation)) return;

        const newRequest: RideRequest = {
            id: Date.now().toString(),
            passengerName: 'Ana Paula',
            rating: 4.8,
            origin: { 
                lat: driverLocation.lat + 0.002, 
                lng: driverLocation.lng + 0.002, 
                address: 'Mutamba, Luanda' 
            },
            destination: { 
                lat: driverLocation.lat - 0.005, 
                lng: driverLocation.lng - 0.002, 
                address: 'Ilha do Cabo' 
            },
            price: 2400,
            distance: 4.5
        };
        // Sanity check just in case calculations went wrong
        if (isValidLocation(newRequest.origin) && isValidLocation(newRequest.destination)) {
          setIncomingRequest(newRequest);
        }
      }, delay);
    }

    return () => clearTimeout(timeout);
  }, [status, incomingRequest, activeRide, driverLocation]);

  const toggleOnline = () => {
      setStatus(prev => prev === 'OFFLINE' ? 'ONLINE' : 'OFFLINE');
      setIncomingRequest(null);
  };

  const acceptRide = () => {
      if (incomingRequest) {
          setActiveRide(incomingRequest);
          setIncomingRequest(null);
          setStatus('BUSY');
      }
  };

  const rejectRide = () => {
      setIncomingRequest(null);
  };

  const completeRide = () => {
      if (activeRide) {
          setEarnings(prev => prev + activeRide.price);
          setActiveRide(null);
          setStatus('ONLINE');
          alert(`Viagem finalizada! Recebeste ${activeRide.price} Kz.`);
      }
  }

  return (
    <div className="relative w-full h-full bg-gray-100 flex flex-col font-sans">
      
      {/* Header / Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/60 to-transparent">
         <div className="flex justify-between items-start">
             <button onClick={onBackToHome} className="bg-white/20 backdrop-blur p-2 rounded-full text-white hover:bg-white/30">
                <ArrowLeft className="w-6 h-6" />
             </button>
             
             <div className="bg-white rounded-full px-6 py-2 shadow-lg flex items-center gap-3">
                 <div className={`w-3 h-3 rounded-full ${status === 'OFFLINE' ? 'bg-gray-400' : 'bg-green-500 animate-pulse'}`}></div>
                 <span className="font-bold text-sm text-gray-800">
                    {status === 'OFFLINE' ? 'Offline' : status === 'ONLINE' ? 'À procura...' : 'Em viagem'}
                 </span>
             </div>

             <div className="bg-white/90 backdrop-blur rounded-2xl px-4 py-2 shadow-lg flex flex-col items-end">
                 <span className="text-[10px] text-gray-500 font-bold uppercase">Hoje</span>
                 <span className="font-black text-violet-700">{earnings.toLocaleString('pt-AO')} Kz</span>
             </div>
         </div>
      </div>

      {/* Map */}
      <MapBackground 
         userLocation={driverLocation} 
         driverLocation={driverLocation} // Driver is the "user" here for map centering
         destination={activeRide ? activeRide.destination : null}
         status={activeRide ? RideStatus.IN_PROGRESS : RideStatus.IDLE}
         onMapClick={() => {}}
      />

      {/* Footer / Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-6 pb-8">
          
          {/* OFFLINE STATE */}
          {status === 'OFFLINE' && (
              <div className="flex justify-center">
                  <button 
                    onClick={toggleOnline}
                    className="bg-violet-600 text-white rounded-full p-6 shadow-xl shadow-violet-500/30 hover:scale-105 transition-transform flex items-center gap-3"
                  >
                      <Power className="w-8 h-8" />
                      <span className="text-xl font-bold pr-2">INICIAR TURNO</span>
                  </button>
              </div>
          )}

          {/* ONLINE STATE (No Request) */}
          {status === 'ONLINE' && !incomingRequest && (
              <div className="bg-white p-4 rounded-3xl shadow-lg border-l-4 border-violet-500 animate-pulse">
                  <p className="text-center text-gray-500 font-medium">À procura de passageiros na zona...</p>
              </div>
          )}

          {/* INCOMING REQUEST */}
          {incomingRequest && (
              <div className="bg-white rounded-[2rem] shadow-2xl p-6 animate-in slide-in-from-bottom-full duration-500">
                  <div className="flex justify-between items-center mb-4">
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                         NOVO PEDIDO
                      </div>
                      <div className="text-xl font-black text-gray-900">
                         {incomingRequest.price.toLocaleString('pt-AO')} Kz
                      </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                          <h3 className="font-bold text-lg">{incomingRequest.passengerName}</h3>
                          <div className="flex items-center text-xs text-gray-500 font-bold">
                              <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                              {incomingRequest.rating}
                          </div>
                      </div>
                      <div className="ml-auto text-right">
                          <p className="font-bold text-gray-900">{incomingRequest.distance} km</p>
                          <p className="text-xs text-gray-400">Distância total</p>
                      </div>
                  </div>

                  <div className="space-y-3 mb-6 relative">
                       {/* Line connector */}
                       <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gray-200"></div>

                       <div className="flex items-center gap-3">
                           <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center relative z-10 text-[10px]">A</div>
                           <p className="text-sm font-medium text-gray-600 truncate">{incomingRequest.origin.address}</p>
                       </div>
                       <div className="flex items-center gap-3">
                           <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center relative z-10 text-[10px]">B</div>
                           <p className="text-sm font-bold text-gray-900 truncate">{incomingRequest.destination.address}</p>
                       </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                      <CarbonButton variant="danger" onClick={rejectRide}>Recusar</CarbonButton>
                      <div className="col-span-1">
                        <button 
                            onClick={acceptRide}
                            className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-200 transition-all active:scale-95"
                        >
                            ACEITAR
                        </button>
                      </div>
                  </div>
              </div>
          )}

          {/* ACTIVE RIDE */}
          {activeRide && (
              <div className="bg-white rounded-[2rem] shadow-2xl p-6">
                   <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                       <div>
                           <p className="text-xs text-gray-400 font-bold uppercase">Passageiro</p>
                           <h3 className="font-bold text-lg">{activeRide.passengerName}</h3>
                       </div>
                       <button className="bg-violet-50 text-violet-600 p-3 rounded-full hover:bg-violet-100">
                           <Navigation className="w-6 h-6" />
                       </button>
                   </div>
                   
                   <div className="bg-gray-50 p-4 rounded-xl mb-4">
                       <p className="text-sm font-medium text-gray-500 mb-1">Destino</p>
                       <p className="font-bold text-gray-900">{activeRide.destination.address}</p>
                   </div>

                   <CarbonButton variant="primary" fullWidth onClick={completeRide}>
                       Finalizar Viagem
                   </CarbonButton>
              </div>
          )}

      </div>
    </div>
  );
};

export default DriverApp;
