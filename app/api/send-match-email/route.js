import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  const { type, user1, user2 } = await request.json()

  try {
    if (type === 'potential_match') {
      // Email both users about a potential match
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: user1.email,
        subject: '🚗 A potential test swap match has been found!',
        html: `
          <h2>Hi ${user1.full_name}!</h2>
          <p>Good news — someone wants to swap their driving test with you!</p>
          <h3>Their details:</h3>
          <p>📍 <strong>Test Centre:</strong> ${user2.current_test_centre}</p>
          <p>📅 <strong>Test Date:</strong> ${new Date(user2.current_test_date).toLocaleDateString('en-GB')}</p>
          <p>🕐 <strong>Test Time:</strong> ${user2.current_test_time}</p>
          <p>Visit <a href="${process.env.NEXT_PUBLIC_SITE_URL}/check-match">Swap My Test</a> to accept or decline this match.</p>
          <p>You'll only receive each other's contact details once both of you accept.</p>
        `
      })

      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: user2.email,
        subject: '🚗 A potential test swap match has been found!',
        html: `
          <h2>Hi ${user2.full_name}!</h2>
          <p>Good news — we found a potential swap match for your driving test!</p>
          <h3>Their details:</h3>
          <p>📍 <strong>Test Centre:</strong> ${user1.current_test_centre}</p>
          <p>📅 <strong>Test Date:</strong> ${new Date(user1.current_test_date).toLocaleDateString('en-GB')}</p>
          <p>🕐 <strong>Test Time:</strong> ${user1.current_test_time}</p>
          <p>Visit <a href="${process.env.NEXT_PUBLIC_SITE_URL}/check-match">Swap My Test</a> to accept or decline this match.</p>
          <p>You'll only receive each other's contact details once both of you accept.</p>
        `
      })
    }

    if (type === 'both_accepted') {
      // Email both users with full contact details
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: user1.email,
        subject: '🎉 Your swap has been confirmed — here are their details!',
        html: `
          <h2>Hi ${user1.full_name}!</h2>
          <p>Both you and your match have accepted the swap. Here are their contact details:</p>
          <h3>Your match:</h3>
          <p>👤 <strong>Name:</strong> ${user2.full_name}</p>
          <p>📞 <strong>Phone:</strong> ${user2.phone}</p>
          <p>📍 <strong>Test Centre:</strong> ${user2.current_test_centre}</p>
          <p>📅 <strong>Test Date:</strong> ${new Date(user2.current_test_date).toLocaleDateString('en-GB')}</p>
          <p>🕐 <strong>Test Time:</strong> ${user2.current_test_time}</p>
          <p>Good luck on your test! 🚗</p>
        `
      })

      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: user2.email,
        subject: '🎉 Your swap has been confirmed — here are their details!',
        html: `
          <h2>Hi ${user2.full_name}!</h2>
          <p>Both you and your match have accepted the swap. Here are their contact details:</p>
          <h3>Your match:</h3>
          <p>👤 <strong>Name:</strong> ${user1.full_name}</p>
          <p>📞 <strong>Phone:</strong> ${user1.phone}</p>
          <p>📍 <strong>Test Centre:</strong> ${user1.current_test_centre}</p>
          <p>📅 <strong>Test Date:</strong> ${new Date(user1.current_test_date).toLocaleDateString('en-GB')}</p>
          <p>🕐 <strong>Test Time:</strong> ${user1.current_test_time}</p>
          <p>Good luck on your test! 🚗</p>
        `
      })
    }

    if (type === 'declined') {
      // Email both users that the match was declined
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: user1.email,
        subject: '❌ A swap match was declined',
        html: `
          <h2>Hi ${user1.full_name}</h2>
          <p>Unfortunately your potential swap match was declined.</p>
          <p>Don't worry — we'll keep looking and notify you when another match is found!</p>
        `
      })

      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: user2.email,
        subject: '❌ A swap match was declined',
        html: `
          <h2>Hi ${user2.full_name}</h2>
          <p>Unfortunately your potential swap match was declined.</p>
          <p>Don't worry — we'll keep looking and notify you when another match is found!</p>
        `
      })
    }

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}