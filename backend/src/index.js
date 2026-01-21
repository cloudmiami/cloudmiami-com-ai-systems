import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import OpenAI from 'openai'

const app = new Hono()

const SYSTEM_PROMPT = `You are the Cloud Miami AI assistant - a helpful, professional concierge for a digital agency.

## About Cloud Miami
Cloud Miami is a digital agency specializing in:
- **Web Architecture**: Modern websites and web applications built with React, Next.js, and cutting-edge technologies
- **SEO/GEO**: Search engine optimization and geographic SEO to help clients rank higher
- **Video Production**: Professional videos for marketing, social media, and brand storytelling

## Your Personality
- Be friendly, professional, and helpful
- Listen to the client's needs and ask clarifying questions
- Focus on understanding their business goals
- Don't overwhelm with technical jargon - explain in plain language
- Guide visitors toward scheduling a discovery call

## Conversation Flow
1. Understand what they need help with
2. Briefly explain relevant services
3. Ask if they'd like to schedule a discovery call
4. If yes, direct them to book at https://mt.cloudmiami.com

Keep responses concise and conversational. Never mention prices unless asked directly.`

app.use('/*', cors({
  origin: ['https://cloudmiami.com', 'http://localhost:5173'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.get('/', (c) => c.json({ 
  service: 'Cloud Miami API',
  version: '1.0.0',
  status: 'running',
}))

app.post('/api/chat/stream', async (c) => {
  const body = await c.req.json()
  const { message, history = [] } = body

  if (!message) {
    return c.json({ error: 'Message is required' }, 400)
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
  })

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((m: any) => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ]

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages as any,
      stream: true,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
            controller.enqueue(encoder.encode(content))
          }
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (error) {
    console.error('OpenAI error:', error)
    return c.json({ error: 'Failed to generate response' }, 500)
  }
})

app.post('/api/chat/complete', async (c) => {
  const body = await c.req.json()
  const { message } = body

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
  })

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message },
      ],
    })

    return c.json({ 
      response: completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.' 
    })
  } catch (error) {
    return c.json({ error: 'Failed to generate response' }, 500)
  }
})

app.post('/api/chat/lead', async (c) => {
  const body = await c.req.json()
  const { name, email } = body

  if (!name || !email) {
    return c.json({ error: 'Name and email are required' }, 400)
  }

  console.log('New lead:', { name, email })

  return c.json({ success: true, lead: { name, email } })
})

app.post('/api/chat/search', async (c) => {
  return c.json({ results: [] })
})

const PORT = process.env.PORT || 3000

console.log(`Server running on port ${PORT}`)

serve({
  fetch: app.fetch,
  port: PORT,
})
