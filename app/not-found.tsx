import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100dvh',
      backgroundColor: '#0A080D',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 32px',
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: 'var(--font-playfair)',
        fontSize: 64,
        fontWeight: 600,
        color: 'rgba(255,255,255,0.06)',
        lineHeight: 1,
        marginBottom: 24,
        letterSpacing: '-0.02em',
      }}>
        404
      </p>
      <p style={{
        fontFamily: 'var(--font-playfair)',
        fontSize: 22,
        fontWeight: 600,
        color: '#ffffff',
        lineHeight: 1.35,
        marginBottom: 10,
      }}>
        This page doesn&apos;t exist.
      </p>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginBottom: 36 }}>
        But your pleasure does.
      </p>
      <Link
        href="/"
        style={{
          backgroundColor: '#A66A86',
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          padding: '12px 28px',
          borderRadius: 999,
          textDecoration: 'none',
        }}
      >
        Take me home
      </Link>
    </div>
  )
}
