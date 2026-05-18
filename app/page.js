'use client'

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
      fontFamily: "'Georgia', serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(99,102,241,0.1) 0%, transparent 40%)',
        pointerEvents: 'none'
      }} />

      <div style={{ textAlign: 'center', maxWidth: '650px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '10px' }}>🚗</div>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          color: '#f8fafc',
          margin: '0 0 8px 0',
          fontWeight: '700',
          letterSpacing: '-1px',
          lineHeight: 1.1
        }}>
          Swap My Test
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#94a3b8',
          marginBottom: '50px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          fontFamily: "'Georgia', serif"
        }}>
          Free driving test date swaps across the UK
        </p>

        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '60px'
        }}>
          {['100% Free', 'All UK Centres', 'Instant Matching'].map(label => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '100px',
              padding: '8px 20px',
              color: '#cbd5e1',
              fontSize: '0.85rem',
              letterSpacing: '0.05em'
            }}>
              ✓ {label}
            </div>
          ))}
        </div>

        <a href="/register" style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
          color: 'white',
          padding: '18px 50px',
          borderRadius: '100px',
          textDecoration: 'none',
          fontSize: '1.1rem',
          fontWeight: '600',
          letterSpacing: '0.02em',
          boxShadow: '0 20px 60px rgba(59,130,246,0.4)',
        }}>
          Find My Swap →
        </a>

        <p style={{ color: '#475569', fontSize: '0.85rem', marginTop: '30px' }}>
          No account needed · Takes 2 minutes
        </p>
      </div>
    </main>
  )
}