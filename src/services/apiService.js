// ApiService para comunicação com backend - WEB INTEGRADO COM FRETES
class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:3000'; // Ajuste conforme seu backend
  }

  // Método auxiliar para fazer requests
  async request(endpoint, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro na requisição');
      }
      
      return data;
    } catch (error) {
      console.error(`Erro na requisição para ${endpoint}:`, error);
      throw error;
    }
  }

  // ===================================
  // AUTENTICAÇÃO EMPRESA
  // ===================================

  async registerEmpresa(empresaData) {
    return this.request('/api/auth/register-empresa', {
      method: 'POST',
      body: JSON.stringify(empresaData)
    });
  }

  async loginEmpresa(email, senha) {
    return this.request('/api/auth/login-empresa', {
      method: 'POST',
      body: JSON.stringify({ email, senha })
    });
  }

  async getEmpresaData(empresaId) {
    return this.request(`/empresa/${empresaId}`);
  }

  // ===================================
  // SISTEMA DE FRETES COMPLETO
  // ===================================

  // Criar novo frete
  async criarFrete(freteData) {
    return this.request('/fretes', {
      method: 'POST',
      body: JSON.stringify(freteData)
    });
  }

  // Listar fretes da empresa (agrupados por status)
  async getFretes(empresaId) {
    return this.request(`/fretes/empresa/${empresaId}`);
  }

  // Buscar frete específico
  async getFrete(freteId) {
    return this.request(`/fretes/${freteId}`);
  }

  // Atualizar frete
  async atualizarFrete(freteId, freteData) {
    return this.request(`/fretes/${freteId}`, {
      method: 'PUT',
      body: JSON.stringify(freteData)
    });
  }

  // Deletar frete
  async deletarFrete(freteId, empresaId) {
    return this.request(`/fretes/${freteId}`, {
      method: 'DELETE',
      body: JSON.stringify({ empresaId })
    });
  }

  // Oferecer frete para motorista
  async oferecerFrete(freteId, motoristaId, empresaId) {
    return this.request(`/fretes/${freteId}/oferecer`, {
      method: 'POST',
      body: JSON.stringify({ motoristaId, empresaId })
    });
  }

  // Finalizar frete
  async finalizarFrete(freteId, empresaId, finalizadoPor = 'Admin') {
    return this.request(`/fretes/${freteId}/finalizar`, {
      method: 'PUT',
      body: JSON.stringify({ empresaId, finalizadoPor })
    });
  }

  // ===================================
  // SISTEMA DE EQUIPE E MOTORISTAS
  // ===================================

  // Enviar convite para motorista por código
  async enviarConvite(empresaId, codigoMotorista) {
    return this.request('/api/auth/convites', {
      method: 'POST',
      body: JSON.stringify({ 
        empresaId, 
        codigoMotorista: codigoMotorista.toUpperCase() 
      })
    });
  }

  // Listar motoristas agregados da empresa
  async getMotoristasEmpresa(empresaId) {
    return this.request(`/api/auth/empresa/${empresaId}/motoristas`);
  }

  // Buscar motoristas disponíveis (livres)
  async getMotoristasDisponiveis(empresaId) {
    const response = await this.getMotoristasEmpresa(empresaId);
    if (response.success) {
      const motoristasLivres = response.motoristas.filter(
        m => m.status_disponibilidade === 'livre' && m.ativo
      );
      return {
        ...response,
        motoristas: motoristasLivres
      };
    }
    return response;
  }

  // ===================================
  // ESTATÍSTICAS E RELATÓRIOS
  // ===================================

  // Buscar métricas do dashboard
  async getDashboardData(empresaId) {
    return this.request(`/dashboard?empresaId=${empresaId}`);
  }

  // Relatório de fretes por período
  async getRelatorioFretes(empresaId, dataInicio, dataFim) {
    const params = new URLSearchParams({
      empresaId,
      dataInicio,
      dataFim
    });
    return this.request(`/fretes/empresa/${empresaId}/relatorio?${params}`);
  }

  // Estatísticas de motoristas
  async getEstatisticasMotoristas(empresaId) {
    const response = await this.getMotoristasEmpresa(empresaId);
    if (response.success) {
      const motoristas = response.motoristas;
      const stats = {
        total: motoristas.length,
        livres: motoristas.filter(m => m.status_disponibilidade === 'livre').length,
        emServico: motoristas.filter(m => m.status_disponibilidade === 'em-frete').length,
        indisponiveis: motoristas.filter(m => m.status_disponibilidade === 'indisponivel').length,
        ativos: motoristas.filter(m => m.ativo).length
      };
      return { success: true, stats };
    }
    return response;
  }

  // ===================================
  // UTILITÁRIOS
  // ===================================

  // Validação de CEP
  async validateCEP(cep) {
    return this.request(`/utils/validate-cep/${cep}`);
  }

  // Calcular distância
  async calculateDistance(origem, destino) {
    return this.request('/utils/calculate-distance', {
      method: 'POST',
      body: JSON.stringify({ origem, destino })
    });
  }

  // ===================================
  // MÉTODOS AUXILIARES PARA FRETES
  // ===================================

  // Método para carregar todos os dados de fretes com estatísticas
  async carregarDadosCompletosFretes(empresaId) {
    try {
      const [fretes, motoristas] = await Promise.all([
        this.getFretes(empresaId),
        this.getMotoristasEmpresa(empresaId)
      ]);

      const resultado = {
        success: true,
        fretes: fretes.success ? fretes.fretes : { pendentes: [], andamento: [], finalizados: [] },
        motoristas: motoristas.success ? motoristas.motoristas : [],
        estatisticas: {}
      };

      // Calcular estatísticas
      if (fretes.success) {
        const { pendentes, andamento, finalizados } = fretes.fretes;
        resultado.estatisticas = {
          totalFretes: pendentes.length + andamento.length + finalizados.length,
          pendentes: pendentes.length,
          andamento: andamento.length,
          finalizados: finalizados.length,
          valorTotal: [...pendentes, ...andamento, ...finalizados]
            .reduce((total, frete) => total + (Number(frete.valor) || 0), 0)
        };
      }

      return resultado;
    } catch (error) {
      console.error('Erro ao carregar dados completos de fretes:', error);
      return {
        success: false,
        error: error.message,
        fretes: { pendentes: [], andamento: [], finalizados: [] },
        motoristas: [],
        estatisticas: {}
      };
    }
  }

  // Método para validar dados do frete antes de enviar
  validarDadosFrete(dadosFrete) {
    const { origem, destino, valor, tipoCarga } = dadosFrete;
    const erros = [];

    if (!origem || origem.trim().length < 3) {
      erros.push('Origem deve ter pelo menos 3 caracteres');
    }
    if (!destino || destino.trim().length < 3) {
      erros.push('Destino deve ter pelo menos 3 caracteres');
    }
    if (!valor || isNaN(Number(valor)) || Number(valor) <= 0) {
      erros.push('Valor deve ser um número positivo');
    }
    if (!tipoCarga || tipoCarga.trim().length < 3) {
      erros.push('Tipo de carga deve ter pelo menos 3 caracteres');
    }

    return {
      valido: erros.length === 0,
      erros
    };
  }

  // Método para formatar dados do frete para envio
  formatarDadosFrete(formData, empresaId) {
    return {
      empresaId: Number(empresaId),
      origem: formData.origem.trim(),
      destino: formData.destino.trim(),
      distancia: formData.distancia ? formData.distancia.trim() : null,
      valor: Number(formData.valor.toString().replace(/[R$\s,]/g, '').replace(/\./g, '')),
      tipoCarga: formData.carga.trim(),
      peso: formData.peso ? formData.peso.trim() : null,
      eixosRequeridos: Number(formData.eixosRequerido) || 3,
      observacoes: formData.observacoes ? formData.observacoes.trim() : null
    };
  }

  // ===================================
  // FORMATAÇÃO E UTILITÁRIOS
  // ===================================

  formatarValor(valor) {
    if (typeof valor === 'number') {
      return `R$ ${valor.toFixed(2).replace('.', ',')}`;
    }
    return valor;
  }

  formatarData(dataString) {
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
    } catch (error) {
      return dataString;
    }
  }

  formatarDataHora(dataString) {
    try {
      const data = new Date(dataString);
      return data.toLocaleString('pt-BR');
    } catch (error) {
      return dataString;
    }
  }

  // ===================================
  // MÉTODOS LEGADOS (para compatibilidade)
  // ===================================

  async getMotoristas(empresaId) {
    return this.getMotoristasEmpresa(empresaId);
  }

  async createFrete(freteData) {
    return this.criarFrete(freteData);
  }

  async updateFrete(freteId, freteData) {
    return this.atualizarFrete(freteId, freteData);
  }

  async deleteFrete(freteId) {
    // Nota: Este método precisa do empresaId, mas mantemos para compatibilidade
    console.warn('deleteFrete sem empresaId está depreciado. Use deletarFrete()');
    return this.request(`/fretes/${freteId}`, {
      method: 'DELETE'
    });
  }

  async getEquipe(empresaId) {
    return this.getMotoristasEmpresa(empresaId);
  }

  async addMembroEquipe(empresaId, membroData) {
    return this.request('/equipe', {
      method: 'POST',
      body: JSON.stringify({
        empresaId,
        ...membroData
      })
    });
  }

  async searchMotoristas(filtros) {
    const queryParams = new URLSearchParams(filtros);
    return this.request(`/motoristas/buscar?${queryParams}`);
  }
}

// Instância singleton
const apiService = new ApiService();

export default apiService;