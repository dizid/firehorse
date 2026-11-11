// Blog posts that live in code instead of the blog_posts table, so publishing a
// post needs no database change. Plain .mjs (types in blog-posts.d.mts) because
// four places read it: the blog API function, the blog pages' prerender path,
// vite.config.ts (routes to prerender) and scripts/generate-sitemap.mjs, which
// runs in plain Node before the Vite build.
//
// Each post is one file in ./posts/. Content is HTML using only the tags the
// blog's prose styles cover: p, h2, h3, strong, em, a, blockquote.
import hinoeuma2026Births from './posts/hinoeuma-2026-japan-births.mjs'
import born1966TurnSixty from './posts/born-1966-turn-60-fire-horse-year.mjs'
import yaoyaOshichi from './posts/yaoya-oshichi-fire-horse-curse-origin.mjs'
import koreaWhiteHorse from './posts/korea-white-horse-1990-girls.mjs'
import fireHorseWomen1906 from './posts/fire-horse-women-of-1906.mjs'
import fireHorseYearDates from './posts/fire-horse-year-dates-2026-2027.mjs'
import redHorseRedSheep from './posts/red-horse-red-sheep-china-fire-horse-warning.mjs'

/** @type {import('./blog-posts.d.mts').CodeBlogPost[]} */
export const CODE_BLOG_POSTS = [
  hinoeuma2026Births,
  born1966TurnSixty,
  yaoyaOshichi,
  koreaWhiteHorse,
  fireHorseWomen1906,
  fireHorseYearDates,
  redHorseRedSheep,
]

/**
 * The code post with this slug, or null.
 * @param {string} slug
 */
export function getCodeBlogPost(slug) {
  return CODE_BLOG_POSTS.find((post) => post.slug === slug) ?? null
}

/** Code posts without their full text, for blog lists. */
export function codeBlogPostSummaries() {
  return CODE_BLOG_POSTS.map(({ content: _content, ...summary }) => summary)
}

/**
 * Database posts and code posts in one list, newest first. A code post wins
 * when both have the same slug.
 * @template {{ slug: string, publishedAt: string | Date }} A
 * @template {{ slug: string, publishedAt: string | Date }} B
 * @param {A[]} databasePosts
 * @param {B[]} codePosts
 * @returns {(A | B)[]}
 */
export function mergeBlogPosts(databasePosts, codePosts) {
  const codeSlugs = new Set(codePosts.map((post) => post.slug))
  return [...databasePosts.filter((post) => !codeSlugs.has(post.slug)), ...codePosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}
