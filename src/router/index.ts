import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0 }
  },
  routes: [
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
      path: '/forum',
      name: 'forum',
      component: () => import('@/pages/ForumPage.vue'),
    },
    {
      path: '/forum/:categorySlug',
      name: 'forum-category',
      component: () => import('@/pages/ForumCategoryPage.vue'),
    },
    {
      path: '/forum/thread/:id',
      name: 'forum-thread',
      component: () => import('@/pages/ForumThreadPage.vue'),
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
    {
      path: '/sign-in',
      name: 'sign-in',
      component: () => import('@/pages/SignInPage.vue'),
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () => import('@/pages/SignUpPage.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/pages/ProfilePage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
    },
  ],
})

// Handle stale chunk errors after new deploys (old HTML references old chunk filenames)
router.onError((error, to) => {
  if (
    error.message.includes('Failed to fetch dynamically imported module') ||
    error.message.includes('Importing a module script failed')
  ) {
    window.location.href = to.fullPath
  }
})

export default router
