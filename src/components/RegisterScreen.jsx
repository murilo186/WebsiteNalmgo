import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Truck,
  Mail,
  Lock,
  Phone,
  FileText,
  Building,
  MapPin,
  User,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const RegisterPage = ({ onRegister }) => {
  const navigate = useNavigate();
  const { register, login, loading, error } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [autoLogin, setAutoLogin] = useState(true); // Para controlar se deve fazer login automático

  const [formData, setFormData] = useState({
    // Etapa 1
    corporateEmail: "",
    cnpj: "",
    password: "",
    confirmPassword: "",
    contactPhone: "",
    supervisorEmail: "",

    // Etapa 2
    companyName: "",
    socialReason: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",

    // Etapa 3
    adminName: "",
    adminCpf: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formatação automática
    if (name === "cnpj") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    } else if (name === "contactPhone") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (name === "zipCode") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{5})(\d{3})/, "$1-$2");
    } else if (name === "adminCpf") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setRegisterError("");
      
      // Validar se as senhas coincidem
      if (formData.password !== formData.confirmPassword) {
        setRegisterError("As senhas não coincidem");
        return;
      }
      
      // Montar dados apenas com campos obrigatórios
    const empresaData = {
  nomeEmpresa: formData.companyName,        // ✅ companyName -> nomeEmpresa
  senha: formData.password,                 // ✅ password -> senha
  emailCorporativo: formData.corporateEmail, // ✅ corporateEmail -> emailCorporativo
  cnpj: formData.cnpj,                      // ✅ OK
  nomeAdministrador: formData.adminName,    // ✅ adminName -> nomeAdministrador
  cpfAdministrador: formData.adminCpf       // ✅ adminCpf -> cpfAdministrador
};
      console.log("Enviando dados para registro:", empresaData);
      
      const result = await register(empresaData);
      
      if (result.success) {
        if (autoLogin) {
          // Fazer login automático após registro
          console.log("Fazendo login automático após registro...");
          const loginResult = await login(formData.corporateEmail, formData.password);
          
          if (loginResult.success) {
            // Login automático bem-sucedido - redirecionar para dashboard
            navigate("/dashboard");
          } else {
            // Se falhou o login automático, redirecionar para login manual
            navigate("/login", { 
              state: { 
                message: "Empresa cadastrada com sucesso! Faça login para continuar.",
                email: formData.corporateEmail 
              }
            });
          }
        } else {
          // Não fazer login automático - ir para tela de login
          navigate("/login", { 
            state: { 
              message: "Empresa cadastrada com sucesso! Faça login para continuar.",
              email: formData.corporateEmail 
            }
          });
        }
      } else {
        setRegisterError(result.error || "Erro ao cadastrar empresa");
      }
    } catch (err) {
      console.error("Erro no cadastro:", err);
      setRegisterError("Erro interno. Tente novamente.");
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4" style={{ color: "#222222" }}>
        Dados da conta
      </h3>

      {/* Email Corporativo */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#222222" }}
        >
          Email corporativo
        </label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-3 h-4 w-4"
            style={{ color: "#4B5563" }}
          />
          <input
            name="corporateEmail"
            type="email"
            required
            value={formData.corporateEmail}
            onChange={handleInputChange}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm"
            style={{ borderColor: "#E5E7EB", color: "#222222" }}
            placeholder="admin@empresa.com.br"
          />
        </div>
      </div>

      {/* CNPJ */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#222222" }}
        >
          CNPJ
        </label>
        <div className="relative">
          <FileText
            className="absolute left-3 top-3 h-4 w-4"
            style={{ color: "#4B5563" }}
          />
          <input
            name="cnpj"
            type="text"
            required
            maxLength="18"
            value={formData.cnpj}
            onChange={handleInputChange}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm"
            style={{ borderColor: "#E5E7EB", color: "#222222" }}
            placeholder="00.000.000/0000-00"
          />
        </div>
      </div>

      {/* Senha */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#222222" }}
        >
          Senha
        </label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-3 h-4 w-4"
            style={{ color: "#4B5563" }}
          />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            value={formData.password}
            onChange={handleInputChange}
            className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm"
            style={{ borderColor: "#E5E7EB", color: "#222222" }}
            placeholder="••••••••"
          />
          <button
            type="button"
            className="absolute right-3 top-3"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" style={{ color: "#4B5563" }} />
            ) : (
              <Eye className="h-4 w-4" style={{ color: "#4B5563" }} />
            )}
          </button>
        </div>
      </div>

      {/* Confirmar Senha */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#222222" }}
        >
          Confirmar senha
        </label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-3 h-4 w-4"
            style={{ color: "#4B5563" }}
          />
          <input
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm"
            style={{ borderColor: "#E5E7EB", color: "#222222" }}
            placeholder="••••••••"
          />
        </div>
      </div>

      {/* Telefone */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#222222" }}
        >
          Telefone para contato
        </label>
        <div className="relative">
          <Phone
            className="absolute left-3 top-3 h-4 w-4"
            style={{ color: "#4B5563" }}
          />
          <input
            name="contactPhone"
            type="text"
            required
            maxLength="15"
            value={formData.contactPhone}
            onChange={handleInputChange}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm"
            style={{ borderColor: "#E5E7EB", color: "#222222" }}
            placeholder="(11) 99999-9999"
          />
        </div>
      </div>

      {/* Email do Supervisor */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#222222" }}
        >
          Email do supervisor
        </label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-3 h-4 w-4"
            style={{ color: "#4B5563" }}
          />
          <input
            name="supervisorEmail"
            type="email"
            required
            value={formData.supervisorEmail}
            onChange={handleInputChange}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm"
            style={{ borderColor: "#E5E7EB", color: "#222222" }}
            placeholder="supervisor@empresa.com.br"
          />
        </div>
        <p className="text-xs mt-1.5" style={{ color: "#4B5563" }}>
          Este email receberá uma confirmação do cadastro da empresa
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4" style={{ color: "#222222" }}>
        Dados da empresa
      </h3>

      {/* Nome da Empresa */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#222222" }}
        >
          Nome da empresa
        </label>
        <div className="relative">
          <Building
            className="absolute left-3 top-3 h-4 w-4"
            style={{ color: "#4B5563" }}
          />
          <input
            name="companyName"
            type="text"
            required
            value={formData.companyName}
            onChange={handleInputChange}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm"
            style={{ borderColor: "#E5E7EB", color: "#222222" }}
            placeholder="Transportes XYZ Ltda"
          />
        </div>
      </div>

      {/* Razão Social */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#222222" }}
        >
          Razão social
        </label>
        <div className="relative">
          <FileText
            className="absolute left-3 top-3 h-4 w-4"
            style={{ color: "#4B5563" }}
          />
          <input
            name="socialReason"
            type="text"
            required
            value={formData.socialReason}
            onChange={handleInputChange}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm"
            style={{ borderColor: "#E5E7EB", color: "#222222" }}
            placeholder="XYZ Transportes e Logística Ltda"
          />
        </div>
      </div>

      {/* Endereço */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: "#222222" }}
          >
            Rua/Avenida
          </label>
          <input
            name="street"
            type="text"
            required
            value={formData.street}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm"
            style={{ borderColor: "#E5E7EB", color: "#222222" }}
            placeholder="Rua das Flores"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: "#222222" }}
          >
            Número
          </label>
          <input
            name="number"
            type="text"
            required
            value={formData.number}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm"
            style={{ borderColor: "#E5E7EB", color: "#222222" }}
            placeholder="123"
          />
        </div>
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#222222" }}
        >
          Complemento (opcional)
        </label>
        <input
          name="complement"
          type="text"
          value={formData.complement}
          onChange={handleInputChange}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm"
          style={{ borderColor: "#E5E7EB", color: "#222222" }}
          placeholder="Sala 101"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: "#222222" }}
          >
            Bairro
          </label>
          <input
            name="neighborhood"
            type="text"
            required
            value={formData.neighborhood}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm"
            style={{ borderColor: "#E5E7EB", color: "#222222" }}
            placeholder="Centro"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: "#222222" }}
          >
            CEP
          </label>
          <input
            name="zipCode"
            type="text"
            required
            maxLength="9"
            value={formData.zipCode}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm"
            style={{ borderColor: "#E5E7EB", color: "#222222" }}
            placeholder="00000-000"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: "#222222" }}
          >
            Cidade
          </label>
          <input
            name="city"
            type="text"
            required
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm"
            style={{ borderColor: "#E5E7EB", color: "#222222" }}
            placeholder="São Paulo"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: "#222222" }}
          >
            Estado
          </label>
          <select
            name="state"
            required
            value={formData.state}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm"
            style={{ borderColor: "#E5E7EB", color: "#222222" }}
          >
            <option value="">UF</option>
            <option value="SP">SP</option>
            <option value="RJ">RJ</option>
            <option value="MG">MG</option>
            <option value="RS">RS</option>
            <option value="PR">PR</option>
            <option value="SC">SC</option>
            <option value="ES">ES</option>
            <option value="BA">BA</option>
            <option value="GO">GO</option>
            <option value="DF">DF</option>
            <option value="MT">MT</option>
            <option value="MS">MS</option>
            <option value="TO">TO</option>
            <option value="PA">PA</option>
            <option value="AP">AP</option>
            <option value="RR">RR</option>
            <option value="AM">AM</option>
            <option value="AC">AC</option>
            <option value="RO">RO</option>
            <option value="PE">PE</option>
            <option value="AL">AL</option>
            <option value="SE">SE</option>
            <option value="PB">PB</option>
            <option value="RN">RN</option>
            <option value="CE">CE</option>
            <option value="PI">PI</option>
            <option value="MA">MA</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4" style={{ color: "#222222" }}>
        Dados do administrador
      </h3>

      {/* Nome do Admin */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#222222" }}
        >
          Nome completo do administrador
        </label>
        <div className="relative">
          <User
            className="absolute left-3 top-3 h-4 w-4"
            style={{ color: "#4B5563" }}
          />
          <input
            name="adminName"
            type="text"
            required
            value={formData.adminName}
            onChange={handleInputChange}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm"
            style={{ borderColor: "#E5E7EB", color: "#222222" }}
            placeholder="João Silva Santos"
          />
        </div>
      </div>

      {/* CPF do Admin */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#222222" }}
        >
          CPF do administrador
        </label>
        <div className="relative">
          <FileText
            className="absolute left-3 top-3 h-4 w-4"
            style={{ color: "#4B5563" }}
          />
          <input
            name="adminCpf"
            type="text"
            required
            maxLength="14"
            value={formData.adminCpf}
            onChange={handleInputChange}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm"
            style={{ borderColor: "#E5E7EB", color: "#222222" }}
            placeholder="000.000.000-00"
          />
        </div>
        <p className="text-xs mt-1.5" style={{ color: "#4B5563" }}>
          Esta pessoa será o administrador principal do sistema
        </p>
      </div>

      {/* Opção de login automático */}
      <div className="flex items-start space-x-3 mt-4">
        <input
          id="autoLogin"
          type="checkbox"
          checked={autoLogin}
          onChange={(e) => setAutoLogin(e.target.checked)}
          className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="autoLogin" className="text-sm" style={{ color: "#222222" }}>
          Fazer login automaticamente após o cadastro
          <p className="text-xs mt-0.5" style={{ color: "#4B5563" }}>
            Se desmarcado, você será redirecionado para a tela de login
          </p>
        </label>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
        <div className="flex items-start space-x-3">
          <Check className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">
              Pronto para finalizar!
            </h4>
            <p className="text-xs text-blue-700 mt-1">
              O administrador poderá criar contas para funcionários e motoristas
              após o cadastro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Criar conta empresarial";
      case 2:
        return "Informações da empresa";
      case 3:
        return "Finalizar cadastro";
      default:
        return "Cadastro";
    }
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
              onClick={goToLogin}
              className="text-sm hover:opacity-80 transition-opacity"
              style={{ color: "#4B5563" }}
            >
              Já tem conta? Entrar
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? "text-white"
                      : "border-2 border-gray-300"
                  }`}
                  style={{
                    backgroundColor:
                      currentStep >= step ? "#3B82F6" : "transparent",
                    color: currentStep >= step ? "white" : "#4B5563",
                  }}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className="w-8 h-0.5 mx-2"
                    style={{
                      backgroundColor:
                        currentStep > step ? "#3B82F6" : "#E5E7EB",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Título */}
          <div className="text-center">
            <h2 className="text-2xl font-bold" style={{ color: "#222222" }}>
              {getStepTitle()}
            </h2>
            <p className="mt-2 text-sm" style={{ color: "#4B5563" }}>
              Etapa {currentStep} de 3
            </p>
          </div>

          {/* Formulário */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            {/* Erro de registro */}
            {(registerError || error) && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{registerError || error}</p>
              </div>
            )}
            
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Botões de Navegação */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex items-center px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
                  style={{ color: "#4B5563" }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </button>
              )}

              <div className="flex-1" />

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center px-6 py-2.5 rounded-lg font-medium text-white text-sm hover:shadow-lg transition-all"
                  style={{ backgroundColor: "#3B82F6" }}
                >
                  Prosseguir
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="flex items-center px-6 py-2.5 rounded-lg font-medium text-white text-sm hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                  style={{ backgroundColor: "#8B5CF6" }}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Finalizando...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Finalizar Cadastro
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Link para Login */}
          <div className="text-center">
            <p className="text-xs" style={{ color: "#4B5563" }}>
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={goToLogin}
                className="font-medium hover:opacity-80 transition-opacity underline"
                style={{ color: "#3B82F6" }}
              >
                Fazer login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;