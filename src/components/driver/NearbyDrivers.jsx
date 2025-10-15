import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

const NearbyDrivers = ({ empresaId }) => {
  const [motoristas, setMotoristas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [raio, setRaio] = useState(30);

  const buscarMotoristasPróximos = async () => {
    if (!empresaId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.get(`/api/proximidade/empresa/${empresaId}/motoristas?raio=${raio}`);

      if (response.success) {
        console.log('🚛 Motoristas recebidos:', response.motoristas);
        console.log('📞 Telefones:', response.motoristas.map(m => ({ nome: m.nome, telefone: m.telefone })));
        setMotoristas(response.motoristas);
      } else {
        setError('Erro ao buscar motoristas próximos');
      }
    } catch (err) {
      console.error('Erro ao buscar motoristas:', err);
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (empresaId) {
      buscarMotoristasPróximos();
    }
  }, [empresaId, raio]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'disponivel':
        return 'text-green-600 bg-green-100';
      case 'ocupado':
        return 'text-yellow-600 bg-yellow-100';
      case 'em_frete':
        return 'text-blue-600 bg-blue-100';
      case 'offline':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'disponivel':
        return 'Disponível';
      case 'ocupado':
        return 'Ocupado';
      case 'em_frete':
        return 'Em Frete';
      case 'offline':
        return 'Offline';
      default:
        return 'Desconhecido';
    }
  };

  const getTipoVinculoColor = (tipo) => {
    return tipo === 'proprio' ? 'text-purple-600 bg-purple-100' : 'text-orange-600 bg-orange-100';
  };

  const formatDistance = (distance) => {
    return parseFloat(distance).toFixed(1);
  };

  const formatLastUpdate = (timestamp) => {
    if (!timestamp) return 'Nunca';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffMinutes < 1) return 'Agora mesmo';
    if (diffMinutes < 60) return `${diffMinutes}min atrás`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          🚛 Motoristas Próximos
        </h2>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Raio:</label>
          <select
            value={raio}
            onChange={(e) => setRaio(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={10}>10km</option>
            <option value={20}>20km</option>
            <option value={30}>30km</option>
            <option value={50}>50km</option>
            <option value={100}>100km</option>
          </select>

          <button
            onClick={buscarMotoristasPróximos}
            disabled={loading}
            className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? '⏳' : '🔄'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Buscando motoristas...</p>
        </div>
      ) : motoristas.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>📍 Nenhum motorista encontrado em um raio de {raio}km</p>
          <p className="text-sm mt-2">Tente aumentar o raio de busca</p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Encontrados {motoristas.length} motoristas em um raio de {raio}km
          </p>

          <div className="grid gap-4">
            {motoristas.map((motorista) => (
              <div key={motorista.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {motorista.nome}
                    </h3>
                    <div className="space-y-1 mt-1">
                      {motorista.codigo && (
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">Código:</span> {motorista.codigo}
                        </p>
                      )}
                      {motorista.usuario && (
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">Usuário:</span> {motorista.usuario}
                        </p>
                      )}
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Email:</span> {motorista.email}
                      </p>
                      {motorista.telefone && (
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">Telefone:</span> {motorista.telefone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoVinculoColor(motorista.tipo_vinculo)}`}>
                      {motorista.tipo_vinculo === 'proprio' ? '🏢 Próprio' : '🤝 Terceirizado'}
                    </span>

                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(motorista.status_disponibilidade)}`}>
                      {getStatusText(motorista.status_disponibilidade)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mt-3 pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-gray-500">📍 Distância:</span>
                    <span className="font-medium ml-1">{formatDistance(motorista.distancia_km)} km</span>
                  </div>

                  <div>
                    <span className="text-gray-500">🕐 Última localização:</span>
                    <span className="font-medium ml-1">{formatLastUpdate(motorista.ultima_localizacao)}</span>
                  </div>
                </div>

                {motorista.status_disponibilidade === 'disponivel' && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 text-sm font-medium">
                      💬 Contactar Motorista
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NearbyDrivers;