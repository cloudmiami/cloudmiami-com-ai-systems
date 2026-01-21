import { Hono } from 'hono'
import { getMeetings, createMeeting } from '../db/supabase'

export const calendarRoutes = new Hono()

calendarRoutes.get('/', async (c) => {
  const { data, error } = await getMeetings()
  if (error) {
    return c.json({ error: 'Failed to fetch meetings' }, 500)
  }
  return c.json({ meetings: data })
})

calendarRoutes.post('/webhook', async (c) => {
  const body = await c.req.json()
  const { event, payload } = body

  if (event !== 'INVITEE_CREATED') {
    return c.json({ received: true })
  }

  const { email, name, scheduled_event, location } = payload

  const { data: meeting, error } = await createMeeting({
    cal_com_event_id: scheduled_event?.uid,
    scheduled_at: scheduled_event?.start_time,
    meeting_url: location || scheduled_event?.location,
    status: 'confirmed',
    notes: `Cal.com booking: ${name} (${email})`,
  })

  if (error) {
    console.error('Failed to create meeting:', error)
    return c.json({ error: 'Failed to create meeting' }, 500)
  }

  return c.json({ success: true, meeting })
})

calendarRoutes.post('/availability', async (c) => {
  return c.json({
    available_slots: [
      { date: '2024-01-22', times: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
      { date: '2024-01-23', times: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
    ],
  })
})

calendarRoutes.post('/book', async (c) => {
  const body = await c.req.json()
  const { email, name, start_time } = body

  if (!email || !name || !start_time) {
    return c.json({ error: 'Email, name, and start_time are required' }, 400)
  }

  return c.json({
    success: true,
    booking: {
      id: 'mock-booking-id',
      start_time,
      end_time: new Date(new Date(start_time).getTime() + 30 * 60000).toISOString(),
      status: 'accepted',
    },
  })
})
