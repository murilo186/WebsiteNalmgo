import { useState, useCallback } from 'react';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const [mode, setMode] = useState('view');

  const openModal = useCallback((modalData = null, modalMode = 'view') => {
    setData(modalData);
    setMode(modalMode);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setData(null);
    setMode('view');
  }, []);

  const setModalData = useCallback((newData) => {
    setData(newData);
  }, []);

  const setModalMode = useCallback((newMode) => {
    setMode(newMode);
  }, []);

  return {
    isOpen,
    data,
    mode,
    openModal,
    closeModal,
    setModalData,
    setModalMode
  };
};