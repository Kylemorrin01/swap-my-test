'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const pageStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
  fontFamily: "'Georgia', serif",
  padding: '40px 20px',
}

const cardStyle = {
  maxWidth: '560px',
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

const sectionStyle = {
  borderTop: '1px solid rgba(255,255,255,0.07)',
  paddingTop: '20px',
  marginTop: '5px'
}

export default function Register() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    current_test_date: '',
    current_test_centre: '',
  })
  const [desiredCentres, setDesiredCentres] = useState(['', '', ''])
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [excludedRanges, setExcludedRanges] = useState([])
  const [excludeInput, setExcludeInput] = useState({ from: '', to: '' })
  const [centres, setCentres] = useState([])
  const [matches, setMatches] = useState([])
  const [status, setStatus] = useState('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadCentres = async () => {
      const { data } = await supabase.from('test_centres').select('name').order('name')
      if (data) setCentres(data.map(c => c.name))
    }
    loadCentres()
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleDesiredCentre = (index, value) => {
    const updated = [...desiredCentres]
    updated[index] = value
    setDesiredCentres(updated)
  }

  const addExcludedRange = () => {
    if (excludeInput.from && excludeInput.to) {
      setExcludedRanges([...excludedRanges, { ...excludeInput }])
      setExcludeInput({ from: '', to: '' })
    }
  }

  const isDateExcluded = (date) =>
    excludedRanges.some(range => date >= range.from && date <= range.to)

  const handleSubmit = async () => {
    setLoading(true)
    setStatus('')

    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: Math.random().toString(36).slice(-8),
    })

    if (signUpError) {
      setStatus('Error: ' + signUpError.message)
      setLoading(false)
      return
    }

    const filteredCentres = desiredCentres.filter(c => c !== '')

    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      full_name: form.full_name,
      email: form.email,
      current_test_date: form.current_test_date,
      current_test_centre: form.current_test_centre,
      desired_centres: filteredCentres,
      desired_dates: [dateRange.from, dateRange.to],
    })

    if (profileError) {
      setStatus('Error saving details: ' + profileError.message)
      setLoading(false)
      return
    }

    const { data: potentialMatches } = await supabase
      .from('profiles')
      .select()
      .in('current_test_centre', filteredCentres)
      .gte('current_test_date', dateRange.from)
      .lte('current_test_date', dateRange.to)
      .eq('match_status', 'unmatched')
      .neq('id', user.id)

    const filteredMatches = potentialMatches
      ? potentialMatches.filter(m => !isDateExcluded(m.current_test_date))
      : []

    setLoading(false)

    if (filteredMatches.length > 0) {
      setMatches(filteredMatches)
      setStep(2)
    } else {
      setStatus("✅ You're registered! We'll notify you when a match is found.")
    }
  }

  const getInitials = (name) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase()

  const requestSwap = async (match) => {
    await fetch('/api/send-match-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user1: { full_name: form.full_name, email: form.email, current_test_centre: form.current_test_centre, current_test_date: form.current_test_date },
        user2: { full_name: match.full_name, email: match.email, current_test_centre: match.current_test_centre, current_test_date: match.current_test_date }
      })
    })
    setStatus(`✅ Swap requested! Both you and ${getInitials(match.full_name)} have been notified by email.`)
    setMatches([])
  }

  if (step === 2) {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, maxWidth: '600px' }}>
          <a href="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', display: 'block', marginBottom: '25px' }}>← Back</a>
          <h1 style={{ fontSize: '1.8rem', color: '#f1f5f9', margin: '0 0 5px 0', fontWeight: '700' }}>🎉 Matches Found!</h1>
          <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '0.95rem' }}>
            Request a swap with anyone below — both of you will be notified by email
          </p>

          {status && (
            <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px', padding: '15px', color: '#93c5fd', textAlign: 'center', marginBottom: '20px', fontSize: '0.95rem' }}>
              {status}
            </div>
          )}

          {matches.map((match, i) => (
            <div key={i} style={{
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '20px 24px',
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: '700', fontSize: '1rem', flexShrink: 0
                }}>
                  {getInitials(match.full_name)}
                </div>
                <div>
                  <p style={{ margin: '0 0 3px 0', color: '#e2e8f0', fontWeight: '600', fontSize: '0.95rem' }}>
                    {getInitials(match.full_name)}
                  </p>
                  <p style={{ margin: '0', color: '#64748b', fontSize: '0.85rem' }}>
                    📍 {match.current_test_centre}
                  </p>
                  <p style={{ margin: '0', color: '#64748b', fontSize: '0.85rem' }}>
                    📅 {new Date(match.current_test_date).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>
              <button onClick={() => requestSwap(match)} style={{
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                color: 'white', padding: '10px 20px',
                border: 'none', borderRadius: '100px',
                fontSize: '0.9rem', cursor: 'pointer',
                fontWeight: '600', whiteSpace: 'nowrap'
              }}>
                Request Swap
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <a href="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', display: 'block', marginBottom: '25px' }}>← Back</a>
        <h1 style={{ fontSize: '1.8rem', color: '#f1f5f9', margin: '0 0 5px 0', fontWeight: '700' }}>📋 Register Your Test</h1>
        <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '0.95rem' }}>Fill in your details and we'll find you a swap</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          <div>
            <span style={labelStyle}>Full Name</span>
            <input name="full_name" placeholder="John Smith" onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <span style={labelStyle}>Email Address</span>
            <input name="email" placeholder="john@example.com" type="email" onChange={handleChange} style={inputStyle} />
          </div>

          <div style={sectionStyle}>
            <p style={{ ...labelStyle, color: '#f1f5f9', fontSize: '0.8rem', marginBottom: '14px' }}>YOUR CURRENT TEST</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <span style={labelStyle}>Test Date</span>
                <input name="current_test_date" type="date" onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <span style={labelStyle}>Test Centre</span>
                <select name="current_test_centre" onChange={handleChange} style={{ ...inputStyle, color: form.current_test_centre ? '#f1f5f9' : '#64748b' }}>
                  <option value="">Select your test centre</option>
                  {centres.map(c => <option key={c} value={c} style={{ background: '#1e3a5f' }}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <p style={{ ...labelStyle, color: '#f1f5f9', fontSize: '0.8rem', marginBottom: '14px' }}>DESIRED DATE RANGE</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <span style={labelStyle}>From</span>
                <input type="date" onChange={e => setDateRange({ ...dateRange, from: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={labelStyle}>To</span>
                <input type="date" onChange={e => setDateRange({ ...dateRange, to: e.target.value })} style={inputStyle} />
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <p style={{ ...labelStyle, color: '#f1f5f9', fontSize: '0.8rem', marginBottom: '4px' }}>EXCLUDE DATE RANGES <span style={{ color: '#475569', fontWeight: 'normal' }}>(OPTIONAL)</span></p>
            <p style={{ color: '#475569', fontSize: '0.8rem', marginBottom: '12px' }}>Add any dates within your range you can't do</p>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <span style={labelStyle}>From</span>
                <input type="date" value={excludeInput.from} onChange={e => setExcludeInput({ ...excludeInput, from: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={labelStyle}>To</span>
                <input type="date" value={excludeInput.to} onChange={e => setExcludeInput({ ...excludeInput, to: e.target.value })} style={inputStyle} />
              </div>
              <button type="button" onClick={addExcludedRange} style={{
                background: 'rgba(255,255,255,0.08)', color: '#94a3b8',
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px',
                padding: '13px 16px', cursor: 'pointer', fontSize: '0.85rem',
                whiteSpace: 'nowrap', fontFamily: "'Georgia', serif"
              }}>
                + Add
              </button>
            </div>

            {excludedRanges.length > 0 && (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {excludedRanges.map((range, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                    padding: '8px 14px', borderRadius: '10px'
                  }}>
                    <span style={{ color: '#fca5a5', fontSize: '0.85rem' }}>
                      {new Date(range.from).toLocaleDateString('en-GB')} — {new Date(range.to).toLocaleDateString('en-GB')}
                    </span>
                    <button onClick={() => setExcludedRanges(excludedRanges.filter((_, j) => j !== i))} style={{
                      background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', fontSize: '1.1rem'
                    }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={sectionStyle}>
            <p style={{ ...labelStyle, color: '#f1f5f9', fontSize: '0.8rem', marginBottom: '14px' }}>DESIRED TEST CENTRES <span style={{ color: '#475569', fontWeight: 'normal' }}>(UP TO 3)</span></p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[0, 1, 2].map(i => (
                <select key={i} onChange={e => handleDesiredCentre(i, e.target.value)} style={{ ...inputStyle, color: desiredCentres[i] ? '#f1f5f9' : '#64748b' }}>
                  <option value="">Centre {i + 1} (optional)</option>
                  {centres.map(c => <option key={c} value={c} style={{ background: '#1e3a5f' }}>{c}</option>)}
                </select>
              ))}
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading} style={{
            background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #3b82f6, #6366f1)',
            color: loading ? '#64748b' : 'white',
            padding: '16px',
            border: 'none', borderRadius: '100px',
            fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600', marginTop: '10px',
            fontFamily: "'Georgia', serif",
            transition: 'all 0.2s'
          }}>
            {loading ? 'Searching...' : 'Find My Swap →'}
          </button>

          {status && (
            <div style={{
              background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
              borderRadius: '12px', padding: '15px', color: '#93c5fd',
              textAlign: 'center', fontSize: '0.95rem'
            }}>
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}