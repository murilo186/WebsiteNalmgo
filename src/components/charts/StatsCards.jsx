import React, { useEffect, useState } from 'react';
import { TrendingUp, MapPin, Trophy, Calendar, Route, Navigation } from 'lucide-react';
import apiService from '../../services/apiService';

const StatsCards = ({ empresaId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (empresaId) {
      loadStats();
    }
  }, [empresaId]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(`/api/fretes/estatisticas/${empresaId}`);

      if (response.success) {
        setStats(response.estatisticas);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(1)}k`;
    }
    return `R$ ${value.toFixed(0)}`;
  };

  const formatMes = (mesStr) => {
    if (!mesStr) return 'N/A';
    const [ano, mes] = mesStr.split('-');
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${meses[parseInt(mes) - 1]}/${ano}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/30 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Card 1: Financeiro */}
      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
          <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mr-3 shadow-lg">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          Financeiro
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
            <span className="text-sm font-bold text-green-800">Ganhos Totais</span>
            <span className="text-lg font-bold bg-gradient-to-r from-green-700 to-green-800 bg-clip-text text-transparent">
              {formatCurrency(stats.financeiro.ganhos_totais)}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200/50">
            <span className="text-sm font-bold text-blue-800">Média/Frete</span>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-700 to-blue-800 bg-clip-text text-transparent">
              {formatCurrency(stats.financeiro.media_por_frete)}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200/50">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-purple-800">Melhor Mês</span>
              <span className="text-xs text-purple-600">{formatMes(stats.financeiro.melhor_mes)}</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-700 to-purple-800 bg-clip-text text-transparent">
              {formatCurrency(stats.financeiro.valor_melhor_mes)}
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: Rotas & Distâncias */}
      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mr-3 shadow-lg">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          Rotas & KMs
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200/50">
            <span className="text-sm font-bold text-blue-800">KMs Rodados</span>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-700 to-blue-800 bg-clip-text text-transparent">
              {stats.rotas.kms_rodados.toFixed(0)} km
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200/50">
            <span className="text-sm font-bold text-indigo-800">Dist. Média</span>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-700 to-indigo-800 bg-clip-text text-transparent">
              {stats.rotas.distancia_media.toFixed(0)} km
            </span>
          </div>
          <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold text-orange-800">Rota + Rentável</span>
              <span className="text-sm font-bold text-orange-700">
                {formatCurrency(stats.rotas.valor_rota_rentavel)}
              </span>
            </div>
            <p className="text-xs text-orange-600 truncate">
              {stats.rotas.rota_mais_rentavel}
            </p>
          </div>
        </div>
      </div>

      {/* Card 3: Performance */}
      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mr-3 shadow-lg">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          Performance
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200/50">
            <span className="text-sm font-bold text-purple-800">Total Fretes</span>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-700 to-purple-800 bg-clip-text text-transparent">
              {stats.performance.total_fretes}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border border-pink-200/50">
            <span className="text-sm font-bold text-pink-800">Dias Trabalhados</span>
            <span className="text-lg font-bold bg-gradient-to-r from-pink-700 to-pink-800 bg-clip-text text-transparent">
              {stats.performance.dias_trabalhados} dias
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl border border-cyan-200/50">
            <span className="text-sm font-bold text-cyan-800">Freq. Semanal</span>
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-700 to-cyan-800 bg-clip-text text-transparent">
              {stats.performance.frequencia_semanal > 0
                ? `${stats.performance.frequencia_semanal.toFixed(1)} fretes/sem`
                : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
