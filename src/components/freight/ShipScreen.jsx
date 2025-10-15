import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import { useUser } from "../../contexts/UserContext";
import { useFretes } from "../../hooks/useFretes";
import { useTeam } from "../../hooks/useTeam";
import { useModal } from "../../hooks/useModal";
import FreightTabs from "./FreightTabs";
import FreightGrid from "./FreightGrid";
import FreightModal from "./FreightModal";
import CandidatesModal from "./CandidatesModal";
import { Plus } from "lucide-react";
import apiService from "../../services/apiService";

const ShipScreen = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userData } = useUser();
  const [activeTab, setActiveTab] = useState("pendentes");
  const [empresaData, setEmpresaData] = useState({
    id: null,
    nome: "Carregando..."
  });

  // Estados para candidaturas
  const [candidaturasModal, setCandidaturasModal] = useState({
    isOpen: false,
    frete: null,
    candidaturas: []
  });
  const [candidaturasCount, setCandidaturasCount] = useState({});

  // Hooks customizados
  const fretes = useFretes(empresaData.id);
  const team = useTeam(empresaData.id);
  const modal = useModal();

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

    if (!empresaId) {
      return;
    }

    setEmpresaData({
      id: empresaId,
      nome: userData.nome_empresa || userData.nome
    });
  }, [userData]);

  // Carregar dados quando empresa estiver definida
  useEffect(() => {
    if (empresaData.id) {
      fretes.carregarFretes();
      team.carregarEquipe();
    }
  }, [empresaData.id, fretes.carregarFretes, team.carregarEquipe]);

  // Função para carregar contagem de candidaturas (usando useCallback)
  const carregarCandidaturasCount = useCallback(async () => {
    if (!fretes.fretesPendentes.length) return;

    try {
      const fretesComTerceiros = fretes.fretesPendentes.filter(frete => frete.disponivel_terceiros);
      if (fretesComTerceiros.length === 0) return;

      const freteIds = fretesComTerceiros.map(frete => frete.id);
      const response = await apiService.getCandidaturasFretes(freteIds);

      if (response.success) {
        setCandidaturasCount(response.candidaturasCount || {});
      }
    } catch (error) {
      console.error('Erro ao carregar contagem de candidaturas:', error);
    }
  }, [fretes.fretesPendentes]);

  // Carregar contagem de candidaturas quando fretes mudarem
  useEffect(() => {
    carregarCandidaturasCount();
  }, [carregarCandidaturasCount]);

  // Polling: Atualizar candidaturas automaticamente a cada 10 segundos
  useEffect(() => {
    if (!empresaData.id) return;

    // Atualizar candidaturas a cada 10 segundos
    const intervalId = setInterval(() => {
      carregarCandidaturasCount();
    }, 10000); // 10 segundos

    // Limpar intervalo quando componente desmontar
    return () => clearInterval(intervalId);
  }, [empresaData.id, carregarCandidaturasCount]);

  const tabs = [
    { id: "pendentes", label: "Pendentes", count: fretes.fretesPendentes.length },
    { id: "andamento", label: "Em Andamento", count: fretes.fretesAndamento.length },
    { id: "finalizados", label: "Finalizados", count: fretes.fretesFinalizados.length },
  ];

  const getCurrentFretes = () => {
    switch (activeTab) {
      case "pendentes":
        return fretes.fretesPendentes;
      case "andamento":
        return fretes.fretesAndamento;
      case "finalizados":
        return fretes.fretesFinalizados;
      default:
        return [];
    }
  };

  // Funções para candidaturas
  const handleViewCandidates = async (frete) => {
    try {
      const response = await apiService.getCandidaturas(frete.id);

      if (response.success) {
        setCandidaturasModal({
          isOpen: true,
          frete,
          candidaturas: response.candidaturas || []
        });
      } else {
        alert('Erro ao carregar candidaturas: ' + response.error);
      }
    } catch (error) {
      console.error('Erro ao carregar candidaturas:', error);
      alert('Erro ao carregar candidaturas');
    }
  };

  const handleAprovarCandidatura = async (candidaturaId, observacoes) => {
    try {
      const response = await apiService.aprovarCandidatura(candidaturaId, observacoes);

      if (response.success) {
        // Recarregar candidaturas do modal
        if (candidaturasModal.frete) {
          const candidaturasResponse = await apiService.getCandidaturas(candidaturasModal.frete.id);
          if (candidaturasResponse.success) {
            setCandidaturasModal(prev => ({
              ...prev,
              candidaturas: candidaturasResponse.candidaturas || []
            }));
          }
        }

        // Recarregar fretes para atualizar status
        fretes.carregarFretes();

        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Erro ao aprovar candidatura:', error);
      return { success: false, error: error.message };
    }
  };

  const handleRecusarCandidatura = async (candidaturaId, observacoes) => {
    try {
      const response = await apiService.recusarCandidatura(candidaturaId, observacoes);

      if (response.success) {
        // Recarregar candidaturas do modal
        if (candidaturasModal.frete) {
          const candidaturasResponse = await apiService.getCandidaturas(candidaturasModal.frete.id);
          if (candidaturasResponse.success) {
            setCandidaturasModal(prev => ({
              ...prev,
              candidaturas: candidaturasResponse.candidaturas || []
            }));
          }
        }

        // Atualizar contagem de candidaturas
        setCandidaturasCount(prev => ({
          ...prev,
          [candidaturasModal.frete.id]: Math.max(0, (prev[candidaturasModal.frete.id] || 0) - 1)
        }));

        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Erro ao recusar candidatura:', error);
      return { success: false, error: error.message };
    }
  };

  const closeCandidatesModal = () => {
    setCandidaturasModal({
      isOpen: false,
      frete: null,
      candidaturas: []
    });
  };

  if (fretes.loading && !fretes.fretesPendentes.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 animate-fade-in">
        <Header companyName={empresaData.nome} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            {/* Loading skeleton moderno */}
            <div className="relative">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg animate-pulse">
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 animate-fade-in">
      <Header companyName={empresaData.nome} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header da página com glassmorphism */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 p-4 sm:p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 transition-all duration-300 touch-manipulation">
          <div className="mb-4 lg:mb-0 w-full lg:w-auto">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Gerenciar Fretes
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Acompanhe e gerencie seus fretes com elegância</p>
          </div>
          <button
            onClick={() => modal.openModal(null, "novo")}
            className="group relative overflow-hidden flex items-center justify-center w-full lg:w-auto px-6 py-3 min-h-[44px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900 text-white rounded-xl touch-manipulation transform hover:scale-105 active:scale-95 transition-all duration-300 border border-blue-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <Plus className="w-5 h-5 mr-2 relative z-10" />
            <span className="font-medium relative z-10">Novo Frete</span>
          </button>
        </div>

        {/* Tabs */}
        <FreightTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Grid de fretes */}
        <FreightGrid
          fretes={getCurrentFretes()}
          tipo={activeTab}
          onEdit={(frete) => modal.openModal(frete, "editar")}
          onDelete={fretes.removerFrete}
          onOffer={(frete) => modal.openModal(frete, "oferecer")}
          onFinish={fretes.finalizarFrete}
          onViewCandidates={handleViewCandidates}
          candidaturasCount={candidaturasCount}
        />

        {/* Modal */}
        <FreightModal
          isOpen={modal.isOpen}
          mode={modal.mode}
          frete={modal.data}
          motoristasDisponiveis={team.getMotoristasDisponiveis()}
          onClose={modal.closeModal}
          onSave={fretes.criarFrete}
          onOffer={fretes.oferecerFrete}
        />

        {/* Modal de Candidaturas */}
        <CandidatesModal
          isOpen={candidaturasModal.isOpen}
          frete={candidaturasModal.frete}
          candidaturas={candidaturasModal.candidaturas}
          onClose={closeCandidatesModal}
          onApprove={handleAprovarCandidatura}
          onReject={handleRecusarCandidatura}
        />
      </main>
    </div>
  );
};

export default ShipScreen;