import React, { useState } from "react";
import { XCircle, User, Mail, Briefcase, Lock, Shield } from "lucide-react";

const AddColaboradorModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cargo: "",
    senha: "",
    confirmarSenha: ""
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Formato de email inválido";
    }

    if (!formData.cargo.trim()) {
      newErrors.cargo = "Cargo é obrigatório";
    }

    if (!formData.senha) {
      newErrors.senha = "Senha é obrigatória";
    } else if (formData.senha.length < 6) {
      newErrors.senha = "Senha deve ter pelo menos 6 caracteres";
    }

    if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = "Senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit({
      nome: formData.nome.trim(),
      email: formData.email.trim().toLowerCase(),
      cargo: formData.cargo.trim(),
      senha: formData.senha
    });
  };

  const handleClose = () => {
    setFormData({
      nome: "",
      email: "",
      cargo: "",
      senha: "",
      confirmarSenha: ""
    });
    setErrors({});
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const cargosComuns = [
    "Analista",
    "Assistente",
    "Coordenador",
    "Supervisor",
    "Gerente",
    "Diretor",
    "Auxiliar Administrativo",
    "Operador de Logística",
    "Despachante",
    "Atendente"
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Novo Colaborador</h2>
                <p className="text-blue-100 text-sm">Adicionar funcionário à equipe</p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Nome Completo
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              placeholder="Ex: João Silva"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.nome ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
              autoFocus
            />
            {errors.nome && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠</span>{errors.nome}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="joao@empresa.com"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠</span>{errors.email}
              </p>
            )}
          </div>

          {/* Cargo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Briefcase className="h-4 w-4 inline mr-1" />
              Cargo
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.cargo}
                onChange={(e) => handleChange("cargo", e.target.value)}
                placeholder="Ex: Analista de Logística"
                list="cargos-list"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.cargo ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              <datalist id="cargos-list">
                {cargosComuns.map(cargo => (
                  <option key={cargo} value={cargo} />
                ))}
              </datalist>
            </div>
            {errors.cargo && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠</span>{errors.cargo}
              </p>
            )}
          </div>

          {/* Senha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Lock className="h-4 w-4 inline mr-1" />
                Senha
              </label>
              <input
                type="password"
                value={formData.senha}
                onChange={(e) => handleChange("senha", e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.senha ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.senha && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠</span>{errors.senha}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Lock className="h-4 w-4 inline mr-1" />
                Confirmar
              </label>
              <input
                type="password"
                value={formData.confirmarSenha}
                onChange={(e) => handleChange("confirmarSenha", e.target.value)}
                placeholder="Confirme a senha"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.confirmarSenha ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.confirmarSenha && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠</span>{errors.confirmarSenha}
                </p>
              )}
            </div>
          </div>


          {/* Botões */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Criando...
                </div>
              ) : (
                "Criar Colaborador"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddColaboradorModal;