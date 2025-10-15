import React from "react";
import { Package, Edit, Trash2, Users } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";

const FreightCard = ({ frete, tipo, onEdit, onDelete, onOffer, onFinish, onViewCandidates, candidaturasCount = 0 }) => {
  const handleDelete = () => {
    if (confirm('Tem certeza que deseja remover este frete?')) {
      onDelete(frete.id);
    }
  };

  const handleFinish = () => {
    if (confirm(`Tem certeza que deseja encerrar o frete ${frete.codigo_frete || frete.id}?`)) {
      onFinish(frete.id);
    }
  };

  return (
    <div
      className={`group backdrop-blur-sm p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between transform hover:scale-[1.02] hover:-translate-y-1 animate-fade-in ${
        frete.disponivel_terceiros
          ? "bg-amber-50/80 border-amber-200 hover:bg-amber-100/80 hover:border-amber-300"
          : "bg-white/70 border-gray-200"
      }`}
      style={{ minHeight: "220px" }}
    >
      {/* Header do card */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl transition-all duration-300 ${
              frete.disponivel_terceiros
                ? "bg-gradient-to-r from-amber-500 to-orange-500"
                : "bg-gradient-to-r from-blue-500 to-blue-600"
            }`}>
              <Package className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-lg bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {frete.codigo_frete || frete.id}
            </h3>
          </div>

          {/* Badge de candidaturas - APENAS em fretes pendentes */}
          {candidaturasCount > 0 && frete.disponivel_terceiros && tipo === "pendentes" && (
            <div
              className="relative cursor-pointer group"
              onClick={() => onViewCandidates && onViewCandidates(frete)}
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm transform hover:scale-110 transition-all duration-300 animate-pulse">
                {candidaturasCount}
              </div>
              <div className="absolute -inset-2 bg-orange-300 rounded-full opacity-30 animate-ping"></div>
              <div className="absolute top-10 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                {candidaturasCount} candidatura{candidaturasCount > 1 ? 's' : ''} pendente{candidaturasCount > 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-2">
          <p className="text-sm text-gray-700 font-semibold mb-1">
            {frete.origem} → {frete.destino}
          </p>
          <div className="w-full bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 h-0.5 rounded-full"></div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {frete.distancia && (
            <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
              {frete.distancia}
            </span>
          )}
          {(frete.data_coleta || frete.data_entrega_prevista) && (
            <span className="text-xs text-gray-600 bg-blue-50 px-3 py-1 rounded-full font-medium border border-blue-200">
              {frete.data_coleta && new Date(frete.data_coleta).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
              {frete.data_coleta && frete.data_entrega_prevista && ' - '}
              {frete.data_entrega_prevista && new Date(frete.data_entrega_prevista).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* Informações do frete */}
      <div className="mt-5 space-y-2">
        <div className="bg-white/80 p-3 rounded-xl border border-green-200/50 hover:border-green-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 font-medium">Valor:</span>
            <span className="font-bold text-green-600 text-sm">
              {formatCurrency(frete.valor)}
            </span>
          </div>
        </div>

        <div className="bg-white/80 p-3 rounded-xl border border-blue-200/50 hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 font-medium">Carga:</span>
            <span className="font-semibold text-blue-600 text-sm truncate ml-2">
              {frete.tipo_carga || frete.carga}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/80 p-3 rounded-xl border border-orange-200/50 hover:border-orange-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 font-medium">Peso:</span>
              <span className="font-semibold text-orange-600 text-sm">
                {frete.peso || 'N/A'}
              </span>
            </div>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-purple-200/50 hover:border-purple-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 font-medium">Eixos:</span>
              <span className="font-semibold text-purple-600 text-sm">
                {frete.eixos_requeridos || 3}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ações do card */}
      <div className="mt-4 flex justify-between items-center">
        {tipo === "pendentes" && (
          <>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOffer(frete)}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transform hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative z-10">Oferecer</span>
              </button>

              {candidaturasCount > 0 && frete.disponivel_terceiros && tipo === "pendentes" && (
                <button
                  onClick={() => onViewCandidates && onViewCandidates(frete)}
                  className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-3 py-2 rounded-xl text-xs font-semibold transform hover:scale-105 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative z-10 flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{candidaturasCount}</span>
                  </span>
                </button>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(frete)}
                className="group p-2.5 bg-white/80 hover:bg-blue-50 border border-blue-200 rounded-xl transition-all duration-300 transform hover:scale-110"
              >
                <Edit className="h-4 w-4 text-blue-600 group-hover:text-blue-700" />
              </button>

              <button
                onClick={handleDelete}
                className="group p-2.5 bg-white/80 hover:bg-red-50 border border-red-200 rounded-xl transition-all duration-300 transform hover:scale-110"
              >
                <Trash2 className="h-4 w-4 text-red-500 group-hover:text-red-600" />
              </button>
            </div>
          </>
        )}

        {tipo === "andamento" && (
          <>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-semibold text-gray-700">
                {frete.motorista_nome || 'Motorista'}
              </p>
            </div>
            <button
              onClick={handleFinish}
              className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transform hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative z-10">Encerrar</span>
            </button>
          </>
        )}

        {tipo === "finalizados" && (
          <>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <p className="text-sm font-semibold text-gray-600">
                  {frete.motorista_nome || 'Motorista'}
                </p>
              </div>
              {frete.finalizado_por && (
                <p className="text-xs text-gray-500 ml-5">
                  Finalizado por: {frete.finalizado_por}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
                {formatDate(frete.data_finalizacao)}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FreightCard;