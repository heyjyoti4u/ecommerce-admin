import { NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/auth'
export const dynamic = 'force-dynamic'
export async function GET() {
  const admin = await getCurrentAdmin()
  return NextResponse.json(admin ? { ok:true, admin } : { ok:false }, { status:admin ? 200 : 401, headers:{'Cache-Control':'no-store'} })
}