
export default function LoginPage() {
  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #e0e7ff' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 16 }}>Sign in to your account</h2>
      <LoginForm />
      <div style={{ margin: '24px 0', textAlign: 'center', color: '#6b7280' }}>or</div>
      <GoogleLogin />
    </div>
  );
}
