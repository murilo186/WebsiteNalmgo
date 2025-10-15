// UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService.js";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para login
  const login = async (email, senha) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.loginEmpresa(email, senha);

      console.log("Resultado do authService.loginEmpresa:", result);

      if (result.success) {
        console.log("User data do result:", result.user);
        setUserData(result.user);
        return { success: true, message: result.message };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err.message || 'Erro ao fazer login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Função para registro
  const register = async (empresaData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.registerEmpresa(empresaData);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Erro ao registrar empresa';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Função para logout
  const logout = async () => {
    try {
      await authService.logout();
      setUserData(null);
      setError(null);
    } catch (error) {
      console.error('Erro no logout:', error);
      // Limpa dados locais mesmo se API falhar
      setUserData(null);
      setError(null);
    }
  };

  // Função para atualizar dados do usuário
  const updateUser = (newData) => {
    const updatedData = authService.updateUserData(newData);
    if (updatedData) {
      setUserData(updatedData);
    }
  };

  // Função para atualizar status de trabalho do usuário
  const updateStatusTrabalho = (novoStatus) => {
    if (userData) {
      const updatedData = { ...userData, status_trabalho: novoStatus };
      setUserData(updatedData);
      // Atualizar também no localStorage
      authService.updateUserData(updatedData);
    }
  };

  // Verificar sessão ao carregar
  useEffect(() => {
    const checkSession = () => {
      try {
        const savedUserData = authService.getUserData();
        if (savedUserData && authService.validateSession()) {
          setUserData(savedUserData);
        } else {
          // Limpar dados inválidos
          authService.logout();
        }
      } catch (err) {
        console.error('Erro ao verificar sessão:', err);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const value = {
    // Dados do usuário
    userData,
    loading,
    error,
    
    // Funções
    login,
    register,
    logout,
    updateUser,
    updateStatusTrabalho,
    
    // Estados derivados
    isLoggedIn: !!userData,
    companyName: userData?.nome_empresa || "",
    userName: userData?.nome || userData?.nome_administrador || "",
    userEmail: userData?.email || userData?.email_corporativo || "",
    empresaId: userData?.empresa_id || userData?.id || null,
  };

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
