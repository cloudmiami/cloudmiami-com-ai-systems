export async function sendMeetingConfirmation(_meeting: { lead_email: string; lead_name: string; scheduled_at: string; meeting_url: string }) {
  console.log('Meeting confirmation email (placeholder):', _meeting)
  return { success: true }
}
