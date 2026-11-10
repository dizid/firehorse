import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import App from './App.vue'
import { routes, attachRouterHooks } from './router'
// Fonts served from our own domain (were a render-blocking Google Fonts stylesheet,
// which also sent every visitor's IP to Google). Same families and weights as before.
import '@fontsource/cinzel/400.css'
import '@fontsource/cinzel/700.css'
import '@fontsource/cinzel/900.css'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import './styles/main.css'

export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior(_to, _from, savedPosition) {
      return savedPosition || { top: 0 }
    },
  },
  ({ app, router, isClient }) => {
    app.use(createPinia())
    if (isClient) {
      attachRouterHooks(router)
    }
  },
)
