import React from "react";
import { Users, UserCheck, Truck } from "lucide-react";

const TeamStats = ({ stats }) => {
  const statCards = [
    {
      icon: Users,
      title: "Colaboradores",
      subtitle: "Equipe interna",
      value: stats.colaboradores,
      color: "#3B82F6",
      bgGradient: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200/50"
    },
    {
      icon: UserCheck,
      title: "Agregados", 
      subtitle: "Motoristas fixos",
      value: stats.agregados,
      color: "#10B981",
      bgGradient: "from-green-50 to-green-100",
      borderColor: "border-green-200/50"
    },
    {
      icon: Truck,
      title: "Terceirizados",
      subtitle: "Disponíveis", 
      value: stats.terceirizados,
      color: "#8B5CF6",
      bgGradient: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200/50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`group relative overflow-hidden bg-gradient-to-br ${card.bgGradient} p-6 rounded-2xl border ${card.borderColor} transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1 animate-fade-in`}
            style={{
              animationDelay: `${index * 150}ms`,
              animationFillMode: 'both'
            }}
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r rounded-xl transition-all duration-300 transform group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${card.color}, ${card.color}dd)`
                  }}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    {card.title}
                  </p>
                  <p className="text-xs text-gray-600 font-medium">
                    {card.subtitle}
                  </p>
                </div>
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {card.value}
              </p>
            </div>
            {/* Efeito shimmer no hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-2xl"></div>
          </div>
        );
      })}
    </div>
  );
};

export default TeamStats;