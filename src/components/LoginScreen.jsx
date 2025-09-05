import React, { useState } from "react";
import { Eye, EyeOff, Truck, Mail, Lock } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular chamada à API
    setTimeout(() => {
      console.log("Login attempt:", formData);
      setIsLoading(false);
      // Aqui você fará a integração com sua API
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ backgroundColor: "#F7F9FA" }}
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div
                className="bg-blue-500 p-2 rounded-lg"
                style={{ backgroundColor: "#3B82F6" }}
              >
                <Truck className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold" style={{ color: "#222222" }}>
                NALM GO
              </span>
            </div>
            <button
              className="text-sm hover:opacity-80 transition-opacity"
              style={{ color: "#4B5563" }}
            >
              Precisa de ajuda?
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-sm w-full space-y-6">
          {/* Título */}
          <div className="text-center">
            <h2 className="text-2xl font-bold" style={{ color: "#222222" }}>
              Entrar na sua conta
            </h2>
            <p className="mt-2 text-sm" style={{ color: "#4B5563" }}>
              Acesse o painel de controle de fretes
            </p>
          </div>

          {/* Formulário de Login */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="space-y-5">
              {/* Campo Email */}
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "#222222" }}
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4" style={{ color: "#4B5563" }} />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm"
                    style={{
                      borderColor: "#E5E7EB",
                      color: "#222222",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3B82F6";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(59, 130, 246, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#E5E7EB";
                      e.target.style.boxShadow = "none";
                    }}
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "#222222" }}
                >
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4" style={{ color: "#4B5563" }} />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm"
                    style={{
                      borderColor: "#E5E7EB",
                      color: "#222222",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3B82F6";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(59, 130, 246, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#E5E7EB";
                      e.target.style.boxShadow = "none";
                    }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff
                        className="h-4 w-4 hover:opacity-70 transition-opacity"
                        style={{ color: "#4B5563" }}
                      />
                    ) : (
                      <Eye
                        className="h-4 w-4 hover:opacity-70 transition-opacity"
                        style={{ color: "#4B5563" }}
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Esqueceu a senha */}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="text-xs hover:opacity-80 transition-opacity"
                  style={{ color: "#3B82F6" }}
                >
                  Esqueceu sua senha?
                </button>
              </div>

              {/* Botão de Login */}
              <button
                type="button"
                disabled={isLoading}
                onClick={handleSubmit}
                className="w-full py-2.5 px-4 rounded-lg font-medium text-white transition-all duration-200 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                style={{
                  backgroundColor: "#3B82F6",
                  boxShadow: "0 2px 8px rgba(59, 130, 246, 0.2)",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.backgroundColor = "#2563EB";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.target.style.backgroundColor = "#3B82F6";
                  }
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Entrando...
                  </div>
                ) : (
                  "Entrar"
                )}
              </button>
            </div>
          </div>

          {/* Link para Cadastro */}
          <div className="text-center">
            <p className="text-xs" style={{ color: "#4B5563" }}>
              Ainda não tem uma conta?{" "}
              <button
                type="button"
                className="font-medium opacity-50 hover:opacity-80 transition-opacity text-xs underline"
                style={{ color: "#4B5563" }}
              >
                Cadastrar empresa
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
