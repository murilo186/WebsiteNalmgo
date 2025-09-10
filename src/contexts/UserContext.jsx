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
      
      if (result.success) {
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
  const logout = () => {
    authService.logout();
    setUserData(null);
    setError(null);
  };

  // Função para atualizar dados do usuário
  const updateUser = (newData) => {
    const updatedData = authService.updateUserData(newData);
    if (updatedData) {
      setUserData(updatedData);
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
    
    // Estados derivados
    isLoggedIn: !!userData,
    companyName: userData?.nome_empresa || "",
    userName: userData?.nome_administrador || "",
    userEmail: userData?.email_corporativo || "",
  };

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
