import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import svgrPlugin from 'vite-plugin-svgr'
import envCompatible from 'vite-plugin-env-compatible'
import path from 'path'
import react from '@vitejs/plugin-react';

// see all documentation here https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build change as your need
  // comment this out if that isn't relevant for your project
  build: {
    outDir: 'NeoCardMaster.build',
  },
  css: { modules: { localsConvention: 'camelCase' } },
  plugins: [
    react(),
    envCompatible(),
    // reactRefresh(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  resolve: {
    alias: {
        process: "process/browser",
        stream: "stream-browserify",
        zlib: "browserify-zlib",
        util: 'util',
        '@': path.resolve(__dirname, "./src"),
    },
  }
})
