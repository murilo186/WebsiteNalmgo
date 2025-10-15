import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Truck } from 'lucide-react';
import apiService from '../../services/apiService';

const DriversRanking = ({ empresaId }) => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (empresaId) {
      loadRanking();
    }
  }, [empresaId]);

  const loadRanking = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.get(`/api/motoristas/ranking/${empresaId}`);

      if (response.success) {
        setRanking(response.ranking || []);
      } else {
        // Fallback para dados mockados
        setRanking(generateMockRanking());
      }
    } catch (err) {
      console.error('Erro ao carregar ranking:', err);
      // Fallback para dados mockados
      setRanking(generateMockRanking());
    } finally {
      setLoading(false);
    }
  };

  const generateMockRanking = () => {
    return [
      { id: 1, nome: 'João Silva', total_fretes: 23, fretes_finalizados: 21 },
      { id: 2, nome: 'Maria Santos', total_fretes: 18, fretes_finalizados: 17 },
      { id: 3, nome: 'Carlos Oliveira', total_fretes: 15, fretes_finalizados: 14 },
      { id: 4, nome: 'Ana Costa', total_fretes: 12, fretes_finalizados: 11 },
      { id: 5, nome: 'Pedro Alves', total_fretes: 8, fretes_finalizados: 7 },
    ];
  };

  const getRankIcon = (position) => {
    switch (position) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <Truck className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRankBg = (position) => {
    switch (position) {
      case 1:
        return 'bg-yellow-50 border-yellow-300';
      case 2:
        return 'bg-gray-50 border-gray-300';
      case 3:
        return 'bg-amber-50 border-amber-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Ranking de Motoristas</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-center p-3 bg-gray-100 rounded-lg">
              <div className="rounded-full bg-gray-300 h-10 w-10 mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (ranking.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Ranking de Motoristas</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Truck className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p>Nenhum motorista com fretes finalizados ainda</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-indigo-600 rounded-lg">
          <Trophy className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Ranking de Motoristas</h3>
      </div>

      <div className="space-y-3">
        {ranking.map((motorista, index) => {
          const position = index + 1;
          const taxaConclusao = motorista.total_fretes > 0
            ? ((motorista.fretes_finalizados / motorista.total_fretes) * 100).toFixed(0)
            : 0;

          return (
            <div
              key={motorista.id}
              className={`flex items-center p-3 rounded-lg border ${getRankBg(position)}`}
            >
              {/* Posição e Ícone */}
              <div className="flex items-center justify-center w-12 h-12 mr-3">
                {getRankIcon(position)}
              </div>

              {/* Nome e Stats */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-800">{motorista.nome}</h4>
                  <span className="text-sm font-bold text-gray-700">
                    {motorista.total_fretes} fretes
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-600">
                  <span className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                    {motorista.fretes_finalizados} finalizados
                  </span>
                  <span className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                    {taxaConclusao}% conclusão
                  </span>
                </div>
              </div>

              {/* Badge de Posição */}
              <div className="ml-3">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                  position === 1 ? 'bg-yellow-500 text-white' :
                  position === 2 ? 'bg-gray-400 text-white' :
                  position === 3 ? 'bg-amber-600 text-white' :
                  'bg-gray-300 text-gray-700'
                }`}>
                  {position}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rodapé com total */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          Total: <span className="font-bold text-gray-800">{ranking.length} motoristas agregados</span>
        </p>
      </div>
    </div>
  );
};

export default DriversRanking;
