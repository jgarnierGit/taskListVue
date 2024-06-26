// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  build: {
    transpile: ['vuetify'],
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  modules: ['@pinia/nuxt', '@nuxt/test-utils/module',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    }],
  vite: {
    define: {
      VUE_APP_JOB_RETRY_MAX: 20,
      VUE_APP_JOB_RETRY_TIMEOUT: 50
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
