import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {
  Truck,
  Users,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Plus,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Calendar,
  DollarSign,
  Package,
  Weight,
  Route,
  Phone,
  Mail,
  MoreVertical,
} from "lucide-react";

const FretesPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pendentes");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFreteDetails, setSelectedFreteDetails] = useState(null);

  // Dados mockados dos fretes
  const fretesData = {
    pendentes: [
      {
        id: "F001",
        origem: "São Paulo - SP",
        destino: "Rio de Janeiro - RJ",
        distancia: "430 km",
        valor: "R$ 2.800",
        carga: "Eletrônicos",
        peso: "1.5t",
        eixosRequerido: 2,
        dataColeta: "2024-08-15",
        prazoEntrega: "2024-08-16",
        cliente: "Tech Solutions Ltda",
        observacoes: "Carga frágil, transporte cuidadoso",
      },
      {
        id: "F002",
        origem: "Campinas - SP",
        destino: "Belo Horizonte - MG",
        distancia: "520 km",
        valor: "R$ 3.200",
        carga: "Peças Automotivas",
        peso: "3.2t",
        eixosRequerido: 3,
        dataColeta: "2024-08-16",
        prazoEntrega: "2024-08-17",
        cliente: "AutoParts Brasil",
        observacoes: "",
      },
      {
        id: "F003",
        origem: "Santos - SP",
        destino: "Curitiba - PR",
        distancia: "340 km",
        valor: "R$ 2.100",
        carga: "Alimentos",
        peso: "2.8t",
        eixosRequerido: 2,
        dataColeta: "2024-08-17",
        prazoEntrega: "2024-08-17",
        cliente: "FreshFood S.A.",
        observacoes: "Perecível - refrigerado",
      },
    ],
    andamento: [
      {
        id: "F010",
        origem: "São Paulo - SP",
        destino: "Salvador - BA",
        distancia: "1.180 km",
        valor: "R$ 4.500",
        carga: "Medicamentos",
        peso: "1.8t",
        eixosRequerido: 2,
        motorista: "Carlos Silva",
        veiculo: "Mercedes 1318 - ABC-1234",
        dataInicio: "2024-08-14",
        previsaoChegada: "2024-08-16",
        progresso: 65,
      },
      {
        id: "F011",
        origem: "Ribeirão Preto - SP",
        destino: "Goiânia - GO",
        distancia: "520 km",
        valor: "R$ 3.100",
        carga: "Equipamentos",
        peso: "4.2t",
        eixosRequerido: 3,
        motorista: "João Santos",
        veiculo: "Volvo FH 440 - XYZ-5678",
        dataInicio: "2024-08-15",
        previsaoChegada: "2024-08-16",
        progresso: 80,
      },
    ],
    finalizados: [
      {
        id: "F020",
        origem: "São Paulo - SP",
        destino: "Porto Alegre - RS",
        distancia: "1.120 km",
        valor: "R$ 5.200",
        carga: "Móveis",
        peso: "5.5t",
        eixosRequerido: 4,
        motorista: "Pedro Lima",
        veiculo: "Scania R450 - MOV-9012",
        dataFinalizacao: "2024-08-13",
        avaliacaoCliente: 5,
        tempoViagem: "2 dias",
      },
      {
        id: "F021",
        origem: "Campinas - SP",
        destino: "Brasília - DF",
        distancia: "880 km",
        valor: "R$ 4.100",
        carga: "Documentos",
        peso: "0.5t",
        eixosRequerido: 2,
        motorista: "Ana Costa",
        veiculo: "Ford Cargo - DOC-3456",
        dataFinalizacao: "2024-08-12",
        avaliacaoCliente: 4,
        tempoViagem: "1 dia",
      },
    ],
  };

  const userProfile = {
    name: "João Silva",
    role: "Administrador",
    avatar: null,
    status: "online",
  };

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

  const tabs = [
    {
      id: "pendentes",
      label: "Pendentes",
      count: fretesData.pendentes.length,
      color: "#F59E0B",
    },
    {
      id: "andamento",
      label: "Em Andamento",
      count: fretesData.andamento.length,
      color: "#8B5CF6",
    },
    {
      id: "finalizados",
      label: "Finalizados",
      count: fretesData.finalizados.length,
      color: "#10B981",
    },
  ];

  const renderFreteCard = (frete, tipo) => (
    <div
      key={frete.id}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
    >
      {/* Header do Card */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className="p-2 rounded-lg"
            style={{
              backgroundColor: `${tabs.find((t) => t.id === tipo)?.color}15`,
            }}
          >
            <Package
              className="h-4 w-4"
              style={{ color: tabs.find((t) => t.id === tipo)?.color }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: "#222222" }}>
              {frete.id}
            </h3>
            <p className="text-xs" style={{ color: "#4B5563" }}>
              {tipo === "pendentes"
                ? `Coleta: ${new Date(frete.dataColeta).toLocaleDateString(
                    "pt-BR"
                  )}`
                : tipo === "andamento"
                ? `Iniciado: ${new Date(frete.dataInicio).toLocaleDateString(
                    "pt-BR"
                  )}`
                : `Finalizado: ${new Date(
                    frete.dataFinalizacao
                  ).toLocaleDateString("pt-BR")}`}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setSelectedFreteDetails(frete)}
          >
            <Eye className="h-4 w-4" style={{ color: "#4B5563" }} />
          </button>
          <div className="relative">
            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="h-4 w-4" style={{ color: "#4B5563" }} />
            </button>
          </div>
        </div>
      </div>

      {/* Rota */}
      <div className="flex items-center space-x-2 mb-4 p-3 bg-gray-50 rounded-lg">
        <MapPin className="h-4 w-4" style={{ color: "#4B5563" }} />
        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: "#222222" }}>
            {frete.origem} → {frete.destino}
          </p>
          <p className="text-xs" style={{ color: "#4B5563" }}>
            {frete.distancia}
          </p>
        </div>
      </div>

      {/* Informações principais */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: "#4B5563" }}>
            Valor
          </p>
          <p className="text-sm font-semibold" style={{ color: "#10B981" }}>
            {frete.valor}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: "#4B5563" }}>
            Carga
          </p>
          <p className="text-sm" style={{ color: "#222222" }}>
            {frete.carga}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: "#4B5563" }}>
            Peso
          </p>
          <p className="text-sm" style={{ color: "#222222" }}>
            {frete.peso}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: "#4B5563" }}>
            Eixos
          </p>
          <p className="text-sm" style={{ color: "#222222" }}>
            {frete.eixosRequerido}
          </p>
        </div>
      </div>

      {/* Informações específicas por tipo */}
      {tipo === "andamento" && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium" style={{ color: "#4B5563" }}>
              Progresso
            </p>
            <p className="text-xs" style={{ color: "#4B5563" }}>
              {frete.progresso}%
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${frete.progresso}%`,
                backgroundColor: "#8B5CF6",
              }}
            ></div>
          </div>
          <p className="text-xs mt-2" style={{ color: "#4B5563" }}>
            Motorista: {frete.motorista} • {frete.veiculo}
          </p>
        </div>
      )}

      {tipo === "finalizados" && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: "#059669" }}>
              Motorista: {frete.motorista}
            </p>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor:
                      i < frete.avaliacaoCliente ? "#10B981" : "#E5E7EB",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
        {tipo === "pendentes" && (
          <>
            <button
              className="flex-1 py-2 px-3 text-xs font-medium text-white rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#3B82F6" }}
            >
              Oferecer Frete
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Edit className="h-4 w-4" style={{ color: "#4B5563" }} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Trash2 className="h-4 w-4" style={{ color: "#EF4444" }} />
            </button>
          </>
        )}
        {tipo === "andamento" && (
          <>
            <button
              className="flex-1 py-2 px-3 text-xs font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              style={{ color: "#4B5563" }}
            >
              Rastrear
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Phone className="h-4 w-4" style={{ color: "#4B5563" }} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Mail className="h-4 w-4" style={{ color: "#4B5563" }} />
            </button>
          </>
        )}
        {tipo === "finalizados" && (
          <>
            <button
              className="flex-1 py-2 px-3 text-xs font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              style={{ color: "#4B5563" }}
            >
              Ver Relatório
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Edit className="h-4 w-4" style={{ color: "#4B5563" }} />
            </button>
          </>
        )}
      </div>
    </div>
  );

  const renderModal = () => {
    if (!selectedFreteDetails) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-lg font-semibold"
                style={{ color: "#222222" }}
              >
                Detalhes do Frete {selectedFreteDetails.id}
              </h3>
              <button
                onClick={() => setSelectedFreteDetails(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="h-5 w-5" style={{ color: "#4B5563" }} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2" style={{ color: "#222222" }}>
                  Rota
                </h4>
                <p className="text-sm" style={{ color: "#4B5563" }}>
                  <strong>Origem:</strong> {selectedFreteDetails.origem}
                  <br />
                  <strong>Destino:</strong> {selectedFreteDetails.destino}
                  <br />
                  <strong>Distância:</strong> {selectedFreteDetails.distancia}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1" style={{ color: "#222222" }}>
                    Valor
                  </h4>
                  <p className="text-sm" style={{ color: "#4B5563" }}>
                    {selectedFreteDetails.valor}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1" style={{ color: "#222222" }}>
                    Peso
                  </h4>
                  <p className="text-sm" style={{ color: "#4B5563" }}>
                    {selectedFreteDetails.peso}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-1" style={{ color: "#222222" }}>
                  Carga
                </h4>
                <p className="text-sm" style={{ color: "#4B5563" }}>
                  {selectedFreteDetails.carga}
                </p>
              </div>

              {selectedFreteDetails.cliente && (
                <div>
                  <h4 className="font-medium mb-1" style={{ color: "#222222" }}>
                    Cliente
                  </h4>
                  <p className="text-sm" style={{ color: "#4B5563" }}>
                    {selectedFreteDetails.cliente}
                  </p>
                </div>
              )}

              {selectedFreteDetails.observacoes && (
                <div>
                  <h4 className="font-medium mb-1" style={{ color: "#222222" }}>
                    Observações
                  </h4>
                  <p className="text-sm" style={{ color: "#4B5563" }}>
                    {selectedFreteDetails.observacoes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F9FA" }}>
      {/* Header Principal */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo e Nome da Empresa */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div
                  className="bg-blue-500 p-2 rounded-lg"
                  style={{ backgroundColor: "#3B82F6" }}
                >
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span
                    className="text-xl font-bold"
                    style={{ color: "#222222" }}
                  >
                    NALM GO
                  </span>
                  <p className="text-sm" style={{ color: "#4B5563" }}>
                    Transportes Silva & Cia
                  </p>
                </div>
              </div>
            </div>

            {/* Navegação Central */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: "#4B5563" }}
              >
                Dashboard
              </button>

              <button
                onClick={() => navigate("/fretes")}
                className="text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: "#4B5563" }}
              >
                Fretes
              </button>

              <button
                onClick={() => navigate("/equipe")}
                className="text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: "#4B5563" }}
              >
                Equipe
              </button>

              <button
                onClick={() => navigate("/motoristas")}
                className="text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: "#4B5563" }}
              >
                Motoristas
              </button>
            </div>

            {/* Perfil do Usuário */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <Bell className="h-5 w-5" style={{ color: "#4B5563" }} />
                <span
                  className="absolute -top-1 -right-1 h-4 w-4 text-xs flex items-center justify-center text-white rounded-full"
                  style={{ backgroundColor: "#EF4444" }}
                >
                  3
                </span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span
                          className="text-sm font-medium"
                          style={{ color: "#4B5563" }}
                        >
                          {userProfile.name.charAt(0)}
                        </span>
                      </div>
                      <div
                        className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white"
                        style={{
                          backgroundColor: getStatusColor(userProfile.status),
                        }}
                      />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#222222" }}
                      >
                        {userProfile.name}
                      </p>
                      <p className="text-xs" style={{ color: "#4B5563" }}>
                        {getStatusText(userProfile.status)}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className="h-4 w-4"
                    style={{ color: "#4B5563" }}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2">
                      <Settings
                        className="h-4 w-4"
                        style={{ color: "#4B5563" }}
                      />
                      <span style={{ color: "#222222" }}>Editar Perfil</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2">
                      <Users className="h-4 w-4" style={{ color: "#4B5563" }} />
                      <span style={{ color: "#222222" }}>Mudar Status</span>
                    </button>
                    <hr className="my-1 border-gray-200" />
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2">
                      <LogOut
                        className="h-4 w-4"
                        style={{ color: "#EF4444" }}
                      />
                      <span style={{ color: "#EF4444" }}>Sair</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho da Página */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#222222" }}>
              Gerenciar Fretes
            </h1>
            <p className="mt-2 text-sm" style={{ color: "#4B5563" }}>
              Acompanhe e gerencie todos os seus fretes
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-3 h-4 w-4"
                style={{ color: "#4B5563" }}
              />
              <input
                type="text"
                placeholder="Buscar frete..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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

        {/* Tabs de Navegação */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-current"
                    : "border-transparent hover:border-gray-300"
                }`}
                style={{
                  color: activeTab === tab.id ? tab.color : "#4B5563",
                }}
              >
                {tab.label}
                <span
                  className="ml-2 px-2 py-1 text-xs rounded-full"
                  style={{
                    backgroundColor:
                      activeTab === tab.id ? `${tab.color}15` : "#F3F4F6",
                    color: activeTab === tab.id ? tab.color : "#6B7280",
                  }}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Grid de Cards de Fretes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fretesData[activeTab].map((frete) =>
            renderFreteCard(frete, activeTab)
          )}
        </div>

        {/* Estado vazio */}
        {fretesData[activeTab].length === 0 && (
          <div className="text-center py-12">
            <Package
              className="h-12 w-12 mx-auto mb-4"
              style={{ color: "#9CA3AF" }}
            />
            <h3
              className="text-lg font-medium mb-2"
              style={{ color: "#374151" }}
            >
              Nenhum frete encontrado
            </h3>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Não há fretes {activeTab} no momento.
            </p>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {renderModal()}
    </div>
  );
};

export default FretesPage;
