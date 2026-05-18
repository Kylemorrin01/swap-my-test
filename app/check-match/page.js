'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

const pageStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
  fontFamily: "'Georgia', serif",
  padding: '40px 20px',
}

const cardStyle = {
  maxWidth: '520px',
  margin: '0 auto',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '24px',
  padding: '40px',
  backdropFilter: 'blur(10px)',
}

const inputStyle = {
  padding: '13px 16px',
  fontSize: '0.95rem',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '12px',
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: "'Georgia', serif",
  background: 'rgba(255,255,255,0.06)',
  color: '#f1f5f9',
  outline: 'none',
}

const labelStyle = {
  color: '#94a3b8',
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: '6px',
  display: 'block'
}

export default function CheckMatch() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [profile, setProfile] = useState(null)
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(false)

  const getInitials = (name) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase()

  const handleCheck = async () => {
    setLoading(true)
    setStatus('')
    setProfile(null)
    setMatch(null)

    const { data: profileData } = await supabase
      .from('profiles')
      .select()
      .eq('email', email)
      .single()

    if (!profileData) {
      setStatus('❌ No registration found with that email address.')
      setLoading(false)
      return
    }

    setProfile(profileData)

    if (profileData.matched_with) {
      const { data: matchData } = await supabase
        .from('profiles')
        .select()
        .eq('id', profileData.matched_with)
        .single()
      setMatch(matchData)
    }

    setLoading(false)
  }

  const handleAccept = async () => {
    // Figure out if this user is user1 or user2
    const isUser1 = profile.matched_with && match && profile.id < match.id

    if (isUser1) {
      await supabase.from('profiles').update({ user1_accepted: true }).eq('id', profile.id)
    } else {
      await supabase.from('profiles').update({ user2_accepted: true }).eq('id', profile.id)
    }

    // Check if both have accepted
    const { data: updatedProfile } = await supabase.from('profiles').select().eq('id', profile.id).single()
    const { data: updatedMatch } = await supabase.from('profiles').select().eq('id', match.id).single()

    const bothAccepted = updatedProfile.user1_accepted && updatedMatch.user1_accepted ||
      updatedProfile.user2_accepted && updatedMatch.user2_accepted ||
      (updatedProfile.user1_accepted || updatedProfile.user2_accepted) &&
      (updatedMatch.user1_accepted || updatedMatch.user2_accepted)

    if (bothAccepted) {
      await supabase.from('profiles').update({ match_status: 'matched' }).eq('id', profile.id)
      await supabase.from('profiles').update({ match_status: 'matched' }).eq('id', match.id)

      await fetch('/api/send-match-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'both_accepted',
          user1: { full_name: profile.full_name, email: profile.email, phone: profile.phone, current_test_centre: profile.current_test_centre, current_test_date: profile.current_test_date, current_test_time: profile.current_test_time },
          user2: { full_name: match.full_name, email: match.email, phone: match.phone, current_test_centre: match.current_test_centre, current_test_date: match.current_test_date, current_test_time: match.current_test_time }
        })
      })

      setStatus('🎉 Both accepted! Check your email for full contact details.')
    } else {
      setStatus('✅ You\'ve accepted! We\'re waiting for the other person to accept too.')
    }
  }

  const handleDecline = async () => {
    await supabase.from('profiles').update({
      match_status: 'unmatched',
      matched_with: null,
      user1_accepted: false,
      user2_accepted: false
    }).eq('id', profile.id)

    await supabase.from('profiles').update({
      match_status: 'unmatched',
      matched_with: null,
      user1_accepted: false,
      user2_accepted: false
    }).eq('id', match.id)

    await fetch('/api/send-match-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'declined',
        user1: { full_name: profile.full_name, email: profile.email },
        user2: { full_name: match.full_name, email: match.email }
      })
    })

    setStatus('❌ Match declined. Both users have been notified and will be re-entered into matching.')
    setMatch(null)
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <a href="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', display: 'block', marginBottom: '25px' }}>← Back</a>
        <h1 style={{ fontSize: '1.8rem', color: '#f1f5f9', margin: '0 0 5px 0', fontWeight: '700' }}>🔍 Check My Match</h1>
        <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '0.95rem' }}>Enter your email to see your current status</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <span style={labelStyle}>Email Address</span>
            <input
              placeholder="john@example.com"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button onClick={handleCheck} disabled={loading} style={{
            background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #3b82f6, #6366f1)',
            color: loading ? '#64748b' : 'white',
            padding: '16px',
            border: 'none', borderRadius: '100px',
            fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontFamily: "'Georgia', serif",
            transition: 'all 0.2s'
          }}>
            {loading ? 'Checking...' : 'Check Status →'}
          </button>

          {status && (
            <div style={{
              background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: '12px', padding: '15px', color: '#93c5fd',
              textAlign: 'center', fontSize: '0.95rem'
            }}>
              {status}
            </div>
          )}

          {profile && profile.match_status === 'unmatched' && (
            <div style={{
              background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)',
              borderRadius: '16px', padding: '24px', textAlign: 'center'
            }}>
              <p style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>⏳</p>
              <p style={{ color: '#fde047', fontWeight: '600', margin: '0 0 5px 0', fontSize: '1.1rem' }}>Still Searching</p>
              <p style={{ color: '#64748b', margin: '0', fontSize: '0.9rem' }}>
                Your registration is active. We'll email you as soon as a match is found!
              </p>
              <div style={{ marginTop: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '15px' }}>
                <p style={{ color: '#f1f5f9', margin: '0', fontWeight: '600' }}>📍 {profile.current_test_centre}</p>
                <p style={{ color: '#f1f5f9', margin: '0', fontWeight: '600' }}>📅 {new Date(profile.current_test_date).toLocaleDateString('en-GB')}</p>
                <p style={{ color: '#f1f5f9', margin: '0', fontWeight: '600' }}>🕐 {profile.current_test_time}</p>
              </div>
            </div>
          )}

          {profile && profile.match_status === 'pending' && match && (
            <div style={{
              background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: '16px', padding: '24px'
            }}>
              <p style={{ fontSize: '2rem', margin: '0 0 10px 0', textAlign: 'center' }}>🤝</p>
              <p style={{ color: '#93c5fd', fontWeight: '600', margin: '0 0 5px 0', fontSize: '1.1rem', textAlign: 'center' }}>Potential Match Found!</p>
              <p style={{ color: '#64748b', margin: '0 0 20px 0', fontSize: '0.9rem', textAlign: 'center' }}>
                Accept or decline this potential swap
              </p>

              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '15px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: '700', fontSize: '1rem', flexShrink: 0
                }}>
                  {getInitials(match.full_name)}
                </div>
                <div>
                  <p style={{ color: '#f1f5f9', margin: '0 0 3px 0', fontWeight: '600' }}>{getInitials(match.full_name)}</p>
                  <p style={{ color: '#64748b', margin: '0', fontSize: '0.85rem' }}>📍 {match.current_test_centre}</p>
                  <p style={{ color: '#64748b', margin: '0', fontSize: '0.85rem' }}>📅 {new Date(match.current_test_date).toLocaleDateString('en-GB')}</p>
                  <p style={{ color: '#64748b', margin: '0', fontSize: '0.85rem' }}>🕐 {match.current_test_time}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleAccept} style={{
                  flex: 1, background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  color: 'white', padding: '13px',
                  border: 'none', borderRadius: '100px',
                  fontSize: '0.95rem', cursor: 'pointer',
                  fontWeight: '600', fontFamily: "'Georgia', serif"
                }}>
                  ✓ Accept
                </button>
                <button onClick={handleDecline} style={{
                  flex: 1, background: 'rgba(239,68,68,0.1)',
                  color: '#fca5a5', padding: '13px',
                  border: '1px solid rgba(239,68,68,0.2)', borderRadius: '100px',
                  fontSize: '0.95rem', cursor: 'pointer',
                  fontWeight: '600', fontFamily: "'Georgia', serif"
                }}>
                  ✗ Decline
                </button>
              </div>
            </div>
          )}

          {profile && profile.match_status === 'matched' && (
            <div style={{
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: '16px', padding: '24px', textAlign: 'center'
            }}>
              <p style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>🎉</p>
              <p style={{ color: '#86efac', fontWeight: '600', margin: '0 0 5px 0', fontSize: '1.1rem' }}>Swap Confirmed!</p>
              <p style={{ color: '#64748b', margin: '0', fontSize: '0.9rem' }}>
                Both parties have accepted. Check your email for full contact details!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}