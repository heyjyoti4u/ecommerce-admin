'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { LayoutDashboard, Package, ShoppingCart, Users, Boxes, UserCog, LogOut, ExternalLink } from 'lucide-react'
import { getBrowserSupabase } from '@/lib/supabase/browser'

const nav = [
  { href:'/dashboard', label:'Overview', icon:LayoutDashboard },
  { href:'/products', label:'Products', icon:Package },
  { href:'/orders', label:'Orders', icon:ShoppingCart },
  { href:'/inventory', label:'Inventory', icon:Boxes },
  { href:'/customers', label:'Customers', icon:Users },
  { href:'/staff', label:'Staff access', icon:UserCog, roles:['owner','admin'] },
]
export default function AdminShell({admin,children}:{admin:{name:string;email:string;role:string};children:ReactNode}) {
  const path=usePathname(), router=useRouter()
  async function signOut(){await getBrowserSupabase().auth.signOut();router.replace('/login');router.refresh()}
  return <div className="admin-app">
    <aside className="sidebar">
      <Link href="/dashboard" className="brand"><span className="brand-mark small">O</span><span><b>ORO</b><small>OPERATIONS</small></span></Link>
      <div className="store-label">STORE MANAGEMENT</div>
      <nav>{nav.filter(item=>!item.roles || item.roles.includes(admin.role)).map(item=>{const Icon=item.icon;return <Link key={item.href} href={item.href} className={path===item.href?'active':''}><Icon size={17}/><span>{item.label}</span></Link>})}</nav>
      <div className="sidebar-bottom"><a href={process.env.NEXT_PUBLIC_STORE_URL || 'https://ecommerce-store-development.vercel.app'} target="_blank" rel="noreferrer"><ExternalLink size={15}/> View storefront</a><div className="staff"><span className="avatar">{admin.name.slice(0,1).toUpperCase()}</span><span><b>{admin.name}</b><small>{admin.email}</small></span></div><button onClick={signOut}><LogOut size={16}/> Sign out</button></div>
    </aside>
    <main className="main-area"><header className="topbar"><div><span className="eyebrow">STORE WORKSPACE</span><strong>Good work starts with a clear view.</strong></div><span className="live-indicator">Connected workspace</span></header>{children}</main>
  </div>
}