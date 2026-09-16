import type { RouteRecordRaw, Router } from 'vue-router'

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

  router.onError((error, to) => {
    if (
      typeof window !== 'undefined' &&
      (error.message.includes('Failed to fetch dynamically imported module') ||
        error.message.includes('Importing a module script failed'))
    ) {
      window.location.href = to.fullPath
    }
  })
}
