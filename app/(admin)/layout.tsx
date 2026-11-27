import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import AdminShell from '@/components/admin-shell'

export const dynamic = 'force-dynamic'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin()
  if (!admin) redirect('/login')
  return <AdminShell admin={admin}>{children}</AdminShell>
}