// Types for blog-posts.mjs (see that file for why it is plain JavaScript).
import type { BlogPost } from '../types'

/** A post kept in code: same shape as a database post, id is "code-<slug>". */
export type CodeBlogPost = BlogPost

export declare const CODE_BLOG_POSTS: CodeBlogPost[]

export declare function getCodeBlogPost(slug: string): CodeBlogPost | null

export declare function codeBlogPostSummaries(): Omit<CodeBlogPost, 'content'>[]

type Dated = { slug: string; publishedAt: string | Date }

export declare function mergeBlogPosts<A extends Dated, B extends Dated>(
  databasePosts: A[],
  codePosts: B[],
): (A | B)[]
