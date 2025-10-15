import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import Header from "../Header";
import { useUser } from "../../contexts/UserContext";
import { useTeam } from "../../hooks/useTeam";
import { useModal } from "../../hooks/useModal";
import TeamStats from "./TeamStats";
import TeamTabs from "./TeamTabs";
import TeamContent from "./TeamContent";
import AddDriverModal from "./AddDriverModal";
import AddColaboradorModal from "./AddColaboradorModal";
import DriverDetailsModal from "./DriverDetailsModal";

const TeamScreen = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userData } = useUser();
  const [activeTab, setActiveTab] = useState("colaboradores");
  const [activeDriverTab, setActiveDriverTab] = useState("agregados");
  const [searchTerm, setSearchTerm] = useState("");

  const [empresaData, setEmpresaData] = useState({
    id: null,
    nome: "Carregando..."
  });

  const [currentUserId, setCurrentUserId] = useState(null);

  // Estado para modal de detalhes do motorista
  const [driverDetailsModal, setDriverDetailsModal] = useState({
    isOpen: false,
    motorista: null
  });

  // Hooks customizados
  const team = useTeam(empresaData.id);
  const addDriverModal = useModal();
  const colaboradorModal = useModal();

  // Proteção de rota - redirecionar se não estiver logado
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // Inicializar dados da empresa
  useEffect(() => {
    if (!userData) return;

    // Se for colaborador, usar empresa_id; se for empresa, usar id
    const empresaId = userData.empresa_id || userData.id;
    const userId = userData.id; // ID do usuário atual (sempre o próprio ID)

    if (empresaId) {
      setEmpresaData({
        id: empresaId,
        nome: userData.nome_empresa || userData.nome
      });
      // Set current user ID for colaborador comparison
      setCurrentUserId(userId);
    }
  }, [userData]);

  // Equipe inicializa com dados mockados automaticamente

  const handleAddDriver = async (codigo) => {
    const result = await team.adicionarMotorista(codigo);
    
    if (result.success) {
      alert(result.message);
      addDriverModal.closeModal();
    } else {
      alert(result.error || "Erro ao enviar convite");
    }
  };

  const handleAddColaborador = async (dadosColaborador) => {
    const result = await team.adicionarColaborador(dadosColaborador);
    
    if (result.success) {
      alert(result.message || "Colaborador criado com sucesso!");
      colaboradorModal.closeModal();
    } else {
      alert(result.error || "Erro ao criar colaborador");
    }
    
    return result;
  };

  const handleEditColaborador = async (colaborador) => {
    // For now, just show an alert - could implement edit modal later
    alert(`Editar colaborador: ${colaborador.nome}`);
  };

  const handleDeleteColaborador = async (colaborador) => {
    if (window.confirm(`Tem certeza que deseja remover ${colaborador.nome} da equipe?`)) {
      const result = await team.removerColaborador(colaborador.id);

      if (result.success) {
        alert(result.message || "Colaborador removido com sucesso!");
      } else {
        alert(result.error || "Erro ao remover colaborador");
      }
    }
  };

  const handleViewDriverDetails = (motorista) => {
    setDriverDetailsModal({
      isOpen: true,
      motorista
    });
  };

  const closeDriverDetailsModal = () => {
    setDriverDetailsModal({
      isOpen: false,
      motorista: null
    });
  };

  if (team.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 animate-fade-in">
        <Header companyName={empresaData.nome} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              {/* Loading skeleton moderno */}
              <div className="relative">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl animate-ping opacity-30"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-32 mx-auto animate-pulse"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-24 mx-auto animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 animate-fade-in">
      <Header companyName={empresaData.nome} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho com glassmorphism */}
        <div className="mb-8 p-4 sm:p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Gestão de Equipe
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600 font-medium">
                Gerencie colaboradores e motoristas da sua frota
              </p>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <TeamStats stats={team.getEstatisticas()} />

        {/* Tabs e Conteúdo */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300">
          <TeamTabs
            activeTab={activeTab}
            activeDriverTab={activeDriverTab}
            onTabChange={setActiveTab}
            onDriverTabChange={setActiveDriverTab}
            colaboradoresCount={team.colaboradores.length}
            motoristasCount={team.motoristasAgregados.length + team.motoristasTerceirizados.length}
            agregadosCount={team.motoristasAgregados.length}
            terceirizadosCount={team.motoristasTerceirizados.length}
          />

          <TeamContent
            activeTab={activeTab}
            activeDriverTab={activeDriverTab}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            colaboradores={team.colaboradores}
            motoristasAgregados={team.motoristasAgregados}
            motoristasTerceirizados={team.motoristasTerceirizados}
            onAddDriver={() => addDriverModal.openModal()}
            onAddColaborador={handleAddColaborador}
            onEditColaborador={handleEditColaborador}
            onDeleteColaborador={handleDeleteColaborador}
            currentUserId={currentUserId}
            onOpenColaboradorModal={colaboradorModal.openModal}
            onViewDriverDetails={handleViewDriverDetails}
          />
        </div>

        {/* Modal de Adicionar Motorista */}
        <AddDriverModal
          isOpen={addDriverModal.isOpen}
          onClose={addDriverModal.closeModal}
          onSubmit={handleAddDriver}
          loading={team.loading}
        />

        {/* Modal de Adicionar Colaborador */}
        <AddColaboradorModal
          isOpen={colaboradorModal.isOpen}
          onClose={colaboradorModal.closeModal}
          onSubmit={handleAddColaborador}
          loading={team.loading}
        />

        {/* Modal de Detalhes do Motorista */}
        <DriverDetailsModal
          isOpen={driverDetailsModal.isOpen}
          onClose={closeDriverDetailsModal}
          motorista={driverDetailsModal.motorista}
        />
      </div>
    </div>
  );
};

export default TeamScreen;