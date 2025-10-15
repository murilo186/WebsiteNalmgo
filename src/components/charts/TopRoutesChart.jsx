import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { MapPin, DollarSign, Package } from 'lucide-react';
import apiService from '../../services/apiService';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopRoutesChart = ({ empresaId, type = 'lucrative' }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (empresaId) {
      loadRoutesData();
    }
  }, [empresaId, type]);

  const loadRoutesData = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = type === 'lucrative'
        ? `/api/fretes/top-rotas-lucrativas/${empresaId}`
        : `/api/fretes/top-rotas-usadas/${empresaId}`;

      const response = await apiService.get(endpoint);

      if (response.success) {
        const data = formatChartData(response.rotas);
        setChartData(data);
      } else {
        // Fallback para dados mockados
        const data = generateMockData(type);
        setChartData(data);
      }
    } catch (err) {
      console.error('Erro ao carregar rotas:', err);
      // Fallback para dados mockados
      const data = generateMockData(type);
      setChartData(data);
    } finally {
      setLoading(false);
    }
  };

  const formatChartData = (rotas) => {
    const labels = rotas.map(r => `${r.origem} → ${r.destino}`);
    const values = type === 'lucrative'
      ? rotas.map(r => r.lucro_total || 0)
      : rotas.map(r => r.quantidade || 0);

    return {
      labels,
      datasets: [
        {
          label: type === 'lucrative' ? 'Lucro Total (R$)' : 'Quantidade de Fretes',
          data: values,
          backgroundColor: type === 'lucrative'
            ? 'rgba(34, 197, 94, 0.8)'
            : 'rgba(59, 130, 246, 0.8)',
          borderColor: type === 'lucrative'
            ? 'rgb(34, 197, 94)'
            : 'rgb(59, 130, 246)',
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    };
  };

  const generateMockData = (chartType) => {
    if (chartType === 'lucrative') {
      return {
        labels: [
          'Santos → São Paulo',
          'Rio → Brasília',
          'Curitiba → Porto Alegre',
          'Campinas → Belo Horizonte',
          'Salvador → Recife',
        ],
        datasets: [
          {
            label: 'Lucro Total (R$)',
            data: [12600, 8500, 7200, 6800, 5400],
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      };
    } else {
      return {
        labels: [
          'Santos → Sorocaba',
          'São Paulo → Rio',
          'Campinas → Santos',
          'Santos → Salvador',
          'Bragança → Santos',
        ],
        datasets: [
          {
            label: 'Quantidade de Fretes',
            data: [15, 12, 10, 8, 6],
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      };
    }
  };

  const chartOptions = {
    indexAxis: 'y', // Barras horizontais
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const value = context.parsed.x;
            if (type === 'lucrative') {
              return `Lucro: R$ ${(value / 1000).toFixed(1)}k`;
            } else {
              return `Fretes: ${value}`;
            }
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            if (type === 'lucrative') {
              return `R$ ${(value / 1000).toFixed(0)}k`;
            }
            return value;
          },
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      y: {
        ticks: {
          font: {
            size: 11,
            weight: 'bold',
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const title = type === 'lucrative'
    ? 'Top 5 Rotas Mais Lucrativas'
    : 'Top 5 Rotas Mais Usadas';

  const Icon = type === 'lucrative' ? DollarSign : Package;
  const iconColor = type === 'lucrative' ? 'bg-green-600' : 'bg-blue-600';

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-2 ${iconColor} rounded-lg`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-300 h-12 w-12"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className={`p-2 ${iconColor} rounded-lg`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>

      <div className="h-64">
        {chartData && <Bar data={chartData} options={chartOptions} />}
      </div>
    </div>
  );
};

export default TopRoutesChart;
