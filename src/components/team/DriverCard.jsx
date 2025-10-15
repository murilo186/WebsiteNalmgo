import React from "react";
import { Truck, Mail, Eye, Star, Info } from "lucide-react";
import { getStatusColor, getDriverStatusText } from "../../utils/statusHelpers";
import { getInitials } from "../../utils/formatters";

const DriverCard = ({ motorista, tipo = "agregado", onViewDetails }) => {
  const status = motorista.status_disponibilidade || "livre";
  const statusColor = getStatusColor(status);
  const statusText = getDriverStatusText(status);

  return (
    <div className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1">
      <div className="flex items-center space-x-4 mb-4">
        {/* Avatar modernizado */}
        <div className="relative">
          <div
            className="h-14 w-14 rounded-xl flex items-center justify-center text-white font-bold text-lg transition-all duration-300 transform group-hover:scale-110"
            style={{
              background: tipo === "agregado"
                ? "linear-gradient(135deg, #10B981, #059669)"
                : "linear-gradient(135deg, #8B5CF6, #7C3AED)",
            }}
          >
            {getInitials(motorista.nome)}
          </div>
          <div
            className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-3 border-white animate-pulse"
            style={{ backgroundColor: statusColor }}
          />
        </div>

        {/* Info modernizada */}
        <div className="flex-1">
          <h3 className="font-bold text-lg bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {motorista.nome}
          </h3>
          <p className="text-sm text-gray-600 font-medium">
            {tipo === "agregado" ? "Motorista Agregado" : "Motorista Terceirizado"}
          </p>
          <p className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded-full inline-block mt-1">
            #{motorista.codigo}
          </p>
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mt-2"
            style={{
              background: `linear-gradient(135deg, ${statusColor}20, ${statusColor}10)`,
              color: statusColor,
              border: `1px solid ${statusColor}30`
            }}
          >
            ● {statusText}
          </span>
        </div>
      </div>

      {/* Veículo modernizado */}
      {motorista.veiculo && (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl mb-4 border border-blue-200/50">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <Truck className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-blue-800">
              {motorista.veiculo.modelo || "Veículo não informado"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white/60 backdrop-blur-sm p-2 rounded-lg border border-blue-200/30">
              <span className="text-blue-600 font-medium">Placa: </span>
              <span className="text-blue-800 font-bold">
                {motorista.veiculo.placa || "N/A"}
              </span>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-2 rounded-lg border border-blue-200/30">
              <span className="text-blue-600 font-medium">Eixos: </span>
              <span className="text-blue-800 font-bold">
                {motorista.veiculo.eixos || "N/A"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Avaliação e Preço modernizados */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-2 rounded-xl border border-amber-200/50">
          <Star
            className="h-4 w-4 fill-current text-amber-500"
          />
          <span className="text-sm font-bold text-amber-700">
            {motorista.avaliacoes || "5.0"}
          </span>
        </div>
        {tipo === "terceirizado" && motorista.precoKm && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-2 rounded-xl border border-green-200/50">
            <span className="text-green-600 text-xs font-medium">R$ </span>
            <span className="font-bold text-green-800 text-sm">
              {motorista.precoKm}/km
            </span>
          </div>
        )}
      </div>

      {/* Ações */}
      <div className="flex space-x-2">
        <button className="flex-1 py-2 px-3 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Mail className="h-4 w-4 inline mr-1" />
          Mensagem
        </button>
        <button
          onClick={() => onViewDetails && onViewDetails(motorista)}
          className="py-2 px-3 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          title="Ver informações completas"
        >
          <Info className="h-4 w-4 inline" />
        </button>
      </div>
    </div>
  );
};

export default DriverCard;