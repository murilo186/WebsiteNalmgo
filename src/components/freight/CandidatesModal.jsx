import React, { useState, useEffect } from "react";
import { XCircle, Check, X, User, Phone, FileText, Clock } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";

const CandidatesModal = ({
  isOpen,
  frete,
  onClose,
  onApprove,
  onReject,
  candidaturas = []
}) => {
  const [loading, setLoading] = useState(false);
  const [observacoes, setObservacoes] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [action, setAction] = useState(null); // 'approve' or 'reject'

  useEffect(() => {
    if (!isOpen) {
      setSelectedCandidate(null);
      setAction(null);
      setObservacoes("");
    }
  }, [isOpen]);

  const handleAction = async (candidatura, actionType) => {
    setSelectedCandidate(candidatura);
    setAction(actionType);

    if (actionType === 'approve') {
      // Para aprovação, executa imediatamente
      await executeAction(candidatura, actionType);
    }
    // Para rejeição, pode adicionar modal de observações se necessário
  };

  const executeAction = async (candidatura, actionType) => {
    try {
      setLoading(true);

      const result = actionType === 'approve'
        ? await onApprove(candidatura.id, observacoes)
        : await onReject(candidatura.id, observacoes);

      if (result.success) {
        // Fechar modal após sucesso
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      console.error(`Erro ao ${actionType === 'approve' ? 'aprovar' : 'rejeitar'} candidatura:`, error);
    } finally {
      setLoading(false);
      setSelectedCandidate(null);
      setAction(null);
      setObservacoes("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                Candidaturas - Frete {frete?.codigo_frete || frete?.id}
              </h2>
              <p className="text-blue-100 mt-1">
                {frete?.origem} → {frete?.destino} | {formatCurrency(frete?.valor)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              disabled={loading}
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 140px)" }}>
          {candidaturas.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-600 mb-2">
                Nenhuma candidatura encontrada
              </p>
              <p className="text-gray-500">
                Este frete ainda não recebeu candidaturas de motoristas
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {candidaturas.length} candidatura{candidaturas.length > 1 ? 's' : ''} recebida{candidaturas.length > 1 ? 's' : ''}
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-1 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((candidaturas.length / 5) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {candidaturas.map((candidatura) => (
                <div
                  key={candidatura.id}
                  className={`border rounded-xl p-6 transition-all duration-300 ${
                    candidatura.status_candidatura === 'pendente'
                      ? 'border-orange-200 bg-orange-50 hover:border-orange-300'
                      : candidatura.status_candidatura === 'aprovado'
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    {/* Informações do motorista */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-3 bg-white rounded-full shadow-md">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-800">
                            {candidatura.motorista_nome}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Código: {candidatura.motorista_codigo}
                          </p>
                        </div>
                      </div>

                      {/* Detalhes do motorista */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {candidatura.motorista_telefone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700">
                              Telefone: {candidatura.motorista_telefone}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            Candidatura em: {formatDate(candidatura.data_candidatura)}
                          </span>
                        </div>
                      </div>

                      {/* Observações do motorista */}
                      {candidatura.observacoes_motorista && (
                        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                          <h5 className="font-semibold text-gray-700 mb-2">
                            Observações do motorista:
                          </h5>
                          <p className="text-gray-600 text-sm">
                            {candidatura.observacoes_motorista}
                          </p>
                        </div>
                      )}

                      {/* Status e resposta */}
                      {candidatura.status_candidatura !== 'pendente' && (
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              candidatura.status_candidatura === 'aprovado'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {candidatura.status_candidatura === 'aprovado' ? '✅ Aprovado' : '❌ Recusado'}
                            </span>
                            {candidatura.data_resposta && (
                              <span className="text-xs text-gray-500">
                                {formatDate(candidatura.data_resposta)}
                              </span>
                            )}
                          </div>
                          {candidatura.observacoes_empresa && (
                            <>
                              <h6 className="font-semibold text-gray-700 text-sm mb-1">
                                Observações da empresa:
                              </h6>
                              <p className="text-gray-600 text-sm">
                                {candidatura.observacoes_empresa}
                              </p>
                            </>
                          )}
                          {candidatura.respondido_por && (
                            <p className="text-xs text-gray-500 mt-2">
                              Respondido por: {candidatura.respondido_por}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Ações */}
                    {candidatura.status_candidatura === 'pendente' && (
                      <div className="flex flex-col space-y-2 ml-4">
                        <button
                          onClick={() => handleAction(candidatura, 'approve')}
                          disabled={loading}
                          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                        >
                          <Check className="h-4 w-4" />
                          <span>Aprovar</span>
                        </button>
                        <button
                          onClick={() => handleAction(candidatura, 'reject')}
                          disabled={loading}
                          className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                          <span>Recusar</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatesModal;