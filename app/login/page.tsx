import { getCurrentAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import LoginForm from '@/components/login-form'

export default async function LoginPage() {
  if (await getCurrentAdmin()) redirect('/dashboard')
  return <main className="login-shell"><section className="login-card">
    <div className="brand-mark">O</div><p className="eyebrow">ORO OPERATIONS</p>
    <h1>Welcome back.</h1><p className="muted">Sign in with your ORO staff account.</p>
    <LoginForm />
  </section></main>
}