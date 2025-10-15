import { useState, useCallback } from "react";
import { DRIVER_STATUS } from "../constants/statusTypes";
const API_URL = import.meta.env.VITE_API_URL;

export const useDriver = (motoristaId) => {
  const [driverData, setDriverData] = useState(null);
  const [fretes, setFretes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar dados do motorista
  const carregarDados = useCallback(async () => {
    if (!motoristaId) return;

    try {
      setLoading(true);
      setError(null);

      // Carregar dados do motorista do localStorage (mantém local)
      const userData = JSON.parse(
        localStorage.getItem("frete_app_user") || "{}"
      );
      setDriverData(userData);

      // Temporariamente comentado até backend estar funcionando
      // const fretesResponse = await fetch(`http://localhost:3000/api/fretes/motorista/${motoristaId}/oferecidos`);
      // const fretesData = await fretesResponse.json();
      // if (fretesData.success && fretesData.data) {
      //   setFretes(fretesData.data);
      // }
    } catch (err) {
      setError(err.message);
      console.error("❌ Erro ao carregar dados do motorista:", err);
    } finally {
      setLoading(false);
    }
  }, [motoristaId]);

  // Atualizar status do motorista
  const atualizarStatus = useCallback(
    async (novoStatus) => {
      try {
        setLoading(true);
        setError(null);

        console.log(`🔄 Alterando status para: ${novoStatus}`);

        // ✅ CONECTADO AO BACKEND - Endpoint correto para motoristas
        const response = await fetch(
          `${API_URL}/api/motoristas/${motoristaId}/status`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status_disponibilidade: novoStatus }),
          }
        );

        const data = await response.json();

        if (data.success) {
          // Atualizar estado local
          setDriverData((prev) => ({
            ...prev,
            status_disponibilidade: novoStatus,
          }));

          // Atualizar localStorage também
          const userData = JSON.parse(
            localStorage.getItem("frete_app_user") || "{}"
          );
          const updatedData = {
            ...userData,
            status_disponibilidade: novoStatus,
          };
          localStorage.setItem("frete_app_user", JSON.stringify(updatedData));

          return {
            success: true,
            message: data.message || "Status atualizado com sucesso!",
          };
        } else {
          return { success: false, error: data.error };
        }
      } catch (err) {
        setError(err.message);
        console.error("❌ Erro ao atualizar status:", err);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [motoristaId]
  );

  // Aceitar frete
  const aceitarFrete = useCallback(
    async (freteId) => {
      try {
        setLoading(true);
        setError(null);

        console.log(`✅ Aceitando frete: ${freteId}`);

        // ✅ CONECTADO AO BACKEND - Endpoint existe
        const response = await fetch(
          `${API_URL}/api/fretes/${freteId}/aceitar`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ motoristaId }),
          }
        );

        const data = await response.json();

        if (data.success) {
          // Atualizar status local para "em-frete"
          setDriverData((prev) => ({
            ...prev,
            status_disponibilidade: "em-frete",
          }));

          return {
            success: true,
            message: data.message || "Frete aceito com sucesso!",
          };
        } else {
          return { success: false, error: data.error };
        }
      } catch (err) {
        setError(err.message);
        console.error("❌ Erro ao aceitar frete:", err);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [motoristaId]
  );

  // Recusar frete
  const recusarFrete = useCallback(
    async (freteId, motivo = "") => {
      try {
        setLoading(true);
        setError(null);

        console.log(`❌ Recusando frete: ${freteId}`);

        // ✅ CONECTADO AO BACKEND - Endpoint existe
        const response = await fetch(
          `${API_URL}/api/fretes/${freteId}/recusar`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ motoristaId, observacoes: motivo }),
          }
        );

        const data = await response.json();

        if (data.success) {
          return { success: true, message: data.message || "Frete recusado." };
        } else {
          return { success: false, error: data.error };
        }
      } catch (err) {
        setError(err.message);
        console.error("❌ Erro ao recusar frete:", err);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [motoristaId]
  );

  return {
    // Estados
    driverData,
    fretes,
    loading,
    error,

    // Ações
    carregarDados,
    atualizarStatus,
    aceitarFrete,
    recusarFrete,
  };
};
