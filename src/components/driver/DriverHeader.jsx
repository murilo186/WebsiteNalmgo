import React from 'react';
import { Bell, Truck } from 'lucide-react';

const DriverHeader = () => {
  return (
    <header className="bg-purple-600 text-white shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Truck className="h-6 w-6" />
          <h1 className="text-xl font-bold">NALM GO</h1>
        </div>
        
        <button className="relative p-2 hover:bg-purple-700 rounded-lg transition">
          <Bell className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </button>
      </div>
    </header>
  );
};

export default DriverHeader;