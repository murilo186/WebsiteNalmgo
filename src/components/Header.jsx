import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import {
  Truck,
  ChevronDown,
  Bell,
  Settings,
  Users,
  LogOut,
} from "lucide-react";

const Header = ({ companyName, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    logout,
    userData,
    companyName: userCompanyName,
    userName,
  } = useUser();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [status, setStatus] = useState("online");

  const notifications = [
    { id: 1, text: "Novo frete disponível", time: "2 min atrás" },
    { id: 2, text: "Motorista João aceitou o frete", time: "15 min atrás" },
    { id: 3, text: "Frete finalizado com sucesso", time: "1 hora atrás" },
  ];

  const userProfile = {
    name: userName || userData?.nome_administrador || "Usuário",
  };

  const displayCompanyName =
    companyName || userCompanyName || userData?.nome_empresa || "Empresa";

  // Função para fazer logout
  const handleLogout = async () => {
    // Fecha todos os menus
    setUserMenuOpen(false);
    setNotificationsOpen(false);
    setStatusMenuOpen(false);

    // Usa o logout do UserContext (aguarda completar)
    await logout();

    // Chama a função de logout passada pelo App se existir
    if (onLogout) {
      onLogout();
    }

    // Redireciona para login e substitui o histórico
    navigate("/login", { replace: true });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "#10B981";
      case "ausente":
        return "#F59E0B";
      case "ocupado":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "online":
        return "Online";
      case "ausente":
        return "Ausente";
      case "ocupado":
        return "Ocupado";
      default:
        return "Offline";
    }
  };

  const isActive = (path) =>
    location.pathname === path
      ? { color: "#3B82F6", fontWeight: "bold" }
      : { color: "#4B5563" };

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo e Nome da Empresa */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-xl transition-all duration-300 transform hover:scale-110">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-700 bg-clip-text text-transparent">
                  NALM GO
                </span>
                <p className="text-sm text-gray-600 font-medium">
                  {displayCompanyName}
                </p>
              </div>
            </div>
          </div>

          {/* Navegação */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => navigate("/dashboard")}
              className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                location.pathname === "/dashboard"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                  : "text-gray-700 hover:bg-white/60 hover:text-blue-600"
              }`}
            >
              Dashboard
              {location.pathname === "/dashboard" && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-pulse rounded-xl"></div>
              )}
            </button>
            <button
              onClick={() => navigate("/fretes")}
              className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                location.pathname === "/fretes"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                  : "text-gray-700 hover:bg-white/60 hover:text-blue-600"
              }`}
            >
              Fretes
              {location.pathname === "/fretes" && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-pulse rounded-xl"></div>
              )}
            </button>
            <button
              onClick={() => navigate("/equipe")}
              className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                location.pathname === "/equipe"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                  : "text-gray-700 hover:bg-white/60 hover:text-blue-600"
              }`}
            >
              Equipe
              {location.pathname === "/equipe" && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-pulse rounded-xl"></div>
              )}
            </button>
            <button
              onClick={() => navigate("/motoristas")}
              className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                location.pathname === "/motoristas"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                  : "text-gray-700 hover:bg-white/60 hover:text-blue-600"
              }`}
            >
              Motoristas
              {location.pathname === "/motoristas" && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-pulse rounded-xl"></div>
              )}
            </button>
            <button
              onClick={() => navigate("/empresa")}
              className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                location.pathname === "/empresa"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                  : "text-gray-700 hover:bg-white/60 hover:text-blue-600"
              }`}
            >
              Empresa
              {location.pathname === "/empresa" && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-pulse rounded-xl"></div>
              )}
            </button>
          </div>

          {/* Perfil e Notificações */}
          <div className="flex items-center space-x-4">
            {/* Notificações */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserMenuOpen(false);
                  setStatusMenuOpen(false);
                }}
                className="relative p-3 hover:bg-white/60 rounded-xl transition-all duration-300 transform hover:scale-105 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Notificações"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center text-white rounded-full bg-gradient-to-r from-red-500 to-red-600 font-semibold">
                  {notifications.length}
                </span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg border border-gray-200 py-2 z-50">
                  <h4 className="px-4 py-2 font-semibold text-gray-700 border-b border-gray-200">
                    Notificações
                  </h4>
                  <ul>
                    {notifications.map((notif) => (
                      <li
                        key={notif.id}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                      >
                        <p className="text-sm text-gray-800">{notif.text}</p>
                        <span className="text-xs text-gray-500">
                          {notif.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Menu do Usuário */}
            <div className="relative">
              <button
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setNotificationsOpen(false);
                  setStatusMenuOpen(false);
                }}
                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                aria-label="Menu do usuário"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#4B5563" }}
                      >
                        {userProfile.name.charAt(0)}
                      </span>
                    </div>
                    {/* Bolinha de status só visual */}
                    <div
                      className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white"
                      style={{ backgroundColor: getStatusColor(status) }}
                    />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#222222" }}
                    >
                      {userProfile.name}
                    </p>
                    <p className="text-xs" style={{ color: "#4B5563" }}>
                      {getStatusText(status)}
                    </p>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4" style={{ color: "#4B5563" }} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 py-1 z-50">
                  {/* Botão para abrir submenu de status */}
                  <button
                    onClick={() => setStatusMenuOpen(!statusMenuOpen)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Users className="h-4 w-4" style={{ color: "#4B5563" }} />
                    <span style={{ color: "#222222" }}>Mudar Status</span>
                  </button>

                  {/* Submenu de status */}
                  {statusMenuOpen && (
                    <div className="pl-6 pr-4 py-2">
                      <button
                        onClick={() => {
                          setStatus("online");
                          setStatusMenuOpen(false);
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center space-x-2 w-full hover:bg-gray-50 px-2 py-1 rounded"
                      >
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: "#10B981" }}
                        />
                        <span>Online</span>
                      </button>
                      <button
                        onClick={() => {
                          setStatus("ausente");
                          setStatusMenuOpen(false);
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center space-x-2 w-full hover:bg-gray-50 px-2 py-1 rounded"
                      >
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: "#F59E0B" }}
                        />
                        <span>Ausente</span>
                      </button>
                      <button
                        onClick={() => {
                          setStatus("ocupado");
                          setStatusMenuOpen(false);
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center space-x-2 w-full hover:bg-gray-50 px-2 py-1 rounded"
                      >
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: "#EF4444" }}
                        />
                        <span>Ocupado</span>
                      </button>
                    </div>
                  )}

                  <hr className="my-1 border-gray-200" />
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2">
                    <Settings
                      className="h-4 w-4"
                      style={{ color: "#4B5563" }}
                    />
                    <span style={{ color: "#222222" }}>Editar Perfil</span>
                  </button>
                  <hr className="my-1 border-gray-200" />

                  {/* Botão de Logout atualizado */}
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" style={{ color: "#EF4444" }} />
                    <span style={{ color: "#EF4444" }}>Sair</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
