import Header from "./Header";

import React, { useState } from "react";
import {
  Users,
  UserCheck,
  Truck,
  Search,
  Plus,
  Mail,
  Eye,
  Edit,
  Settings,
  Bell,
  LogOut,
  ChevronDown,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";

const GestaoEquipe = () => {
  const [activeTab, setActiveTab] = useState("colaboradores");
  const [activeDriverTab, setActiveDriverTab] = useState("agregados");
  const [searchTerm, setSearchTerm] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Dados da empresa
  const empresaData = {
    nome: "Silva Transportes & Logística",
    colaboradores: 4,
    agregados: 3,
    terceirizados: 3,
  };

  // Dados mockados - Colaboradores
  const colaboradores = [
    {
      id: 1,
      nome: "Carlos Silva",
      cargo: "Administrador do Sistema",
      tipo: "admin",
      status: "online",
      avatar: "CS",
    },
    {
      id: 2,
      nome: "Maria Santos",
      cargo: "Coordenadora Operacional",
      tipo: "colaborador",
      status: "ocupado",
      avatar: "MS",
    },
    {
      id: 3,
      nome: "João Costa",
      cargo: "Assistente de Fretes",
      tipo: "colaborador",
      status: "ausente",
      avatar: "JC",
    },
    {
      id: 4,
      nome: "Ana Lima",
      cargo: "Analista Financeiro",
      tipo: "colaborador",
      status: "online",
      avatar: "AL",
    },
  ];

  // Dados mockados - Motoristas Agregados
  const motoristasAgregados = [
    {
      id: 1,
      nome: "Roberto Oliveira",
      status: "livre",
      veiculo: { placa: "ABC-1234", modelo: "Volvo FH", eixos: 3 },
      avaliacoes: 4.8,
      avatar: "RO",
    },
    {
      id: 2,
      nome: "José Carlos",
      status: "em-frete",
      veiculo: { placa: "DEF-5678", modelo: "Scania R450", eixos: 5 },
      avaliacoes: 4.9,
      avatar: "JC",
    },
    {
      id: 3,
      nome: "Marcos Silva",
      status: "livre",
      veiculo: { placa: "GHI-9012", modelo: "Mercedes Actros", eixos: 4 },
      avaliacoes: 4.7,
      avatar: "MS",
    },
  ];

  // Dados mockados - Motoristas Terceirizados
  const motoristasTerceirizados = [
    {
      id: 1,
      nome: "Fernando Lima",
      status: "livre",
      veiculo: { placa: "XYZ-9876", modelo: "Iveco Stralis", eixos: 3 },
      precoKm: 2.5,
      avaliacoes: 4.6,
      avatar: "FL",
    },
    {
      id: 2,
      nome: "Ricardo Santos",
      status: "em-frete",
      veiculo: { placa: "WVU-5432", modelo: "Volvo VM", eixos: 2 },
      precoKm: 2.3,
      avaliacoes: 4.5,
      avatar: "RS",
    },
    {
      id: 3,
      nome: "Paulo Mendes",
      status: "livre",
      veiculo: { placa: "TUV-7890", modelo: "Ford Cargo", eixos: 2 },
      precoKm: 2.2,
      avaliacoes: 4.4,
      avatar: "PM",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "#10B981";
      case "ausente":
        return "#F59E0B";
      case "ocupado":
        return "#EF4444";
      case "livre":
        return "#10B981";
      case "em-frete":
        return "#F59E0B";
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
      case "livre":
        return "Livre";
      case "em-frete":
        return "Em Frete";
      default:
        return "Desconectado";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "online":
      case "livre":
        return CheckCircle;
      case "ausente":
        return Clock;
      case "ocupado":
      case "em-frete":
        return AlertCircle;
      default:
        return XCircle;
    }
  };

  const ColaboradorCard = ({ colaborador }) => {
    const StatusIcon = getStatusIcon(colaborador.status);

    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
        {colaborador.tipo === "admin" && (
          <div
            className="absolute top-4 right-4 px-2 py-1 text-xs font-bold text-white rounded-lg"
            style={{ backgroundColor: "#F59E0B" }}
          >
            ADMIN
          </div>
        )}

        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: "#3B82F6" }}
            >
              {colaborador.avatar}
            </div>
            <div
              className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white flex items-center justify-center"
              style={{ backgroundColor: getStatusColor(colaborador.status) }}
            >
              <StatusIcon className="h-2 w-2 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg" style={{ color: "#222222" }}>
              {colaborador.nome}
            </h3>
            <p className="text-sm" style={{ color: "#4B5563" }}>
              {colaborador.cargo}
            </p>
            <span
              className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium mt-2"
              style={{
                backgroundColor: `${getStatusColor(colaborador.status)}15`,
                color: getStatusColor(colaborador.status),
              }}
            >
              {getStatusText(colaborador.status)}
            </span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button className="flex-1 py-2 px-3 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Mail className="h-4 w-4 inline mr-1" />
            Mensagem
          </button>
          {colaborador.tipo !== "admin" && (
            <button className="flex-1 py-2 px-3 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Edit className="h-4 w-4 inline mr-1" />
              Editar
            </button>
          )}
          <button
            className="py-2 px-3 text-sm font-medium text-white rounded-lg transition-colors"
            style={{ backgroundColor: "#3B82F6" }}
          >
            <Eye className="h-4 w-4 inline" />
          </button>
        </div>
      </div>
    );
  };

  const MotoristaCard = ({ motorista, tipo = "agregado" }) => {
    const StatusIcon = getStatusIcon(motorista.status);

    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold"
              style={{
                backgroundColor: tipo === "agregado" ? "#10B981" : "#8B5CF6",
              }}
            >
              {motorista.avatar}
            </div>
            <div
              className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white flex items-center justify-center"
              style={{ backgroundColor: getStatusColor(motorista.status) }}
            >
              <StatusIcon className="h-2 w-2 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg" style={{ color: "#222222" }}>
              {motorista.nome}
            </h3>
            <p className="text-sm" style={{ color: "#4B5563" }}>
              {tipo === "agregado"
                ? "Motorista Agregado"
                : "Motorista Terceirizado"}
            </p>
            <span
              className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium mt-2"
              style={{
                backgroundColor: `${getStatusColor(motorista.status)}15`,
                color: getStatusColor(motorista.status),
              }}
            >
              {getStatusText(motorista.status)}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Truck className="h-4 w-4" style={{ color: "#3B82F6" }} />
            <span className="text-sm font-medium" style={{ color: "#222222" }}>
              {motorista.veiculo.modelo}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span style={{ color: "#4B5563" }}>Placa: </span>
              <span style={{ color: "#222222" }}>
                {motorista.veiculo.placa}
              </span>
            </div>
            <div>
              <span style={{ color: "#4B5563" }}>Eixos: </span>
              <span style={{ color: "#222222" }}>
                {motorista.veiculo.eixos}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <Star
              className="h-4 w-4 fill-current"
              style={{ color: "#F59E0B" }}
            />
            <span className="text-sm font-medium" style={{ color: "#222222" }}>
              {motorista.avaliacoes}
            </span>
          </div>
          {tipo === "terceirizado" && (
            <div className="text-sm">
              <span style={{ color: "#4B5563" }}>R$ </span>
              <span className="font-semibold" style={{ color: "#222222" }}>
                {motorista.precoKm}/km
              </span>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <button className="flex-1 py-2 px-3 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Mail className="h-4 w-4 inline mr-1" />
            Mensagem
          </button>
          <button
            className="py-2 px-3 text-sm font-medium text-white rounded-lg transition-colors"
            style={{ backgroundColor: "#3B82F6" }}
          >
            <Eye className="h-4 w-4 inline" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
     

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: "#222222" }}>
            Gestão de Equipe
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#4B5563" }}>
            Gerencie colaboradores e motoristas da sua frota
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#3B82F615" }}
                >
                  <Users className="h-6 w-6" style={{ color: "#3B82F6" }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: "#4B5563" }}>
                    Colaboradores
                  </p>
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    Equipe interna
                  </p>
                </div>
              </div>
              <p className="text-2xl font-bold" style={{ color: "#222222" }}>
                {empresaData.colaboradores}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#10B98115" }}
                >
                  <UserCheck className="h-6 w-6" style={{ color: "#10B981" }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: "#4B5563" }}>
                    Agregados
                  </p>
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    Motoristas fixos
                  </p>
                </div>
              </div>
              <p className="text-2xl font-bold" style={{ color: "#222222" }}>
                {empresaData.agregados}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#8B5CF615" }}
                >
                  <Truck className="h-6 w-6" style={{ color: "#8B5CF6" }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: "#4B5563" }}>
                    Terceirizados
                  </p>
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    Disponíveis
                  </p>
                </div>
              </div>
              <p className="text-2xl font-bold" style={{ color: "#222222" }}>
                {empresaData.terceirizados}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("colaboradores")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "colaboradores"
                  ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Colaboradores</span>
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {colaboradores.length}
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("motoristas")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "motoristas"
                  ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Truck className="h-4 w-4" />
                <span>Motoristas</span>
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {motoristasAgregados.length + motoristasTerceirizados.length}
                </span>
              </div>
            </button>
          </div>

          <div className="p-6">
            {activeTab === "colaboradores" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="relative">
                    <Search
                      className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: "#4B5563" }}
                    />
                    <input
                      type="text"
                      placeholder="Buscar colaboradores..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button
                    className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white hover:shadow-lg transition-all"
                    style={{ backgroundColor: "#10B981" }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Colaborador
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {colaboradores.map((colaborador) => (
                    <ColaboradorCard
                      key={colaborador.id}
                      colaborador={colaborador}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "motoristas" && (
              <div>
                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={() => setActiveDriverTab("agregados")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeDriverTab === "agregados"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <UserCheck className="h-4 w-4" />
                      <span>Agregados</span>
                      <span className="bg-white text-green-700 px-2 py-1 rounded-full text-xs">
                        {motoristasAgregados.length}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveDriverTab("terceirizados")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeDriverTab === "terceirizados"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4" />
                      <span>Terceirizados</span>
                      <span className="bg-white text-purple-700 px-2 py-1 rounded-full text-xs">
                        {motoristasTerceirizados.length}
                      </span>
                    </div>
                  </button>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="relative">
                    <Search
                      className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: "#4B5563" }}
                    />
                    <input
                      type="text"
                      placeholder="Buscar motoristas..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button
                    className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white hover:shadow-lg transition-all"
                    style={{ backgroundColor: "#10B981" }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo{" "}
                    {activeDriverTab === "agregados"
                      ? "Agregado"
                      : "Terceirizado"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeDriverTab === "agregados"
                    ? motoristasAgregados.map((motorista) => (
                        <MotoristaCard
                          key={motorista.id}
                          motorista={motorista}
                          tipo="agregado"
                        />
                      ))
                    : motoristasTerceirizados.map((motorista) => (
                        <MotoristaCard
                          key={motorista.id}
                          motorista={motorista}
                          tipo="terceirizado"
                        />
                      ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GestaoEquipe;
