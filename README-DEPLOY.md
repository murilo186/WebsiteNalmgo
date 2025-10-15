# 🚀 Deploy do Frontend NALM GO no Render

## ✅ Arquivos Criados/Modificados

- ✅ `vite.config.js` - Configurações de build otimizado
- ✅ `.env` - Variáveis de ambiente para desenvolvimento
- ✅ `.env.example` - Template de variáveis
- ✅ `render.yaml` - Configuração de deploy automático
- ✅ `public/_redirects` - SPA routing
- ✅ `src/services/apiService.js` - Usa variável de ambiente
- ✅ `.gitignore` - Atualizado para proteger .env

## 📦 Variáveis de Ambiente

### Desenvolvimento Local
```env
VITE_API_URL=http://localhost:3000
```

### Produção (Render)
```env
VITE_API_URL=https://nalm-go-backend.onrender.com
```

## 🎯 Como Testar Localmente

### 1. Desenvolvimento
```bash
npm run dev
```
Usa `.env` → `http://localhost:3000`

### 2. Build de Produção
```bash
npm run build
```

### 3. Testar Build Localmente
```bash
npm run preview
```
Acesse: http://localhost:4173

## 🚀 Deploy no Render

### Método 1: Automático (Blueprint)

1. Faça commit e push para o GitHub:
```bash
git add .
git commit -m "Preparar frontend para deploy no Render"
git push origin main
```

2. No Render Dashboard:
   - New + → Blueprint
   - Conecte o repositório
   - O Render detecta `render.yaml` automaticamente
   - Clique em "Apply"

### Método 2: Manual

1. No Render Dashboard:
   - New + → Static Site
   - Conecte o repositório

2. Configure:
   - **Name**: nalm-go-frontend
   - **Branch**: main
   - **Root Directory**: web3/my-frete-app
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. Environment Variables:
   ```
   VITE_API_URL=https://nalm-go-backend.onrender.com
   ```

4. Aguarde o deploy (~3-5 minutos)

## 🔧 Otimizações Implementadas

### Bundle Size
- **Antes**: 608 KB (um arquivo único)
- **Depois**:
  - react-vendor.js: 45 KB
  - chart-vendor.js: 179 KB
  - index.js: 388 KB
  - **Total**: ~613 KB (dividido em 3 arquivos = carrega mais rápido!)

### Code Splitting
- ✅ React/ReactDOM/Router separados
- ✅ Chart.js separado
- ✅ Código da aplicação separado
- ✅ Carregamento lazy (mais rápido)

### Otimizações
- ✅ Minificação com esbuild
- ✅ Tree shaking automático
- ✅ CSS otimizado
- ✅ Sourcemaps desabilitados em produção

## 📊 Tamanho dos Arquivos

```
dist/
├── index.html                 0.63 KB
├── assets/
│   ├── index.css             55.74 KB (gzip: ~9 KB)
│   ├── react-vendor.js       45.42 KB (gzip: ~15 KB)
│   ├── chart-vendor.js      179.14 KB (gzip: ~50 KB)
│   └── index.js             388.45 KB (gzip: ~110 KB)
```

## 🌐 Após o Deploy

1. Atualize o CORS no backend:
   - Render Dashboard → nalm-go-backend → Environment
   - `CORS_ORIGIN`: Adicione a URL do frontend
   - Exemplo: `https://nalm-go-frontend.onrender.com`

2. Teste os endpoints:
   - Login
   - Dashboard
   - Criação de fretes

## 🐛 Troubleshooting

### Erro: "Failed to fetch"
- Verifique se `VITE_API_URL` está configurada
- Verifique CORS no backend
- Abra DevTools → Console para ver erros

### Build falha no Render
- Verifique se `package.json` está commitado
- Confirme que `Build Command` está correta
- Veja os logs do Render

### SPA Routing não funciona
- Confirme que `public/_redirects` existe
- Conteúdo: `/* /index.html 200`

## ✅ Checklist Pré-Deploy

- [x] apiService.js usa `import.meta.env.VITE_API_URL`
- [x] vite.config.js criado com otimizações
- [x] .env.example commitado
- [x] .env no .gitignore
- [x] render.yaml configurado
- [x] public/_redirects criado
- [x] Build testado localmente
- [ ] Código commitado no GitHub
- [ ] Deploy no Render
- [ ] CORS atualizado no backend
- [ ] Testes end-to-end

## 📱 URLs

- **Frontend**: https://nalm-go-frontend.onrender.com
- **Backend**: https://nalm-go-backend.onrender.com
- **API Base**: https://nalm-go-backend.onrender.com/api

## 🎉 Pronto!

Seu frontend está otimizado e pronto para deploy!
