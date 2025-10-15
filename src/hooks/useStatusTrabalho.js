import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';
import apiService from '../services/apiService';

const useStatusTrabalho = () => {
  const { userData, updateStatusTrabalho: updateUserStatus } = useUser();
  const [status, setStatus] = useState('online');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Inicializar status do usuário logado
  useEffect(() => {
    if (userData?.id && userData?.status_trabalho) {
      setStatus(userData.status_trabalho);
    }
  }, [userData]);

  // Atualizar status no servidor
  const updateStatus = useCallback(async (novoStatus) => {
    if (!userData?.id) {
      setError('Usuário não identificado');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await apiService.atualizarStatusTrabalho(userData.id, novoStatus);
      setStatus(novoStatus);
      // Sincronizar com o UserContext
      updateUserStatus(novoStatus);
      return true;
    } catch (err) {
      setError(err.message || 'Erro ao atualizar status');
      console.error('Erro ao atualizar status:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userData?.id]);

  // Definir offline no logout (será chamado pelo Header)
  const setOffline = useCallback(() => {
    if (userData?.id) {
      updateStatus('offline');
    }
  }, [userData?.id, updateStatus]);

  // Helpers para cores e textos
  const getStatusColor = useCallback((statusValue) => {
    switch (statusValue) {
      case 'online': return '#10B981';
      case 'ausente': return '#F59E0B';
      case 'ocupado': return '#EF4444';
      default: return '#6B7280';
    }
  }, []);

  const getStatusText = useCallback((statusValue) => {
    switch (statusValue) {
      case 'online': return 'Online';
      case 'ausente': return 'Ausente';
      case 'ocupado': return 'Ocupado';
      default: return 'Offline';
    }
  }, []);

  return {
    status,
    loading,
    error,
    updateStatus,
    setOffline,
    getStatusColor,
    getStatusText
  };
};

export default useStatusTrabalho;