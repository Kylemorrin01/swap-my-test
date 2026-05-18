'use client'

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, #1e3a8a 0%, transparent 35%), radial-gradient(circle at bottom right, #4338ca 0%, transparent 30%), linear-gradient(135deg, #020617 0%, #0f172a 45%, #111827 100%)',
        fontFamily: "Inter, sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated glow blobs */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '999px',
          background: 'rgba(59,130,246,0.18)',
          filter: 'blur(120px)',
          top: '-120px',
          left: '-120px',
          animation: 'float1 10s ease-in-out infinite',
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '999px',
          background: 'rgba(99,102,241,0.15)',
          filter: 'blur(100px)',
          bottom: '-100px',
          right: '-80px',
          animation: 'float2 12s ease-in-out infinite',
        }}
      />

      {/* Main card */}
      <div
        style={{
          width: '100%',
          maxWidth: '760px',
          position: 'relative',
          zIndex: 1,
          backdropFilter: 'blur(20px)',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '32px',
          padding: '70px 50px',
          boxShadow:
            '0 10px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
          textAlign: 'center',
        }}
      >
        {/* Small badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(59,130,246,0.12)',
            border: '1px solid rgba(96,165,250,0.2)',
            padding: '10px 18px',
            borderRadius: '999px',
            color: '#bfdbfe',
            fontSize: '0.9rem',
            marginBottom: '28px',
            letterSpacing: '0.03em',
          }}
        >
          🚗 UK Driving Test Swaps
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            lineHeight: 0.95,
            margin: 0,
            fontWeight: 800,
            letterSpacing: '-0.05em',
            color: '#f8fafc',
          }}
        >
          Swap
          <br />
          <span
            style={{
              background:
                'linear-gradient(135deg, #60a5fa 0%, #818cf8 50%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            My Test
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '1.2rem',
            color: '#94a3b8',
            maxWidth: '560px',
            margin: '28px auto 0',
            lineHeight: 1.7,
          }}
        >
          Find someone to swap driving test dates with across the UK —
          completely free, no subscriptions, no hidden fees.
        </p>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: '14px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '42px',
            marginBottom: '50px',
          }}
        >
          {[
            '100% Free',
            'All UK Test Centres',
            'Instant Matching',
          ].map((label) => (
            <div
              key={label}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '999px',
                padding: '12px 20px',
                color: '#e2e8f0',
                fontSize: '0.92rem',
                fontWeight: 500,
                backdropFilter: 'blur(10px)',
              }}
            >
              ✦ {label}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '18px',
          }}
        >
          <a
            href="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              background:
                'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              color: 'white',
              padding: '20px 54px',
              borderRadius: '999px',
              textDecoration: 'none',
              fontSize: '1.05rem',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              boxShadow:
                '0 15px 40px rgba(59,130,246,0.35)',
              transition: 'all 0.25s ease',
            }}
          >
            Find My Swap →
          </a>

          <a
            href="/check-match"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#cbd5e1',
              padding: '16px 38px',
              borderRadius: '999px',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              backdropFilter: 'blur(10px)',
            }}
          >
            Check Match Status
          </a>
        </div>

        {/* Footer text */}
        <p
          style={{
            color: '#64748b',
            fontSize: '0.88rem',
            marginTop: '32px',
            letterSpacing: '0.02em',
          }}
        >
          No account needed · Takes under 2 minutes
        </p>
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes float1 {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(25px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes float2 {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        a:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </main>
  )
}