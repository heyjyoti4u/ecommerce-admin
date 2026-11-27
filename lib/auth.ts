import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getAdminSupabase, getPublicSupabaseConfig } from '@/lib/supabase/admin'

export async function getCurrentAdmin() {
  const cookieStore = await cookies()
  const { url, anon } = getPublicSupabaseConfig()
  const authClient = createServerClient(url, anon, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (values) => {
        try { values.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
      },
    },
  })
  const { data: { user }, error } = await authClient.auth.getUser()
  if (error || !user) return null

  const allowedIds = (process.env.ADMIN_USER_IDS ?? '').split(',').map((id) => id.trim()).filter(Boolean)
  if (!allowedIds.includes(user.id)) return null

  const admin = getAdminSupabase()
  const { data: profile } = await admin.from('customer_profiles').select('id,email,full_name').eq('user_id', user.id).maybeSingle()
  return { id: user.id, email: user.email ?? '', name: profile?.full_name || user.email || 'ORO staff' }
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin()
  if (!admin) throw new Error('UNAUTHORIZED')
  return admin
}