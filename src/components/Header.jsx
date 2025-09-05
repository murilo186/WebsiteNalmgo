import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Truck,
  ChevronDown,
  Bell,
  Settings,
  Users,
  LogOut,
} from "lucide-react";

const Header = ({ companyName }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [status, setStatus] = useState("online");

  const notifications = [
    { id: 1, text: "Novo frete disponível", time: "2 min atrás" },
    { id: 2, text: "Motorista João aceitou o frete", time: "15 min atrás" },
    { id: 3, text: "Frete finalizado com sucesso", time: "1 hora atrás" },
  ];

  const userProfile = { name: "João Silva" };

  const getStatusColor = (status) => {
    switch (status) {
      case "online": return "#10B981";
      case "ausente": return "#F59E0B";
      case "ocupado": return "#EF4444";
      default: return "#6B7280";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "online": return "Online";
      case "ausente": return "Ausente";
      case "ocupado": return "Ocupado";
      default: return "Offline";
    }
  };

  const isActive = (path) =>
    location.pathname === path
      ? { color: "#3B82F6", fontWeight: "bold" }
      : { color: "#4B5563" };

  return (
    <div className="bg-white shadow-sm border-b border-gray-100 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Nome da Empresa */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold" style={{ color: "#222222" }}>
                  NALM GO
                </span>
                <p className="text-sm" style={{ color: "#4B5563" }}>
                  {companyName}
                </p>
              </div>
            </div>
          </div>

          {/* Navegação */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => navigate("/dashboard")} className="text-sm font-medium hover:opacity-80 transition-opacity" style={isActive("/dashboard")}>
              Dashboard
            </button>
            <button onClick={() => navigate("/fretes")} className="text-sm font-medium hover:opacity-80 transition-opacity" style={isActive("/fretes")}>
              Fretes
            </button>
            <button onClick={() => navigate("/equipe")} className="text-sm font-medium hover:opacity-80 transition-opacity" style={isActive("/equipe")}>
              Equipe
            </button>
            <button onClick={() => navigate("/motoristas")} className="text-sm font-medium hover:opacity-80 transition-opacity" style={isActive("/motoristas")}>
              Motoristas
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
                className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors"
                aria-label="Notificações"
              >
                <Bell className="h-5 w-5" style={{ color: "#4B5563" }} />
                <span
                  className="absolute -top-1 -right-1 h-4 w-4 text-xs flex items-center justify-center text-white rounded-full"
                  style={{ backgroundColor: "#EF4444" }}
                >
                  {notifications.length}
                </span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
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
                        <span className="text-xs text-gray-500">{notif.time}</span>
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
                      <span className="text-sm font-medium" style={{ color: "#4B5563" }}>
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
                    <p className="text-sm font-medium" style={{ color: "#222222" }}>
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
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
                        onClick={() => { setStatus("online"); setStatusMenuOpen(false); setUserMenuOpen(false); }}
                        className="flex items-center space-x-2 w-full hover:bg-gray-50 px-2 py-1 rounded"
                      >
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "#10B981" }} />
                        <span>Online</span>
                      </button>
                      <button
                        onClick={() => { setStatus("ausente"); setStatusMenuOpen(false); setUserMenuOpen(false); }}
                        className="flex items-center space-x-2 w-full hover:bg-gray-50 px-2 py-1 rounded"
                      >
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "#F59E0B" }} />
                        <span>Ausente</span>
                      </button>
                      <button
                        onClick={() => { setStatus("ocupado"); setStatusMenuOpen(false); setUserMenuOpen(false); }}
                        className="flex items-center space-x-2 w-full hover:bg-gray-50 px-2 py-1 rounded"
                      >
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "#EF4444" }} />
                        <span>Ocupado</span>
                      </button>
                    </div>
                  )}

                  <hr className="my-1 border-gray-200" />
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2">
                    <Settings className="h-4 w-4" style={{ color: "#4B5563" }} />
                    <span style={{ color: "#222222" }}>Editar Perfil</span>
                  </button>
                  <hr className="my-1 border-gray-200" />
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2">
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
