import React, { useState, useRef } from "react";
import { XCircle } from "lucide-react";

const AddDriverModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [codigoMotorista, setCodigoMotorista] = useState("");
  const inputRef = useRef(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!codigoMotorista.trim()) {
      alert("Digite o código do motorista");
      return;
    }
    onSubmit(codigoMotorista.trim());
  };

  const handleClose = () => {
    setCodigoMotorista("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Adicionar Motorista Agregado
          </h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-4">
            Digite o código de vinculação do motorista para enviar um convite à equipe.
          </p>
          
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código do Motorista
            </label>
            <input
              ref={inputRef}
              type="text"
              value={codigoMotorista}
              onChange={(e) => setCodigoMotorista(e.target.value)}
              placeholder="Ex: MG12345"
              maxLength={7}
              autoFocus
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Formato: 2 letras + 5 números (ex: MG12345)
            </p>

            <div className="flex space-x-3 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !codigoMotorista.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Enviando..." : "Enviar Convite"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDriverModal;