// Serviço específico para autenticação
import apiService from "./apiService.js";
const API_URL = import.meta.env.VITE_API_URL;

class AuthService {
  constructor() {
    this.TOKEN_KEY = "frete_app_token";
    this.USER_KEY = "frete_app_user";
  }

  // Salvar dados do usuário no localStorage
  saveUserData(userData) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
  }

  // Buscar dados do usuário do localStorage
  getUserData() {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // Verificar se usuário está logado
  isLoggedIn() {
    return this.getUserData() !== null;
  }

  // Fazer logout
  async logout() {
    const userData = this.getUserData();

    // Chamar API de logout se usuário estiver logado
    if (userData) {
      try {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userData.id,
            userType: userData.tipo === "empresa" ? "empresa" : "colaborador",
          }),
        });
        console.log("✅ Logout enviado para servidor");
      } catch (error) {
        console.error("❌ Erro ao fazer logout no servidor:", error);
        // Continue com logout local mesmo se API falhar
      }
    }

    // Limpar dados locais
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Login de empresa
  async loginEmpresa(email, senha) {
    try {
      const response = await apiService.loginEmpresa(email, senha);

      if (response.success) {
        // Salvar dados do usuário
        let userData;

        if (response.colaborador) {
          // Login como colaborador
          userData = {
            id: response.colaborador.id,
            nome: response.colaborador.nome,
            email: response.colaborador.email,
            cargo: response.colaborador.cargo,
            is_admin: response.colaborador.is_admin,
            empresa_id: response.colaborador.empresa_id,
            nome_empresa: response.empresa.nome_empresa,
            status_trabalho: response.colaborador.status_trabalho || "online",
            tipo: "colaborador",
          };
        } else {
          // Login como admin da empresa
          userData = {
            ...response.empresa,
            nome: response.empresa.nome_administrador,
            tipo: "empresa",
          };
        }

        this.saveUserData(userData);

        return {
          success: true,
          user: userData,
          message: response.message,
        };
      }

      return { success: false, error: response.error };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao fazer login",
      };
    }
  }

  // Registro de empresa
  async registerEmpresa(empresaData) {
    try {
      const response = await apiService.registerEmpresa(empresaData);

      if (response.success) {
        return {
          success: true,
          message: response.message,
          empresa: response.empresa,
        };
      }

      return { success: false, error: response.error };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao registrar empresa",
      };
    }
  }

  // Validar sessão
  validateSession() {
    const userData = this.getUserData();
    if (!userData) {
      return false;
    }

    // Aqui você pode adicionar validações adicionais
    // como verificar se o token não expirou, etc.
    return true;
  }

  // Atualizar dados do usuário
  updateUserData(newData) {
    const currentData = this.getUserData();
    if (currentData) {
      const updatedData = { ...currentData, ...newData };
      this.saveUserData(updatedData);
      return updatedData;
    }
    return null;
  }
}

// Instância singleton
const authService = new AuthService();

export default authService;
