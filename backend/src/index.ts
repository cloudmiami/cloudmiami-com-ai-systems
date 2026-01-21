import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { chatRoutes } from './routes/chat'
import { leadRoutes } from './routes/leads'
import { calendarRoutes } from './routes/calendar'
import { knowledgeRoutes } from './routes/knowledge'

const app = new Hono()

app.use('/*', cors({
  origin: ['https://cloudmiami.com', 'http://localhost:5173'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.get('/', (c) => c.json({ 
  service: 'Cloud Miami API',
  version: '1.0.0',
  status: 'running',
  endpoints: {
    chat: '/api/chat',
    leads: '/api/leads',
    calendar: '/api/calendar',
    knowledge: '/api/knowledge'
  }
}))

app.route('/api/chat', chatRoutes)
app.route('/api/leads', leadRoutes)
app.route('/api/calendar', calendarRoutes)
app.route('/api/knowledge', knowledgeRoutes)

const PORT = process.env.PORT || 3000

console.log(`Server running on port ${PORT}`)

export default {
  port: PORT,
  fetch: app.fetch,
}
