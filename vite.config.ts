import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postcsspxtoviewport from 'postcss-px-to-viewport'
import autoprefixer from 'autoprefixer'
import path from 'path'
import dayjs from 'dayjs'
import { VitePWA } from 'vite-plugin-pwa'
import replace from '@rollup/plugin-replace'
import styleImport from 'vite-plugin-style-import'
const appVersion = dayjs().format('YYYY_MM_DD_HH_mm_ss')

const serviceWorkerFileName = `sw.js`
const isProd = process.env.BUILD_ENV === 'prod'

const installJs = `
<script src="//cdn.jsdelivr.net/npm/eruda"></script>
<script>
  eruda.init()
</script>
`
// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  resolve: {
    alias: [{ find: '@/', replacement: path.resolve(__dirname, 'src') + '/' }],
  },
  plugins: [
    react(),
    VitePWA({
      mode: 'production',
      registerType: 'autoUpdate',
      filename: serviceWorkerFileName,
      injectRegister: null,
      workbox: {
        // globIgnores: ['*.html'],
        // 服务工作进程会将所有应用程序资产存储在浏览器缓存（或一组缓存）中。每次对应用程序进行更改并重新生成它时，也会重新生成，包括在其预缓存清单中所有新修改的资产，这些资产的修订将更改（所有已修改的资产都将具有新版本）。尚未修改的资产也将包含在服务工作进程预缓存清单中，但其修订版不会与上一个修订版发生更改。service worker
        cleanupOutdatedCaches: true,
        globPatterns: [
          'assets/*.ttf',
          'assets/*.woff2',
          'assets/*.woff',
          'assets/*.ico',
          'assets/*.js',
          'assets/*.css',
          'assets/*.svg',
          'assets/*.png',
          'index.html',
        ],
        runtimeCaching: [
          {
            urlPattern: /.*(?=\/npm\/eruda)/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'npm-eruda',
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30, // <== 30 days
              },
            },
          },

          {
            urlPattern: /.*(?=monitor\.latest\.js)/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'monitor',
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 6, // <== 6
              },
            },
          },
        ],
      },
    }),
    styleImport({
      libs: [
        {
          libraryName: 'react-vant',
          libraryNameChangeCase: 'paramCase',
          resolveStyle: (name) => {
            if (name === 'config-provider' || name === 'hooks') {
              return ''
            } else {
              return `react-vant/es/${name}/style/index.css`
            }
          },
          resolveComponent: (name) => {
            return `react-vant/es/${name}/index.js`
          },
        },
      ],
    }),
    replace({
      preventAssignment: true,
      __APP_VERSION__: appVersion,
      __SW__: `/${serviceWorkerFileName}`,
      __INLINE_JS__: isProd ? '' : installJs,
    }),
  ],
  define: {
    __APP_VERSION__: appVersion,
  },
  build: {
    sourcemap: true,
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: [
            'Android 4.1',
            'iOS 7.1',
            'Chrome > 31',
            'ff > 31',
            'ie >= 8',
            '> 1%',
          ],
          grid: true,
        }),
        postcsspxtoviewport({
          unitToConvert: 'px', // 要转化的单位
          viewportWidth: 375, // UI设计稿的宽度
          unitPrecision: 6, // 转换后的精度，即小数点位数
          propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
          viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
          fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
          selectorBlackList: ['ignore-'], // 指定不转换为视窗单位的类名，
          minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
          mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
          replace: true, // 是否转换后直接更换属性值
          // exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
          exclude: [],
          landscape: false, // 是否处理横屏情况
        }),
      ],
    },
  },
})
