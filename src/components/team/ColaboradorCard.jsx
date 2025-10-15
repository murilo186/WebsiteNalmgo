import React from "react";
import { User, Mail, Shield, Edit2, Trash2 } from "lucide-react";
import { getInitials } from "../../utils/formatters";

const ColaboradorCard = ({ colaborador, currentUserId, onEdit, onDelete }) => {
  const isCurrentUser = colaborador.id === currentUserId;
  const isAdmin = colaborador.is_admin;

  // Função para obter cor do status de trabalho
  const getStatusTrabalhoColor = (status) => {
    switch (status) {
      case 'online': return '#10B981';
      case 'ausente': return '#F59E0B';
      case 'ocupado': return '#EF4444';
      default: return '#6B7280';
    }
  };

  // Função para obter texto do status de trabalho
  const getStatusTrabalhoText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'ausente': return 'Ausente';
      case 'ocupado': return 'Ocupado';
      default: return 'Offline';
    }
  };

  return (
    <div className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="relative">
            <div
              className="h-14 w-14 rounded-xl flex items-center justify-center text-white font-bold text-lg transition-all duration-300 transform group-hover:scale-110"
              style={{
                background: isAdmin
                  ? "linear-gradient(135deg, #DC2626, #B91C1C)"
                  : "linear-gradient(135deg, #3B82F6, #2563EB)",
              }}
            >
              {getInitials(colaborador.nome)}
            </div>

            {/* Bolinha de status de trabalho */}
            <div
              className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white"
              style={{
                backgroundColor: getStatusTrabalhoColor(colaborador.status_trabalho)
              }}
              title={`Status: ${getStatusTrabalhoText(colaborador.status_trabalho)}`}
            />

            {isAdmin && (
              <div className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center border-2 border-white">
                <Shield className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-bold text-lg bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {colaborador.nome}
              </h3>
              {isCurrentUser && (
                <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-xs font-bold rounded-full border border-blue-300">
                  Você
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 font-medium mb-1">
              {colaborador.cargo}
            </p>
            
            <div className="flex items-center space-x-1 text-gray-500">
              <Mail className="h-3 w-3" />
              <span className="text-xs">{colaborador.email}</span>
            </div>
            
            {/* Badge de status */}
            <div className="mt-2 flex items-center space-x-2">
              {isAdmin ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-300">
                  <Shield className="h-3 w-3 mr-1" />
                  Administrador
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-300">
                  <User className="h-3 w-3 mr-1" />
                  Colaborador
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Informações adicionais */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl mb-4 border border-gray-200/50">
        <div className="text-sm text-gray-600">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Membro desde:</span>
            <span className="text-gray-800 font-semibold">
              {new Date(colaborador.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Status da conta:</span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
              colaborador.ativo 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}>
              ● {colaborador.ativo ? "Ativo" : "Inativo"}
            </span>
          </div>
          
          {colaborador.ativo && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Status atual:</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold">
                <div
                  className="h-2 w-2 rounded-full mr-1"
                  style={{ backgroundColor: getStatusTrabalhoColor(colaborador.status_trabalho) }}
                />
                {getStatusTrabalhoText(colaborador.status_trabalho)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Ações - apenas se não for o usuário atual */}
      {!isCurrentUser && (
        <div className="flex space-x-2">
          {onEdit && (
            <button 
              onClick={() => onEdit(colaborador)}
              className="flex-1 flex items-center justify-center py-2 px-3 text-sm font-medium border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Editar
            </button>
          )}
          
          {onDelete && (
            <button
              onClick={() => onDelete(colaborador)}
              className="py-2 px-3 text-sm font-medium text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Mensagem para usuário atual */}
      {isCurrentUser && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200/50">
          <p className="text-sm text-blue-700 font-medium text-center">
            Este é o seu perfil atual
          </p>
        </div>
      )}
    </div>
  );
};

export default ColaboradorCard;