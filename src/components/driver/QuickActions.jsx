import React from 'react';
import { FileText, User, Settings, AlertCircle } from 'lucide-react';
import { DRIVER_STATUS } from '../../constants/statusTypes';
import { getStatusColor } from '../../utils/statusHelpers';

const QuickActions = ({ status, onStatusChange }) => {
  const statusColor = getStatusColor(status);

  const actions = [
    {
      icon: FileText,
      title: 'Ver Fretes',
      subtitle: 'Histórico e ofertas',
      color: '#8B5CF6',
      onClick: () => console.log('Ver fretes')
    },
    {
      icon: User,
      title: 'Perfil',
      subtitle: 'Dados pessoais',
      color: '#3B82F6',
      onClick: () => console.log('Ver perfil')
    },
    {
      icon: Settings,
      title: 'Configurações',
      subtitle: 'Preferências',
      color: '#6B7280',
      onClick: () => console.log('Configurações')
    },
    {
      icon: AlertCircle,
      title: status === DRIVER_STATUS.EM_FRETE ? 'Em Serviço' : 'Alt. Status',
      subtitle: status === DRIVER_STATUS.EM_FRETE ? 'Frete ativo' : 'Disponibilidade',
      color: status === DRIVER_STATUS.EM_FRETE ? '#6B7280' : statusColor,
      onClick: status === DRIVER_STATUS.EM_FRETE ? null : () => {
        const novoStatus = status === DRIVER_STATUS.LIVRE ? DRIVER_STATUS.INDISPONIVEL : DRIVER_STATUS.LIVRE;
        onStatusChange(novoStatus);
      },
      disabled: status === DRIVER_STATUS.EM_FRETE
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Ações Rápidas
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`p-4 rounded-xl border transition-all text-left ${
                action.disabled
                  ? 'opacity-50 cursor-not-allowed bg-gray-50'
                  : 'hover:shadow-md hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: `${action.color}15` }}
                >
                  <Icon className="h-6 w-6" style={{ color: action.color }} />
                </div>
                <div>
                  <h4 
                    className="font-semibold"
                    style={{ color: action.disabled ? '#6B7280' : action.color }}
                  >
                    {action.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {action.subtitle}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;