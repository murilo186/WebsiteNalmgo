import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin, Phone, Globe, Settings, Edit2, Save, X } from "lucide-react";
import Header from "../Header";
import { useUser } from "../../contexts/UserContext";
import apiService from "../../services/apiService";

const EmpresaScreen = () => {
  const navigate = useNavigate();
  const { userData, empresaId, isLoggedIn } = useUser();
  const [empresaData, setEmpresaData] = useState({
    // Dados básicos (do cadastro)
    nome_empresa: "",
    cnpj: "",
    email_corporativo: "",

    // Dados adicionais (opcionais)
    telefone: "",
    site: "",
    whatsapp: "",
    descricao: "",
    setor: "",
    porte: "",
    data_fundacao: "",
    num_funcionarios: "",

    // Endereço
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: ""
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  // Proteção de rota - redirecionar se não estiver logado
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // Carregar dados da empresa
  useEffect(() => {
    const loadEmpresaData = async () => {
      if (!empresaId) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiService.getEmpresaData(empresaId);

        if (response.success) {
          const empresa = response.empresa;
          setEmpresaData({
            nome_empresa: empresa.nome_empresa || "",
            cnpj: empresa.cnpj || "",
            email_corporativo: empresa.email_corporativo || "",
            telefone: empresa.telefone || "",
            site: empresa.site || "",
            whatsapp: empresa.whatsapp || "",
            descricao: empresa.descricao || "",
            setor: empresa.setor || "",
            porte: empresa.porte || "",
            data_fundacao: empresa.data_fundacao || "",
            num_funcionarios: empresa.num_funcionarios || "",
            cep: empresa.cep || "",
            rua: empresa.rua || "",
            numero: empresa.numero || "",
            complemento: empresa.complemento || "",
            bairro: empresa.bairro || "",
            cidade: empresa.cidade || "",
            estado: empresa.estado || ""
          });
        } else {
          console.error("Erro ao carregar dados da empresa:", response.error);
        }
      } catch (error) {
        console.error("Erro ao carregar dados da empresa:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEmpresaData();
  }, [empresaId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await apiService.updateEmpresaData(empresaId, empresaData);

      if (response.success) {
        alert("Dados da empresa salvos com sucesso!");
        setEditMode(false);

        // Atualizar dados com a resposta do servidor
        const empresa = response.empresa;
        setEmpresaData({
          nome_empresa: empresa.nome_empresa || "",
          cnpj: empresa.cnpj || "",
          email_corporativo: empresa.email_corporativo || "",
          telefone: empresa.telefone || "",
          site: empresa.site || "",
          whatsapp: empresa.whatsapp || "",
          descricao: empresa.descricao || "",
          setor: empresa.setor || "",
          porte: empresa.porte || "",
          data_fundacao: empresa.data_fundacao || "",
          num_funcionarios: empresa.num_funcionarios || "",
          cep: empresa.cep || "",
          rua: empresa.rua || "",
          numero: empresa.numero || "",
          complemento: empresa.complemento || "",
          bairro: empresa.bairro || "",
          cidade: empresa.cidade || "",
          estado: empresa.estado || ""
        });
      } else {
        alert("Erro ao salvar dados: " + response.error);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar dados da empresa");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Resetar para dados originais
    setEmpresaData(prev => ({
      ...prev,
      nome_empresa: userData?.nome_empresa || "",
      cnpj: userData?.cnpj || "",
      email_corporativo: userData?.email_corporativo || ""
    }));
    setEditMode(false);
  };

  // Função para buscar endereço por CEP usando API ViaCEP
  const buscarEnderecoPorCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) return;

    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const dados = await response.json();

      if (!dados.erro) {
        setEmpresaData(prev => ({
          ...prev,
          rua: dados.logradouro || prev.rua,
          bairro: dados.bairro || prev.bairro,
          cidade: dados.localidade || prev.cidade,
          estado: dados.uf || prev.estado
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setLoadingCep(false);
    }
  };

  // Função para manipular mudança do CEP com formatação e busca automática
  const handleCepChange = (value) => {
    // Formatar CEP (00000-000)
    const formattedCep = value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d{3})/, '$1-$2')
      .substring(0, 9); // Limitar a 9 caracteres (00000-000)

    setEmpresaData(prev => ({ ...prev, cep: formattedCep }));

    // Se o CEP foi alterado e tem 9 caracteres (00000-000), buscar endereço
    if (formattedCep.length === 9) {
      buscarEnderecoPorCep(formattedCep);
    }
  };

  const formatCNPJ = (cnpj) => {
    if (!cnpj) return "";
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  };

  const formatCEP = (cep) => {
    if (!cep) return "";
    return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho da página */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-700 bg-clip-text text-transparent">
                Dados da Empresa
              </h1>
              <p className="text-gray-600 font-medium">
                Gerencie as informações da sua empresa
              </p>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex space-x-3">
            {editMode ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={saving}
                >
                  <X className="h-4 w-4" />
                  <span>Cancelar</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? "Salvando..." : "Salvar"}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <Edit2 className="h-4 w-4" />
                <span>Editar</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dados Básicos */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Building2 className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">Dados Básicos</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Empresa
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={empresaData.nome_empresa}
                    onChange={(e) => setEmpresaData(prev => ({ ...prev, nome_empresa: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{empresaData.nome_empresa || "Não informado"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNPJ
                </label>
                <p className="text-gray-900 font-medium">{formatCNPJ(empresaData.cnpj) || "Não informado"}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Corporativo
                </label>
                {editMode ? (
                  <input
                    type="email"
                    value={empresaData.email_corporativo}
                    onChange={(e) => setEmpresaData(prev => ({ ...prev, email_corporativo: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{empresaData.email_corporativo || "Não informado"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                {editMode ? (
                  <textarea
                    value={empresaData.descricao}
                    onChange={(e) => setEmpresaData(prev => ({ ...prev, descricao: e.target.value }))}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descreva sua empresa..."
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{empresaData.descricao || "Não informado"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contatos */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Phone className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-800">Contatos</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                {editMode ? (
                  <input
                    type="tel"
                    value={empresaData.telefone}
                    onChange={(e) => setEmpresaData(prev => ({ ...prev, telefone: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(11) 99999-9999"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{empresaData.telefone || "Não informado"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp
                </label>
                {editMode ? (
                  <input
                    type="tel"
                    value={empresaData.whatsapp}
                    onChange={(e) => setEmpresaData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(11) 99999-9999"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{empresaData.whatsapp || "Não informado"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site
                </label>
                {editMode ? (
                  <input
                    type="url"
                    value={empresaData.site}
                    onChange={(e) => setEmpresaData(prev => ({ ...prev, site: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://exemplo.com.br"
                  />
                ) : (
                  <div>
                    {empresaData.site ? (
                      <a
                        href={empresaData.site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-medium hover:underline flex items-center space-x-1"
                      >
                        <Globe className="h-4 w-4" />
                        <span>{empresaData.site}</span>
                      </a>
                    ) : (
                      <p className="text-gray-900 font-medium">Não informado</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <MapPin className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-bold text-gray-800">Endereço</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CEP
                    {loadingCep && <span className="text-xs text-blue-600 ml-2">Buscando...</span>}
                  </label>
                  {editMode ? (
                    <div className="relative">
                      <input
                        type="text"
                        value={empresaData.cep}
                        onChange={(e) => handleCepChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="00000-000"
                        maxLength="9"
                        disabled={loadingCep}
                      />
                      {loadingCep && (
                        <div className="absolute right-3 top-3">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-900 font-medium">{formatCEP(empresaData.cep) || "Não informado"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={empresaData.numero}
                      onChange={(e) => setEmpresaData(prev => ({ ...prev, numero: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="123"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{empresaData.numero || "Não informado"}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rua
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={empresaData.rua}
                    onChange={(e) => setEmpresaData(prev => ({ ...prev, rua: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Rua das Flores"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{empresaData.rua || "Não informado"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complemento
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={empresaData.complemento}
                    onChange={(e) => setEmpresaData(prev => ({ ...prev, complemento: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Sala 101"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{empresaData.complemento || "Não informado"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bairro
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={empresaData.bairro}
                    onChange={(e) => setEmpresaData(prev => ({ ...prev, bairro: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Centro"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{empresaData.bairro || "Não informado"}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={empresaData.cidade}
                      onChange={(e) => setEmpresaData(prev => ({ ...prev, cidade: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="São Paulo"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{empresaData.cidade || "Não informado"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  {editMode ? (
                    <select
                      value={empresaData.estado}
                      onChange={(e) => setEmpresaData(prev => ({ ...prev, estado: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione</option>
                      <option value="SP">São Paulo</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="RS">Rio Grande do Sul</option>
                      {/* Adicionar outros estados */}
                    </select>
                  ) : (
                    <p className="text-gray-900 font-medium">{empresaData.estado || "Não informado"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Informações Adicionais</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Setor
                </label>
                {editMode ? (
                  <select
                    value={empresaData.setor}
                    onChange={(e) => setEmpresaData(prev => ({ ...prev, setor: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione o setor</option>
                    <option value="transportes">Transportes e Logística</option>
                    <option value="comercio">Comércio</option>
                    <option value="servicos">Serviços</option>
                    <option value="industria">Indústria</option>
                    <option value="tecnologia">Tecnologia</option>
                    <option value="outro">Outro</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium">{empresaData.setor || "Não informado"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Porte da Empresa
                </label>
                {editMode ? (
                  <select
                    value={empresaData.porte}
                    onChange={(e) => setEmpresaData(prev => ({ ...prev, porte: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione o porte</option>
                    <option value="mei">MEI</option>
                    <option value="micro">Microempresa</option>
                    <option value="pequena">Pequena Empresa</option>
                    <option value="media">Média Empresa</option>
                    <option value="grande">Grande Empresa</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium">{empresaData.porte || "Não informado"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Fundação
                </label>
                {editMode ? (
                  <input
                    type="date"
                    value={empresaData.data_fundacao}
                    onChange={(e) => setEmpresaData(prev => ({ ...prev, data_fundacao: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">
                    {empresaData.data_fundacao ?
                      new Date(empresaData.data_fundacao).toLocaleDateString('pt-BR') :
                      "Não informado"
                    }
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Funcionários
                </label>
                {editMode ? (
                  <input
                    type="number"
                    value={empresaData.num_funcionarios}
                    onChange={(e) => setEmpresaData(prev => ({ ...prev, num_funcionarios: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{empresaData.num_funcionarios || "Não informado"}</p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmpresaScreen;