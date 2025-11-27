import React from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { ViewName, RideHistoryItem } from '../types';

interface HistoryViewProps {
  onBack: () => void;
}

const MOCK_HISTORY: RideHistoryItem[] = [
  { id: '1', date: 'Hoje, 08:30', origin: 'Maianga, Luanda', destination: 'Aeroporto 4 de Fevereiro', price: 2500, status: 'COMPLETED' },
  { id: '2', date: 'Ontem, 18:45', origin: 'Talatona Shopping', destination: 'Mutamba', price: 1800, status: 'COMPLETED' },
  { id: '3', date: '12 Mar, 14:20', origin: 'Ilha do Cabo', destination: 'Miramar', price: 1200, status: 'CANCELLED' },
  { id: '4', date: '10 Mar, 09:00', origin: 'Kilamba', destination: 'Centro da Cidade', price: 3500, status: 'COMPLETED' },
];

const HistoryView: React.FC<HistoryViewProps> = ({ onBack }) => {
  return (
    <div className="absolute inset-0 bg-gray-100 z-30 flex flex-col h-full animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full mr-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">As minhas viagens</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {MOCK_HISTORY.map((ride) => (
          <div key={ride.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-3">
               <div className="flex items-center text-xs text-gray-500 font-medium">
                  <Calendar className="w-3 h-3 mr-1" />
                  {ride.date}
               </div>
               <div className={`px-2 py-0.5 rounded text-xs font-bold flex items-center ${ride.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {ride.status === 'COMPLETED' ? (
                    <><CheckCircle className="w-3 h-3 mr-1" /> Concluída</>
                  ) : (
                    <><XCircle className="w-3 h-3 mr-1" /> Cancelada</>
                  )}
               </div>
            </div>

            <div className="relative pl-4 border-l-2 border-gray-200 space-y-4 mb-4">
               <div>
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-gray-400 ring-2 ring-white"></div>
                  <p className="text-sm text-gray-900 font-semibold">{ride.origin}</p>
               </div>
               <div>
                  <div className="absolute -left-[5px] top-full w-2 h-2 rounded-full bg-red-600 ring-2 ring-white -mt-2"></div>
                  <p className="text-sm text-gray-900 font-semibold">{ride.destination}</p>
               </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-50">
               <span className="text-sm text-gray-500">Econômico</span>
               <span className="font-bold text-lg">{ride.price} Kz</span>
            </div>
          </div>
        ))}

        <div className="text-center py-8 text-gray-400 text-sm">
          Não há mais viagens recentes.
        </div>
      </div>
    </div>
  );
};

export default HistoryView;