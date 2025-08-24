import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    build: {
      target: 'esnext',
      sourcemap: true,
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
    server: {
      port: 3000,
      open: true
    },
    define: {
      'process.env.REACT_APP_FLOUCI_API_KEY': JSON.stringify(env.REACT_APP_FLOUCI_API_KEY),
      'process.env.REACT_APP_FLOUCI_APP_TOKEN': JSON.stringify(env.REACT_APP_FLOUCI_APP_TOKEN),
      'process.env.REACT_APP_FLOUCI_APP_SECRET': JSON.stringify(env.REACT_APP_FLOUCI_APP_SECRET),
      'process.env.REACT_APP_FLOUCI_DEVELOPER_ID': JSON.stringify(env.REACT_APP_FLOUCI_DEVELOPER_ID)
    }
  }
})