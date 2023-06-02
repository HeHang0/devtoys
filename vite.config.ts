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
import { VitePWA } from 'vite-plugin-pwa';
import basicSsl from '@vitejs/plugin-basic-ssl';

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
        spare:
          'https://cdnjs.cloudflare.com/ajax/libs/vue/3.3.4/vue.global.min.js'
      },
      {
        name: 'vue-demi',
        global: 'VueDemi',
        spare:
          'https://cdnjs.cloudflare.com/ajax/libs/vue-demi/0.14.5/index.iife.min.js'
      },
      {
        name: 'pinia',
        global: 'Pinia',
        spare:
          'https://cdnjs.cloudflare.com/ajax/libs/pinia/2.1.3/pinia.iife.min.js'
      },
      {
        name: 'vue-router',
        global: 'VueRouter',
        spare:
          'https://cdnjs.cloudflare.com/ajax/libs/vue-router/4.2.1/vue-router.global.js'
      },
      {
        name: 'element-plus',
        global: 'ElementPlus',
        spare: [
          'https://cdnjs.cloudflare.com/ajax/libs/element-plus/2.3.5/index.full.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/element-plus/2.3.5/index.min.css'
        ]
      },
      {
        name: '@element-plus/icons-vue',
        global: 'ElementPlusIconsVue',
        spare:
          'https://cdnjs.cloudflare.com/ajax/libs/element-plus-icons-vue/2.1.0/global.iife.min.js'
      },
      {
        name: 'marked',
        global: 'Al',
        spare:
          'https://cdnjs.cloudflare.com/ajax/libs/marked/5.0.3/marked.min.js'
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
        spare:
          'https://cdnjs.cloudflare.com/ajax/libs/heic2any/0.0.4/heic2any.min.js'
      },
      {
        name: 'crypto-js',
        global: 'CryptoJS',
        spare:
          'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js'
      },
      // {
      //   name: 'jsqr',
      //   global: 'jsQR',
      //   spare: 'https://unpkg.com/jsqr@1.4.0/dist/jsQR.js'
      // },
      {
        name: 'js-yaml',
        global: 'jsyaml',
        spare:
          'https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js'
      },
      {
        name: 'moment',
        global: 'moment',
        spare:
          'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment-with-locales.min.js'
      },
      // {
      //   name: 'qrcode',
      //   global: 'qrcode',
      //   spare: 'https://cdn.bootcdn.net/ajax/libs/qrcode/1.5.1/qrcode.min.js'
      // },
      {
        name: 'sql-formatter',
        global: 'sqlFormatter',
        spare:
          'https://cdnjs.cloudflare.com/ajax/libs/sql-formatter/12.2.1/sql-formatter.min.js'
      },
      {
        name: 'he',
        global: 'he',
        spare: 'https://cdnjs.cloudflare.com/ajax/libs/he/1.2.0/he.min.js'
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
  }),
  VitePWA({
    manifest: {
      name: 'DevToys',
      short_name: 'DevToys',
      description: 'Web-based version of a Swiss Army knife for developers.',
      start_url: 'devtoys',
      scope: './',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#000000',
      icons: [
        {
          src: 'logo.png',
          type: 'image/png',
          sizes: '140x140'
        },
        {
          src: 'logo300x300.png',
          type: 'image/png',
          sizes: '300x300'
        }
      ]
    },
    manifestFilename: 'manifest.json',
    includeManifestIcons: false,
    outDir: 'devtoys',
    includeAssets: ['logo.png'],
    registerType: 'autoUpdate',
    workbox: {
      runtimeCaching: [
        {
          urlPattern: /(.*?)\.(js|css|ts)/, // js /css /ts静态资源缓存
          handler: 'CacheFirst',
          options: {
            cacheName: 'js-css-cache'
          }
        },
        {
          urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/, // 图片缓存
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache'
          }
        }
      ]
    }
  }),
  basicSsl()
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
  },
  server: {
    https: true
  }
});
