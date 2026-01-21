import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const app = new Hono()

// Initialize clients
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
)

const resend = new Resend(process.env.RESEND_API_KEY)

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
- **Goal:** Naturally guide the conversation to understand their project and gather their contact information (email/name) so our team can follow up.

## Conversation Flow
1. Understand what they need help with (Web, SEO, or Video).
2. Briefly explain how we can help.
3. Ask relevant questions to qualify the lead (e.g., "Tell me more about your project", "Do you have an existing website?").
4. If they seem interested, politely ask for their email to send them more information or to have a specialist contact them.
5. If they provide contact info, confirm you've received it and let them know we'll be in touch shortly.

Keep responses concise and conversational. Never mention specific prices unless asked directly (give ranges instead).`

app.use('/*', cors({
  origin: ['https://cloudmiami.com', 'http://localhost:5173', 'http://localhost:5174'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.get('/', (c) => c.json({ 
  service: 'Cloud Miami API',
  version: '1.0.0',
  status: 'running',
}))

// Helper to handle lead storage and notification
async function handleLead(leadData) {
  if (!leadData.email) return null

  try {
    // 1. Upsert lead to Supabase
    const { data, error } = await supabase
      .from('leads')
      .upsert({
        email: leadData.email,
        name: leadData.name || 'Unknown',
        phone: leadData.phone,
        company: leadData.company,
        interests: leadData.interests || [],
        source: 'chatbot',
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return null
    }

    // 2. Send email notification (only if new or significantly updated)
    // For simplicity, we send on every capture for now, or you could add logic to check last_contacted
    await resend.emails.send({
      from: 'Cloud Miami AI <noreply@cloudmiami.com>',
      to: ['manuel@cloudmiami.com'], // Replace with your email
      subject: `New Lead Detected: ${leadData.email}`,
      html: `
        <h2>New Lead Captured by AI</h2>
        <p><strong>Email:</strong> ${leadData.email}</p>
        <p><strong>Phone:</strong> ${leadData.phone || 'N/A'}</p>
        <p><strong>Company:</strong> ${leadData.company || 'N/A'}</p>
        <p><strong>Interests:</strong> ${leadData.interests?.join(', ') || 'N/A'}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <br/>
        <a href="https://cx.cloudmiami.com/admin/leads">View in Dashboard</a>
      `
    })

    return data
  } catch (err) {
    console.error('Lead handling error:', err)
    return null
  }
}

app.post('/api/chat/stream', async (c) => {
  const body = await c.req.json()
  const { message, leadEmail, leadPhone, leadCompany, leadInterests, history = [] } = body

  if (!message) {
    return c.json({ error: 'Message is required' }, 400)
  }

  // Check if frontend detected lead info and process it
  if (leadEmail) {
    await handleLead({
      email: leadEmail,
      phone: leadPhone,
      company: leadCompany,
      interests: leadInterests
    })
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
  })

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ]

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
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

app.post('/api/leads', async (c) => {
  const body = await c.req.json()
  const result = await handleLead(body)
  
  if (result) {
    return c.json({ success: true, lead: result })
  } else {
    return c.json({ success: false, error: 'Failed to save lead' }, 500)
  }
})

// Simple Admin Dashboard Endpoint (JSON for now)
app.get('/api/admin/leads', async (c) => {
  // Basic auth check could be added here
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return c.json({ error: error.message }, 500)
  }

  return c.json({ leads: data })
})

const PORT = process.env.PORT || 3000

console.log(`Server running on port ${PORT}`)

serve({
  fetch: app.fetch,
  port: PORT,
})
