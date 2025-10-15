import { DRIVER_STATUS, FREIGHT_STATUS, STATUS_COLORS } from '../constants/statusTypes';

/**
 * Helpers para gerenciar status
 */

// Obter cor do status
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || '#6B7280';
};

// Obter texto legível do status do motorista
export const getDriverStatusText = (status) => {
  switch (status) {
    case DRIVER_STATUS.LIVRE:
      return 'Disponível';
    case DRIVER_STATUS.OCUPADO:
      return 'Ocupado';
    case DRIVER_STATUS.EM_FRETE:
      return 'Em Serviço';
    case DRIVER_STATUS.INDISPONIVEL:
      return 'Indisponível';
    case DRIVER_STATUS.OFFLINE:
      return 'Offline';
    default:
      return 'Desconhecido';
  }
};

// Obter texto legível do status do frete
export const getFreightStatusText = (status) => {
  switch (status) {
    case FREIGHT_STATUS.PENDENTE:
      return 'Pendente';
    case FREIGHT_STATUS.ANDAMENTO:
      return 'Em Andamento';
    case FREIGHT_STATUS.FINALIZADO:
      return 'Finalizado';
    case FREIGHT_STATUS.CANCELADO:
      return 'Cancelado';
    default:
      return 'Desconhecido';
  }
};

// Verificar se motorista está disponível
export const isDriverAvailable = (driver) => {
  return driver.status_disponibilidade === DRIVER_STATUS.LIVRE && driver.ativo;
};

// Filtrar motoristas disponíveis
export const filterAvailableDrivers = (drivers) => {
  return drivers.filter(isDriverAvailable);
};