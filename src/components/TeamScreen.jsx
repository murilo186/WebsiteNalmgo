import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import apiService from "../services/apiService";

import {
  Users,
  UserCheck,
  Truck,
  Search,
  Plus,
  Mail,
  Eye,
  Edit,
  XCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
} from "lucide-react";

const GestaoEquipe = () => {
  const [activeTab, setActiveTab] = useState("colaboradores");
  const [activeDriverTab, setActiveDriverTab] = useState("agregados");
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para dados do backend
  const [colaboradores, setColaboradores] = useState([]);
  const [motoristasAgregados, setMotoristasAgregados] = useState([]);
  const [motoristasTerceirizados, setMotoristasTerceirizados] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para modal de adicionar motorista
  const [showAddMotoristaModal, setShowAddMotoristaModal] = useState(false);
  const [codigoMotorista, setCodigoMotorista] = useState("");
  const [loadingAddMotorista, setLoadingAddMotorista] = useState(false);
  const inputRef = useRef(null);

  // Dados da empresa (virá do backend)
  const [empresaData, setEmpresaData] = useState({
    id: null,
    nome: "Carregando...",
    colaboradores: 0,
    agregados: 0,
    terceirizados: 0,
  });

useEffect(() => {
  // Pegar dados da empresa do localStorage
  const empresaLogada = JSON.parse(localStorage.getItem('frete_app_user') || '{}');
  console.log('🏢 Empresa logada:', empresaLogada);
  
  if (empresaLogada.id) {
    setEmpresaData(prev => ({
      ...prev,
      id: empresaLogada.id,
      nome: empresaLogada.nome_empresa || empresaLogada.nome
    }));
  }
  
  carregarDadosEquipe();
}, []);

  const carregarDadosEquipe = async () => {
  try {
    setLoading(true);
    const empresaLogada = JSON.parse(localStorage.getItem('frete_app_user') || '{}');
    console.log('🔍 Carregando equipe para empresa:', empresaLogada);
    
    if (!empresaLogada.id) {
      console.error("ID da empresa não encontrado no localStorage");
      alert("Erro: Faça login novamente");
      return;
    }

    // Buscar motoristas agregados da empresa
    console.log('📞 Chamando API para empresa ID:', empresaLogada.id);
    const response = await apiService.getMotoristasEmpresa(empresaLogada.id);
    console.log('📋 Resposta da API:', response);
    
    if (response.success) {
      console.log('✅ Motoristas carregados:', response.motoristas);
      setMotoristasAgregados(response.motoristas);
      setEmpresaData(prev => ({
        ...prev,
        agregados: response.motoristas.length
      }));
    } else {
      console.error('❌ Erro na resposta:', response.error);
    }
    
  } catch (error) {
    console.error("❌ Erro ao carregar equipe:", error);
    alert("Erro ao carregar dados da equipe: " + error.message);
  } finally {
    setLoading(false);
  }
};

const adicionarMotoristaPorCodigo = async () => {
  if (!codigoMotorista.trim()) {
    alert("Digite o código do motorista");
    return;
  }

  const empresaLogada = JSON.parse(localStorage.getItem('frete_app_user') || '{}');
  if (!empresaLogada.id) {
    alert("Erro: ID da empresa não encontrado. Faça login novamente.");
    return;
  }

  setLoadingAddMotorista(true);
  
  try {
    console.log('📤 Enviando convite para:', codigoMotorista, 'empresa:', empresaLogada.id);
    const response = await apiService.enviarConvite(empresaLogada.id, codigoMotorista.trim().toUpperCase());
    console.log('📨 Resposta do convite:', response);
    
    if (response.success) {
      setCodigoMotorista("");
      setShowAddMotoristaModal(false);
      alert(response.message);
      
      // Recarregar lista após 2 segundos (tempo para o motorista aceitar)
      setTimeout(() => {
        carregarDadosEquipe();
      }, 2000);
    } else {
      alert(response.error || "Erro ao enviar convite");
    }
    
  } catch (error) {
    console.error("❌ Erro ao enviar convite:", error);
    alert(error.message || "Erro ao enviar convite. Verifique o código e tente novamente.");
  } finally {
    setLoadingAddMotorista(false);
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
              {colaborador.nome?.substring(0, 2).toUpperCase() || "??"}
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

  const getStatusColor = (status) => {
  switch (status) {
    case "online": return "#10B981";
    case "ausente": return "#F59E0B";
    case "ocupado": return "#EF4444";
    case "livre": return "#10B981";
    case "em-frete": return "#F59E0B";
    default: return "#6B7280";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "online": return "Online";
    case "ausente": return "Ausente";
    case "ocupado": return "Ocupado";
    case "livre": return "Livre";
    case "em-frete": return "Em Frete";
    default: return "Desconectado";
  }
};

  const getStatusIcon = (status) => {
  switch (status) {
    case "online":
    case "livre": return CheckCircle;
    case "ausente": return Clock;
    case "ocupado":
    case "em-frete": return AlertCircle;
    default: return XCircle;
  }
};

  const MotoristaCard = ({ motorista, tipo = "agregado" }) => {
    const status = motorista.status || "livre";
  const StatusIcon = getStatusIcon(status);
  


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
              {motorista.nome?.substring(0, 2).toUpperCase() || "??"}
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
              {tipo === "agregado" ? "Motorista Agregado" : "Motorista Terceirizado"}
            </p>
            <p className="text-xs" style={{ color: "#6B7280" }}>
              Código: {motorista.codigo}
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

        {motorista.veiculo && (
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Truck className="h-4 w-4" style={{ color: "#3B82F6" }} />
              <span className="text-sm font-medium" style={{ color: "#222222" }}>
                {motorista.veiculo.modelo || "Veículo não informado"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span style={{ color: "#4B5563" }}>Placa: </span>
                <span style={{ color: "#222222" }}>
                  {motorista.veiculo.placa || "N/A"}
                </span>
              </div>
              <div>
                <span style={{ color: "#4B5563" }}>Eixos: </span>
                <span style={{ color: "#222222" }}>
                  {motorista.veiculo.eixos || "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <Star
              className="h-4 w-4 fill-current"
              style={{ color: "#F59E0B" }}
            />
            <span className="text-sm font-medium" style={{ color: "#222222" }}>
              {motorista.avaliacoes || "5.0"}
            </span>
          </div>
          {tipo === "terceirizado" && motorista.precoKm && (
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

  const AddMotoristaModal = () => {
    if (!showAddMotoristaModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Adicionar Motorista Agregado</h2>
            <button 
              onClick={() => {
                setShowAddMotoristaModal(false);
                setCodigoMotorista("");
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">
              Digite o código de vinculação do motorista para enviar um convite à equipe.
            </p>
            
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código do Motorista
            </label>
            <input
              ref={inputRef}
              type="text"
              value={codigoMotorista}
              onChange={(e) => setCodigoMotorista(e.target.value)}
              placeholder="Ex: MG12345"
              maxLength={7}
              autoFocus
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Formato: 2 letras + 5 números (ex: MG12345)
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => {
                setShowAddMotoristaModal(false);
                setCodigoMotorista("");
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              onClick={adicionarMotoristaPorCodigo}
              disabled={loadingAddMotorista || !codigoMotorista.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loadingAddMotorista ? "Enviando..." : "Enviar Convite"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando equipe...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F9FA" }}>
      <Header companyName={empresaData.nome} />
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
              {motoristasAgregados.length}
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

              {colaboradores.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="mx-auto mb-4" size={48} />
                  <p>Nenhum colaborador encontrado.</p>
                  <p className="text-sm">Adicione colaboradores à sua equipe.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {colaboradores.map((colaborador) => (
                    <ColaboradorCard
                      key={colaborador.id}
                      colaborador={colaborador}
                    />
                  ))}
                </div>
              )}
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
                {activeDriverTab === "agregados" && (
                  <button
                    onClick={() => setShowAddMotoristaModal(true)}
                    className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white hover:shadow-lg transition-all"
                    style={{ backgroundColor: "#10B981" }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar por Código
                  </button>
                )}
              </div>

              {activeDriverTab === "agregados" ? (
                motoristasAgregados.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <UserCheck className="mx-auto mb-4" size={48} />
                    <p>Nenhum motorista agregado encontrado.</p>
                    <p className="text-sm">Use o código de vinculação para adicionar motoristas à sua equipe.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {motoristasAgregados.map((motorista) => (
                      <MotoristaCard
                        key={motorista.id}
                        motorista={motorista}
                        tipo="agregado"
                      />
                    ))}
                  </div>
                )
              ) : (
                motoristasTerceirizados.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Truck className="mx-auto mb-4" size={48} />
                    <p>Nenhum motorista terceirizado disponível.</p>
                    <p className="text-sm">Motoristas terceirizados aparecerão aqui quando disponíveis.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {motoristasTerceirizados.map((motorista) => (
                      <MotoristaCard
                        key={motorista.id}
                        motorista={motorista}
                        tipo="terceirizado"
                      />
                    ))}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      <AddMotoristaModal />
    </div>
    </div>
  );
};  

export default GestaoEquipe;