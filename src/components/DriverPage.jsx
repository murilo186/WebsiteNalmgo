import Header from "./Header";
import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiMapPin,
  FiTruck,
  FiStar,
  FiFilter,
  FiEye,
  FiSend,
  FiPhone,
  FiCalendar,
  FiDollarSign,
  FiBell,
} from "react-icons/fi";

const EncontrarMotorista = () => {
  
  const [filtros, setFiltros] = useState({
    origem: "",
    destino: "",
    tipoVeiculo: "",
    eixos: "",
    raioKm: 50,
  });

  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [motoristaSelecionado, setMotoristaSelecionado] = useState(null);
  const [showOfertaModal, setShowOfertaModal] = useState(false);

  // Mock data de motoristas terceirizados disponíveis
  const [motoristas] = useState([
    {
      id: 1,
      nome: "Carlos Silva",
      foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      avaliacao: 4.8,
      totalAvaliacoes: 127,
      localizacao: "Santos, SP",
      distancia: 12,
      veiculo: {
        modelo: "Scania R450",
        placa: "ABC-1234",
        eixos: 3,
        capacidade: "25 ton",
        ano: 2020,
      },
      preco: "R$ 2,50/km",
      disponibilidade: "Disponível agora",
      especialidades: ["Carga Seca", "Refrigerada"],
      telefone: "(13) 99999-9999",
      ultimaViagem: "2 dias atrás",
      status: "online",
    },
    {
      id: 2,
      nome: "Maria Santos",
      foto: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face",
      avaliacao: 4.9,
      totalAvaliacoes: 89,
      localizacao: "São Paulo, SP",
      distancia: 25,
      veiculo: {
        modelo: "Volvo FH540",
        placa: "XYZ-5678",
        eixos: 4,
        capacidade: "30 ton",
        ano: 2021,
      },
      preco: "R$ 2,80/km",
      disponibilidade: "Disponível hoje",
      especialidades: ["Carga Perigosa", "Granéis"],
      telefone: "(11) 88888-8888",
      ultimaViagem: "1 dia atrás",
      status: "online",
    },
    {
      id: 3,
      nome: "João Oliveira",
      foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      avaliacao: 4.6,
      totalAvaliacoes: 203,
      localizacao: "Campinas, SP",
      distancia: 45,
      veiculo: {
        modelo: "Mercedes Actros",
        placa: "DEF-9012",
        eixos: 5,
        capacidade: "40 ton",
        ano: 2019,
      },
      preco: "R$ 2,30/km",
      disponibilidade: "Disponível amanhã",
      especialidades: ["Container", "Carga Pesada"],
      telefone: "(19) 77777-7777",
      ultimaViagem: "5 dias atrás",
      status: "away",
    },
  ]);

  const [motoristasFiltrados, setMotoristasFiltrados] = useState(motoristas);

  // Filtrar motoristas
  useEffect(() => {
    let resultado = motoristas;

    if (filtros.tipoVeiculo) {
      resultado = resultado.filter((m) =>
        m.veiculo.modelo
          .toLowerCase()
          .includes(filtros.tipoVeiculo.toLowerCase())
      );
    }

    if (filtros.eixos) {
      resultado = resultado.filter(
        (m) => m.veiculo.eixos >= parseInt(filtros.eixos)
      );
    }

    setMotoristasFiltrados(resultado);
  }, [filtros, motoristas]);

  const abrirPerfilMotorista = (motorista) => {
    setMotoristaSelecionado(motorista);
  };

  const fecharPerfilMotorista = () => {
    setMotoristaSelecionado(null);
  };

  const abrirOfertaFrete = (motorista) => {
    setMotoristaSelecionado(motorista);
    setShowOfertaModal(true);
  };

  const fecharOfertaModal = () => {
    setShowOfertaModal(false);
    setMotoristaSelecionado(null);
  };

  const enviarOferta = () => {
    // Simular envio da oferta
    alert(`Oferta enviada para ${motoristaSelecionado.nome}!`);
    fecharOfertaModal();
  };

  return (
    <>
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Barra de busca e filtros */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Campos de busca principais */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cidade de origem"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filtros.origem}
                  onChange={(e) =>
                    setFiltros({ ...filtros, origem: e.target.value })
                  }
                />
              </div>

              <div className="relative">
                <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cidade de destino"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filtros.destino}
                  onChange={(e) =>
                    setFiltros({ ...filtros, destino: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-2">
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiFilter className="mr-2" />
                Filtros
              </button>

              <button className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FiSearch className="mr-2" />
                Buscar
              </button>
            </div>
          </div>

          {/* Filtros expandidos */}
          {mostrarFiltros && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Veículo
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filtros.tipoVeiculo}
                    onChange={(e) =>
                      setFiltros({ ...filtros, tipoVeiculo: e.target.value })
                    }
                  >
                    <option value="">Todos</option>
                    <option value="scania">Scania</option>
                    <option value="volvo">Volvo</option>
                    <option value="mercedes">Mercedes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mínimo de Eixos
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filtros.eixos}
                    onChange={(e) =>
                      setFiltros({ ...filtros, eixos: e.target.value })
                    }
                  >
                    <option value="">Qualquer</option>
                    <option value="2">2 eixos ou mais</option>
                    <option value="3">3 eixos ou mais</option>
                    <option value="4">4 eixos ou mais</option>
                    <option value="5">5 eixos ou mais</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Raio de Busca: {filtros.raioKm}km
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={filtros.raioKm}
                    onChange={(e) =>
                      setFiltros({ ...filtros, raioKm: e.target.value })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Resultados */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {motoristasFiltrados.length} motoristas encontrados
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {motoristasFiltrados.map((motorista) => (
              <div
                key={motorista.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Informações do motorista */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative">
                      <img
                        src={motorista.foto}
                        alt={motorista.nome}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                          motorista.status === "online"
                            ? "bg-green-400"
                            : "bg-yellow-400"
                        }`}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {motorista.nome}
                        </h3>
                        <div className="flex items-center">
                          <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">
                            {motorista.avaliacao} ({motorista.totalAvaliacoes})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <FiMapPin className="w-4 h-4 mr-1" />
                        {motorista.localizacao} • {motorista.distancia}km de
                        distância
                      </div>

                      <div className="flex items-center text-sm text-green-600 mb-3">
                        <FiCalendar className="w-4 h-4 mr-1" />
                        {motorista.disponibilidade}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {motorista.especialidades.map((esp) => (
                          <span
                            key={esp}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {esp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Informações do veículo */}
                  <div className="lg:w-80 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <FiTruck className="w-5 h-5 text-gray-600 mr-2" />
                      <h4 className="font-medium text-gray-900">
                        {motorista.veiculo.modelo}
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Placa:</span>
                        <div className="font-medium">
                          {motorista.veiculo.placa}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Eixos:</span>
                        <div className="font-medium">
                          {motorista.veiculo.eixos}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Capacidade:</span>
                        <div className="font-medium">
                          {motorista.veiculo.capacidade}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Ano:</span>
                        <div className="font-medium">
                          {motorista.veiculo.ano}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Preço:</span>
                        <span className="text-lg font-bold text-green-600">
                          {motorista.preco}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex lg:flex-col gap-2 lg:w-32">
                    <button
                      onClick={() => abrirPerfilMotorista(motorista)}
                      className="flex-1 lg:flex-none flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FiEye className="w-4 h-4 mr-2 lg:mr-0" />
                      <span className="lg:hidden">Ver Perfil</span>
                    </button>

                    <button
                      onClick={() => abrirOfertaFrete(motorista)}
                      className="flex-1 lg:flex-none flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiSend className="w-4 h-4 mr-2 lg:mr-0" />
                      <span className="lg:hidden">Enviar Oferta</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Perfil do Motorista */}
      {motoristaSelecionado && !showOfertaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Perfil do Motorista
                </h2>
                <button
                  onClick={fecharPerfilMotorista}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={motoristaSelecionado.foto}
                  alt={motoristaSelecionado.nome}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {motoristaSelecionado.nome}
                  </h3>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center">
                      <FiStar className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium">
                        {motoristaSelecionado.avaliacao}
                      </span>
                      <span className="text-gray-500 ml-1">
                        ({motoristaSelecionado.totalAvaliacoes} avaliações)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Informações de Contato
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FiPhone className="w-4 h-4 text-gray-500 mr-3" />
                      <span>{motoristaSelecionado.telefone}</span>
                    </div>
                    <div className="flex items-center">
                      <FiMapPin className="w-4 h-4 text-gray-500 mr-3" />
                      <span>{motoristaSelecionado.localizacao}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Atividade Recente
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FiCalendar className="w-4 h-4 text-gray-500 mr-3" />
                      <span>
                        Última viagem: {motoristaSelecionado.ultimaViagem}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiDollarSign className="w-4 h-4 text-gray-500 mr-3" />
                      <span>Preço médio: {motoristaSelecionado.preco}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Especialidades
                </h4>
                <div className="flex flex-wrap gap-2">
                  {motoristaSelecionado.especialidades.map((esp) => (
                    <span
                      key={esp}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                    >
                      {esp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <button
                    onClick={fecharPerfilMotorista}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => {
                      fecharPerfilMotorista();
                      abrirOfertaFrete(motoristaSelecionado);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Enviar Oferta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Oferta de Frete */}
      {showOfertaModal && motoristaSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Enviar Oferta para {motoristaSelecionado.nome}
              </h2>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Origem
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Santos, SP"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Destino
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="São Paulo, SP"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor Oferecido
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="R$ 1.500,00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Coleta
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição da Carga
                  </label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Descreva o tipo de carga, peso, dimensões..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Informações adicionais..."
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-b-xl">
              <div className="flex gap-3">
                <button
                  onClick={fecharOfertaModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={enviarOferta}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Enviar Oferta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EncontrarMotorista;
