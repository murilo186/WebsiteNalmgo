import React from 'react';
import { CheckCircle, Star, Building, TrendingUp } from 'lucide-react';
import { getStatusColor, getDriverStatusText } from '../../utils/statusHelpers';

const DriverStats = ({ userData, status }) => {
  const statusColor = getStatusColor(status);
  const statusText = getDriverStatusText(status);

  const stats = [
    {
      icon: CheckCircle,
      value: userData?.total_fretes_concluidos || 0,
      label: 'Fretes Completos',
      subtitle: 'Total realizado',
      color: '#10B981'
    },
    {
      icon: Star,
      value: '4.8',
      label: 'Avaliação Média',
      subtitle: 'Baseado em avaliações',
      color: '#F59E0B'
    },
    {
      icon: Building,
      value: userData?.empresa_id ? 'Sim' : 'Não',
      label: 'Empresa Vinculada',
      subtitle: 'Status de vinculação',
      color: '#8B5CF6'
    },
    {
      icon: TrendingUp,
      value: statusText,
      label: 'Status Atual',
      subtitle: 'Sua disponibilidade',
      color: statusColor
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4">
              <div 
                className="p-3 rounded-xl"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <Icon className="h-6 w-6" style={{ color: stat.color }} />
              </div>
              <div className="flex-1">
                <p 
                  className="text-2xl font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-gray-700">
                  {stat.label}
                </p>
                <p className="text-xs text-gray-500">
                  {stat.subtitle}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DriverStats;