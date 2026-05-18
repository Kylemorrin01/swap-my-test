'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const pageStyle = {
  minHeight: '100vh',
  background:
    'radial-gradient(circle at top left, #1e3a8a 0%, transparent 30%), radial-gradient(circle at bottom right, #4338ca 0%, transparent 30%), linear-gradient(135deg, #020617 0%, #0f172a 50%, #111827 100%)',
  fontFamily: 'Inter, sans-serif',
  padding: '40px 20px',
  position: 'relative',
  overflow: 'hidden',
}

const cardStyle = {
  maxWidth: '760px',
  margin: '0 auto',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '32px',
  padding: '50px',
  backdropFilter: 'blur(20px)',
  boxShadow:
    '0 10px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)',
  position: 'relative',
  zIndex: 2,
}

const inputStyle = {
  padding: '15px 18px',
  fontSize: '0.96rem',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '14px',
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: 'Inter, sans-serif',
  background: 'rgba(255,255,255,0.04)',
  color: '#f8fafc',
  outline: 'none',
  transition: 'all 0.2s ease',
}

const labelStyle = {
  color: '#94a3b8',
  fontSize: '0.72rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  marginBottom: '8px',
  display: 'block',
  fontWeight: '600',
}

const sectionStyle = {
  border: '1px solid rgba(255,255,255,0.06)',
  background: 'rgba(255,255,255,0.03)',
  borderRadius: '24px',
  padding: '24px',
}

export default function Register() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    current_test_date: '',
    current_test_time: '',
    current_test_ampm: 'AM',
    current_test_centre: '',
  })

  const [desiredCentres, setDesiredCentres] = useState(['', '', ''])
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [centres, setCentres] = useState([])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadCentres = async () => {
      const { data } = await supabase
        .from('test_centres')
        .select('name')
        .order('name')

      if (data) {
        setCentres(data.map((c) => c.name))
      }
    }

    loadCentres()
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleDesiredCentre = (index, value) => {
    const updated = [...desiredCentres]
    updated[index] = value
    setDesiredCentres(updated)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setStatus('')

    try {
      const {
        data: { user },
        error: signUpError,
      } = await supabase.auth.signUp({
        email: form.email,
        password: Math.random().toString(36).slice(-8),
      })

      if (signUpError) {
        setStatus(signUpError.message)
        setLoading(false)
        return
      }

      const filteredCentres = desiredCentres.filter((c) => c)

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          current_test_date: form.current_test_date,
          current_test_time: `${form.current_test_time} ${form.current_test_ampm}`,
          current_test_centre: form.current_test_centre,
          desired_centres: filteredCentres,
          desired_dates: [dateRange.from, dateRange.to],
        })

      if (profileError) {
        setStatus(profileError.message)
        setLoading(false)
        return
      }

      setStatus(
        "✅ You're registered! We'll notify you when a match is found."
      )
    } catch (err) {
      setStatus('Something went wrong.')
    }

    setLoading(false)
  }

  return (
    <div style={pageStyle}>
      {/* Glow effects */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '999px',
          background: 'rgba(59,130,246,0.15)',
          filter: 'blur(120px)',
          top: '-150px',
          left: '-100px',
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '999px',
          background: 'rgba(99,102,241,0.12)',
          filter: 'blur(120px)',
          bottom: '-120px',
          right: '-80px',
        }}
      />

      <div style={cardStyle}>
        <div style={{ marginBottom: '35px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(59,130,246,0.12)',
              border: '1px solid rgba(96,165,250,0.18)',
              padding: '10px 18px',
              borderRadius: '999px',
              color: '#bfdbfe',
              fontSize: '0.85rem',
              marginBottom: '24px',
              fontWeight: 500,
            }}
          >
            🚗 Driving Test Swap Registration
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              color: '#f8fafc',
              margin: '0 0 12px 0',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.04em',
            }}
          >
            Find Your
            <br />

            <span
              style={{
                background:
                  'linear-gradient(135deg, #60a5fa 0%, #818cf8 50%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Perfect Swap
            </span>
          </h1>

          <p
            style={{
              color: '#94a3b8',
              fontSize: '1.05rem',
              lineHeight: 1.7,
            }}
          >
            Enter your driving test details and we’ll automatically
            match you with compatible drivers across the UK.
          </p>
        </div>

        <div
  style={{
    display: 'flex',
    gap: '10px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  }}
>
  <button
    type="button"
    onClick={() => {
      setForm({
        full_name: 'John Smith',
        email: `john${Date.now()}@example.com`,
        phone: '07700900001',
        current_test_date: '2026-08-04',
        current_test_time: '10:04',
        current_test_ampm: 'AM',
        current_test_centre: 'Wellingborough',
      })

      setDesiredCentres([
        'Wellingborough',
        'Kettering',
        '',
      ])

      setDateRange({
        from: '2026-07-01',
        to: '2026-08-30',
      })
    }}
    style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: '#cbd5e1',
      padding: '12px 18px',
      borderRadius: '12px',
      cursor: 'pointer',
    }}
  >
    Fill Demo User 1
  </button>

  <button
    type="button"
    onClick={() => {
      setForm({
        full_name: 'Sarah Williams',
        email: `sarah${Date.now()}@example.com`,
        phone: '07700900002',
        current_test_date: '2026-07-20',
        current_test_time: '11:30',
        current_test_ampm: 'AM',
        current_test_centre: 'Kettering',
      })

      setDesiredCentres([
        'Wellingborough',
        'Kettering',
        '',
      ])

      setDateRange({
        from: '2026-07-01',
        to: '2026-08-30',
      })
    }}
    style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: '#cbd5e1',
      padding: '12px 18px',
      borderRadius: '12px',
      cursor: 'pointer',
    }}
  >
    Fill Demo User 2
  </button>
</div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <div style={sectionStyle}>
            <div style={{ marginBottom: '18px' }}>
              <p
                style={{
                  color: '#f8fafc',
                  fontWeight: 700,
                  marginBottom: '6px',
                }}
              >
                Your Details
              </p>

              <p
                style={{
                  color: '#64748b',
                  margin: 0,
                  fontSize: '0.9rem',
                }}
              >
                Basic contact information
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div>
                <span style={labelStyle}>Full Name</span>

                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="John Smith"
                  style={inputStyle}
                />
              </div>

              <div>
                <span style={labelStyle}>Email</span>

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  style={inputStyle}
                />
              </div>

              <div>
                <span style={labelStyle}>Phone Number</span>

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="07700 900000"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <div style={{ marginBottom: '18px' }}>
              <p
                style={{
                  color: '#f8fafc',
                  fontWeight: 700,
                  marginBottom: '6px',
                }}
              >
                Current Test
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <span style={labelStyle}>Date</span>

                  <input
                    type="date"
                    name="current_test_date"
                    value={form.current_test_date}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <span style={labelStyle}>Time</span>

                  <input
                    name="current_test_time"
                    value={form.current_test_time}
                    onChange={handleChange}
                    placeholder="10:14"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <span style={labelStyle}>AM / PM</span>

                <select
                  name="current_test_ampm"
                  value={form.current_test_ampm}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>

              <div>
                <span style={labelStyle}>Test Centre</span>

                <select
                  name="current_test_centre"
                  value={form.current_test_centre}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Select centre</option>

                  {centres.map((c) => (
                    <option
                      key={c}
                      value={c}
                      style={{ background: '#0f172a' }}
                    >
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <div style={{ marginBottom: '18px' }}>
              <p
                style={{
                  color: '#f8fafc',
                  fontWeight: 700,
                  marginBottom: '6px',
                }}
              >
                Desired Date Range
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <span style={labelStyle}>From</span>

                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange({
                      ...dateRange,
                      from: e.target.value,
                    })
                  }
                  style={inputStyle}
                />
              </div>

              <div style={{ flex: 1 }}>
                <span style={labelStyle}>To</span>

                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange({
                      ...dateRange,
                      to: e.target.value,
                    })
                  }
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <div style={{ marginBottom: '18px' }}>
              <p
                style={{
                  color: '#f8fafc',
                  fontWeight: 700,
                  marginBottom: '6px',
                }}
              >
                Preferred Test Centres
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {[0, 1, 2].map((i) => (
                <select
                  key={i}
                  value={desiredCentres[i]}
                  onChange={(e) =>
                    handleDesiredCentre(i, e.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="">
                    Centre {i + 1} (optional)
                  </option>

                  {centres.map((c) => (
                    <option
                      key={c}
                      value={c}
                      style={{ background: '#0f172a' }}
                    >
                      {c}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: loading
                ? 'rgba(255,255,255,0.08)'
                : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              color: loading ? '#64748b' : 'white',
              padding: '20px',
              border: 'none',
              borderRadius: '18px',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              boxShadow: loading
                ? 'none'
                : '0 15px 40px rgba(59,130,246,0.35)',
            }}
          >
            {loading
              ? 'Searching for matches...'
              : 'Find My Swap →'}
          </button>

          {status && (
            <div
              style={{
                background: 'rgba(59,130,246,0.1)',
                border: '1px solid rgba(59,130,246,0.25)',
                borderRadius: '18px',
                padding: '18px',
                color: '#bfdbfe',
                textAlign: 'center',
              }}
            >
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}