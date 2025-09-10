// Configurações da API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3,
};

// Status de frete
export const FRETE_STATUS = {
  PENDENTE: 'pendente',
  EM_ANDAMENTO: 'em_andamento',
  CONCLUIDO: 'concluido',
  CANCELADO: 'cancelado',
};

// Status de motorista
export const MOTORISTA_STATUS = {
  DISPONIVEL: 'disponivel',
  OCUPADO: 'ocupado',
  OFFLINE: 'offline',
};

// Tipos de usuário
export const USER_TYPES = {
  EMPRESA: 'empresa',
  MOTORISTA: 'motorista',
  ADMIN: 'admin',
};

// Mensagens de erro padrão
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Acesso não autorizado. Faça login novamente.',
  NOT_FOUND: 'Recurso não encontrado.',
  SERVER_ERROR: 'Erro interno do servidor. Tente novamente mais tarde.',
  VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
};

export default API_CONFIG;