import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:8000'
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export async function getLeads() {
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
  return { data, error }
}

export async function getLeadByEmail(email: string) {
  const { data, error } = await supabase.from('leads').select('*').eq('email', email).single()
  return { data, error }
}

export async function createLead(lead: { name: string; email: string; phone?: string; company?: string; website?: string; interests?: string[]; source?: string }) {
  const { data, error } = await supabase.from('leads').insert(lead).select().single()
  return { data, error }
}

export async function updateLead(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase.from('leads').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  return { data, error }
}

export async function getConversations(leadId?: string) {
  let query = supabase.from('conversations').select('*').order('created_at', { ascending: true })
  if (leadId) query = query.eq('lead_id', leadId)
  const { data, error } = await query
  return { data, error }
}

export async function createConversation(conversation: { lead_id?: string; messages: Array<{ role: string; content: string; timestamp?: string }>; metadata?: Record<string, unknown> }) {
  const { data, error } = await supabase.from('conversations').insert(conversation).select().single()
  return { data, error }
}

export async function updateConversation(id: string, messages: Array<{ role: string; content: string; timestamp?: string }>) {
  const { data, error } = await supabase.from('conversations').update({ messages, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  return { data, error }
}

export async function getMeetings(leadId?: string) {
  let query = supabase.from('meetings').select('*').order('scheduled_at', { ascending: true })
  if (leadId) query = query.eq('lead_id', leadId)
  const { data, error } = await query
  return { data, error }
}

export async function createMeeting(meeting: { lead_id?: string; cal_com_event_id?: string; scheduled_at?: string; status?: string; meeting_url?: string; notes?: string }) {
  const { data, error } = await supabase.from('meetings').insert(meeting).select().single()
  return { data, error }
}

export async function sendLeadNotification(_lead: { name: string; email: string; phone?: string; company?: string; interests?: string[] }) {
  console.log('Lead notification:', _lead)
  return { success: true }
}
