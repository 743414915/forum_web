import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import inject from '@rollup/plugin-inject'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
  inject({
    $: "jquery",  // 这里会自动载入 node_modules 中的 jquery
    jQuery: "jquery",
    "windows.jQuery": "jquery"
  })],
  resolve: {
    // 忽略后缀名的配置选项, 添加 .vue 选项时要记得原本默认忽略的选项也要手动写入
    // extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    hmr: true,
    port: 3004,
    proxy: {
      "/api": {
        target: "http://localhost:8083",
        changeOrigin: true,
        pathRewrite: {
          "^api": "/api"
        }
      }
    }
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "./src/assets/base.less")]
    }
  },
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        }
      },
    },
    chunkFileNames: (chunkInfo) => {
      const facdaeModuleId = chunkInfo.facdaeModuleId ? chunkInfo.facdaeModuleId.split("/") : []
      const fileName = facdaeModuleId[facdaeModuleId.length - 2] || "[name]";
      return `js/${fileName}/[name].[hash].js`
    }
  }
})
