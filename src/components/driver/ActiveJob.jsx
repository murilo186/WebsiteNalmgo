import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';

const ActiveJob = () => {
  // Dados simulados - em produção viriam da API
  const activeJob = {
    id: 'FR-2024-0123',
    origem: 'Santos',
    destino: 'São Paulo',
    progresso: 65,
    tempoEstimado: '2h 30min',
    distanciaRestante: '45km'
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Trabalho Atual
        </h3>
        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
          Em Andamento
        </span>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">
          Frete #{activeJob.id}
        </h4>
        
        <div className="flex items-center space-x-2 text-gray-600 mb-3">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">
            {activeJob.origem}
          </span>
          <ArrowRight className="h-4 w-4" />
          <span className="text-sm">
            {activeJob.destino}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <span className="text-gray-500">Tempo restante:</span>
            <p className="font-semibold text-gray-900">{activeJob.tempoEstimado}</p>
          </div>
          <div>
            <span className="text-gray-500">Distância restante:</span>
            <p className="font-semibold text-gray-900">{activeJob.distanciaRestante}</p>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progresso</span>
            <span className="text-sm font-semibold text-purple-600">
              {activeJob.progresso}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${activeJob.progresso}%` }}
            />
          </div>
        </div>
      </div>

      <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
        Ver Detalhes do Frete
      </button>
    </div>
  );
};

export default ActiveJob;