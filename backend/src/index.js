import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import OpenAI from 'openai'
import postgres from 'postgres'
import { Resend } from 'resend'

const app = new Hono()

// Initialize clients safely
const dbUrl = process.env.DATABASE_URL
const resendKey = process.env.RESEND_API_KEY
const openaiKey = process.env.OPENAI_API_KEY

let sql
if (dbUrl) {
  sql = postgres(dbUrl)
} else {
  console.warn('DATABASE_URL not set. Lead capture will not persist to DB.')
}

let resend
if (resendKey) {
  resend = new Resend(resendKey)
} else {
  console.warn('RESEND_API_KEY not set. Emails will not be sent.')
}

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
  features: {
    database: !!sql,
    email: !!resend,
    openai: !!openaiKey
  }
}))

// Helper to handle lead storage and notification
async function handleLead(leadData) {
  if (!leadData.email) return null

  try {
    // 1. Upsert lead to Postgres
    let lead = null
    if (sql) {
      // Ensure arrays are formatted for Postgres
      const interests = Array.isArray(leadData.interests) ? leadData.interests : [];
      
      const [result] = await sql`
        INSERT INTO leads (
          email, name, phone, company, interests, notes, source, updated_at
        ) VALUES (
          ${leadData.email},
          ${leadData.name || 'Unknown'},
          ${leadData.phone || null},
          ${leadData.company || null},
          ${interests},
          ${leadData.summary || null},
          'chatbot',
          NOW()
        )
        ON CONFLICT (email) DO UPDATE SET
          updated_at = NOW(),
          name = COALESCE(NULLIF(EXCLUDED.name, 'Unknown'), leads.name),
          phone = COALESCE(EXCLUDED.phone, leads.phone),
          company = COALESCE(EXCLUDED.company, leads.company),
          interests = (
            SELECT ARRAY(SELECT DISTINCT UNNEST(leads.interests || EXCLUDED.interests))
          ),
          notes = COALESCE(EXCLUDED.notes, leads.notes)
        RETURNING *
      `
      lead = result
    } else {
      console.log('Mock DB Save:', leadData)
      lead = leadData
    }

    // 2. Send email notification (debounced logic ideally, but sending on update for now)
    if (resend) {
      await resend.emails.send({
        from: 'Cloud Miami AI <noreply@cloudmiami.com>',
        to: ['manuel@cloudmiami.com'],
        subject: `Lead Update: ${leadData.email}`,
        html: `
          <h2>Lead Captured/Updated</h2>
          <p><strong>Name:</strong> ${leadData.name || 'N/A'}</p>
          <p><strong>Email:</strong> ${leadData.email}</p>
          <p><strong>Phone:</strong> ${leadData.phone || 'N/A'}</p>
          <p><strong>Company:</strong> ${leadData.company || 'N/A'}</p>
          <p><strong>Interests:</strong> ${leadData.interests?.join(', ') || 'N/A'}</p>
          <p><strong>Summary:</strong> ${leadData.summary || 'N/A'}</p>
          <br/>
          <a href="https://cx.cloudmiami.com/api/admin/leads">View in Dashboard</a>
        `
      })
    }

    return lead
  } catch (err) {
    console.error('Lead handling error:', err)
    return null
  }
}

// Background Extraction Function
async function extractAndSaveLead(messages) {
  if (!openaiKey) return;

  const openai = new OpenAI({ apiKey: openaiKey });
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        ...messages,
        { 
          role: 'system', 
          content: 'Analyze the conversation above. Extract the user\'s contact information (email, name, phone) and any project details/interests. Return JSON only.' 
        }
      ],
      tools: [{
        type: "function",
        function: {
          name: "save_lead_info",
          description: "Save extracted lead information",
          parameters: {
            type: "object",
            properties: {
              email: { type: "string" },
              name: { type: "string" },
              phone: { type: "string" },
              company: { type: "string" },
              interests: { type: "array", items: { type: "string" } },
              summary: { type: "string", description: "Summary of user needs" }
            },
            required: ["email"]
          }
        }
      }],
      tool_choice: { type: "function", function: { name: "save_lead_info" } }
    });

    const toolCall = response.choices[0]?.message?.tool_calls?.[0];
    if (toolCall) {
      const args = JSON.parse(toolCall.function.arguments);
      console.log('Extracted Lead Info:', args);
      await handleLead(args);
    }
  } catch (e) {
    console.error('Extraction error:', e);
  }
}

app.post('/api/chat/stream', async (c) => {
  const body = await c.req.json()
  const { message, leadEmail, history = [] } = body

  if (!message) {
    return c.json({ error: 'Message is required' }, 400)
  }

  // 1. Check frontend-detected email as fallback/fast-path
  if (leadEmail) {
    // We don't save immediately, we let the extractor do a better job with context
    // But we pass it to context if needed
  }

  const openai = new OpenAI({
    apiKey: openaiKey || '',
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
        let fullResponse = "";
        
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
            fullResponse += content;
            controller.enqueue(encoder.encode(content))
          }
        }
        controller.close()

        // 2. Trigger background extraction after response is complete
        // We send the full history + new user message + new AI response
        const fullHistory = [
          ...messages,
          { role: 'assistant', content: fullResponse }
        ];
        
        // Fire and forget (don't await)
        extractAndSaveLead(fullHistory);
      },
    })

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (error) {
    console.error('OpenAI error:', error)
    return c.json({ 
      error: 'Failed to generate response',
      details: error.message || String(error)
    }, 500)
  }
})

app.get('/api/admin/leads', async (c) => {
  if (!sql) return c.json({ error: 'Database not connected' }, 503)
    
  try {
    const leads = await sql`
      SELECT * FROM leads ORDER BY updated_at DESC LIMIT 50
    `
    return c.json({ leads })
  } catch (error) {
    return c.json({ error: error.message }, 500)
  }
})

const PORT = process.env.PORT || 3000

console.log(`Server running on port ${PORT}`)

serve({
  fetch: app.fetch,
  port: PORT,
})
