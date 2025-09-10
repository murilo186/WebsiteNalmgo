# Services - Pasta de Serviços

Esta pasta contém todos os serviços para comunicação com o backend.

## Estrutura

- `apiservice.js` - Serviço principal para todas as chamadas da API
- `authService.js` - Serviço específico para autenticação
- `config.js` - Configurações e constantes da API

## Como Usar

### 1. Autenticação (Login/Registro)

```javascript
import { useUser } from '../contexts/UserContext';

function LoginComponent() {
  const { login, register, loading, error } = useUser();

  const handleLogin = async (email, senha) => {
    const result = await login(email, senha);
    if (result.success) {
      // Redirecionar para dashboard
      navigate('/dashboard');
    }
  };

  const handleRegister = async (empresaData) => {
    const result = await register(empresaData);
    if (result.success) {
      // Mostrar sucesso e redirecionar para login
    }
  };
}
```

### 2. Usar o ApiService diretamente

```javascript
import apiService from '../services/apiservice';

// Buscar fretes
const fretes = await apiService.getFretes(empresaId);

// Criar novo frete
const novoFrete = await apiService.createFrete({
  origem: 'São Paulo, SP',
  destino: 'Rio de Janeiro, RJ',
  peso: 1000,
  // ... outros dados
});

// Buscar motoristas
const motoristas = await apiService.searchMotoristas({
  estado: 'SP',
  disponivel: true
});
```

### 3. Configurações de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
```

## Endpoints Disponíveis

### Empresa
- `POST /register-empresa` - Registrar empresa
- `POST /login-empresa` - Login de empresa
- `GET /empresa/:id` - Dados da empresa

### Fretes
- `GET /fretes?empresaId=:id` - Listar fretes
- `POST /fretes` - Criar frete
- `PUT /fretes/:id` - Atualizar frete  
- `DELETE /fretes/:id` - Deletar frete

### Motoristas
- `GET /motoristas?empresaId=:id` - Listar motoristas
- `GET /motoristas/buscar` - Buscar motoristas

### Equipe
- `GET /equipe?empresaId=:id` - Listar equipe
- `POST /equipe` - Adicionar membro

### Dashboard
- `GET /dashboard?empresaId=:id` - Métricas do dashboard

### Utils
- `GET /utils/validate-cep/:cep` - Validar CEP
- `POST /utils/calculate-distance` - Calcular distância

## Estrutura de Dados Esperada

### Registro de Empresa
```javascript
{
  nomeEmpresa: "Transportes ABC",
  senha: "minhasenha123",
  emailCorporativo: "contato@transportesabc.com",
  cnpj: "12345678000100",
  nomeAdministrador: "João Silva",
  cpfAdministrador: "12345678900"
}
```

### Login
```javascript
{
  email: "contato@transportesabc.com",
  senha: "minhasenha123"
}
```

## Tratamento de Erros

Todos os serviços retornam objetos no formato:

```javascript
// Sucesso
{
  success: true,
  data: {...},
  message: "Operação realizada com sucesso"
}

// Erro
{
  success: false,
  error: "Mensagem de erro",
  details: {...} // Em modo desenvolvimento
}
```