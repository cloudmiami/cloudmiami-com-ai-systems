import { Hono } from 'hono'
import { createLead, getLeadByEmail, getLeads, updateLead, createMeeting, getMeetings, sendLeadNotification } from '../db/supabase'

export const leadRoutes = new Hono()

leadRoutes.get('/', async (c) => {
  const { data, error } = await getLeads()
  if (error) {
    return c.json({ error: 'Failed to fetch leads' }, 500)
  }
  return c.json({ leads: data })
})

leadRoutes.get('/:email', async (c) => {
  const email = c.req.param('email')
  const { data, error } = await getLeadByEmail(email)
  if (error) {
    return c.json({ error: 'Failed to fetch lead' }, 500)
  }
  if (!data) {
    return c.json({ error: 'Lead not found' }, 404)
  }
  return c.json({ lead: data })
})

leadRoutes.post('/', async (c) => {
  const body = await c.req.json()
  const { name, email, phone, company, website, interests, source } = body

  if (!name || !email) {
    return c.json({ error: 'Name and email are required' }, 400)
  }

  const { data: existingLead } = await getLeadByEmail(email)

  let lead

  if (existingLead) {
    const { data: updatedLead, error } = await updateLead(existingLead.id, {
      name, phone, company, website, interests,
    })
    if (error) {
      return c.json({ error: 'Failed to update lead' }, 500)
    }
    lead = updatedLead
  } else {
    const { data: newLead, error } = await createLead({
      name, email, phone, company, website, interests,
      source: source || 'direct',
    })
    if (error) {
      return c.json({ error: 'Failed to create lead' }, 500)
    }
    lead = newLead
    await sendLeadNotification({ name, email, phone, company, interests })
  }

  return c.json({ success: true, lead })
})

leadRoutes.put('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const { data, error } = await updateLead(id, body)
  if (error) {
    return c.json({ error: 'Failed to update lead' }, 500)
  }
  return c.json({ success: true, lead: data })
})

leadRoutes.get('/:email/meetings', async (c) => {
  const email = c.req.param('email')
  const { data: lead } = await getLeadByEmail(email)
  if (!lead) {
    return c.json({ error: 'Lead not found' }, 404)
  }
  const { data: meetings, error } = await getMeetings(lead.id)
  if (error) {
    return c.json({ error: 'Failed to fetch meetings' }, 500)
  }
  return c.json({ meetings })
})

leadRoutes.post('/:email/meetings', async (c) => {
  const email = c.req.param('email')
  const body = await c.req.json()
  const { cal_com_event_id, scheduled_at, meeting_url, notes } = body

  const { data: lead } = await getLeadByEmail(email)
  if (!lead) {
    return c.json({ error: 'Lead not found' }, 404)
  }

  const { data: meeting, error } = await createMeeting({
    lead_id: lead.id,
    cal_com_event_id,
    scheduled_at,
    meeting_url,
    notes,
    status: 'pending',
  })

  if (error) {
    return c.json({ error: 'Failed to create meeting' }, 500)
  }

  return c.json({ success: true, meeting })
})
