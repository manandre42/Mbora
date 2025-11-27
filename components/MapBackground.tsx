
import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Location, RideStatus } from '../types';

// Fix for default Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icons with Brand Colors (Violet)
const userIcon = L.divIcon({
  html: `<div class="bg-violet-600 w-4 h-4 rounded-full border-2 border-white shadow-lg pulse-ring"></div>`,
  className: 'custom-div-icon',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const carIcon = L.divIcon({
  html: `<div class="text-3xl drop-shadow-md filter hue-rotate-15" style="transform: rotate(0deg);">🚙</div>`,
  className: 'custom-car-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const phantomCarIcon = L.divIcon({
  html: `<div class="text-xl opacity-70 grayscale" style="transform: rotate(0deg);">🚗</div>`,
  className: 'phantom-car-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const destIcon = L.divIcon({
  html: `<div class="bg-black w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-xl text-white text-xs font-bold relative z-10"><div class="w-2 h-2 bg-violet-400 rounded-full"></div></div>`,
  className: 'custom-dest-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface MapBackgroundProps {
  userLocation: Location;
  destination: Location | null;
  driverLocation: Location | null;
  status: RideStatus;
  onMapClick: (loc: Location) => void;
}

// Robust Helper to validate location coordinates
const isValidLatLng = (lat?: any, lng?: any): boolean => {
  return (
    typeof lat === 'number' && 
    !isNaN(lat) && 
    isFinite(lat) &&
    typeof lng === 'number' && 
    !isNaN(lng) && 
    isFinite(lng)
  );
};

// Component to handle map clicks
const MapEvents = ({ onClick }: { onClick: (loc: Location) => void }) => {
  useMapEvents({
    click(e) {
      if (isValidLatLng(e.latlng.lat, e.latlng.lng)) {
        onClick({ lat: e.latlng.lat, lng: e.latlng.lng, address: "Local selecionado" });
      }
    },
  });
  return null;
};

// Component to fly to active area
const MapUpdater = ({ center }: { center: Location }) => {
  const map = useMap();
  useEffect(() => {
    if (center && isValidLatLng(center.lat, center.lng)) {
      try {
        // Double check specifically for FlyTo to prevent crashes
        if (!isNaN(center.lat) && !isNaN(center.lng)) {
            map.flyTo([center.lat, center.lng], map.getZoom(), {
            animate: true,
            duration: 1.5
            });
        }
      } catch (e) {
        console.error("Map flyTo error suppressed:", e);
      }
    }
  }, [center, map]);
  return null;
};

// Component to render phantom cars moving randomly
const PhantomCars = ({ center }: { center: Location }) => {
    const [cars, setCars] = useState<{id: number, lat: number, lng: number}[]>([]);

    useEffect(() => {
        if (!center || !isValidLatLng(center.lat, center.lng)) return;

        // Init cars around center safely
        const initialCars = Array.from({length: 5}).map((_, i) => {
            const lat = center.lat + (Math.random() - 0.5) * 0.01;
            const lng = center.lng + (Math.random() - 0.5) * 0.01;
            if (isValidLatLng(lat, lng)) {
                return { id: i, lat, lng };
            }
            return null;
        }).filter(c => c !== null) as {id: number, lat: number, lng: number}[];

        setCars(initialCars);
    }, [center.lat, center.lng]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCars(prev => prev.map(car => {
                const newLat = car.lat + (Math.random() - 0.5) * 0.0005;
                const newLng = car.lng + (Math.random() - 0.5) * 0.0005;
                
                if (isValidLatLng(newLat, newLng)) {
                   return { ...car, lat: newLat, lng: newLng };
                }
                return car;
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {cars.map(car => (
                isValidLatLng(car.lat, car.lng) ? (
                  <Marker key={car.id} position={[car.lat, car.lng]} icon={phantomCarIcon} />
                ) : null
            ))}
        </>
    );
}

const MapBackground: React.FC<MapBackgroundProps> = ({ 
  userLocation, 
  destination, 
  driverLocation, 
  status,
  onMapClick 
}) => {
  // Determine the active center for camera
  const activeCenter = useMemo(() => {
    let center = userLocation;
    
    // Check if we should focus on driver
    if ((status === RideStatus.MATCHED || status === RideStatus.IN_PROGRESS) && driverLocation) {
      if (isValidLatLng(driverLocation.lat, driverLocation.lng)) {
        center = driverLocation;
      }
    }

    // Safety fallback
    return isValidLatLng(center.lat, center.lng) ? center : { lat: -8.839988, lng: 13.289437 };
  }, [userLocation, driverLocation, status]);

  // Fallback for MapContainer initial center
  const mapCenter: [number, number] = useMemo(() => {
    return isValidLatLng(userLocation.lat, userLocation.lng) 
      ? [userLocation.lat, userLocation.lng] 
      : [-8.839988, 13.289437]; // Default Luanda
  }, [userLocation]);

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <MapContainer 
        center={mapCenter} 
        zoom={16} 
        scrollWheelZoom={true} 
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {/* Helper to fly map camera */}
        {isValidLatLng(activeCenter.lat, activeCenter.lng) && <MapUpdater center={activeCenter} />}
        
        {/* Phantom ambient cars */}
        {status === RideStatus.IDLE && isValidLatLng(userLocation.lat, userLocation.lng) && (
          <PhantomCars center={userLocation} />
        )}

        {/* Click Handler */}
        {status === RideStatus.CHOOSING_DESTINATION && (
           <MapEvents onClick={onMapClick} />
        )}

        {/* User Location */}
        {isValidLatLng(userLocation.lat, userLocation.lng) && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>Você está aqui</Popup>
          </Marker>
        )}

        {/* Destination */}
        {destination && isValidLatLng(destination.lat, destination.lng) && (
          <Marker position={[destination.lat, destination.lng]} icon={destIcon}>
             <Popup>Destino</Popup>
          </Marker>
        )}

        {/* Active Driver */}
        {driverLocation && isValidLatLng(driverLocation.lat, driverLocation.lng) && (status === RideStatus.MATCHED || status === RideStatus.IN_PROGRESS) && (
           <Marker position={[driverLocation.lat, driverLocation.lng]} icon={carIcon} />
        )}

      </MapContainer>
    </div>
  );
};

export default MapBackground;
