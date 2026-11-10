import type { RouteRecordRaw, Router } from 'vue-router'
import { reloadOnStaleChunks } from '@/lib/stale-chunk-reload'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/encyclopedia',
    name: 'encyclopedia',
    component: () => import('@/pages/EncyclopediaPage.vue'),
  },
  {
    path: '/encyclopedia/:slug',
    name: 'encyclopedia-article',
    component: () => import('@/pages/EncyclopediaArticlePage.vue'),
  },
  {
    path: '/compatibility',
    name: 'compatibility',
    component: () => import('@/pages/CompatibilityPage.vue'),
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/pages/BlogPage.vue'),
  },
  {
    path: '/blog/:slug',
    name: 'blog-post',
    component: () => import('@/pages/BlogPostPage.vue'),
  },
]

if (import.meta.env.DEV) {
  routes.push({
    path: '/preview',
    name: 'preview',
    component: () => import('@/pages/PreviewPage.vue'),
  })
}

routes.push({
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: () => import('@/pages/NotFoundPage.vue'),
})

export function attachRouterHooks(router: Router) {
  router.afterEach((to) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: to.fullPath,
        page_title: document.title,
      })
    }
  })

  // Tabs still open from before a deploy: reload the target page once (Chrome, Safari and
  // Firefox error texts), with a 10 s guard so a truly missing file can't loop forever.
  // attachRouterHooks only runs in the browser (main.ts, isClient).
  reloadOnStaleChunks(router)
}
