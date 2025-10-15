import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Otimizações de build
  build: {
    // Tamanho máximo de warning (500kb)
    chunkSizeWarningLimit: 500,

    // Otimizar saída com esbuild (mais rápido que terser)
    minify: 'esbuild',
    target: 'es2015',

    // Code splitting manual
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar bibliotecas grandes
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
        },
      },
    },

    // Otimizações adicionais
    sourcemap: false, // Desabilitar sourcemaps em produção
    reportCompressedSize: false, // Mais rápido
  },

  // Preview server (para testar build localmente)
  preview: {
    port: 5173,
    strictPort: false,
  },

  // Dev server
  server: {
    port: 5173,
    strictPort: false,
    host: true, // Permite acesso via rede local
  },
})
