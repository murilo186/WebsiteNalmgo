import React from "react";
import { Search, Plus, Users, UserCheck, Truck } from "lucide-react";
import DriverCard from "./DriverCard";
import ColaboradorCard from "./ColaboradorCard";

const TeamContent = ({
  activeTab,
  activeDriverTab,
  searchTerm,
  onSearchChange,
  colaboradores,
  motoristasAgregados,
  motoristasTerceirizados,
  onAddDriver,
  onAddColaborador, // Nova prop para adicionar colaborador
  onEditColaborador, // Nova prop para editar colaborador
  onDeleteColaborador, // Nova prop para deletar colaborador
  currentUserId, // Nova prop para identificar usuário atual
  onOpenColaboradorModal, // Nova prop para abrir modal
  onViewDriverDetails // Nova prop para ver detalhes do motorista
}) => {

  const filteredColaboradores = colaboradores.filter(colaborador =>
    colaborador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    colaborador.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    colaborador.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderColaboradores = () => (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar colaboradores..."
            className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 shadow-md hover:shadow-lg"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button 
          onClick={onOpenColaboradorModal}
          className="group relative overflow-hidden flex items-center justify-center px-6 py-3 min-h-[44px] bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-green-500/20 touch-manipulation"
        >
          <Plus className="h-4 w-4 mr-2 relative z-10" />
          <span className="font-medium relative z-10">Novo Colaborador</span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        </button>
      </div>

      {filteredColaboradores.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/30 max-w-md mx-auto">
            <div className="text-6xl mb-4 animate-float">👥</div>
            <Users className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 font-medium text-lg mb-2">
              {colaboradores.length === 0 ? "Nenhum colaborador encontrado" : "Nenhum resultado para sua busca"}
            </p>
            <p className="text-sm text-gray-500">
              {colaboradores.length === 0 
                ? "Adicione colaboradores à sua equipe para começar!" 
                : "Tente buscar por nome, email ou cargo"
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColaboradores.map((colaborador, index) => (
            <div 
              key={colaborador.id} 
              className="animate-fade-in"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both'
              }}
            >
              <ColaboradorCard
                colaborador={colaborador}
                currentUserId={currentUserId}
                onEdit={onEditColaborador}
                onDelete={onDeleteColaborador}
              />
            </div>
          ))}
        </div>
      )}

    </div>
  );

  const renderMotoristas = () => (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar motoristas..."
            className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 shadow-md hover:shadow-lg"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {activeDriverTab === "agregados" && (
          <button
            onClick={onAddDriver}
            className="group relative overflow-hidden flex items-center justify-center px-6 py-3 min-h-[44px] bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-green-500/20 touch-manipulation"
          >
            <Plus className="h-4 w-4 mr-2 relative z-10" />
            <span className="font-medium relative z-10">Adicionar por Código</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </button>
        )}
      </div>

      {activeDriverTab === "agregados" ? (
        motoristasAgregados.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/30 max-w-md mx-auto">
              <div className="text-6xl mb-4 animate-float">⭐</div>
              <UserCheck className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 font-medium text-lg mb-2">Nenhum motorista agregado encontrado</p>
              <p className="text-sm text-gray-500">Use o código de vinculação para adicionar motoristas à sua equipe!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {motoristasAgregados.map((motorista, index) => (
              <div
                key={motorista.id}
                className="animate-fade-in"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <DriverCard
                  motorista={motorista}
                  tipo="agregado"
                  onViewDetails={onViewDriverDetails}
                />
              </div>
            ))}
          </div>
        )
      ) : (
        motoristasTerceirizados.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/30 max-w-md mx-auto">
              {/* Removido emoji - usando apenas ícone Lucide */}
              <Truck className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 font-medium text-lg mb-2">Nenhum motorista terceirizado disponível</p>
              <p className="text-sm text-gray-500">Motoristas terceirizados aparecerão aqui quando disponíveis!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {motoristasTerceirizados.map((motorista, index) => (
              <div
                key={motorista.id}
                className="animate-fade-in"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <DriverCard
                  motorista={motorista}
                  tipo="terceirizado"
                  onViewDetails={onViewDriverDetails}
                />
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );

  return (
    <div className="p-6">
      {activeTab === "colaboradores" && renderColaboradores()}
      {activeTab === "motoristas" && renderMotoristas()}
    </div>
  );
};

export default TeamContent;