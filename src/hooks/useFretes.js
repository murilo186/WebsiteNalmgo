import { useState, useCallback } from 'react';
import { formatCurrency } from '../utils/formatters';

export const useFretes = (empresaId) => {
  const [fretesPendentes, setFretesPendentes] = useState([]);
  const [fretesAndamento, setFretesAndamento] = useState([]);
  const [fretesFinalizados, setFretesFinalizados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar todos os fretes da empresa
  const carregarFretes = useCallback(async () => {
    if (!empresaId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚛 Carregando fretes para empresa:', empresaId);
      
      const response = await fetch(`http://localhost:3000/api/fretes/empresa/${empresaId}`, {
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Fretes carregados:', data.fretes);
        setFretesPendentes(data.fretes.pendentes || []);
        setFretesAndamento(data.fretes.andamento || []);
        setFretesFinalizados(data.fretes.finalizados || []);
      } else {
        setError(data.error);
        console.error('❌ Erro na resposta:', data.error);
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Erro ao carregar fretes:', err);
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  // Criar novo frete
  const criarFrete = useCallback(async (freteId, freteData) => {
    try {
      setLoading(true);
      setError(null);

      // Se freteId for null, é criação. Se tiver ID, é edição
      if (freteId) {
        return await editarFrete(freteId, freteData);
      }

      const novoFreteData = {
        empresaId,
        origem: freteData.origem,
        destino: freteData.destino,
        distancia: freteData.distancia,
        valor: parseFloat((freteData.valor || '0').toString().replace(/[R$\s,]/g, '').replace('.', '')),
        valorEmpresa: parseFloat((freteData.valorEmpresa || '0').toString().replace(/[R$\s,]/g, '').replace('.', '')),
        tipoCarga: freteData.carga,
        peso: freteData.peso,
        eixosRequeridos: freteData.eixosRequerido,
        observacoes: freteData.observacoes,
        disponivelTerceiros: freteData.disponivelTerceiros || false,
        dataColeta: freteData.dataColeta || null,
        dataEntregaPrevista: freteData.dataEntregaPrevista || null
      };

      console.log('📤 Criando frete:', novoFreteData);

      const response = await fetch('http://localhost:3000/api/fretes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoFreteData)
      });

      const data = await response.json();

      if (data.success) {
        await carregarFretes(); // Recarregar lista
        return { success: true, message: 'Frete criado com sucesso!' };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('❌ Erro ao criar frete:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [empresaId, carregarFretes]);

  // Editar frete existente
  const editarFrete = useCallback(async (freteId, freteData) => {
    try {
      setLoading(true);
      setError(null);

      const freteAtualizado = {
        empresaId,
        origem: freteData.origem,
        destino: freteData.destino,
        distancia: freteData.distancia,
        valor: parseFloat((freteData.valor || '0').toString().replace(/[R$\s,]/g, '').replace('.', '')),
        valorEmpresa: parseFloat((freteData.valorEmpresa || '0').toString().replace(/[R$\s,]/g, '').replace('.', '')),
        tipoCarga: freteData.carga,
        peso: freteData.peso,
        eixosRequeridos: freteData.eixosRequerido,
        observacoes: freteData.observacoes,
        disponivelTerceiros: freteData.disponivelTerceiros || false,
        dataColeta: freteData.dataColeta || null,
        dataEntregaPrevista: freteData.dataEntregaPrevista || null
      };

      console.log('📝 Atualizando frete:', freteId, freteAtualizado);

      const response = await fetch(`http://localhost:3000/api/fretes/${freteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(freteAtualizado)
      });

      const data = await response.json();

      if (data.success) {
        await carregarFretes(); // Recarregar lista
        return { success: true, message: 'Frete atualizado com sucesso!' };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('❌ Erro ao atualizar frete:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [empresaId, carregarFretes]);

  // Remover frete
  const removerFrete = useCallback(async (freteId) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🗑️ Removendo frete:', freteId);

      const response = await fetch(`http://localhost:3000/api/fretes/${freteId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empresaId })
      });

      const data = await response.json();

      if (data.success) {
        await carregarFretes(); // Recarregar lista
        return { success: true, message: 'Frete removido com sucesso!' };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('❌ Erro ao remover frete:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [empresaId, carregarFretes]);

  // Oferecer frete para motorista
  const oferecerFrete = useCallback(async (freteId, motoristaId) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🎯 Oferecendo frete', freteId, 'para motorista', motoristaId);

      const response = await fetch(`http://localhost:3000/api/fretes/${freteId}/oferecer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motoristaId, empresaId })
      });

      const data = await response.json();

      if (data.success) {
        await carregarFretes(); // Recarregar lista
        return { success: true, message: 'Frete oferecido com sucesso!' };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('❌ Erro ao oferecer frete:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [empresaId, carregarFretes]);

  // Finalizar frete
  const finalizarFrete = useCallback(async (freteId) => {
    try {
      setLoading(true);
      setError(null);

      // Buscar nome do usuário logado
      const user = JSON.parse(localStorage.getItem('frete_app_user') || '{}');
      const userName = user.nome || user.nome_completo || 'Sistema';

      console.log('🏁 Finalizando frete:', freteId, 'por', userName);

      const response = await fetch(`http://localhost:3000/api/fretes/${freteId}/finalizar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empresaId, finalizadoPor: userName })
      });

      const data = await response.json();

      if (data.success) {
        await carregarFretes(); // Recarregar lista
        return { success: true, message: 'Frete finalizado com sucesso!' };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('❌ Erro ao finalizar frete:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [empresaId, carregarFretes]);

  return {
    // Estados
    fretesPendentes,
    fretesAndamento,
    fretesFinalizados,
    loading,
    error,
    
    // Ações
    carregarFretes,
    criarFrete,
    editarFrete,
    removerFrete,
    oferecerFrete,
    finalizarFrete
  };
};