import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
import react from "@vitejs/plugin-react-swc";
import * as path from "node:path";
import viteTsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 5173, // ✅ 여기서 포트를 5173 → 3000으로 변경
  },
  plugins: [react(), viteTsconfigPaths()],
  resolve: {
    alias: {
      Components: path.resolve(__dirname, './src/Components'),
      // ducks: path.resolve(__dirname, './src/ducks'),
      Library: path.resolve(__dirname, './src/Library'),
      Pages: path.resolve(__dirname, './src/Pages'),
      Communicator: path.resolve(__dirname, './src/Communicator'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  optimizeDeps: {
    // noDiscovery: true,
    // exclude: [...]
  }
})
