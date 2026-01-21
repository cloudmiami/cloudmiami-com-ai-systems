import { Hono } from 'hono'
import { supabase } from '../db/supabase'

export const knowledgeRoutes = new Hono()

knowledgeRoutes.get('/', async (c) => {
  return c.json({ items: [], message: 'Knowledge base API' })
})

knowledgeRoutes.post('/search', async (c) => {
  return c.json({ results: [], message: 'RAG search coming soon' })
})

knowledgeRoutes.post('/ingest', async (c) => {
  return c.json({ results: [], message: 'Knowledge ingestion coming soon' })
})

knowledgeRoutes.post('/', async (c) => {
  return c.json({ success: true, message: 'Item creation coming soon' })
})
