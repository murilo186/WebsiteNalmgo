import React, { useState } from "react";
import {
  Truck,
  Package,
  Eye,
  Edit,
  Trash2,
  Plus,
  XCircle,
  CheckCircle,
  UserCheck,
} from "lucide-react";

import Header from "./Header"; // seu header separado, que já tem a navegação e o useNavigate

// Mock motoristas (status: "livre" ou "em-frete")
const motoristas = [
  { id: 1, nome: "Roberto Oliveira", status: "livre" },
  { id: 2, nome: "José Carlos", status: "em-frete" },
  { id: 3, nome: "Marcos Silva", status: "livre" },
];

const FretesPage = () => {
  // Estados dos fretes agrupados por status
  const [fretesPendentes, setFretesPendentes] = useState([]);
  const [fretesAndamento, setFretesAndamento] = useState([]);
  const [fretesFinalizados, setFretesFinalizados] = useState([]);

  const [activeTab, setActiveTab] = useState("pendentes");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalFrete, setModalFrete] = useState(null);
  const [modalMode, setModalMode] = useState("detalhes"); // 'detalhes', 'editar', 'novo', 'oferecer'

  // Para lista de motoristas ao oferecer frete
  const [freteParaOferecer, setFreteParaOferecer] = useState(null);

  // Campos do formulário (edição/criação)
  const [formData, setFormData] = useState({
    origem: "",
    destino: "",
    distancia: "",
    valor: "",
    carga: "",
    peso: "",
    eixosRequerido: 1,
    observacoes: "",
  });

  // Função para abrir modal (detalhes, editar ou novo frete)
  const openModal = (frete, mode = "detalhes") => {
    setModalFrete(frete);
    setModalMode(mode);
    if (frete) {
      setFormData({
        origem: frete.origem,
        destino: frete.destino,
        distancia: frete.distancia,
        valor: frete.valor,
        carga: frete.carga,
        peso: frete.peso,
        eixosRequerido: frete.eixosRequerido,
        observacoes: frete.observacoes || "",
      });
    } else {
      // limpa form para novo
      setFormData({
        origem: "",
        destino: "",
        distancia: "",
        valor: "",
        carga: "",
        peso: "",
        eixosRequerido: 1,
        observacoes: "",
      });
    }
    setModalVisible(true);
  };

  // Fechar modal
  const closeModal = () => {
    setModalVisible(false);
    setModalFrete(null);
    setFreteParaOferecer(null);
    setModalMode("detalhes");
  };

  // Gerar ID aleatório simples
  const gerarIdFrete = () => {
    return "F" + Math.floor(Math.random() * 9000 + 1000);
  };

  // Criar novo frete
  const criarFrete = () => {
    const novoFrete = {
      id: gerarIdFrete(),
      ...formData,
      status: "pendente",
    };
    setFretesPendentes((old) => [...old, novoFrete]);
    closeModal();
  };

  // Atualizar frete editado
  const editarFrete = () => {
    if (!modalFrete) return;
    const atualizarFrete = {
      ...modalFrete,
      ...formData,
    };
    // Atualiza no array correto
    if (activeTab === "pendentes") {
      setFretesPendentes((old) =>
        old.map((f) => (f.id === modalFrete.id ? atualizarFrete : f))
      );
    } else if (activeTab === "andamento") {
      setFretesAndamento((old) =>
        old.map((f) => (f.id === modalFrete.id ? atualizarFrete : f))
      );
    } else if (activeTab === "finalizados") {
      setFretesFinalizados((old) =>
        old.map((f) => (f.id === modalFrete.id ? atualizarFrete : f))
      );
    }
    closeModal();
  };

  // Remover frete
  const removerFrete = (id) => {
    if (activeTab === "pendentes") {
      setFretesPendentes((old) => old.filter((f) => f.id !== id));
    } else if (activeTab === "andamento") {
      setFretesAndamento((old) => old.filter((f) => f.id !== id));
    } else if (activeTab === "finalizados") {
      setFretesFinalizados((old) => old.filter((f) => f.id !== id));
    }
  };

  // Abrir modal para oferecer frete a motoristas livres
  const abrirOferecerFrete = (frete) => {
    setFreteParaOferecer(frete);
    setModalMode("oferecer");
    setModalVisible(true);
  };

  // Oferecer frete para motorista selecionado: tira de pendente e move para andamento
  const oferecerParaMotorista = (motorista) => {
    if (!freteParaOferecer) return;

    // Remove frete da lista pendente
    setFretesPendentes((old) =>
      old.filter((f) => f.id !== freteParaOferecer.id)
    );

    // Adiciona frete na lista de andamento, com motorista e progresso 0
    setFretesAndamento((old) => [
      ...old,
      {
        ...freteParaOferecer,
        motorista: motorista.nome,
        progresso: 0,
        status: "andamento",
      },
    ]);

    closeModal();
    setActiveTab("andamento");
  };

  // Encerrar frete em andamento: move para finalizados
  const encerrarFrete = (frete) => {
    // Remove da lista andamento
    setFretesAndamento((old) => old.filter((f) => f.id !== frete.id));

    // Adiciona na lista finalizados
    setFretesFinalizados((old) => [
      ...old,
      {
        ...frete,
        status: "finalizado",
        encerradoPor: "João Silva", // usuário atual fixo só pra exemplo
        dataFinalizacao: new Date().toLocaleDateString("pt-BR"),
      },
    ]);
  };

  // Renderizar cards pequenos e quadrados
  const renderFreteCard = (frete, tipo) => {
    return (
      <div
        key={frete.id}
        className="bg-white p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        style={{ minHeight: "180px" }}
      >
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Package className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-lg text-gray-900">{frete.id}</h3>
          </div>
          <p className="text-sm text-gray-700 font-medium">
            {frete.origem} → {frete.destino}
          </p>
          <p className="text-xs text-gray-500">{frete.distancia}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-700">
          <div>
            <p className="font-semibold text-green-600">{frete.valor}</p>
            <p className="text-xs">Valor</p>
          </div>
          <div>
            <p>{frete.carga}</p>
            <p className="text-xs">Carga</p>
          </div>
          <div>
            <p>{frete.peso}</p>
            <p className="text-xs">Peso</p>
          </div>
          <div>
            <p>{frete.eixosRequerido}</p>
            <p className="text-xs">Eixos</p>
          </div>
        </div>

        <div className="mt-3 flex justify-between items-center">
          {tipo === "pendentes" && (
            <>
              <button
                onClick={() => abrirOferecerFrete(frete)}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
              >
                Oferecer Frete
              </button>

              <button
                onClick={() => openModal(frete, "editar")}
                className="p-1 hover:bg-gray-100 rounded transition"
              >
                <Edit className="h-5 w-5 text-gray-600" />
              </button>

              <button
                onClick={() => removerFrete(frete.id)}
                className="p-1 hover:bg-gray-100 rounded transition"
              >
                <Trash2 className="h-5 w-5 text-red-600" />
              </button>
            </>
          )}

          {tipo === "andamento" && (
            <>
              <p className="text-sm font-semibold">{frete.motorista}</p>
              <button
                onClick={() => encerrarFrete(frete)}
                className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
              >
                Encerrar Frete
              </button>
            </>
          )}

          {tipo === "finalizados" && (
            <>
              <p className="text-sm font-semibold">{frete.motorista}</p>
              <p className="text-xs text-gray-500">
                Encerrado por: {frete.encerradoPor}
              </p>
            </>
          )}
        </div>
      </div>
    );
  };

  // Render modal para detalhes, edição, criação e oferecer frete
  const renderModalContent = () => {
    if (modalMode === "detalhes" && modalFrete) {
      return (
        <div className="p-6 max-h-[70vh] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{modalFrete.id} - Detalhes</h2>
            <button onClick={closeModal}>
              <XCircle className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          <p>
            <strong>Origem:</strong> {modalFrete.origem}
          </p>
          <p>
            <strong>Destino:</strong> {modalFrete.destino}
          </p>
          <p>
            <strong>Distância:</strong> {modalFrete.distancia}
          </p>
          <p>
            <strong>Valor:</strong> {modalFrete.valor}
          </p>
          <p>
            <strong>Carga:</strong> {modalFrete.carga}
          </p>
          <p>
            <strong>Peso:</strong> {modalFrete.peso}
          </p>
          <p>
            <strong>Eixos:</strong> {modalFrete.eixosRequerido}
          </p>
          {modalFrete.observacoes && (
            <p>
              <strong>Observações:</strong> {modalFrete.observacoes}
            </p>
          )}
        </div>
      );
    }

    if (modalMode === "editar" || modalMode === "novo") {
      return (
        <div className="p-6 max-h-[70vh] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {modalMode === "novo" ? "Novo Frete" : `Editar ${modalFrete.id}`}
            </h2>
            <button onClick={closeModal}>
              <XCircle className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              modalMode === "novo" ? criarFrete() : editarFrete();
            }}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Origem"
              value={formData.origem}
              onChange={(e) =>
                setFormData({ ...formData, origem: e.target.value })
              }
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Destino"
              value={formData.destino}
              onChange={(e) =>
                setFormData({ ...formData, destino: e.target.value })
              }
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Distância"
              value={formData.distancia}
              onChange={(e) =>
                setFormData({ ...formData, distancia: e.target.value })
              }
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Valor"
              value={formData.valor}
              onChange={(e) =>
                setFormData({ ...formData, valor: e.target.value })
              }
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Carga"
              value={formData.carga}
              onChange={(e) =>
                setFormData({ ...formData, carga: e.target.value })
              }
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Peso"
              value={formData.peso}
              onChange={(e) =>
                setFormData({ ...formData, peso: e.target.value })
              }
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="number"
              min={1}
              max={10}
              placeholder="Eixos Requeridos"
              value={formData.eixosRequerido}
              onChange={(e) =>
                setFormData({ ...formData, eixosRequerido: Number(e.target.value) })
              }
              required
              className="w-full border px-3 py-2 rounded"
            />
            <textarea
              placeholder="Observações"
              value={formData.observacoes}
              onChange={(e) =>
                setFormData({ ...formData, observacoes: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {modalMode === "novo" ? "Criar Frete" : "Salvar Alterações"}
            </button>
          </form>
        </div>
      );
    }

    if (modalMode === "oferecer") {
      // Mostrar lista de motoristas livres para oferecer frete
      const motoristasLivres = motoristas.filter(
        (m) => m.status === "livre"
      );

      return (
        <div className="p-6 max-h-[70vh] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Oferecer Frete - {freteParaOferecer.id}</h2>
            <button onClick={closeModal}>
              <XCircle className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          {motoristasLivres.length === 0 ? (
            <p className="text-gray-700">Nenhum motorista livre disponível.</p>
          ) : (
            <ul className="space-y-3">
              {motoristasLivres.map((motorista) => (
                <li
                  key={motorista.id}
                  className="flex justify-between items-center border rounded p-3 cursor-pointer hover:bg-gray-100"
                  onClick={() => oferecerParaMotorista(motorista)}
                >
                  <div>
                    <p className="font-semibold">{motorista.nome}</p>
                    <p className="text-xs text-gray-600">Status: {motorista.status}</p>
                  </div>
                  <UserCheck className="h-5 w-5 text-green-600" />
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    return null;
  };

  // Tabs para organizar fretes
  const tabs = [
    { id: "pendentes", label: "Pendentes", count: fretesPendentes.length },
    { id: "andamento", label: "Em Andamento", count: fretesAndamento.length },
    { id: "finalizados", label: "Finalizados", count: fretesFinalizados.length },
  ];

  return (
    <>
    

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Fretes</h1>
            <p className="text-sm text-gray-600">Acompanhe e gerencie seus fretes</p>
          </div>
          <button
            onClick={() => openModal(null, "novo")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Frete
          </button>
        </div>

        {/* Navegação de abas */}
        <nav className="border-b border-gray-200 mb-6">
          <ul className="flex space-x-8">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 border-b-2 font-semibold text-sm ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {tab.label}{" "}
                  <span className="ml-1 text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5">
                    {tab.count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {activeTab === "pendentes" &&
            (fretesPendentes.length ? (
              fretesPendentes.map((frete) => renderFreteCard(frete, "pendentes"))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                <Package className="mx-auto mb-4" size={48} />
                Nenhum frete pendente encontrado.
              </div>
            ))}

          {activeTab === "andamento" &&
            (fretesAndamento.length ? (
              fretesAndamento.map((frete) => renderFreteCard(frete, "andamento"))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                <Package className="mx-auto mb-4" size={48} />
                Nenhum frete em andamento.
              </div>
            ))}

          {activeTab === "finalizados" &&
            (fretesFinalizados.length ? (
              fretesFinalizados.map((frete) => renderFreteCard(frete, "finalizados"))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                <Package className="mx-auto mb-4" size={48} />
                Nenhum frete finalizado.
              </div>
            ))}
        </div>

        {/* Modal */}
        {modalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full shadow-lg overflow-auto max-h-[90vh]">
              {renderModalContent()}
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default FretesPage;
