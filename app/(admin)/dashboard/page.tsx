import { getAdminSupabase } from '@/lib/supabase/admin'
import type { ReactNode } from 'react'
import { formatINR } from '@/lib/format'
import { Package, ShoppingCart, IndianRupee, Clock3, Boxes } from 'lucide-react'

export const dynamic='force-dynamic'
export default async function DashboardPage() {
  const db=getAdminSupabase()
  const [{count:products},{count:orders},{data:recent},{count:pending},{data:recentPaid},{count:lowStock}] = await Promise.all([
    db.from('products').select('id',{count:'exact',head:true}).eq('active',true),
    db.from('orders').select('id',{count:'exact',head:true}),
    db.from('orders').select('id,order_number,total,status,payment_status,payment_method,created_at,customer_profiles(full_name,email)').order('created_at',{ascending:false}).limit(8),
    db.from('orders').select('id',{count:'exact',head:true}).in('status',['pending_payment','confirmed']),
    db.from('orders').select('total,payment_status,payment_method').order('created_at',{ascending:false}).limit(100),
    db.from('product_inventory').select('product_id',{count:'exact',head:true}).lte('stock_on_hand',3),
  ])
  const revenue=(recentPaid??[]).filter(o=>o.payment_status==='paid'||o.payment_method==='cod').reduce((sum,o)=>sum+Number(o.total),0)
  return <div className="page-wrap"><div className="page-heading"><div><p className="eyebrow">OVERVIEW</p><h1>Store at a glance.</h1><p className="muted">Your daily operations, in one place.</p></div><span className="date-chip">{new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</span></div>
    <div className="metric-grid">
      <Metric title="Active products" value={String(products??0)} icon={<Package/>}/>
      <Metric title="Total orders" value={String(orders??0)} icon={<ShoppingCart/>}/>
      <Metric title="Awaiting action" value={String(pending??0)} icon={<Clock3/>}/>
      <Metric title="Recent order value" value={formatINR(revenue)} icon={<IndianRupee/>}/>
      <Metric title="Low-stock variants" value={String(lowStock??0)} icon={<Boxes/>}/>
    </div>
    <section className="panel"><div className="panel-head"><div><h2>Recent orders</h2><p>Latest customer activity</p></div><a className="text-link" href="/orders">View all orders →</a></div>
      <div className="table-scroll"><table><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead><tbody>
      {(recent??[]).map((o:any)=><tr key={o.id}><td><b>{o.order_number}</b></td><td>{o.customer_profiles?.full_name??o.customer_profiles?.email??'Customer'}</td><td>{new Date(o.created_at).toLocaleDateString('en-IN')}</td><td>{formatINR(Number(o.total))}</td><td><span className="pill">{o.payment_status}</span></td><td><span className="pill">{o.status}</span></td></tr>)}
      {!recent?.length&&<tr><td colSpan={6} className="empty">No orders yet.</td></tr>}</tbody></table></div>
    </section>
  </div>
}
function Metric({title,value,icon}:{title:string;value:string;icon:ReactNode}){return <section className="metric-card"><span>{icon}</span><p>{title}</p><strong>{value}</strong></section>}