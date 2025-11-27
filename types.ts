
export enum RideStatus {
  IDLE = 'IDLE',
  CHOOSING_DESTINATION = 'CHOOSING_DESTINATION',
  REQUESTING = 'REQUESTING',
  MATCHED = 'MATCHED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export type ViewName = 'HOME' | 'HISTORY' | 'WALLET' | 'SETTINGS' | 'SUPPORT';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface RideOption {
  id: string;
  name: string;
  priceMultiplier: number;
  eta: number; // minutes
  image: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface RideHistoryItem {
  id: string;
  date: string;
  origin: string;
  destination: string;
  price: number;
  status: 'COMPLETED' | 'CANCELLED';
  mapUrl?: string;
}

export interface RidePreferences {
  quiet: boolean;
  ac: boolean;
  music: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  genre: string;
}

// Driver Module Types
export type DriverStatus = 'OFFLINE' | 'ONLINE' | 'BUSY';

export interface RideRequest {
  id: string;
  passengerName: string;
  rating: number;
  origin: Location;
  destination: Location;
  price: number;
  distance: number; // km
}

// Admin Module Types
export type DriverCategory = 'moto' | 'economy' | 'comfort';

export interface RegisteredDriver {
  id: string;
  fullName: string;
  phone: string;
  licenseNumber: string;
  carModel: string;
  plate: string;
  color: string;
  category: DriverCategory;
  status: 'active' | 'pending' | 'suspended';
  registrationDate: string;
  earnings: number;
}

export const LUANDA_CENTER: Location = {
  lat: -8.839988,
  lng: 13.289437,
  address: "Luanda, Angola"
};