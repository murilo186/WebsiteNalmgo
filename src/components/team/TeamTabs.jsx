import React from "react";
import { Users, Truck, UserCheck } from "lucide-react";

const TeamTabs = ({ 
  activeTab, 
  activeDriverTab,
  onTabChange, 
  onDriverTabChange,
  colaboradoresCount,
  motoristasCount,
  agregadosCount,
  terceirizadosCount
}) => {
  return (
    <div className="relative">
      {/* Tabs principais */}
      <div className="bg-white/70 backdrop-blur-sm rounded-t-2xl p-2 shadow-lg border-b border-white/30">
        <div className="flex gap-2">
          <button
            onClick={() => onTabChange("colaboradores")}
            className={`group relative flex-1 px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
              activeTab === "colaboradores"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
                : "text-gray-600 hover:text-gray-800 hover:bg-white/60 hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Colaboradores</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                activeTab === "colaboradores"
                  ? "bg-white/20 text-white backdrop-blur-sm"
                  : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
              }`}>
                {colaboradoresCount || 0}
              </span>
            </div>
            {activeTab !== "colaboradores" && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-xl"></div>
            )}
          </button>

          <button
            onClick={() => onTabChange("motoristas")}
            className={`group relative flex-1 px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
              activeTab === "motoristas"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
                : "text-gray-600 hover:text-gray-800 hover:bg-white/60 hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Truck className="h-4 w-4" />
              <span>Motoristas</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                activeTab === "motoristas"
                  ? "bg-white/20 text-white backdrop-blur-sm"
                  : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
              }`}>
                {motoristasCount || 0}
              </span>
            </div>
            {activeTab !== "motoristas" && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-xl"></div>
            )}
          </button>
        </div>
      </div>

      {/* Subtabs de Motoristas */}
      {activeTab === "motoristas" && (
        <div className="bg-white/60 backdrop-blur-sm border-b border-white/30 px-4 py-3">
          <div className="flex gap-3">
            <button
              onClick={() => onDriverTabChange("agregados")}
              className={`group relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeDriverTab === "agregados"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                  : "bg-white/80 text-gray-700 hover:bg-green-50 hover:text-green-700 hover:shadow-md"
              }`}
            >
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4" />
                <span>Agregados</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  activeDriverTab === "agregados"
                    ? "bg-white/20 text-white"
                    : "bg-green-100 text-green-700"
                }`}>
                  {agregadosCount || 0}
                </span>
              </div>
            </button>

            <button
              onClick={() => onDriverTabChange("terceirizados")}
              className={`group relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeDriverTab === "terceirizados"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                  : "bg-white/80 text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:shadow-md"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4" />
                <span>Terceirizados</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  activeDriverTab === "terceirizados"
                    ? "bg-white/20 text-white"
                    : "bg-purple-100 text-purple-700"
                }`}>
                  {terceirizadosCount || 0}
                </span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamTabs;