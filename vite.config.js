import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import postcsscsspxtorem from 'postcss-plugin-px2rem'

import path from 'path'

export default defineConfig({
  server: {
    host: '0.0.0.0', // 监听所有地址（包括内网）
    port: 5173,      // 默认端口（可修改）
    strictPort: true, // 如果端口被占用，直接退出
  },
  base: '/h5/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @use "@/assets/style/_global.scss";
        @use "@/assets/style/_variables.scss";
        @use "@/assets/style/_mixin.scss";
      `,
      },
    },
    postcss: {
      plugins: [
        postcsscsspxtorem({
          rootValue: 14, // 换算的基数
          propList: ['*'], // 需转换的属性，这里选择全部都进行转换
          selectorBlackList: ['van-'], // 忽略转换正则匹配项，这里选择忽略van-开头，即忽略vant组件中设置的样式
          replace: true, // 是否转换后直接更换属性值
          mediaQuery: false, // 设置媒体查询里的单位是否需要转换单位
          minPixelValue: 0, // 设置要替换的最小像素值(3px会被转成0.5rem)。 默认
          exclude: [
              /style-pc/,
          ],
        }),
      ]
    }
  },
})
