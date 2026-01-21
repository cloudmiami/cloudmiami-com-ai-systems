import OpenAI from 'openai'

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' })

export async function createEmbedding(text: string) {
  const response = await openai.embeddings.create({ model: 'text-embedding-3-small', input: text })
  return response.data[0].embedding
}

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

export async function generateStreamingChatCompletion(messages: ChatMessage[]) {
  return await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: messages as any,
    stream: true,
    temperature: 0.7,
    max_tokens: 2000,
  })
}
