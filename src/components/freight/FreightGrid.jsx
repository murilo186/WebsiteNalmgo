import React from "react";
import FreightCard from "./FreightCard";
import { Package } from "lucide-react";

const FreightGrid = ({ fretes, tipo, onEdit, onDelete, onOffer, onFinish, onViewCandidates, candidaturasCount = {} }) => {
  if (!fretes || fretes.length === 0) {
    const messages = {
      pendentes: "Nenhum frete pendente encontrado.",
      andamento: "Nenhum frete em andamento.",
      finalizados: "Nenhum frete finalizado."
    };

    // Removido emptyStateIcons - usando apenas ícones Lucide

    return (
      <div className="col-span-full text-center py-16 animate-fade-in">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 max-w-md mx-auto">
          {/* Removido emoji - usando apenas ícone Lucide */}
          <Package className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600 font-medium text-lg">
            {messages[tipo] || "Nenhum frete encontrado."}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {tipo === "pendentes" && "Crie seu primeiro frete para começar!"}
            {tipo === "andamento" && "Quando houver fretes em andamento, eles aparecerão aqui."}
            {tipo === "finalizados" && "Fretes concluídos serão exibidos nesta seção."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {fretes.map((frete, index) => (
        <div
          key={frete.id}
          className="animate-fade-in"
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'both'
          }}
        >
          <FreightCard
            frete={frete}
            tipo={tipo}
            onEdit={onEdit}
            onDelete={onDelete}
            onOffer={onOffer}
            onFinish={onFinish}
            onViewCandidates={onViewCandidates}
            candidaturasCount={candidaturasCount[frete.id] || 0}
          />
        </div>
      ))}
    </div>
  );
};

export default FreightGrid;