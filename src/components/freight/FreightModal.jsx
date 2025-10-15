import React, { useState, useEffect, useCallback } from "react";
import { XCircle, UserCheck, MapPin } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import apiService from "../../services/apiService";

const FreightModal = ({ 
  isOpen, 
  mode, 
  frete, 
  motoristasDisponiveis,
  onClose, 
  onSave, 
  onOffer 
}) => {
  const [formData, setFormData] = useState({
    origem: "",
    destino: "",
    distancia: "",
    valor: "",
    valorEmpresa: "",
    carga: "solta",
    peso: "",
    eixosRequerido: 3,
    observacoes: "",
    disponivelTerceiros: false,
    dataColeta: "",
    dataEntregaPrevista: "",
  });

  const [calculandoDistancia, setCalculandoDistancia] = useState(false);
  const [erroDistancia, setErroDistancia] = useState(null);

  // Função para calcular distância automaticamente
  const calcularDistanciaAutomatica = useCallback(async (origem, destino) => {
    if (!origem || !destino || origem.length < 3 || destino.length < 3) {
      return;
    }

    try {
      setCalculandoDistancia(true);
      setErroDistancia(null);

      const response = await apiService.calcularDistancia(origem, destino);

      if (response.success) {
        setFormData(prev => ({
          ...prev,
          distancia: response.data.distancia // "85.2 km"
        }));
      } else {
        setErroDistancia("Não foi possível calcular a distância");
      }
    } catch (error) {
      console.error("Erro ao calcular distância:", error);
      setErroDistancia("Erro ao calcular distância entre cidades");
    } finally {
      setCalculandoDistancia(false);
    }
  }, []);

  // UseEffect para calcular distância quando origem e destino mudarem
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.origem && formData.destino && (mode === "novo" || mode === "editar")) {
        calcularDistanciaAutomatica(formData.origem, formData.destino);
      }
    }, 1500); // Delay de 1.5 segundos para evitar muitas chamadas

    return () => clearTimeout(timeoutId);
  }, [formData.origem, formData.destino, calcularDistanciaAutomatica, mode]);

  // Atualizar form quando frete mudar
  useEffect(() => {
    if (frete && (mode === "editar" || mode === "detalhes")) {
      setFormData({
        origem: frete.origem || "",
        destino: frete.destino || "",
        distancia: frete.distancia || "",
        valor: frete.valor?.toString() || "",
        valorEmpresa: frete.valor_empresa?.toString() || "",
        carga: frete.tipo_carga || frete.carga || "solta",
        peso: frete.peso || "",
        eixosRequerido: frete.eixos_requeridos || 3,
        observacoes: frete.observacoes || "",
        disponivelTerceiros: frete.disponivel_terceiros || false,
        dataColeta: frete.data_coleta ? new Date(frete.data_coleta).toISOString().slice(0, 16) : "",
        dataEntregaPrevista: frete.data_entrega_prevista ? new Date(frete.data_entrega_prevista).toISOString().slice(0, 16) : "",
      });
    } else {
      // Reset para novo frete
      setFormData({
        origem: "",
        destino: "",
        distancia: "",
        valor: "",
        valorEmpresa: "",
        carga: "solta",
        peso: "",
        eixosRequerido: 3,
        observacoes: "",
        disponivelTerceiros: false,
        dataColeta: "",
        dataEntregaPrevista: "",
      });
    }
  }, [frete, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🔧 DEBUG FreightModal - dados enviados:", {
      mode,
      freteId: mode === "editar" ? frete.id : null,
      formData: formData,
      disponivelTerceiros: formData.disponivelTerceiros,
      typeOfDisponivelTerceiros: typeof formData.disponivelTerceiros
    });

    const result = await onSave(mode === "editar" ? frete.id : null, formData);

    if (result.success) {
      alert(result.message);
      onClose();
    } else {
      alert(`Erro: ${result.error}`);
    }
  };

  const handleOfferToDriver = async (motorista) => {
    const result = await onOffer(frete.id, motorista.id);
    
    if (result.success) {
      alert(`Frete oferecido para ${motorista.nome} com sucesso!`);
      onClose();
    } else {
      alert(`Erro ao oferecer frete: ${result.error}`);
    }
  };

  if (!isOpen) return null;

  // Modal de detalhes
  if (mode === "detalhes") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-lg w-full shadow-lg overflow-auto max-h-[90vh]">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {frete?.codigo_frete || frete?.id} - Detalhes
              </h2>
              <button onClick={onClose}>
                <XCircle className="h-6 w-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="space-y-3">
              <p><strong>Origem:</strong> {frete?.origem}</p>
              <p><strong>Destino:</strong> {frete?.destino}</p>
              {frete?.distancia && <p><strong>Distância:</strong> {frete.distancia}</p>}

              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p><strong>💰 Valor da Empresa:</strong> {formatCurrency(frete?.valor_empresa)}</p>
                <p><strong>🚛 Valor do Motorista:</strong> {formatCurrency(frete?.valor)}</p>
                {frete?.valor_empresa && frete?.valor && (
                  <p className="text-green-700 font-semibold">
                    <strong>💵 Lucro:</strong> {formatCurrency(frete.valor_empresa - frete.valor)}
                  </p>
                )}
              </div>

              <p><strong>📦 Tipo de Carga:</strong> {frete?.tipo_carga === 'containerizada' ? '🚚 Containerizada' : '📋 Carga Solta'}</p>
              {frete?.peso && <p><strong>Peso:</strong> {frete.peso}</p>}
              <p><strong>Eixos:</strong> {frete?.eixos_requeridos || 3}</p>
              {frete?.observacoes && (
                <p><strong>Observações:</strong> {frete.observacoes}</p>
              )}
              {frete?.data_coleta && (
                <p><strong>📅 Data de Coleta:</strong> {new Date(frete.data_coleta).toLocaleString('pt-BR')}</p>
              )}
              {frete?.data_entrega_prevista && (
                <p><strong>🚚 Data de Entrega Prevista:</strong> {new Date(frete.data_entrega_prevista).toLocaleString('pt-BR')}</p>
              )}
              <p><strong>Disponível para terceiros:</strong> {frete?.disponivel_terceiros ? 'Sim' : 'Não'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modal de formulário (novo/editar)
  if (mode === "novo" || mode === "editar") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-lg w-full shadow-lg overflow-auto max-h-[90vh]">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {mode === "novo" ? "Novo Frete" : `Editar ${frete?.codigo_frete || frete?.id}`}
              </h2>
              <button onClick={onClose}>
                <XCircle className="h-6 w-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Origem"
                value={formData.origem}
                onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded"
              />
              
              <input
                type="text"
                placeholder="Destino"
                value={formData.destino}
                onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded"
              />
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Distância (calculada automaticamente)"
                  value={formData.distancia}
                  onChange={(e) => setFormData({ ...formData, distancia: e.target.value })}
                  className={`w-full border px-3 py-2 rounded pr-8 ${
                    calculandoDistancia ? 'bg-blue-50' : ''
                  } ${
                    erroDistancia ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {calculandoDistancia && (
                  <MapPin className="absolute right-2 top-2.5 h-4 w-4 text-blue-500 animate-pulse" />
                )}
                {erroDistancia && (
                  <p className="text-xs text-red-500 mt-1">{erroDistancia}</p>
                )}
                {formData.origem && formData.destino && !calculandoDistancia && !erroDistancia && (
                  <p className="text-xs text-gray-500 mt-1">
                    Distância calculada automaticamente via Google Maps
                  </p>
                )}
              </div>
              
              {/* Valores - Empresa e Motorista */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor da Empresa (cliente paga)
                  </label>
                  <input
                    type="text"
                    placeholder="ex: 10000.00"
                    value={formData.valorEmpresa}
                    onChange={(e) => setFormData({ ...formData, valorEmpresa: e.target.value })}
                    required
                    className="w-full border border-green-300 px-3 py-2 rounded focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor do Motorista (recebe)
                  </label>
                  <input
                    type="text"
                    placeholder="ex: 3000.00"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    required
                    className="w-full border border-blue-300 px-3 py-2 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Cálculo do Lucro */}
              {formData.valorEmpresa && formData.valor && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-yellow-800">
                    Lucro Estimado: {formatCurrency((parseFloat(formData.valorEmpresa) || 0) - (parseFloat(formData.valor) || 0))}
                  </p>
                </div>
              )}

              {/* Tipo de Carga - Radio Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Carga
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="carga"
                      value="containerizada"
                      checked={formData.carga === 'containerizada'}
                      onChange={(e) => setFormData({ ...formData, carga: e.target.value })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Containerizada
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="carga"
                      value="solta"
                      checked={formData.carga === 'solta'}
                      onChange={(e) => setFormData({ ...formData, carga: e.target.value })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Carga Solta
                    </span>
                  </label>
                </div>
              </div>
              
              <input
                type="text"
                placeholder="Peso (opcional)"
                value={formData.peso}
                onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              
              <input
                type="number"
                min={1}
                max={10}
                placeholder="Eixos Requeridos"
                value={formData.eixosRequerido}
                onChange={(e) => setFormData({ ...formData, eixosRequerido: Number(e.target.value) })}
                required
                className="w-full border px-3 py-2 rounded"
              />
              
              <textarea
                placeholder="Observações (opcional)"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                rows="3"
              />

              {/* Data de Coleta e Data de Entrega Prevista */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Coleta
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.dataColeta}
                    onChange={(e) => setFormData({ ...formData, dataColeta: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Entrega Prevista
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.dataEntregaPrevista}
                    onChange={(e) => setFormData({ ...formData, dataEntregaPrevista: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="disponivelTerceiros"
                  checked={formData.disponivelTerceiros}
                  onChange={(e) => setFormData({ ...formData, disponivelTerceiros: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="disponivelTerceiros" className="text-sm font-medium text-gray-700">
                  Disponibilizar para terceiros (motoristas avulsos podem se candidatar)
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                {mode === "novo" ? "Criar Frete" : "Salvar Alterações"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Modal de oferecer frete
  if (mode === "oferecer") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-lg w-full shadow-lg overflow-auto max-h-[90vh]">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Oferecer Frete - {frete?.codigo_frete || frete?.id}
              </h2>
              <button onClick={onClose}>
                <XCircle className="h-6 w-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900">Detalhes do Frete:</h3>
              <p className="text-sm text-blue-700">
                {frete?.origem} → {frete?.destino}
              </p>
              <p className="text-sm text-blue-700">
                Valor: {formatCurrency(frete?.valor)} | Eixos: {frete?.eixos_requeridos || 3}
              </p>
            </div>

            {!motoristasDisponiveis || motoristasDisponiveis.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-700">Nenhum motorista livre disponível na equipe.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Adicione motoristas agregados na aba Equipe.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">
                  Motoristas Disponíveis ({motoristasDisponiveis.length}):
                </h4>
                {motoristasDisponiveis.map((motorista) => (
                  <div
                    key={motorista.id}
                    className="flex justify-between items-center border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleOfferToDriver(motorista)}
                  >
                    <div>
                      <p className="font-semibold">{motorista.nome}</p>
                      <p className="text-sm text-gray-600">
                        Código: {motorista.codigo} | Status: {motorista.status_disponibilidade}
                      </p>
                    </div>
                    <UserCheck className="h-5 w-5 text-green-600" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default FreightModal;