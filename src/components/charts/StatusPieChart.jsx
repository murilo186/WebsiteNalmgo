import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { PieChart } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatusPieChart = ({ fretesPendentes, fretesAndamento, fretesFinalizados }) => {
  const total = fretesPendentes + fretesAndamento + fretesFinalizados;

  const data = {
    labels: ['Pendentes', 'Em Andamento', 'Finalizados'],
    datasets: [
      {
        label: 'Quantidade',
        data: [fretesPendentes, fretesAndamento, fretesFinalizados],
        backgroundColor: [
          'rgba(251, 191, 36, 0.8)',  // Amarelo
          'rgba(139, 92, 246, 0.8)',  // Roxo
          'rgba(34, 197, 94, 0.8)',   // Verde
        ],
        borderColor: [
          'rgb(251, 191, 36)',
          'rgb(139, 92, 246)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const value = context.parsed;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  if (total === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-600 rounded-lg">
            <PieChart className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Distribuição de Fretes</h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Nenhum frete cadastrado ainda</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-600 rounded-lg">
          <PieChart className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Distribuição de Fretes</h3>
      </div>

      <div className="h-64">
        <Pie data={data} options={options} />
      </div>

      {/* Resumo estatístico */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs font-medium text-yellow-800">Pendentes</p>
          <p className="text-xl font-bold text-yellow-700">{fretesPendentes}</p>
          <p className="text-xs text-yellow-600">
            {total > 0 ? ((fretesPendentes / total) * 100).toFixed(0) : 0}%
          </p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-xs font-medium text-purple-800">Em Rota</p>
          <p className="text-xl font-bold text-purple-700">{fretesAndamento}</p>
          <p className="text-xs text-purple-600">
            {total > 0 ? ((fretesAndamento / total) * 100).toFixed(0) : 0}%
          </p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs font-medium text-green-800">Finalizados</p>
          <p className="text-xl font-bold text-green-700">{fretesFinalizados}</p>
          <p className="text-xs text-green-600">
            {total > 0 ? ((fretesFinalizados / total) * 100).toFixed(0) : 0}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatusPieChart;
