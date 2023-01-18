// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiKey: process.env.apiKey,
      authDomain: process.env.authDomain,
      databaseURL: process.env.databaseURL,
      projectId: process.env.projectId,
      storageBucket: process.env.storageBucket,
      messagingSenderId: process.env.messagingSenderId,
      appId: process.env.appId
    }
  },
  app: {
    head: { 
      meta: [
        { name: 'description', content: '学生向けの作品アピールサイトです。' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined'},   //googlematerial iconを使う
      ],
      title: 'KDHub',
    },
  },
  css: [
    'bootstrap/dist/css/bootstrap.min.css', // bootstrap読み込み
    '@mdi/font/css/materialdesignicons.css', // materialdesignicons使えるようにする
    'boxicons/css/boxicons.min.css'
  ],
  ssr: false
})
