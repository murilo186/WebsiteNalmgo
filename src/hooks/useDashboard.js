import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

export const useDashboard = (empresaId) => {
  // Inicializar com dados do localStorage imediatamente
  const initData = () => {
    const empresaData = JSON.parse(localStorage.getItem('frete_app_user') || '{}');
    return {
      company: {
        name: empresaData.nome_empresa || empresaData.nome || "Empresa",
        logo: empresaData.logo || null
      },
      stats: {},
      user: {
        name: empresaData.nome_responsavel || empresaData.nome || "Usuário",
        role: "Administrador",
        avatar: null,
        status: "online"
      }
    };
  };

  const [dashboardData, setDashboardData] = useState(initData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar dados do dashboard
  const carregarDashboard = async (forceReload = false) => {
    if (!empresaId) return;

    try {
      if (forceReload) {
        setLoading(true);
      }
      setError(null);
      
      console.log('📊 Carregando dashboard para empresa:', empresaId);

      // Buscar dados reais da API usando método que calcula estatísticas
      const fretesResponse = await apiService.carregarDadosCompletosFretes(empresaId);
      console.log('📊 Resposta da API carregarDadosCompletosFretes:', fretesResponse);
      
      const empresaData = JSON.parse(localStorage.getItem('frete_app_user') || '{}');
      console.log('🏢 Dados da empresa do localStorage:', empresaData);

      // Mapear os dados de fretes para o formato esperado pelo Dashboard
      let dashboardStats = {};
      if (fretesResponse.success && fretesResponse.estatisticas) {
        dashboardStats = {
          fretesPendentes: fretesResponse.estatisticas.pendentes || 0,
          fretesAndamento: fretesResponse.estatisticas.andamento || 0,
          fretesFinalizados: fretesResponse.estatisticas.finalizados || 0,
          colaboradores: fretesResponse.motoristas?.length || 0,
          agregados: fretesResponse.motoristas?.filter(m => m.tipo === 'agregado' || !m.tipo).length || 0,
          motoristasTerceirizados: fretesResponse.motoristas?.filter(m => m.tipo === 'terceirizado').length || 0,
          receitaMes: fretesResponse.estatisticas.valorTotal || 0,
          custosOperacionais: 0, // Não disponível na API atual
          lucroLiquido: fretesResponse.estatisticas.valorTotal || 0
        };
      }

      setDashboardData(prevData => ({
        ...prevData, // Manter dados da empresa que já estão carregados
        stats: dashboardStats
      }));
      
      console.log('✅ Stats definidas:', dashboardStats);

      console.log('✅ Dashboard carregado');

    } catch (err) {
      console.error('❌ Erro ao carregar dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados automaticamente quando empresaId muda
  useEffect(() => {
    if (empresaId) {
      carregarDashboard();
    }
  }, [empresaId]);

  return {
    dashboardData,
    loading,
    error,
    carregarDashboard
  };
};