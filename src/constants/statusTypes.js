// Status dos motoristas
export const DRIVER_STATUS = {
  LIVRE: 'livre',
  OCUPADO: 'ocupado',
  EM_FRETE: 'em-frete',
  INDISPONIVEL: 'indisponivel',
  OFFLINE: 'offline'
};

// Status dos fretes
export const FREIGHT_STATUS = {
  PENDENTE: 'pendente',
  ANDAMENTO: 'andamento',
  FINALIZADO: 'finalizado',
  CANCELADO: 'cancelado'
};

// Tipos de usuário
export const USER_TYPES = {
  EMPRESA: 'empresa',
  MOTORISTA: 'motorista',
  ADMIN: 'admin'
};

// Cores dos status
export const STATUS_COLORS = {
  [DRIVER_STATUS.LIVRE]: '#10B981',
  [DRIVER_STATUS.OCUPADO]: '#EF4444', 
  [DRIVER_STATUS.EM_FRETE]: '#F59E0B',
  [DRIVER_STATUS.INDISPONIVEL]: '#6B7280',
  [DRIVER_STATUS.OFFLINE]: '#6B7280',
  
  [FREIGHT_STATUS.PENDENTE]: '#F59E0B',
  [FREIGHT_STATUS.ANDAMENTO]: '#8B5CF6',
  [FREIGHT_STATUS.FINALIZADO]: '#10B981',
  [FREIGHT_STATUS.CANCELADO]: '#EF4444'
};