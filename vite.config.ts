import { fileURLToPath, URL } from 'node:url';
import * as path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// import AutoImport from 'unplugin-auto-import/vite';
// import Components from 'unplugin-vue-components/vite';
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import visualizer from 'rollup-plugin-visualizer';
import { cdn } from 'vite-plugin-cdn2';

const plugins = [
  vue(),
  monacoEditorPlugin({
    languageWorkers: ['css', 'html', 'json', 'editorWorkerService']
  }),
  // AutoImport({
  //   resolvers: [ElementPlusResolver()]
  // }),
  // Components({
  //   resolvers: [ElementPlusResolver()]
  // })
  cdn({
    isProduction: true,
    modules: [
      {
        name: 'vue',
        global: 'Vue',
        spare: 'https://unpkg.com/vue@3.2.47/dist/vue.global.js'
      },
      {
        name: 'vue-demi',
        global: 'VueDemi',
        spare: 'https://unpkg.com/vue-demi@0.13.11/lib/index.iife.js'
      },
      {
        name: 'vue-router',
        global: 'VueRouter',
        spare: 'https://unpkg.com/vue-router@latest/dist/vue-router.global.js'
      },
      {
        name: 'element-plus',
        global: 'ElementPlus',
        spare: [
          'https://unpkg.com/element-plus@2.3.0/dist/index.full.js',
          'https://unpkg.com/element-plus@2.3.0/dist/index.css'
        ]
      },
      {
        name: '@element-plus/icons-vue',
        global: 'ElementPlusIconsVue',
        spare:
          'https://unpkg.com/@element-plus/icons-vue@2.1.0/dist/index.iife.min.js'
      },
      {
        name: 'marked',
        global: 'Al',
        spare: 'https://cdn.bootcdn.net/ajax/libs/marked/4.3.0/marked.min.js'
      },
      {
        name: 'highlight.js',
        global: 'hljs',
        spare:
          'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js'
      },
      {
        name: 'heic2any',
        global: 'heic2any',
        spare: 'https://unpkg.com/heic2any@0.0.4/dist/heic2any.js'
      },
      {
        name: 'crypto-js',
        global: 'CryptoJS',
        spare: 'https://unpkg.com/crypto-js@4.1.1/index.js'
      },
      {
        name: 'jsqr',
        global: 'jsQR',
        spare: 'https://unpkg.com/jsqr@1.4.0/dist/jsQR.js'
      },
      {
        name: 'js-yaml',
        global: 'jsyaml',
        spare: 'https://unpkg.com/js-yaml@4.1.0/dist/js-yaml.min.js'
      },
      {
        name: 'moment',
        global: 'moment',
        spare:
          'https://cdn.bootcdn.net/ajax/libs/moment.js/2.29.4/moment-with-locales.min.js'
      },
      {
        name: 'qrcode',
        global: 'qrcode',
        spare: 'https://cdn.bootcdn.net/ajax/libs/qrcode/1.5.1/qrcode.min.js'
      },
      {
        name: 'sql-formatter',
        global: 'sqlFormatter',
        spare:
          'https://unpkg.com/sql-formatter@12.1.3/dist/sql-formatter.min.js'
      },
      {
        name: 'he',
        global: 'he',
        spare: 'https://unpkg.com/he@1.2.0/he.js'
      }
      // {
      //   name: 'cron-parser',
      //   global: 'CronParser',
      //   spare: 'https://unpkg.com/cron-parser@4.8.1/lib/parser.js'
      // },
      // {
      //   name: 'exifr',
      //   global: 'exifr',
      //   spare: 'https://unpkg.com/exifr@7.1.3/dist/full.esm.mjs'
      // }
    ],
    preset: false,
    transform(result: any) {
      if (result.tag === 'script') result.defer = true;
    }
  })
];

if (process.env.NODE_ENV === 'production') {
  // 打包依赖展示
  plugins.push(
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  );
}

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    outDir: 'devtoys',
    rollupOptions: {
      output: {
        manualChunks(id, meta) {
          if (path.resolve(id).includes(path.resolve('./src/views'))) {
            return 'views';
          } else if (path.resolve(id).includes('monaco-editor')) {
            return 'monaco-editor';
          } else if (path.resolve(id).includes('node_modules')) {
            return 'node-modules';
          }
        }
      }
    }
  },
  plugins: plugins,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
