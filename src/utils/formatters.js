/**
 * Formatadores utilitários
 */

// Formatar valor monetário
export const formatCurrency = (value) => {
  if (!value && value !== 0) return "R$ 0,00";

  // Se já é número, formata direto
  if (typeof value === "number") {
    return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // Se é string, converte para número
  if (typeof value === "string") {
    // Remove tudo exceto números e ponto
    let cleanValue = value.replace(/[^\d.,]/g, "");

    // Se tem vírgula e ponto, assume formato brasileiro (1.000,00)
    if (cleanValue.includes(",") && cleanValue.includes(".")) {
      cleanValue = cleanValue.replace(/\./g, "").replace(",", ".");
    }
    // Se tem apenas vírgula, assume que é decimal brasileiro (1000,50)
    else if (cleanValue.includes(",")) {
      cleanValue = cleanValue.replace(",", ".");
    }

    const numValue = parseFloat(cleanValue);
    if (isNaN(numValue)) return "R$ 0,00";

    return `R$ ${numValue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return "R$ 0,00";
};

// Formatar data
export const formatDate = (date, options = {}) => {
  if (!date) return "N/A";

  const defaultOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options,
  };

  return new Date(date).toLocaleDateString("pt-BR", defaultOptions);
};

// Formatar data e hora
export const formatDateTime = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Formatar nome (primeiros 2 nomes)
export const formatDisplayName = (fullName) => {
  if (!fullName) return "Usuário";
  const names = fullName.split(" ");
  if (names.length >= 2) {
    return `${names[0]} ${names[1]}`;
  }
  return names[0];
};

// Obter iniciais do nome
export const getInitials = (name) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};
