
import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, PlusCircle, Car, Search, MoreVertical, 
  ArrowLeft, Save
} from 'lucide-react';
import { RegisteredDriver, DriverCategory } from '../../types';

interface AdminAppProps {
  onBackToHome: () => void;
}

// Mock Database
const INITIAL_DRIVERS: RegisteredDriver[] = [
  {
    id: '1',
    fullName: 'Mateus João',
    phone: '+244 923 456 789',
    licenseNumber: 'LN-2023-8821',
    carModel: 'Hyundai i10',
    plate: 'LD-88-22-HG',
    color: 'Vermelho',
    category: 'economy',
    status: 'active',
    registrationDate: '2024-01-15',
    earnings: 145000
  },
  {
    id: '2',
    fullName: 'Sofia Manuel',
    phone: '+244 933 112 233',
    licenseNumber: 'LN-2024-1102',
    carModel: 'Toyota Fortuner',
    plate: 'LD-10-10-AB',
    color: 'Preto',
    category: 'comfort',
    status: 'active',
    registrationDate: '2024-02-01',
    earnings: 280000
  },
  {
    id: '3',
    fullName: 'Carlos Baza',
    phone: '+244 911 222 333',
    licenseNumber: 'LN-2024-0012',
    carModel: 'Lingken 125',
    plate: 'LD-MOT-99',
    color: 'Azul',
    category: 'moto',
    status: 'pending',
    registrationDate: '2024-03-10',
    earnings: 0
  }
];

const AdminApp: React.FC<AdminAppProps> = ({ onBackToHome }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'drivers' | 'add'>('dashboard');
  const [drivers, setDrivers] = useState<RegisteredDriver[]>(INITIAL_DRIVERS);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<RegisteredDriver>>({
    category: 'economy',
    status: 'active'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.plate) return;

    const newDriver: RegisteredDriver = {
      id: Date.now().toString(),
      fullName: formData.fullName || '',
      phone: formData.phone || '',
      licenseNumber: formData.licenseNumber || '',
      carModel: formData.carModel || '',
      plate: formData.plate?.toUpperCase() || '',
      color: formData.color || '',
      category: (formData.category as DriverCategory) || 'economy',
      status: 'active',
      registrationDate: new Date().toISOString().split('T')[0],
      earnings: 0
    };

    setDrivers(prev => [newDriver, ...prev]);
    setActiveTab('drivers');
    setFormData({ category: 'economy', status: 'active' }); // Reset
    alert("Motorista cadastrado com sucesso!");
  };

  const filteredDrivers = drivers.filter(d => 
    d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-900 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
           <div className="bg-violet-600 p-2 rounded-lg">
             <LayoutDashboard className="w-5 h-5 text-white" />
           </div>
           <div>
             <h1 className="font-bold text-lg leading-tight">Mbora Admin</h1>
             <p className="text-xs text-gray-400">Gestão de Frota</p>
           </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-violet-600 shadow-lg shadow-violet-900/50 font-bold' : 'hover:bg-gray-800 text-gray-400'}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </button>
          
          <button 
            onClick={() => setActiveTab('drivers')}
            className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'drivers' ? 'bg-violet-600 shadow-lg shadow-violet-900/50 font-bold' : 'hover:bg-gray-800 text-gray-400'}`}
          >
            <Users className="w-5 h-5 mr-3" />
            Motoristas
          </button>

          <button 
            onClick={() => setActiveTab('add')}
            className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'add' ? 'bg-violet-600 shadow-lg shadow-violet-900/50 font-bold' : 'hover:bg-gray-800 text-gray-400'}`}
          >
            <PlusCircle className="w-5 h-5 mr-3" />
            Novo Cadastro
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button onClick={onBackToHome} className="flex items-center text-gray-400 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao App Principal
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
           <h2 className="text-xl font-bold text-gray-800 capitalize">
             {activeTab === 'dashboard' ? 'Visão Geral' : activeTab === 'drivers' ? 'Frota de Motoristas' : 'Cadastrar Motorista'}
           </h2>
           <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold">Admin User</p>
                <p className="text-xs text-gray-500">Luanda HQ</p>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-500" />
              </div>
           </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          
          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               {/* Stats Cards */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-50 p-3 rounded-xl"><Users className="w-6 h-6 text-blue-600" /></div>
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">+12%</span>
                     </div>
                     <p className="text-gray-500 text-sm font-medium">Total Motoristas</p>
                     <h3 className="text-3xl font-black text-gray-900">{drivers.length}</h3>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <div className="flex items-center justify-between mb-4">
                        <div className="bg-violet-50 p-3 rounded-xl"><Car className="w-6 h-6 text-violet-600" /></div>
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">Online</span>
                     </div>
                     <p className="text-gray-500 text-sm font-medium">Viaturas Ativas</p>
                     <h3 className="text-3xl font-black text-gray-900">{drivers.filter(d => d.status === 'active').length}</h3>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <div className="flex items-center justify-between mb-4">
                        <div className="bg-emerald-50 p-3 rounded-xl"><Users className="w-6 h-6 text-emerald-600" /></div>
                     </div>
                     <p className="text-gray-500 text-sm font-medium">Faturação Mensal (Est.)</p>
                     <h3 className="text-3xl font-black text-gray-900">4.2M Kz</h3>
                  </div>
               </div>

               {/* Recent Activity */}
               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-lg mb-4">Atividade Recente</h3>
                  <div className="space-y-4">
                     {drivers.slice(0, 3).map(driver => (
                       <div key={driver.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                                {driver.fullName.charAt(0)}
                             </div>
                             <div>
                                <p className="font-bold text-gray-900">{driver.fullName}</p>
                                <p className="text-xs text-gray-500">Adicionado em {driver.registrationDate}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="font-bold text-sm">{driver.carModel}</p>
                             <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-700 font-bold">{driver.plate}</span>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {/* LIST VIEW */}
          {activeTab === 'drivers' && (
            <div className="animate-in fade-in duration-500">
               <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 relative">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                     <input 
                        type="text" 
                        placeholder="Pesquisar por nome ou matrícula..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                     />
                  </div>
                  <button onClick={() => setActiveTab('add')} className="bg-violet-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-violet-200 hover:bg-violet-700 transition-colors flex items-center gap-2">
                     <PlusCircle className="w-5 h-5" /> Novo
                  </button>
               </div>

               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <table className="w-full text-left">
                     <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                           <th className="p-4 text-xs font-bold text-gray-500 uppercase">Motorista</th>
                           <th className="p-4 text-xs font-bold text-gray-500 uppercase">Viatura</th>
                           <th className="p-4 text-xs font-bold text-gray-500 uppercase">Categoria</th>
                           <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                           <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Ações</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {filteredDrivers.map(driver => (
                           <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                              <td className="p-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs">
                                       {driver.fullName.charAt(0)}
                                    </div>
                                    <div>
                                       <p className="font-bold text-sm text-gray-900">{driver.fullName}</p>
                                       <p className="text-xs text-gray-500">{driver.phone}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="p-4">
                                 <p className="font-medium text-sm text-gray-800">{driver.carModel}</p>
                                 <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded border border-yellow-200 font-bold">{driver.plate}</span>
                                    <span className="text-[10px] text-gray-400">{driver.color}</span>
                                 </div>
                              </td>
                              <td className="p-4">
                                 <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${
                                    driver.category === 'comfort' ? 'bg-black text-white' : 
                                    driver.category === 'moto' ? 'bg-orange-100 text-orange-700' : 
                                    'bg-blue-100 text-blue-700'
                                 }`}>
                                    {driver.category}
                                 </span>
                              </td>
                              <td className="p-4">
                                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                    driver.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                 }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${driver.status === 'active' ? 'bg-green-600' : 'bg-gray-500'}`}></span>
                                    {driver.status === 'active' ? 'Ativo' : 'Pendente'}
                                 </span>
                              </td>
                              <td className="p-4 text-right">
                                 <button className="text-gray-400 hover:text-gray-600 p-1"><MoreVertical className="w-5 h-5" /></button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
                  {filteredDrivers.length === 0 && (
                     <div className="p-12 text-center text-gray-400">
                        Nenhum motorista encontrado.
                     </div>
                  )}
               </div>
            </div>
          )}

          {/* ADD FORM */}
          {activeTab === 'add' && (
             <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <form onSubmit={handleSubmit} className="space-y-6">
                   
                   {/* Personal Info Card */}
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
                         <Users className="w-5 h-5 text-violet-600" />
                         Dados Pessoais
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo</label>
                            <input required name="fullName" onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-violet-500 outline-none" placeholder="Ex: João Paulo" />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telefone</label>
                            <input required name="phone" onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-violet-500 outline-none" placeholder="+244 9..." />
                         </div>
                         <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nº Carta de Condução</label>
                            <input required name="licenseNumber" onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-violet-500 outline-none" placeholder="LN-..." />
                         </div>
                      </div>
                   </div>

                   {/* Vehicle Info Card */}
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
                         <Car className="w-5 h-5 text-violet-600" />
                         Dados da Viatura
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Matrícula</label>
                            <input required name="plate" onChange={handleInputChange} className="w-full bg-yellow-50 border border-yellow-200 text-yellow-900 font-mono font-bold rounded-xl p-3 focus:ring-2 focus:ring-yellow-400 outline-none uppercase" placeholder="LD-00-00-AA" />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Modelo do Carro</label>
                            <input required name="carModel" onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-violet-500 outline-none" placeholder="Ex: Hyundai i10" />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cor</label>
                            <input required name="color" onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-violet-500 outline-none" placeholder="Ex: Branco" />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
                            <select name="category" onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-violet-500 outline-none">
                               <option value="economy">Mbora Mini (Econômico)</option>
                               <option value="comfort">Mbora VIP (Conforto)</option>
                               <option value="moto">Mbora Moto</option>
                            </select>
                         </div>
                      </div>
                   </div>

                   {/* Actions */}
                   <div className="flex justify-end gap-4 pt-4">
                      <button type="button" onClick={() => setActiveTab('dashboard')} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
                         Cancelar
                      </button>
                      <button type="submit" className="px-8 py-3 bg-violet-600 text-white rounded-xl font-bold shadow-lg shadow-violet-200 hover:bg-violet-700 transition-all flex items-center gap-2">
                         <Save className="w-5 h-5" />
                         Salvar Motorista
                      </button>
                   </div>
                </form>
             </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminApp;
