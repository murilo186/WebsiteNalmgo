
import Header from "./Header";
import React, { useState, useEffect } from "react";
import {
  Truck,
  Users,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Search,
  Plus,
  Filter,
} from "lucide-react";

const Dashboard = () => {
  
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Dados mockados - em produção viriam da API
  const [dashboardData] = useState({
    company: {
      name: "Transportes Silva & Cia",
      logo: null, // Pode ser uma URL da imagem
    },
    stats: {
      colaboradores: 12,
      agregados: 8,
      fretesPendentes: 15,
      fretesAndamento: 23,
      fretesFinalizados: 187,
      motoristasTerceirizados: 34,
    },
    user: {
      name: "João Silva",
      role: "Administrador",
      avatar: null,
      status: "online", // online, ausente, ocupado
    },
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "#10B981";
      case "ausente":
        return "#F59E0B";
      case "ocupado":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "online":
        return "Online";
      case "ausente":
        return "Ausente";
      case "ocupado":
        return "Ocupado";
      default:
        return "Offline";
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div
              className="p-2.5 rounded-xl"
              style={{ backgroundColor: `${color}15` }}
            >
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
          </div>
          <h3 className="text-sm font-medium mb-1" style={{ color: "#4B5563" }}>
            {title}
          </h3>
          <p className="text-2xl font-bold" style={{ color: "#222222" }}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp
                className="h-3 w-3 mr-1"
                style={{ color: "#10B981" }}
              />
              <span style={{ color: "#10B981" }}>+{trend}% este mês</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F9FA" }}>
      



      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho da Página */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "#222222" }}>
                Dashboard
              </h1>
              <p className="mt-2 text-sm" style={{ color: "#4B5563" }}>
                Visão geral da sua operação •{" "}
                {currentTime.toLocaleDateString("pt-BR")} às{" "}
                {currentTime.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4 mr-2" style={{ color: "#4B5563" }} />
                <span style={{ color: "#4B5563" }}>Filtrar</span>
              </button>
              <button
                className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white hover:shadow-lg transition-all"
                style={{ backgroundColor: "#3B82F6" }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Frete
              </button>
            </div>
          </div>
        </div>

        {/* Grid Principal - 2 colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Coluna 1 - Fretes (principal) */}
          <div className="lg:col-span-2">
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "#222222" }}
            >
              Status dos Fretes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                icon={Clock}
                title="Pendentes"
                value={dashboardData.stats.fretesPendentes}
                color="#F59E0B"
              />
              <StatCard
                icon={Truck}
                title="Em Andamento"
                value={dashboardData.stats.fretesAndamento}
                color="#8B5CF6"
                trend={5}
              />
              <StatCard
                icon={CheckCircle}
                title="Finalizados (mês)"
                value={dashboardData.stats.fretesFinalizados}
                color="#10B981"
                trend={15}
              />
            </div>
          </div>

          {/* Coluna 2 - Equipe (compacto) */}
          <div>
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "#222222" }}
            >
              Equipe
            </h3>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: "#3B82F615" }}
                  >
                    <Users className="h-4 w-4" style={{ color: "#3B82F6" }} />
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#222222" }}
                    >
                      Colaboradores
                    </p>
                    <p className="text-xs" style={{ color: "#4B5563" }}>
                      Equipe interna
                    </p>
                  </div>
                </div>
                <span
                  className="text-xl font-bold"
                  style={{ color: "#3B82F6" }}
                >
                  {dashboardData.stats.colaboradores}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: "#10B98115" }}
                  >
                    <UserCheck
                      className="h-4 w-4"
                      style={{ color: "#10B981" }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#222222" }}
                    >
                      Agregados
                    </p>
                    <p className="text-xs" style={{ color: "#4B5563" }}>
                      Motoristas fixos
                    </p>
                  </div>
                </div>
                <span
                  className="text-xl font-bold"
                  style={{ color: "#10B981" }}
                >
                  {dashboardData.stats.agregados}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: "#6B728015" }}
                  >
                    <Users className="h-4 w-4" style={{ color: "#6B7280" }} />
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#222222" }}
                    >
                      Terceirizados
                    </p>
                    <p className="text-xs" style={{ color: "#4B5563" }}>
                      Disponíveis
                    </p>
                  </div>
                </div>
                <span
                  className="text-xl font-bold"
                  style={{ color: "#6B7280" }}
                >
                  {dashboardData.stats.motoristasTerceirizados}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção inferior - 2 colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ações Rápidas */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "#222222" }}
            >
              Ações Rápidas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button className="flex items-center justify-center p-4 hover:bg-gray-50 rounded-lg transition-colors group border border-gray-200">
                <div className="text-center">
                  <div
                    className="p-3 rounded-lg mx-auto mb-2"
                    style={{ backgroundColor: "#3B82F615" }}
                  >
                    <Plus className="h-5 w-5" style={{ color: "#3B82F6" }} />
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#222222" }}
                  >
                    Novo Frete
                  </span>
                </div>
              </button>

              <button className="flex items-center justify-center p-4 hover:bg-gray-50 rounded-lg transition-colors group border border-gray-200">
                <div className="text-center">
                  <div
                    className="p-3 rounded-lg mx-auto mb-2"
                    style={{ backgroundColor: "#10B98115" }}
                  >
                    <UserCheck
                      className="h-5 w-5"
                      style={{ color: "#10B981" }}
                    />
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#222222" }}
                  >
                    Adicionar Pessoa
                  </span>
                </div>
              </button>

              <button className="flex items-center justify-center p-4 hover:bg-gray-50 rounded-lg transition-colors group border border-gray-200">
                <div className="text-center">
                  <div
                    className="p-3 rounded-lg mx-auto mb-2"
                    style={{ backgroundColor: "#8B5CF615" }}
                  >
                    <Search className="h-5 w-5" style={{ color: "#8B5CF6" }} />
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#222222" }}
                  >
                    Buscar Motorista
                  </span>
                </div>
              </button>

              <button className="flex items-center justify-center p-4 hover:bg-gray-50 rounded-lg transition-colors group border border-gray-200">
                <div className="text-center">
                  <div
                    className="p-3 rounded-lg mx-auto mb-2"
                    style={{ backgroundColor: "#F59E0B15" }}
                  >
                    <MapPin className="h-5 w-5" style={{ color: "#F59E0B" }} />
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#222222" }}
                  >
                    Rastreamento
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Resumo Financeiro */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "#222222" }}
            >
              Resumo Financeiro
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: "#10B981" }}
                  >
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#10B981" }}
                    >
                      Receita do Mês
                    </span>
                    <p className="text-xs" style={{ color: "#059669" }}>
                      +18% vs anterior
                    </p>
                  </div>
                </div>
                <span
                  className="text-lg font-bold"
                  style={{ color: "#10B981" }}
                >
                  R$ 284.5k
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: "#6B7280" }}
                  >
                    <Truck className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#374151" }}
                    >
                      Custos Operacionais
                    </span>
                    <p className="text-xs" style={{ color: "#6B7280" }}>
                      Combustível, manutenção
                    </p>
                  </div>
                </div>
                <span
                  className="text-lg font-bold"
                  style={{ color: "#6B7280" }}
                >
                  R$ 98.2k
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#3B82F6" }}
                  >
                    Lucro Líquido
                  </span>
                  <div className="flex items-center mt-1">
                    <TrendingUp
                      className="h-3 w-3 mr-1"
                      style={{ color: "#10B981" }}
                    />
                    <span className="text-xs" style={{ color: "#10B981" }}>
                      Crescimento constante
                    </span>
                  </div>
                </div>
                <span
                  className="text-2xl font-bold"
                  style={{ color: "#3B82F6" }}
                >
                  R$ 186.3k
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
