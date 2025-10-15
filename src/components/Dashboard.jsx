import Header from "./Header";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useDashboard } from "../hooks/useDashboard";
import RevenueChart from "./charts/RevenueChart";
import StatusPieChart from "./charts/StatusPieChart";
import TopRoutesChart from "./charts/TopRoutesChart";
import DriversRanking from "./charts/DriversRanking";
import apiService from "../services/apiService";
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
  RefreshCw,
} from "lucide-react";

// StatCard component compacto
const StatCard = ({ icon: Icon, title, value, color, trend }) => (
  <div className="group animate-fade-in">
    {/* Card compacto */}
    <div
      className="flex items-center justify-between px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${color}15, ${color}08)`,
        border: `1px solid ${color}25`,
      }}
    >
      <div className="flex items-center space-x-2">
        <Icon className="h-4 w-4" style={{ color }} />
        <span className="text-xs font-bold" style={{ color }}>
          {title}
        </span>
      </div>
      <span className="text-lg font-bold" style={{ color }}>
        {value}
      </span>
    </div>

    {trend && (
      <div className="flex items-center mt-1 px-2 py-1 bg-green-50 rounded border border-green-200/50">
        <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
        <span className="text-xs font-medium text-green-700">+{trend}%</span>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userData } = useUser();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [empresaData, setEmpresaData] = useState({
    id: null,
    nome: "Carregando...",
  });

  // Hook para dados do dashboard
  const dashboard = useDashboard(empresaData.id);

  // Proteção de rota - redirecionar se não estiver logado
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // Carregar dados da empresa
  useEffect(() => {
    if (!userData) return;

    // Se for colaborador, usar empresa_id; se for empresa, usar id
    const empresaId = userData.empresa_id || userData.id;

    if (empresaId) {
      setEmpresaData({
        id: empresaId,
        nome: userData.nome_empresa || userData.nome,
      });
    }
  }, [userData]);

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

  if (dashboard.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 animate-fade-in">
        <Header companyName={empresaData.nome} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 p-4 sm:p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
            {/* Loading skeleton moderno */}
            <div className="space-y-4">
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-48 animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-72 animate-pulse"></div>
            </div>
          </div>

          {/* Grid de cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 animate-pulse"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-200 to-blue-300 rounded-xl"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
                    <div className="h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 animate-fade-in">
      <Header companyName={dashboard.dashboardData.company.name} />

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho da Página com glassmorphism */}
        <div className="mb-8 p-4 sm:p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600 font-medium">
                Visão geral da sua operação •{" "}
                {currentTime.toLocaleDateString("pt-BR")} às{" "}
                {currentTime.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => dashboard.carregarDashboard(true)}
                disabled={dashboard.loading}
                className="group relative overflow-hidden flex items-center justify-center px-4 py-3 min-h-[44px] bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl text-sm font-semibold text-gray-700 hover:bg-white/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 touch-manipulation disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 text-blue-600 transition-transform duration-300 ${
                    dashboard.loading ? "animate-spin" : ""
                  }`}
                />
                <span>
                  {dashboard.loading ? "Atualizando..." : "Atualizar"}
                </span>
                {!dashboard.loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                )}
              </button>
              <button className="group relative overflow-hidden flex items-center justify-center px-4 py-3 min-h-[44px] bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl text-sm font-semibold text-gray-700 hover:bg-white/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 touch-manipulation">
                <Filter className="h-4 w-4 mr-2 text-blue-600" />
                <span>Filtrar</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
              <button className="group relative overflow-hidden flex items-center justify-center px-6 py-3 min-h-[44px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-blue-500/20 touch-manipulation">
                <Plus className="h-4 w-4 mr-2 relative z-10" />
                <span className="relative z-10">Novo Frete</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Seção - Análise Financeira */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mr-3 shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Análise Financeira
            </h2>
          </div>
          <RevenueChart empresaId={empresaData.id} />
        </div>

        {/* Seção - Análise de Operações */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico de Pizza - Status dos Fretes */}
          <StatusPieChart
            fretesPendentes={dashboard.dashboardData.stats.fretesPendentes}
            fretesAndamento={dashboard.dashboardData.stats.fretesAndamento}
            fretesFinalizados={dashboard.dashboardData.stats.fretesFinalizados}
          />

          {/* Top Rotas Lucrativas */}
          <TopRoutesChart empresaId={empresaData.id} type="lucrative" />

          {/* Top Rotas Mais Usadas */}
          <TopRoutesChart empresaId={empresaData.id} type="frequent" />
        </div>

        {/* Seção - Ranking de Motoristas */}
        <div className="mb-6">
          <DriversRanking empresaId={empresaData.id} />
        </div>

        {/* Seção - Resumo Executivo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resumo Mensal */}
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
              <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mr-3 shadow-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              Este Mês
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                <span className="text-sm font-bold text-green-800">
                  Receita
                </span>
                <span className="text-lg font-bold bg-gradient-to-r from-green-700 to-green-800 bg-clip-text text-transparent">
                  R${" "}
                  {(dashboard.dashboardData.stats.receitaMes / 1000).toFixed(1)}
                  k
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200/50">
                <span className="text-sm font-bold text-blue-800">Lucro</span>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-700 to-blue-800 bg-clip-text text-transparent">
                  R$ 67.3k
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200/50">
                <span className="text-sm font-bold text-purple-800">
                  Margem
                </span>
                <span className="text-lg font-bold bg-gradient-to-r from-purple-700 to-purple-800 bg-clip-text text-transparent">
                  28.5%
                </span>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mr-3 shadow-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              Performance
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200/50">
                <span className="text-sm font-bold text-orange-800">
                  Taxa Conclusão
                </span>
                <span className="text-lg font-bold bg-gradient-to-r from-orange-700 to-orange-800 bg-clip-text text-transparent">
                  94%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200/50">
                <span className="text-sm font-bold text-green-800">
                  Eficiência
                </span>
                <span className="text-lg font-bold bg-gradient-to-r from-green-700 to-green-800 bg-clip-text text-transparent">
                  +18%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200/50">
                <span className="text-sm font-bold text-blue-800">
                  Satisfação
                </span>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-700 to-blue-800 bg-clip-text text-transparent">
                  4.7/5
                </span>
              </div>
            </div>
          </div>

          {/* Tendências */}
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl mr-3 shadow-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              Tendências
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-green-800">
                    Crescimento
                  </span>
                  <span className="text-sm font-bold text-green-700">+18%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                    style={{ width: "78%" }}
                  ></div>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-blue-800">
                    Meta Anual
                  </span>
                  <span className="text-sm font-bold text-blue-700">67%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                    style={{ width: "67%" }}
                  ></div>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-purple-800">
                    Capacidade
                  </span>
                  <span className="text-sm font-bold text-purple-700">85%</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
