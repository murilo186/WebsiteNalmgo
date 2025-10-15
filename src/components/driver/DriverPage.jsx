import React, { useState, useEffect } from 'react';
import { useDriver } from '../../hooks/useDriver';
import DriverHeader from './DriverHeader';
import DriverStats from './DriverStats';
import StatusCard from './StatusCard';
import QuickActions from './QuickActions';
import ActiveJob from './ActiveJob';
import { formatDisplayName } from '../../utils/formatters';
import { DRIVER_STATUS } from '../../constants/statusTypes';

const DriverPage = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [greeting, setGreeting] = useState('');
  const [userData, setUserData] = useState(null);

  const driver = useDriver(userData?.id);

  // Inicializar dados
  useEffect(() => {
    // Configurar data e saudação
    const today = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    setCurrentDate(today.toLocaleDateString('pt-BR', options));

    // Definir saudação baseada na hora
    const hour = today.getHours();
    if (hour < 12) {
      setGreeting('Bom dia');
    } else if (hour < 18) {
      setGreeting('Boa tarde');
    } else {
      setGreeting('Boa noite');
    }

    // Carregar dados do usuário
    const savedUserData = JSON.parse(localStorage.getItem('frete_app_user') || '{}');
    setUserData(savedUserData);
  }, []);

  // Carregar dados quando usuário estiver definido
  useEffect(() => {
    if (userData?.id) {
      driver.carregarDados();
    }
  }, [userData?.id, driver.carregarDados]);

  const handleStatusChange = async (novoStatus) => {
    if (driver.driverData?.status_disponibilidade === DRIVER_STATUS.EM_FRETE) {
      alert('Não é possível alterar status durante um frete.');
      return;
    }

    if (confirm(`Deseja alterar seu status para "${novoStatus}"?`)) {
      const result = await driver.atualizarStatus(novoStatus);
      
      if (result.success) {
        alert(result.message);
      } else {
        alert(`Erro: ${result.error}`);
      }
    }
  };

  if (driver.loading && !driver.driverData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const currentStatus = driver.driverData?.status_disponibilidade || DRIVER_STATUS.LIVRE;
  const displayName = formatDisplayName(driver.driverData?.nome || userData?.nome);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DriverHeader />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Saudação */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting}, {displayName}!
          </h1>
          <p className="text-gray-600">{currentDate}</p>
        </div>

        {/* Status Card */}
        <StatusCard
          status={currentStatus}
          onStatusChange={handleStatusChange}
          loading={driver.loading}
        />

        {/* Estatísticas */}
        <DriverStats
          userData={driver.driverData || userData}
          status={currentStatus}
        />

        {/* Trabalho Ativo (se em frete) */}
        {currentStatus === DRIVER_STATUS.EM_FRETE && (
          <ActiveJob />
        )}

        {/* Ações Rápidas */}
        <QuickActions
          status={currentStatus}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
};

export default DriverPage;