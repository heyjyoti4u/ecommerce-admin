'use client'
import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { getBrowserSupabase } from '@/lib/supabase/browser'

export default function LoginForm() {
  const router = useRouter()
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')

  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError('')
    try {
      const { error } = await getBrowserSupabase().auth.signInWithPassword({ email:email.trim().toLowerCase(), password })
      if (error) throw error
      const response = await fetch('/api/session', { method:'GET', cache:'no-store' })
      if (!response.ok) { await getBrowserSupabase().auth.signOut(); throw new Error('This account does not have ORO staff access.') }
      router.replace('/dashboard'); router.refresh()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not sign in.') }
    finally { setBusy(false) }
  }

  return <form className="login-form" onSubmit={submit}>
    {error && <div className="notice error">{error}</div>}
    <label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="username"/></label>
    <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/></label>
    <button className="primary-button" disabled={busy}>{busy?'Signing in…':'Sign in'}</button>
  </form>
}