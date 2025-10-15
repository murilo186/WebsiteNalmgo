import React from "react";
import { X, User, FileText, Truck, Shield, Phone } from "lucide-react";

const DriverDetailsModal = ({ isOpen, onClose, motorista }) => {
  if (!isOpen || !motorista) return null;

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center space-x-2">
        {Icon && <Icon className="h-4 w-4 text-gray-500" />}
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <span className="text-sm font-semibold text-gray-800">{value || "Não informado"}</span>
    </div>
  );

  const InfoSection = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center">
        {title}
      </h3>
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        {children}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Informações do Motorista</h2>
              <p className="text-blue-100 text-sm mt-1">Dados completos e documentação</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              aria-label="Fechar modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Dados Pessoais */}
          <InfoSection title="📋 Dados Pessoais">
            <InfoRow label="Nome Completo" value={motorista.nome} icon={User} />
            <InfoRow label="CPF" value={motorista.cpf} icon={FileText} />
            <InfoRow label="Email" value={motorista.email} icon={FileText} />
            <InfoRow label="Código" value={motorista.codigo} icon={FileText} />
            <InfoRow label="CNH" value={motorista.cnh} icon={Shield} />
            <InfoRow label="Telefone" value={motorista.telefone || "Não informado"} icon={Phone} />
          </InfoSection>

          {/* Dados do Veículo */}
          <InfoSection title="🚚 Dados do Veículo">
            <InfoRow label="ANTT" value={motorista.antt} icon={Shield} />
            <InfoRow label="Placa do Veículo" value={motorista.placa_veiculo} icon={Truck} />
            <InfoRow label="RENAVAM" value={motorista.renavam} icon={FileText} />
            <InfoRow label="Chassi" value={motorista.chassi} icon={FileText} />
            {motorista.veiculo && (
              <>
                <InfoRow label="Modelo" value={motorista.veiculo.modelo} icon={Truck} />
                <InfoRow label="Eixos" value={motorista.veiculo.eixos} icon={Truck} />
              </>
            )}
          </InfoSection>

          {/* Status */}
          <InfoSection title="📊 Status e Estatísticas">
            <InfoRow
              label="Status de Disponibilidade"
              value={
                motorista.status_disponibilidade === 'livre' ? 'Livre' :
                motorista.status_disponibilidade === 'em-frete' ? 'Em Frete' :
                'Indisponível'
              }
              icon={Shield}
            />
            <InfoRow
              label="Total de Fretes Concluídos"
              value={motorista.total_fretes_concluidos || 0}
              icon={FileText}
            />
            <InfoRow
              label="Avaliação"
              value={motorista.avaliacoes ? `${motorista.avaliacoes} ⭐` : "Sem avaliações"}
              icon={Shield}
            />
          </InfoSection>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-2xl border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverDetailsModal;
