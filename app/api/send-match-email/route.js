import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  const { user1, user2 } = await request.json()

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user1.email,
      subject: '🎉 You have a driving test swap match!',
      html: `
        <h2>Great news ${user1.full_name}!</h2>
        <p>We found you a match for your driving test swap!</p>
        <p><strong>Your match:</strong> ${user2.full_name}</p>
        <p><strong>Their email:</strong> ${user2.email}</p>
        <p><strong>Their current test centre:</strong> ${user2.current_test_centre}</p>
        <p>Contact them to arrange your swap. Good luck on your test! 🚗</p>
      `
    })

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user2.email,
      subject: '🎉 You have a driving test swap match!',
      html: `
        <h2>Great news ${user2.full_name}!</h2>
        <p>We found you a match for your driving test swap!</p>
        <p><strong>Your match:</strong> ${user1.full_name}</p>
        <p><strong>Their email:</strong> ${user1.email}</p>
        <p><strong>Their current test centre:</strong> ${user1.current_test_centre}</p>
        <p>Contact them to arrange your swap. Good luck on your test! 🚗</p>
      `
    })

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}