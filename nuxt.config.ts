import type { WatchOptions } from 'vite'

const pollingOptions: WatchOptions = {
  usePolling: true,
  interval: 300
}

export default defineNuxtConfig({
  compatibilityDate: '2025-09-01',

  ssr: false,

  devtools: { enabled: true },

  watchers: {
    chokidar: pollingOptions
  },

  modules: ['@pinia/nuxt', '@nuxt/eslint'],

  components: false,

  imports: {
    autoImport: false
  },

  typescript: {
    strict: true,
    typeCheck: true
  },

  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'Заметки',
      meta: [{ charset: 'utf-8' }, { name: 'description', content: 'Заметки со списками задач' }]
    }
  },

  vite: {
    server: {
      watch: pollingOptions
    }
  }
})
