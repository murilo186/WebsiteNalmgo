// Serviço específico para autenticação
import apiService from './apiService.js';

class AuthService {
  constructor() {
    this.TOKEN_KEY = 'frete_app_token';
    this.USER_KEY = 'frete_app_user';
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
  logout() {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Login de empresa
  async loginEmpresa(email, senha) {
    try {
      const response = await apiService.loginEmpresa(email, senha);
      
      if (response.success) {
        // Salvar dados do usuário
        const userData = {
          ...response.empresa,
          tipo: 'empresa'
        };
        this.saveUserData(userData);
        
        return {
          success: true,
          user: userData,
          message: response.message
        };
      }
      
      return { success: false, error: response.error };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Erro ao fazer login' 
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
          empresa: response.empresa
        };
      }
      
      return { success: false, error: response.error };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Erro ao registrar empresa' 
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