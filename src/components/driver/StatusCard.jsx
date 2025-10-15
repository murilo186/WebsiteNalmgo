import React from 'react';
import { getStatusColor, getDriverStatusText } from '../../utils/statusHelpers';
import { DRIVER_STATUS } from '../../constants/statusTypes';
import { AlertCircle } from 'lucide-react';

const StatusCard = ({ status, onStatusChange, loading }) => {
  const statusColor = getStatusColor(status);
  const statusText = getDriverStatusText(status);

  const getStatusDescription = (status) => {
    switch (status) {
      case DRIVER_STATUS.LIVRE:
        return 'Você está visível para empresas que procuram motoristas';
      case DRIVER_STATUS.INDISPONIVEL:
        return 'Você não receberá ofertas de frete neste momento';
      case DRIVER_STATUS.EM_FRETE:
        return 'Você está executando um frete no momento';
      default:
        return 'Status desconhecido';
    }
  };

  const handleToggleStatus = () => {
    if (status === DRIVER_STATUS.EM_FRETE) return; // Não permite alterar durante frete

    const novoStatus = status === DRIVER_STATUS.LIVRE ? DRIVER_STATUS.INDISPONIVEL : DRIVER_STATUS.LIVRE;
    onStatusChange(novoStatus);
  };

  return (
    <div 
      className="bg-white rounded-2xl p-6 shadow-sm border-l-4 mb-6"
      style={{ borderLeftColor: statusColor }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: statusColor }}
          />
          <span 
            className="text-lg font-semibold"
            style={{ color: statusColor }}
          >
            {statusText}
          </span>
        </div>

        {status !== DRIVER_STATUS.EM_FRETE && (
          <button
            onClick={handleToggleStatus}
            disabled={loading}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading ? 'Alterando...' : 'Alterar Status'}
          </button>
        )}
      </div>

      <p className="text-gray-600 text-sm mb-4">
        {getStatusDescription(status)}
      </p>

      {status === DRIVER_STATUS.EM_FRETE && (
        <div className="flex items-center space-x-2 bg-amber-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <span className="text-amber-800 text-sm">
            Status controlado automaticamente durante fretes
          </span>
        </div>
      )}
    </div>
  );
};

export default StatusCard;