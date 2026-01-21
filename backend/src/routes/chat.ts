import { Hono } from 'hono'
import { openai } from '../services/openai'
import { createLead, getLeadByEmail, createConversation, updateConversation, getConversations } from '../db/supabase'

export const chatRoutes = new Hono()

const SYSTEM_PROMPT = `You are the AI assistant for Cloud Miami.

## Services
1. Web Architecture - Modern websites and web apps
2. SEO/GEO - Search optimization
3. Video Production - Professional videos

Be helpful and professional.`

chatRoutes.post('/stream', async (c) => {
  const body = await c.req.json()
  const { message, leadEmail, history = [] } = body

  if (!message) {
    return c.json({ error: 'Message is required' }, 400)
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((m: { role: string; content: string }) => ({
      role: m.role as 'system' | 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: message },
  ]

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 2000,
    })

    const assistantMessage = completion.choices[0]?.message?.content || ''

    let leadId: string | undefined

    if (leadEmail) {
      const { data: existingLead } = await getLeadByEmail(leadEmail)
      if (existingLead) {
        leadId = existingLead.id
      }
    }

    const { data: conversations } = await getConversations(leadId)
    const conversation = conversations?.[0]

    if (conversation) {
      const updatedMessages = [
        ...conversation.messages,
        { role: 'user', content: message, timestamp: new Date().toISOString() },
        { role: 'assistant', content: assistantMessage, timestamp: new Date().toISOString() },
      ]
      await updateConversation(conversation.id, updatedMessages)
    } else if (leadId || leadEmail) {
      let finalLeadId = leadId

      if (!finalLeadId && leadEmail) {
        const { data: newLead } = await createLead({
          name: 'Chat Visitor',
          email: leadEmail,
          source: 'chatbot',
        })
        finalLeadId = newLead?.id
      }

      if (finalLeadId) {
        await createConversation({
          lead_id: finalLeadId,
          messages: [
            { role: 'user', content: message, timestamp: new Date().toISOString() },
            { role: 'assistant', content: assistantMessage, timestamp: new Date().toISOString() },
          ],
        })
      }
    }

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(assistantMessage))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (error) {
    console.error('Chat error:', error)
    return c.json({ error: 'Failed to generate response' }, 500)
  }
})

chatRoutes.post('/complete', async (c) => {
  const body = await c.req.json()
  const { message, history = [] } = body

  if (!message) {
    return c.json({ error: 'Message is required' }, 400)
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((m: { role: string; content: string }) => ({
      role: m.role as 'system' | 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: message },
  ]

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 2000,
    })
    return c.json({ response: completion.choices[0]?.message?.content || '' })
  } catch (error) {
    console.error('Chat error:', error)
    return c.json({ error: 'Failed to generate response' }, 500)
  }
})

chatRoutes.post('/lead', async (c) => {
  const body = await c.req.json()
  const { name, email, phone, company, website, interests } = body

  if (!name || !email) {
    return c.json({ error: 'Name and email are required' }, 400)
  }

  const { data: existingLead } = await getLeadByEmail(email)

  if (existingLead) {
    return c.json({ success: true, lead: existingLead, updated: false })
  }

  const { data: newLead, error } = await createLead({
    name,
    email,
    phone,
    company,
    website,
    interests,
    source: 'chatbot',
  })

  if (error) {
    return c.json({ error: 'Failed to create lead' }, 500)
  }

  return c.json({ success: true, lead: newLead })
})

chatRoutes.post('/search', async (c) => {
  return c.json({ results: [] })
})
