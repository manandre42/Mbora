import React from 'react';
import { ArrowLeft, CreditCard, Plus, Wallet, Smartphone } from 'lucide-react';

interface WalletViewProps {
  onBack: () => void;
}

const WalletView: React.FC<WalletViewProps> = ({ onBack }) => {
  return (
    <div className="absolute inset-0 bg-gray-50 z-30 flex flex-col h-full animate-in slide-in-from-right duration-300">
      <div className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full mr-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">Pagamento</h2>
      </div>

      <div className="p-4 space-y-6">
         {/* Balance Card */}
         <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Wallet className="w-24 h-24" />
            </div>
            <p className="text-gray-400 text-sm mb-1">Saldo Yango</p>
            <h1 className="text-4xl font-bold mb-6">4.500 Kz</h1>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
               + Carregar Saldo
            </button>
         </div>

         {/* Methods */}
         <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Métodos de Pagamento</h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                     <span className="font-bold text-green-700 text-xs">$$</span>
                  </div>
                  <div className="flex-1">
                     <p className="font-bold text-gray-900">Dinheiro</p>
                     <p className="text-xs text-gray-500">Pagamento ao motorista</p>
                  </div>
                  <div className="w-4 h-4 rounded-full border-4 border-red-600"></div>
               </div>
               
               <div className="flex items-center p-4 cursor-pointer hover:bg-gray-50">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                     <CreditCard className="w-5 h-5 text-blue-700" />
                  </div>
                  <div className="flex-1">
                     <p className="font-bold text-gray-900">Multicaixa Express</p>
                     <p className="text-xs text-gray-500">**** 4422</p>
                  </div>
               </div>
            </div>
            
            <button className="mt-3 w-full flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:bg-gray-50 hover:border-gray-400 transition-all">
               <Plus className="w-5 h-5 mr-2" />
               Adicionar novo cartão
            </button>
         </div>

         {/* Promos */}
         <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Promoções</h3>
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
               <div className="flex items-center">
                  <Smartphone className="w-8 h-8 text-red-600 mr-3" />
                  <div>
                     <p className="font-bold">Código Promocional</p>
                     <p className="text-xs text-gray-500">Tens um código de desconto?</p>
                  </div>
               </div>
               <button className="text-red-600 text-sm font-bold">Inserir</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default WalletView;