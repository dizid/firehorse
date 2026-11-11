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

// Hydrate (reuse the prerendered HTML) instead of vite-ssg's default of throwing it away
// and rendering every page a second time once the JavaScript loads. Only when the HTML
// was prerendered for this exact path (vite.config.ts stamps data-ssg-route).
// The blog hydrates too: its pages re-fetch their posts from /api/blog/posts in the
// browser, and <Suspense> keeps the prerendered HTML on screen until that resolves,
// so the page no longer empties and refills (it was a 0.42 layout shift on phones).
// Dates there are formatted in UTC so server and browser render the same text.
function shouldHydrate(): boolean {
  if (typeof document === 'undefined') return false
  const renderedFor = document.getElementById('app')?.dataset.ssgRoute
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  return renderedFor === path
}

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
  { hydration: shouldHydrate() },
)
