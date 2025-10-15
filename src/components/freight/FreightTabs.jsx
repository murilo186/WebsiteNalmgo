import React from "react";

const FreightTabs = ({ tabs, activeTab, onTabChange }) => {
  const handleTabClick = (e, tabId) => {
    e.preventDefault();
    e.stopPropagation();
    onTabChange(tabId);
  };

  return (
    <nav className="mb-8">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 border border-gray-200">
        <ul className="flex flex-wrap sm:flex-nowrap gap-2">
          {tabs.map((tab) => (
            <li key={tab.id} className="flex-1">
              <button
                type="button"
                onClick={(e) => handleTabClick(e, tab.id)}
                className={`group relative w-full py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-300 touch-manipulation min-h-[44px] ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/60"
                }`}
                aria-current={activeTab === tab.id ? "page" : undefined}
                aria-label={`${tab.label} (${tab.count})`}
              >
                <div className="flex items-center justify-center space-x-2 pointer-events-none">
                  <span>{tab.label}</span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-white/20 text-white backdrop-blur-sm"
                        : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
                    }`}
                  >
                    {tab.count}
                  </span>
                </div>
                {/* Efeito shimmer no hover */}
                {activeTab !== tab.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-xl pointer-events-none"></div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default FreightTabs;