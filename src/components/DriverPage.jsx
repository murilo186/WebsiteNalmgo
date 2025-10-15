import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { useUser } from "../contexts/UserContext";
import apiService from "../services/apiService";
import {
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  User,
  Truck,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Navigation,
  X,
  Package,
  DollarSign,
  Map,
  List,
} from "lucide-react";

const DriverPage = () => {
  const navigate = useNavigate();
  const { user, empresaId, isLoggedIn } = useUser();
  const [motoristas, setMotoristas] = useState([]);
  const [filteredMotoristas, setFilteredMotoristas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRaio, setSelectedRaio] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Proteção de rota - redirecionar se não estiver logado
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // Estados do modal de oferecer frete
  const [showOfertaModal, setShowOfertaModal] = useState(false);
  const [motoristaSelected, setMotoristaSelected] = useState(null);
  const [fretes, setFretes] = useState([]);
  const [loadingFretes, setLoadingFretes] = useState(false);
  const [loadingOferta, setLoadingOferta] = useState(false);

  // Estados do mapa
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [empresaLocation, setEmpresaLocation] = useState(null);
  const [loadingMap, setLoadingMap] = useState(false);

  // Carregar motoristas próximos disponíveis
  const loadMotoristasPróximos = async () => {
    console.log("=== DEBUG loadMotoristasPróximos ===");
    console.log("User completo:", user);

    // Usar empresa do contexto (mesma que EmpresaScreen)
    const currentEmpresaId = empresaId || user?.empresa?.id || 1;
    console.log("✅ Usando empresa ID:", currentEmpresaId, "Raio:", selectedRaio);
    setLoading(true);
    setError("");

    try {
      const response = await apiService.get(
        `/api/proximidade/empresa/${currentEmpresaId}/motoristas?raio=${selectedRaio}`
      );

      if (response.success) {
        // Filtrar apenas motoristas disponíveis
        const motoristasDisponiveis = response.motoristas.filter(
          m => m.status_disponibilidade === 'livre'
        );
        setMotoristas(motoristasDisponiveis);
        setFilteredMotoristas(motoristasDisponiveis);
        console.log(`✅ Encontrados ${motoristasDisponiveis.length} motoristas disponíveis em ${selectedRaio}km`);
      } else {
        setError("Nenhum motorista disponível encontrado próximo");
      }
    } catch (err) {
      console.error("Erro ao buscar motoristas:", err);
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("=== useEffect disparado ===");
    console.log("User mudou:", user);
    loadMotoristasPróximos();
  }, [user, empresaId, selectedRaio]);

  // Debug adicional - executar sempre
  useEffect(() => {
    console.log("=== UserContext Debug ===");
    console.log("User atual:", user);

    // Verificar localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    console.log("Token no localStorage:", token);
    console.log("User no localStorage:", userData);
  }, []);

  // Filtrar motoristas por busca (sem filtro de status, pois só mostra disponíveis)
  const handleSearch = useCallback(
    (term) => {
      let filtered = motoristas.filter(
        (motorista) =>
          motorista.nome.toLowerCase().includes(term.toLowerCase()) ||
          motorista.email.toLowerCase().includes(term.toLowerCase())
      );

      setFilteredMotoristas(filtered);
    },
    [motoristas]
  );

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

  const getStatusColor = (status) => {
    switch (status) {
      case "livre":
        return "text-green-600 bg-green-100";
      case "em-frete":
        return "text-blue-600 bg-blue-100";
      case "indisponivel":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "livre":
        return CheckCircle;
      case "em-frete":
        return Clock;
      default:
        return AlertCircle;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "livre":
        return "Disponível";
      case "em-frete":
        return "Em Frete";
      case "indisponivel":
        return "Indisponível";
      default:
        return "Desconhecido";
    }
  };

  // Carregar fretes pendentes da empresa
  const loadFretes = async () => {
    const currentEmpresaId = empresaId || user?.empresa?.id || 1;
    setLoadingFretes(true);

    try {
      const response = await apiService.get(`/api/fretes/empresa/${currentEmpresaId}`);

      if (response.success) {
        // Pegar apenas fretes pendentes
        setFretes(response.fretes.pendentes || []);
      } else {
        setError("Erro ao carregar fretes");
      }
    } catch (err) {
      console.error("Erro ao buscar fretes:", err);
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoadingFretes(false);
    }
  };

  // Abrir modal de oferta de frete
  const ofereceFreteMotorista = async (motoristaId) => {
    const motorista = motoristas.find(m => m.id === motoristaId);
    setMotoristaSelected(motorista);
    setShowOfertaModal(true);
    await loadFretes();
  };

  // Oferecer frete específico para o motorista
  const oferecerFrete = async (freteId) => {
    if (!motoristaSelected) return;

    const currentEmpresaId = empresaId || user?.empresa?.id || 1;
    setLoadingOferta(true);

    try {
      const response = await apiService.post(`/api/fretes/${freteId}/oferecer`, {
        motoristaId: motoristaSelected.id,
        empresaId: empresaId
      });

      if (response.success) {
        setShowOfertaModal(false);
        setMotoristaSelected(null);
        // Recarregar lista de motoristas para atualizar status
        await loadTerceirizados();
        alert("Frete oferecido com sucesso!");
      } else {
        alert("Erro ao oferecer frete: " + response.error);
      }
    } catch (err) {
      console.error("Erro ao oferecer frete:", err);
      alert("Erro ao conectar com o servidor");
    } finally {
      setLoadingOferta(false);
    }
  };

  // Carregar Google Maps quando mudar para visualização de mapa
  useEffect(() => {
    if (showMap && !map) {
      loadGoogleMaps();
    }
  }, [showMap]);

  // Carregar Google Maps Script
  const loadGoogleMaps = () => {
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDdcof_-ueqF-JxkAF9zplTr7l85U8-hSs&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;
    document.head.appendChild(script);
  };

  // Inicializar mapa
  const initializeMap = async () => {
    if (!window.google || !mapRef.current) return;

    setLoadingMap(true);
    try {
      // Buscar localização da empresa
      const empresaCoords = await buscarLocalizacaoEmpresa();

      const mapOptions = {
        center: empresaCoords || { lat: -23.5505, lng: -46.6333 },
        zoom: 13,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      };

      const googleMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(googleMap);

      if (empresaCoords) {
        console.log('🏢 Adicionando marcador da empresa em:', empresaCoords);

        // Adicionar marcador da empresa (ícone simples)
        const empresaMarker = new window.google.maps.Marker({
          position: empresaCoords,
          map: googleMap,
          title: `🏢 ${user?.nome_empresa || 'Sua Empresa'}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 15,
            fillColor: '#3B82F6',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          },
          label: {
            text: '🏢',
            fontSize: '16px',
            color: 'white'
          }
        });

        console.log('✅ Marcador da empresa criado:', empresaMarker);

        // Adicionar InfoWindow para empresa
        const empresaInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 200px;">
              <h3 style="margin: 0 0 10px 0; color: #333;">🏢 ${user?.nome_empresa || 'Sua Empresa'}</h3>
              <p style="margin: 5px 0; color: #666; font-size: 14px;">
                📍 Localização da empresa
              </p>
              <p style="margin: 5px 0; color: #666; font-size: 14px;">
                👥 ${motoristas.length} motoristas próximos
              </p>
            </div>
          `
        });

        empresaMarker.addListener('click', () => {
          empresaInfoWindow.open(googleMap, empresaMarker);
        });

        // Adicionar marcadores dos motoristas
        addMotoristaMarkers(googleMap);
      } else {
        console.log('❌ Não foi possível obter coordenadas da empresa');
      }
    } catch (error) {
      console.error('Erro ao inicializar mapa:', error);
    } finally {
      setLoadingMap(false);
    }
  };

  // Buscar localização da empresa
  const buscarLocalizacaoEmpresa = async () => {
    const currentEmpresaId = empresaId || user?.empresa?.id || 1;
    console.log('🏢 Buscando localização da empresa ID:', currentEmpresaId);

    try {
      const response = await apiService.getEmpresaData(currentEmpresaId);
      console.log('📍 Resposta da API empresa:', response);

      if (response.success && response.empresa) {
        const { latitude, longitude, cidade, estado, rua, numero, cep } = response.empresa;
        console.log('🗺️ Dados da empresa:', response.empresa);

        if (latitude && longitude) {
          const coords = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
          console.log('✅ Coords cadastradas encontradas:', coords);
          setEmpresaLocation(coords);
          return coords;
        }

        // Se não tem coordenadas, tentar geocoding com endereço
        if (cidade || cep || rua) {
          console.log('📍 Tentando geocoding com endereço...');
          const endereco = `${rua || ''} ${numero || ''}, ${cidade || ''}, ${estado || 'SP'}, Brasil`.trim();
          console.log('🔍 Buscando:', endereco);

          try {
            const geocoder = new window.google.maps.Geocoder();
            const result = await new Promise((resolve, reject) => {
              geocoder.geocode({ address: endereco }, (results, status) => {
                if (status === 'OK' && results[0]) {
                  resolve(results[0].geometry.location);
                } else {
                  reject(new Error('Geocoding failed: ' + status));
                }
              });
            });

            const coords = { lat: result.lat(), lng: result.lng() };
            console.log('✅ Geocoding bem-sucedido:', coords);
            setEmpresaLocation(coords);

            // Opcional: Salvar coordenadas no banco para próximas vezes
            try {
              await apiService.post(`/api/empresa/${currentEmpresaId}/coordenadas`, {
                latitude: coords.lat,
                longitude: coords.lng
              });
              console.log('💾 Coordenadas salvas no banco');
            } catch (saveError) {
              console.log('⚠️ Não foi possível salvar coordenadas:', saveError);
            }

            return coords;
          } catch (geocodeError) {
            console.error('❌ Erro no geocoding:', geocodeError);
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro ao buscar localização da empresa:', error);
    }

    // Fallback - São Paulo
    console.log('⚠️ Usando localização padrão (São Paulo)');
    const fallbackCoords = { lat: -23.5505, lng: -46.6333 };
    setEmpresaLocation(fallbackCoords);
    return fallbackCoords;
  };

  // Adicionar marcadores dos motoristas no mapa
  const addMotoristaMarkers = (googleMap) => {
    console.log('🚛 Adicionando marcadores de motoristas:', motoristas.length);

    motoristas.forEach((motorista, index) => {
      if (motorista.latitude && motorista.longitude) {
        console.log(`🚛 Motorista ${index + 1}:`, {
          nome: motorista.nome,
          lat: motorista.latitude,
          lng: motorista.longitude
        });

        const marker = new window.google.maps.Marker({
          position: {
            lat: parseFloat(motorista.latitude),
            lng: parseFloat(motorista.longitude),
          },
          map: googleMap,
          title: `🚛 ${motorista.nome} - ${parseFloat(motorista.distancia_km).toFixed(1)}km`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: '#10B981',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
          label: {
            text: '🚛',
            fontSize: '14px',
            color: 'white'
          }
        });

        // Adicionar InfoWindow com detalhes do motorista
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 250px;">
              <h3 style="margin: 0 0 10px 0; color: #333;">${motorista.nome}</h3>
              <p style="margin: 5px 0; color: #666; font-size: 14px;">
                📧 ${motorista.email}
              </p>
              <p style="margin: 5px 0; color: #666; font-size: 14px;">
                📍 ${parseFloat(motorista.distancia_km).toFixed(1)}km de distância
              </p>
              <p style="margin: 5px 0; color: #666; font-size: 14px;">
                📊 ${motorista.total_fretes_concluidos} fretes concluídos
              </p>
              <div style="margin-top: 10px;">
                <span style="background: #10B981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                  ✅ Disponível
                </span>
              </div>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(googleMap, marker);
        });
      }
    });
  };

  // Atualizar marcadores quando lista de motoristas mudar
  useEffect(() => {
    if (map && motoristas.length > 0) {
      addMotoristaMarkers(map);
    }
  }, [motoristas, map]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Motoristas Próximos
            </h1>
            <p className="text-gray-600">
              Encontre motoristas disponíveis próximos para oferecer fretes
            </p>
          </div>

          <div className="flex space-x-3 mt-4 md:mt-0">
            {/* Toggle Lista/Mapa */}
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setShowMap(false)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                  !showMap
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="h-4 w-4" />
                <span>Lista</span>
              </button>
              <button
                onClick={() => setShowMap(true)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                  showMap
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Map className="h-4 w-4" />
                <span>Mapa</span>
              </button>
            </div>

            <button
              onClick={loadMotoristasPróximos}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Navigation className="h-4 w-4" />
              <span>Atualizar Busca</span>
            </button>
          </div>
        </div>

        {/* Exibir erro se houver */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Filtros e Busca */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
            {/* Barra de busca */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtro de raio */}
            <div className="flex items-center space-x-2">
              <Navigation className="h-5 w-5 text-gray-400" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={selectedRaio}
                onChange={(e) => setSelectedRaio(Number(e.target.value))}
              >
                <option value={10}>10km</option>
                <option value={20}>20km</option>
                <option value={30}>30km</option>
                <option value={50}>50km</option>
                <option value={100}>100km</option>
              </select>
            </div>
          </div>
        </div>

        {/* Visualização do Mapa ou Lista */}
        {showMap ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                🗺️ Mapa - Empresa e Motoristas Próximos
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>🏢 Sua Empresa</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>🚛 Motoristas ({motoristas.length})</span>
                </div>
              </div>
            </div>

            <div className="relative">
              {loadingMap && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600 font-medium">Carregando mapa...</span>
                  </div>
                </div>
              )}

              <div
                ref={mapRef}
                className="w-full h-96 rounded-xl border border-gray-200"
                style={{ minHeight: '400px' }}
              />
            </div>

            {!loadingMap && motoristas.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Map className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum motorista para exibir no mapa</p>
                <p className="text-sm">Busque motoristas próximos primeiro</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Lista de Motoristas */}
            {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando motoristas próximos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMotoristas.map((motorista) => {
              const StatusIcon = getStatusIcon(
                motorista.status_disponibilidade
              );
              return (
                <div
                  key={motorista.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  {/* Header do Card */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {motorista.nome}
                        </h3>
                        <div className="flex items-center space-x-1 text-sm">
                          <Navigation className="h-4 w-4 text-blue-400" />
                          <span className="text-gray-600">
                            {parseFloat(motorista.distancia_km).toFixed(1)}km
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        motorista.status_disponibilidade
                      )}`}
                    >
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {getStatusText(motorista.status_disponibilidade)}
                    </span>
                  </div>

                  {/* Informações do Motorista */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {motorista.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      Usuário: {motorista.usuario}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Truck className="h-4 w-4 mr-2" />
                      Código: {motorista.codigo}
                    </div>
                    {motorista.telefone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        Telefone: {motorista.telefone}
                      </div>
                    )}
                  </div>

                  {/* Estatísticas */}
                  <div className="flex justify-between text-center border-t pt-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {motorista.total_fretes_concluidos}
                      </p>
                      <p className="text-xs text-gray-500">Fretes</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {parseFloat(motorista.distancia_km).toFixed(1)}km
                      </p>
                      <p className="text-xs text-gray-500">Distância</p>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="mt-4">
                    <button
                      onClick={() => ofereceFreteMotorista(motorista.id)}
                      className="w-full bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      disabled={motorista.status_disponibilidade !== "livre"}
                    >
                      Oferecer Frete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mensagem quando não há resultados */}
        {!loading && filteredMotoristas.length === 0 && (
          <div className="text-center py-12">
            <Navigation className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum motorista terceirizado encontrado
            </h3>
            <p className="text-gray-600">
              Não há motoristas disponíveis em um raio de 30km da sua empresa.
            </p>
            <button
              onClick={loadMotoristasPróximos}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        )}
          </>
        )}

        {/* Modal de Oferecer Frete */}
        {showOfertaModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
              {/* Header do Modal */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Oferecer Frete
                  </h2>
                  <p className="text-gray-600">
                    Para: {motoristaSelected?.nome} ({motoristaSelected?.codigo})
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowOfertaModal(false);
                    setMotoristaSelected(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Conteúdo do Modal */}
              <div className="p-6 overflow-y-auto">
                {loadingFretes ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando fretes...</p>
                  </div>
                ) : fretes.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum frete disponível
                    </h3>
                    <p className="text-gray-600">
                      Não há fretes pendentes para oferecer.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 mb-4">
                      Selecione um frete para oferecer:
                    </h3>

                    {fretes.map((frete) => (
                      <div
                        key={frete.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {frete.origem} → {frete.destino}
                              </span>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center space-x-1">
                                <Package className="h-4 w-4" />
                                <span>{frete.tipo_carga}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="h-4 w-4" />
                                <span>R$ {parseFloat(frete.valor).toFixed(2)}</span>
                              </div>
                              {frete.peso && (
                                <div className="flex items-center space-x-1">
                                  <Truck className="h-4 w-4" />
                                  <span>{frete.peso}</span>
                                </div>
                              )}
                            </div>

                            {frete.observacoes && (
                              <p className="text-sm text-gray-600 mb-3">
                                <strong>Obs:</strong> {frete.observacoes}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => oferecerFrete(frete.id)}
                            disabled={loadingOferta}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingOferta ? "Oferecendo..." : "Oferecer"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverPage;
