import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue()],
//   // server: {
//   //   host: '192.168.1.4'
//   // },
// })
export default defineConfig({
  plugins: [vue()],
  // 打包路径设置
  base: './',
})
