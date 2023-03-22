import { fileURLToPath, URL } from 'node:url'
import * as path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    outDir:'devtoys',
    rollupOptions: {
      output:{
        manualChunks(id, meta) {
          console.log()
            if (path.resolve(id).includes(path.resolve("./src/views"))) {
                return 'views'
            }else if(path.resolve(id).includes("node_modules")) {
              return 'node_modules'
            }
        }
      }
    }
  },
  plugins: [
    vue(),
    monacoEditorPlugin({
      languageWorkers: ["css", "html", "json", "editorWorkerService"]
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
