import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import App from './App.vue'
import { routes, attachRouterHooks } from './router'
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
