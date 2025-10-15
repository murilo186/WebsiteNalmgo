import { useState, useCallback, useEffect } from 'react';
import apiService from '../services/apiService';
import { filterAvailableDrivers } from '../utils/statusHelpers';

export const useTeam = (empresaId) => {
  const [colaboradores, setColaboradores] = useState([]);
  const [motoristasAgregados, setMotoristasAgregados] = useState([]);
  const [motoristasTerceirizados, setMotoristasTerceirizados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar todos os dados da equipe
  const carregarEquipe = useCallback(async (forceReload = false) => {
    if (!empresaId) return;

    try {
      if (forceReload) {
        setLoading(true);
      }
      setError(null);
      
      console.log('👥 Carregando equipe da empresa:', empresaId);
      
      // Buscar equipe completa (agregados + terceirizados ativos)
      const equipeResponse = await apiService.get(`/api/motoristas/empresa/${empresaId}/equipe`);

      console.log('📊 Resposta da API equipe completa:', equipeResponse);

      if (equipeResponse.success) {
        const { agregados, terceirizados } = equipeResponse.equipe;

        console.log('- Total agregados:', agregados.length);
        console.log('- Total terceirizados ativos:', terceirizados.length);

        setMotoristasAgregados(agregados || []);
        setMotoristasTerceirizados(terceirizados || []);
      } else {
        console.log('❌ Falha ao buscar equipe:', equipeResponse.error);
        setMotoristasAgregados([]);
        setMotoristasTerceirizados([]);
      }
      
      // Buscar colaboradores da empresa
      try {
        const colaboradoresResponse = await fetch(`http://localhost:3000/api/auth/empresa/${empresaId}/colaboradores`);
        const colaboradoresData = await colaboradoresResponse.json();
        
        console.log('📊 Resposta da API colaboradores:', colaboradoresData);
        
        if (colaboradoresData && colaboradoresData.success) {
          const colaboradoresList = colaboradoresData.colaboradores || [];
          console.log('- Total colaboradores:', colaboradoresList.length);
          setColaboradores(colaboradoresList);
        } else {
          console.log('❌ Falha ao buscar colaboradores:', colaboradoresData?.error);
          setColaboradores([]);
        }
      } catch (colaboradoresError) {
        console.log('❌ Erro ao conectar com colaboradores:', colaboradoresError.message);
        setColaboradores([]);
      }
      
      console.log('✅ Equipe carregada');
    } catch (err) {
      setError(err.message);
      console.error('❌ Erro ao carregar equipe:', err);
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  // Adicionar motorista por código
  const adicionarMotorista = useCallback(async (codigo) => {
    if (!codigo.trim() || !empresaId) {
      return { success: false, error: 'Código ou empresa inválidos' };
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('📤 Enviando convite para:', codigo, 'empresa:', empresaId);
      
      const response = await apiService.enviarConvite(empresaId, codigo.trim().toUpperCase());
      console.log('📨 Resposta do convite:', response);
      
      if (response.success) {
        // Recarregar equipe após 2 segundos (tempo para aceitar)
        setTimeout(() => {
          carregarEquipe();
        }, 2000);
        
        return { success: true, message: response.message };
      } else {
        return { success: false, error: response.error };
      }
    } catch (err) {
      console.error('❌ Erro ao enviar convite:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [empresaId, carregarEquipe]);

  // Carregar colaboradores da empresa
  const carregarColaboradores = useCallback(async () => {
    if (!empresaId) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/auth/empresa/${empresaId}/colaboradores`);
      const data = await response.json();
      
      if (data.success) {
        setColaboradores(data.colaboradores);
        console.log('✅ Colaboradores carregados:', data.colaboradores.length);
      } else {
        console.error('❌ Erro ao carregar colaboradores:', data.error);
        setColaboradores([]);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar colaboradores:', error);
      setColaboradores([]);
    }
  }, [empresaId]);

  // Adicionar colaborador
  const adicionarColaborador = useCallback(async (dadosColaborador) => {
    if (!empresaId) {
      return { success: false, error: 'ID da empresa não encontrado' };
    }

    try {
      setLoading(true);
      
      console.log('👤 Criando colaborador:', dadosColaborador);
      
      const response = await fetch('http://localhost:3000/api/auth/colaboradores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresaId,
          ...dadosColaborador,
          isAdmin: false // Colaboradores normais nunca são admin
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Recarregar colaboradores
        await carregarColaboradores();
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('❌ Erro ao criar colaborador:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [empresaId, carregarColaboradores]);

  // Editar colaborador
  const editarColaborador = useCallback(async (colaboradorId, dadosAtualizados) => {
    try {
      setLoading(true);
      
      console.log('✏️ Editando colaborador:', colaboradorId, dadosAtualizados);
      
      const response = await fetch(`http://localhost:3000/api/auth/colaboradores/${colaboradorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizados)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Recarregar colaboradores
        await carregarColaboradores();
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('❌ Erro ao editar colaborador:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [carregarColaboradores]);

  // Remover colaborador
  const removerColaborador = useCallback(async (colaboradorId) => {
    try {
      setLoading(true);
      
      console.log('🗑️ Removendo colaborador:', colaboradorId);
      
      const response = await fetch(`http://localhost:3000/api/auth/colaboradores/${colaboradorId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Recarregar colaboradores
        await carregarColaboradores();
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('❌ Erro ao remover colaborador:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [carregarColaboradores]);

  // Obter motoristas disponíveis
  const getMotoristasDisponiveis = useCallback(() => {
    return filterAvailableDrivers(motoristasAgregados);
  }, [motoristasAgregados]);

  // Obter estatísticas da equipe
  const getEstatisticas = useCallback(() => {
    return {
      colaboradores: colaboradores.length,
      agregados: motoristasAgregados.length,
      terceirizados: motoristasTerceirizados.length,
      motoristasDisponiveis: getMotoristasDisponiveis().length
    };
  }, [colaboradores, motoristasAgregados, motoristasTerceirizados, getMotoristasDisponiveis]);

  // Carregar dados automaticamente quando empresaId muda
  useEffect(() => {
    if (empresaId) {
      carregarEquipe();
    }
  }, [empresaId, carregarEquipe]);

  return {
    // Estados
    colaboradores,
    motoristasAgregados,
    motoristasTerceirizados,
    loading,
    error,
    
    // Ações - Motoristas
    carregarEquipe,
    adicionarMotorista,
    
    // Ações - Colaboradores
    carregarColaboradores,
    adicionarColaborador,
    editarColaborador,
    removerColaborador,
    
    // Computed
    getMotoristasDisponiveis,
    getEstatisticas
  };
};