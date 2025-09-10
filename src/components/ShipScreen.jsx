import React, { useState, useEffect } from "react";
import Header from "./Header";
import apiService from "../services/apiService";
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

const FretesPage = () => {
  // Estados para dados da API
  const [motoristasEquipe, setMotoristasEquipe] = useState([]);
  const [fretesPendentes, setFretesPendentes] = useState([]);
  const [fretesAndamento, setFretesAndamento] = useState([]);
  const [fretesFinalizados, setFretesFinalizados] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados da UI
  const [activeTab, setActiveTab] = useState("pendentes");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalFrete, setModalFrete] = useState(null);
  const [modalMode, setModalMode] = useState("detalhes");
  const [freteParaOferecer, setFreteParaOferecer] = useState(null);

  const [formData, setFormData] = useState({
    origem: "",
    destino: "",
    distancia: "",
    valor: "",
    carga: "",
    peso: "",
    eixosRequerido: 3,
    observacoes: "",
  });

  const [empresaData, setEmpresaData] = useState({
    id: null,
    nome: "Carregando..."
  });

  // Carregar dados da empresa e fretes ao inicializar
  useEffect(() => {
    inicializarDados();
  }, []);

  const inicializarDados = async () => {
    try {
      setLoading(true);
      
      // Pegar dados da empresa do localStorage
      const empresaLogada = JSON.parse(localStorage.getItem('frete_app_user') || '{}');
      
      if (!empresaLogada.id) {
        alert("Erro: Faça login novamente");
        return;
      }

      setEmpresaData({
        id: empresaLogada.id,
        nome: empresaLogada.nome_empresa || empresaLogada.nome
      });

      // Carregar fretes e motoristas
      await Promise.all([
        carregarFretes(empresaLogada.id),
        carregarMotoristasEquipe(empresaLogada.id)
      ]);

    } catch (error) {
      console.error('Erro ao inicializar dados:', error);
      alert('Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const carregarFretes = async (empresaId) => {
    try {
      console.log('🚛 Carregando fretes para empresa:', empresaId);
      
      const response = await fetch(`http://localhost:3000/fretes/empresa/${empresaId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Fretes carregados:', data.fretes);
        setFretesPendentes(data.fretes.pendentes || []);
        setFretesAndamento(data.fretes.andamento || []);
        setFretesFinalizados(data.fretes.finalizados || []);
      } else {
        console.error('❌ Erro na resposta:', data.error);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar fretes:', error);
    }
  };

  const carregarMotoristasEquipe = async (empresaId) => {
    try {
      console.log('👥 Carregando motoristas da empresa:', empresaId);
      const response = await apiService.getMotoristasEmpresa(empresaId);
      
      if (response.success) {
        setMotoristasEquipe(response.motoristas);
        console.log('✅ Motoristas carregados:', response.motoristas.length);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar motoristas:', error);
    }
  };

  const openModal = (frete, mode = "detalhes") => {
    setModalFrete(frete);
    setModalMode(mode);
    if (frete) {
      setFormData({
        origem: frete.origem,
        destino: frete.destino,
        distancia: frete.distancia || "",
        valor: frete.valor.toString(),
        carga: frete.tipo_carga || frete.carga,
        peso: frete.peso || "",
        eixosRequerido: frete.eixos_requeridos || 3,
        observacoes: frete.observacoes || "",
      });
    } else {
      setFormData({
        origem: "",
        destino: "",
        distancia: "",
        valor: "",
        carga: "",
        peso: "",
        eixosRequerido: 3,
        observacoes: "",
      });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalFrete(null);
    setFreteParaOferecer(null);
    setModalMode("detalhes");
  };

  const criarFrete = async () => {
    try {
      if (!empresaData.id) {
        alert("Erro: ID da empresa não encontrado");
        return;
      }

      const novoFreteData = {
        empresaId: empresaData.id,
        origem: formData.origem,
        destino: formData.destino,
        distancia: formData.distancia,
        valor: parseFloat(formData.valor.replace(/[R$\s,]/g, '').replace('.', '')),
        tipoCarga: formData.carga,
        peso: formData.peso,
        eixosRequeridos: formData.eixosRequerido,
        observacoes: formData.observacoes
      };

      console.log('📤 Criando frete:', novoFreteData);

      const response = await fetch('http://localhost:3000/fretes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoFreteData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Frete criado com sucesso!');
        closeModal();
        await carregarFretes(empresaData.id); // Recarregar lista
      } else {
        alert(`Erro ao criar frete: ${data.error}`);
      }
    } catch (error) {
      console.error('❌ Erro ao criar frete:', error);
      alert('Erro ao criar frete. Tente novamente.');
    }
  };

  const editarFrete = async () => {
    try {
      if (!modalFrete || !empresaData.id) {
        alert("Erro: Dados do frete não encontrados");
        return;
      }

      const freteAtualizado = {
        empresaId: empresaData.id,
        origem: formData.origem,
        destino: formData.destino,
        distancia: formData.distancia,
        valor: parseFloat(formData.valor.replace(/[R$\s,]/g, '').replace('.', '')),
        tipoCarga: formData.carga,
        peso: formData.peso,
        eixosRequeridos: formData.eixosRequerido,
        observacoes: formData.observacoes
      };

      console.log('📝 Atualizando frete:', modalFrete.id, freteAtualizado);

      const response = await fetch(`http://localhost:3000/fretes/${modalFrete.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(freteAtualizado)
      });

      const data = await response.json();

      if (data.success) {
        alert('Frete atualizado com sucesso!');
        closeModal();
        await carregarFretes(empresaData.id);
      } else {
        alert(`Erro ao atualizar frete: ${data.error}`);
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar frete:', error);
      alert('Erro ao atualizar frete. Tente novamente.');
    }
  };

  const removerFrete = async (freteId) => {
    if (!confirm('Tem certeza que deseja remover este frete?')) return;

    try {
      console.log('🗑️ Removendo frete:', freteId);

      const response = await fetch(`http://localhost:3000/fretes/${freteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ empresaId: empresaData.id })
      });

      const data = await response.json();

      if (data.success) {
        alert('Frete removido com sucesso!');
        await carregarFretes(empresaData.id);
      } else {
        alert(`Erro ao remover frete: ${data.error}`);
      }
    } catch (error) {
      console.error('❌ Erro ao remover frete:', error);
      alert('Erro ao remover frete. Tente novamente.');
    }
  };

  const abrirOferecerFrete = (frete) => {
    setFreteParaOferecer(frete);
    setModalMode("oferecer");
    setModalVisible(true);
  };

  const oferecerParaMotorista = async (motorista) => {
    if (!freteParaOferecer || !empresaData.id) return;

    try {
      console.log('🎯 Oferecendo frete', freteParaOferecer.id, 'para motorista', motorista.id);

      const response = await fetch(`http://localhost:3000/fretes/${freteParaOferecer.id}/oferecer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          motoristaId: motorista.id,
          empresaId: empresaData.id
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Frete oferecido para ${motorista.nome} com sucesso!`);
        closeModal();
        await carregarFretes(empresaData.id);
      } else {
        alert(`Erro ao oferecer frete: ${data.error}`);
      }
    } catch (error) {
      console.error('❌ Erro ao oferecer frete:', error);
      alert('Erro ao oferecer frete. Tente novamente.');
    }
  };

  const encerrarFrete = async (frete) => {
    if (!confirm(`Tem certeza que deseja encerrar o frete ${frete.codigo_frete || frete.id}?`)) return;

    try {
      console.log('🏁 Encerrando frete:', frete.id);

      const response = await fetch(`http://localhost:3000/fretes/${frete.id}/finalizar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          empresaId: empresaData.id,
          finalizadoPor: 'Admin' // Em produção, pegar do usuário logado
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Frete finalizado com sucesso!');
        await carregarFretes(empresaData.id);
      } else {
        alert(`Erro ao finalizar frete: ${data.error}`);
      }
    } catch (error) {
      console.error('❌ Erro ao finalizar frete:', error);
      alert('Erro ao finalizar frete. Tente novamente.');
    }
  };

  const formatarValor = (valor) => {
    if (typeof valor === 'number') {
      return `R$ ${valor.toFixed(2).replace('.', ',')}`;
    }
    return valor;
  };

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
            <h3 className="font-semibold text-lg text-gray-900">
              {frete.codigo_frete || frete.id}
            </h3>
          </div>
          <p className="text-sm text-gray-700 font-medium">
            {frete.origem} → {frete.destino}
          </p>
          {frete.distancia && (
            <p className="text-xs text-gray-500">{frete.distancia}</p>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-700">
          <div>
            <p className="font-semibold text-green-600">{formatarValor(frete.valor)}</p>
            <p className="text-xs">Valor</p>
          </div>
          <div>
            <p>{frete.tipo_carga || frete.carga}</p>
            <p className="text-xs">Carga</p>
          </div>
          <div>
            <p>{frete.peso || 'N/A'}</p>
            <p className="text-xs">Peso</p>
          </div>
          <div>
            <p>{frete.eixos_requeridos || 3}</p>
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
              <p className="text-sm font-semibold">{frete.motorista_nome || 'Motorista'}</p>
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
              <p className="text-sm font-semibold">{frete.motorista_nome || 'Motorista'}</p>
              <p className="text-xs text-gray-500">
                Encerrado em: {frete.data_finalizacao ? new Date(frete.data_finalizacao).toLocaleDateString("pt-BR") : 'N/A'}
              </p>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderModalContent = () => {
    if (modalMode === "detalhes" && modalFrete) {
      return (
        <div className="p-6 max-h-[70vh] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{modalFrete.codigo_frete || modalFrete.id} - Detalhes</h2>
            <button onClick={closeModal}>
              <XCircle className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          <div className="space-y-3">
            <p><strong>Origem:</strong> {modalFrete.origem}</p>
            <p><strong>Destino:</strong> {modalFrete.destino}</p>
            {modalFrete.distancia && <p><strong>Distância:</strong> {modalFrete.distancia}</p>}
            <p><strong>Valor:</strong> {formatarValor(modalFrete.valor)}</p>
            <p><strong>Carga:</strong> {modalFrete.tipo_carga || modalFrete.carga}</p>
            {modalFrete.peso && <p><strong>Peso:</strong> {modalFrete.peso}</p>}
            <p><strong>Eixos:</strong> {modalFrete.eixos_requeridos || 3}</p>
            {modalFrete.observacoes && (
              <p><strong>Observações:</strong> {modalFrete.observacoes}</p>
            )}
          </div>
        </div>
      );
    }

    if (modalMode === "editar" || modalMode === "novo") {
      return (
        <div className="p-6 max-h-[70vh] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {modalMode === "novo" ? "Novo Frete" : `Editar ${modalFrete?.codigo_frete || modalFrete?.id}`}
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
              onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Destino"
              value={formData.destino}
              onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Distância (opcional)"
              value={formData.distancia}
              onChange={(e) => setFormData({ ...formData, distancia: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Valor (ex: 450.00)"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Tipo de Carga"
              value={formData.carga}
              onChange={(e) => setFormData({ ...formData, carga: e.target.value })}
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Peso (opcional)"
              value={formData.peso}
              onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="number"
              min={1}
              max={10}
              placeholder="Eixos Requeridos"
              value={formData.eixosRequerido}
              onChange={(e) => setFormData({ ...formData, eixosRequerido: Number(e.target.value) })}
              required
              className="w-full border px-3 py-2 rounded"
            />
            <textarea
              placeholder="Observações (opcional)"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              rows="3"
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
      const motoristasLivres = motoristasEquipe.filter(
        (m) => m.status_disponibilidade === "livre" && m.ativo
      );

      return (
        <div className="p-6 max-h-[70vh] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Oferecer Frete - {freteParaOferecer?.codigo_frete || freteParaOferecer?.id}</h2>
            <button onClick={closeModal}>
              <XCircle className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900">Detalhes do Frete:</h3>
            <p className="text-sm text-blue-700">
              {freteParaOferecer?.origem} → {freteParaOferecer?.destino}
            </p>
            <p className="text-sm text-blue-700">
              Valor: {formatarValor(freteParaOferecer?.valor)} | Eixos: {freteParaOferecer?.eixos_requeridos || 3}
            </p>
          </div>

          {motoristasLivres.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-700">Nenhum motorista livre disponível na equipe.</p>
              <p className="text-sm text-gray-500 mt-2">
                Adicione motoristas agregados na aba Equipe.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">
                Motoristas Disponíveis ({motoristasLivres.length}):
              </h4>
              {motoristasLivres.map((motorista) => (
                <div
                  key={motorista.id}
                  className="flex justify-between items-center border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => oferecerParaMotorista(motorista)}
                >
                  <div>
                    <p className="font-semibold">{motorista.nome}</p>
                    <p className="text-sm text-gray-600">
                      Código: {motorista.codigo} | Status: {motorista.status_disponibilidade}
                    </p>
                  </div>
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const tabs = [
    { id: "pendentes", label: "Pendentes", count: fretesPendentes.length },
    { id: "andamento", label: "Em Andamento", count: fretesAndamento.length },
    { id: "finalizados", label: "Finalizados", count: fretesFinalizados.length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#F7F9FA" }}>
        <Header companyName={empresaData.nome} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando fretes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F9FA" }}>
      <Header companyName={empresaData.nome} />
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

        {modalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full shadow-lg overflow-auto max-h-[90vh]">
              {renderModalContent()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FretesPage;