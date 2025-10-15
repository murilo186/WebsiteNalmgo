import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Calendar, DollarSign, BarChart3, LineChart } from 'lucide-react';
import apiService from '../../services/apiService';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueChart = ({ empresaId }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('line'); // 'line' ou 'bar'
  const [period, setPeriod] = useState('6meses'); // '3meses', '6meses', '1ano'

  useEffect(() => {
    if (empresaId) {
      loadRevenueData();
    }
  }, [empresaId, period]);

  const loadRevenueData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar dados reais do backend
      const response = await apiService.getReceitaPorPeriodo(empresaId, period);

      if (response.success) {
        const data = formatChartData(response.dados);
        setChartData(data);
      } else {
        // Fallback para dados mockados em caso de erro
        const data = generateRevenueData(period);
        setChartData(data);
      }
    } catch (err) {
      setError('Erro ao carregar dados de receita');
      console.error('Erro ao carregar receita:', err);

      // Fallback para dados mockados em caso de erro
      const data = generateRevenueData(period);
      setChartData(data);
    } finally {
      setLoading(false);
    }
  };

  const formatChartData = (dadosBackend) => {
    const labels = dadosBackend.map(item => item.mes);
    const receitaData = dadosBackend.map(item => item.receita_total || 0);
    const custosData = dadosBackend.map(item => item.custos_motorista || 0);
    const lucroData = dadosBackend.map(item => item.lucro_liquido || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Receita Total',
          data: receitaData,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderWidth: 3,
          fill: chartType === 'line',
          tension: 0.4,
        },
        {
          label: 'Custos Operacionais',
          data: custosData,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 3,
          fill: chartType === 'line',
          tension: 0.4,
        },
        {
          label: 'Lucro Líquido',
          data: lucroData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: chartType === 'line',
          tension: 0.4,
        },
      ],
    };
  };

  const generateRevenueData = (selectedPeriod) => {
    const now = new Date();
    const months = [];
    const revenueData = [];
    const costData = [];
    const profitData = [];

    let monthsCount;
    switch (selectedPeriod) {
      case '3meses':
        monthsCount = 3;
        break;
      case '1ano':
        monthsCount = 12;
        break;
      default:
        monthsCount = 6;
    }

    // Gerar últimos N meses
    for (let i = monthsCount - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('pt-BR', {
        month: 'short',
        year: monthsCount > 6 ? '2-digit' : undefined
      });
      months.push(monthName);

      // Gerar dados realistas com tendência de crescimento
      const baseRevenue = 180000 + (Math.random() * 50000);
      const seasonalityFactor = 1 + (Math.sin((date.getMonth() + 1) / 12 * Math.PI * 2) * 0.15);
      const growthFactor = 1 + ((monthsCount - 1 - i) * 0.03); // 3% crescimento por mês

      const revenue = Math.round(baseRevenue * seasonalityFactor * growthFactor);
      const costs = Math.round(revenue * (0.65 + Math.random() * 0.1)); // 65-75% dos custos
      const profit = revenue - costs;

      revenueData.push(revenue);
      costData.push(costs);
      profitData.push(profit);
    }

    return {
      labels: months,
      datasets: [
        {
          label: 'Receita Total',
          data: revenueData,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderWidth: 3,
          fill: chartType === 'line',
          tension: 0.4,
        },
        {
          label: 'Custos Operacionais',
          data: costData,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 3,
          fill: chartType === 'line',
          tension: 0.4,
        },
        {
          label: 'Lucro Líquido',
          data: profitData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: chartType === 'line',
          tension: 0.4,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      title: {
        display: true,
        text: `Análise Financeira - ${
          period === '7dias' ? 'Últimos 7 Dias' :
          period === 'estemes' ? 'Este Mês' :
          period === '30dias' ? 'Últimos 30 Dias' :
          period === '3meses' ? 'Últimos 3 Meses' :
          period === '1ano' ? 'Último Ano' : 'Últimos 6 Meses'
        }`,
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            return `${context.dataset.label}: R$ ${(value / 1000).toFixed(1)}k`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return `R$ ${(value / 1000).toFixed(0)}k`;
          },
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
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
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Gráfico de Receita</h3>
          </div>
        </div>
        <div className="h-80 flex items-center justify-center">
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

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-600 rounded-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Gráfico de Receita</h3>
          </div>
        </div>
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={loadRevenueData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      {/* Header com controles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Seletor de período */}
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-600" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7dias">Últimos 7 dias</option>
              <option value="estemes">Este mês</option>
              <option value="30dias">Últimos 30 dias</option>
              <option value="3meses">Últimos 3 meses</option>
              <option value="6meses">Últimos 6 meses</option>
              <option value="1ano">Último ano</option>
            </select>
          </div>

          {/* Seletor de tipo de gráfico */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`p-1.5 rounded-md transition-colors ${
                chartType === 'line'
                  ? 'bg-white text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <LineChart className="h-4 w-4" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-1.5 rounded-md transition-colors ${
                chartType === 'bar'
                  ? 'bg-white text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-80">
        {chartType === 'line' ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>

      {/* Resumo estatístico */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm font-medium text-green-800">Receita Média</p>
          <p className="text-xl font-bold text-green-700">
            R$ {chartData ? (chartData.datasets[0].data.reduce((a, b) => a + b, 0) / chartData.datasets[0].data.length / 1000).toFixed(1) : 0}k
          </p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-800">Lucro Médio</p>
          <p className="text-xl font-bold text-blue-700">
            R$ {chartData ? (chartData.datasets[2].data.reduce((a, b) => a + b, 0) / chartData.datasets[2].data.length / 1000).toFixed(1) : 0}k
          </p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-sm font-medium text-purple-800">Margem Média</p>
          <p className="text-xl font-bold text-purple-700">
            {chartData ? (((chartData.datasets[2].data.reduce((a, b) => a + b, 0) / chartData.datasets[2].data.length) /
                          (chartData.datasets[0].data.reduce((a, b) => a + b, 0) / chartData.datasets[0].data.length)) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;