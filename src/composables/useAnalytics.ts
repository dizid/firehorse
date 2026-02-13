/**
 * Analytics tracking composable for GA4 events
 * Tracks key user interactions across the Fire Horse site
 */
export function useAnalytics() {
  function trackEvent(eventName: string, params?: Record<string, any>) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, params)
    }
  }

  return {
    // Compatibility tool completion
    trackCompatibilityComplete: (animal: string, element: string, score: number) =>
      trackEvent('compatibility_check_complete', { animal, element, score }),

    // Forum engagement
    trackForumSignupClick: () =>
      trackEvent('forum_signup_click'),

    // Content engagement
    trackBlogRead: (slug: string, title: string) =>
      trackEvent('blog_read', { slug, title }),

    // Encyclopedia engagement
    trackEncyclopediaView: (slug: string, category: string) =>
      trackEvent('encyclopedia_article_view', { slug, category }),

    // Lead capture
    trackNewsletterSignup: () =>
      trackEvent('newsletter_signup'),

    // Share actions
    trackShareResult: (method: 'twitter' | 'copy', score: number) =>
      trackEvent('share_result', { method, score }),

    // Generic event tracker
    trackEvent,
  }
}
