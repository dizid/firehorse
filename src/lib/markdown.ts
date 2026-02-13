import { marked } from 'marked'

// Configure marked for safe rendering
marked.setOptions({
  breaks: true,
  gfm: true,
})

export function renderMarkdown(content: string): string {
  return marked.parse(content) as string
}
