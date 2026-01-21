import { createEmbedding } from './openai.js'

const KNOWLEDGE_BASE_DIR = './src/content'

export interface KnowledgeItem {
  title: string
  content: string
  category: string
  metadata?: Record<string, unknown>
}

export async function loadKnowledgeBase(): Promise<KnowledgeItem[]> {
  const { glob } = await import('glob')
  const { readFile } = await import('fs/promises')
  
  const files = await glob(`${KNOWLEDGE_BASE_DIR}/*.md`)
  const knowledgeItems: KnowledgeItem[] = []

  for (const file of files) {
    const content = await readFile(file, 'utf-8')
    const title = extractTitle(content)
    const category = extractCategory(file)
    
    knowledgeItems.push({
      title,
      content: cleanContent(content),
      category,
    })
  }

  return knowledgeItems
}

function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : 'Untitled'
}

function extractCategory(filePath: string): string {
  const basename = filePath.split('/').pop()?.replace('.md', '') || 'general'
  return basename
}

function cleanContent(content: string): string {
  return content
    .replace(/^#\s+.+$/m, '')
    .replace(/^#+\s+.+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function buildSystemPrompt(knowledgeItems: KnowledgeItem[]): string {
  const knowledgeContext = knowledgeItems
    .map(item => `
## ${item.title} (${item.category})
${item.content}
`)
    .join('\n---\n')

  return `You are the AI assistant for Cloud Miami, an AI-Native B2B agency.

## About Cloud Miami
Cloud Miami helps B2B businesses scale using modern technology and AI. We offer:
- Web Architecture: Modern websites and web applications
- SEO/GEO: Search optimization with AI-driven content strategies
- Video Production: Professional video content for marketing

## Your Role
- Be helpful, professional, and friendly
- Answer questions about Cloud Miami's services, process, pricing, and company
- Help visitors understand how we can help their business
- Qualify leads and schedule discovery calls when appropriate
- NEVER make up information - if you don't know something, say so

## Response Guidelines
- Keep responses concise and helpful
- Use the knowledge base to answer questions accurately
- When discussing services, focus on benefits and outcomes
- If someone wants to get started, offer to schedule a discovery call
- Ask clarifying questions when you need more information

## Knowledge Base
${knowledgeContext}

## Important Notes
- If asked about specific pricing, encourage a discovery call for a custom quote
- If asked about timeline, give general ranges but encourage a discovery call
- If asked about technical details you're unsure of, acknowledge and offer to connect with a team member

Remember: You are helping the visitor, not selling. Focus on understanding their needs and providing value.`
}
