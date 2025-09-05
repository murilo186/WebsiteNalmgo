import { useState, useEffect } from "react";

export default function FreteFormModal({ frete, onClose, onSave }) {
  const [formData, setFormData] = useState({
    origem: "",
    destino: "",
    valor: "",
    carga: "",
    peso: "",
    eixos: "",
  });

  // Preenche o formulário quando o frete for selecionado
  useEffect(() => {
    if (frete) {
      setFormData({
        origem: frete.origem || "",
        destino: frete.destino || "",
        valor: frete.valor || "",
        carga: frete.carga || "",
        peso: frete.peso || "",
        eixos: frete.eixos || "",
      });
    }
  }, [frete]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Editar Frete</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="origem"
            value={formData.origem}
            onChange={handleChange}
            placeholder="Origem"
            className="w-full border p-2 rounded"
          />
          <input
            name="destino"
            value={formData.destino}
            onChange={handleChange}
            placeholder="Destino"
            className="w-full border p-2 rounded"
          />
          <input
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            placeholder="Valor"
            type="number"
            className="w-full border p-2 rounded"
          />
          <input
            name="carga"
            value={formData.carga}
            onChange={handleChange}
            placeholder="Carga"
            className="w-full border p-2 rounded"
          />
          <input
            name="peso"
            value={formData.peso}
            onChange={handleChange}
            placeholder="Peso"
            className="w-full border p-2 rounded"
          />
          <input
            name="eixos"
            value={formData.eixos}
            onChange={handleChange}
            placeholder="Eixos"
            type="number"
            className="w-full border p-2 rounded"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
