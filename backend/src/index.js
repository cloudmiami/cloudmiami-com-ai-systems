import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import OpenAI from 'openai'
import postgres from 'postgres'
import nodemailer from 'nodemailer'

const app = new Hono()

// Initialize clients safely
const dbUrl = process.env.DATABASE_URL
const openaiKey = process.env.OPENAI_API_KEY

let sql
if (dbUrl) {
  sql = postgres(dbUrl)
} else {
  console.warn('DATABASE_URL not set. Lead capture will not persist to DB.')
}

// Initialize SMTP Transporter
const smtpConfig = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
}

let transporter
if (smtpConfig.host && smtpConfig.auth.user) {
  transporter = nodemailer.createTransport(smtpConfig)
  console.log('SMTP Transporter initialized')
} else {
  console.warn('SMTP settings not set. Emails will not be sent.')
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

## Conversation Flow & Strategy
1. **Understand Needs:** Ask about their business and what they are looking to achieve (Web, SEO, Video?).
2. **Qualify & Gather Info:**
   - If they ask about services, ask "What kind of project do you have in mind?" or "What industry are you in?"
   - **Crucial:** Try to get their **First Name** early ("By the way, who am I chatting with?") or when asking for email.
3. **Capture Contact:**
   - Once you understand their interest, suggest: "I can have a specialist look into this for you. What's the best email to reach you at?"
   - If they give email but no name, ask: "Thanks! And who should we address the email to?"
4. **Summary:**
   - Confirm you have their details and will pass them to the team.

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
    email: !!transporter,
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

    // 2. Send email notification
    if (transporter) {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"Cloud Miami AI" <noreply@cloudmiami.com>',
        to: process.env.EMAIL_TO || 'manuel@cloudmiami.com',
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
      console.log('Email sent:', info.messageId)
    } else {
      console.log('Mock Email Log:', `Lead Update: ${leadData.email}`)
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

        // Trigger background extraction
        const fullHistory = [
          ...messages,
          { role: 'assistant', content: fullResponse }
        ];
        
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

app.post('/api/leads', async (c) => {
  const body = await c.req.json()
  const result = await handleLead(body)
  
  if (result) {
    return c.json({ success: true, lead: result })
  } else {
    return c.json({ success: false, error: 'Failed to save lead' }, 500)
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
