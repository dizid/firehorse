/**
 * Type declarations for Google Analytics 4 (gtag.js)
 * Enables TypeScript support for window.gtag and dataLayer
 */
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export {}
