import { notFound } from 'next/navigation'
import ProductForm from '@/components/product-form'
import { getAdminSupabase } from '@/lib/supabase/admin'
import DeleteButton from './delete-button'
export const dynamic='force-dynamic'
export default async function EditProductPage({params}:{params:Promise<{id:string}>}){
 const {id}=await params,db=getAdminSupabase()
 const {data,error}=await db.from('products').select('*').eq('id',id).maybeSingle()
 if(error)throw new Error(error.message);if(!data)notFound()
 const {data:stock}=await db.from('product_inventory').select('size,color,stock_on_hand').eq('product_id',id)
 return <div className="page-wrap narrow"><div className="page-heading"><div><p className="eyebrow">CATALOGUE</p><h1>Edit product</h1><p className="muted">{data.name}</p></div></div><ProductForm product={data} inventory={stock??[]}/><div className="danger-zone"><h2>Remove product</h2><p>Products referenced by orders are archived instead of hard-deleted to preserve order history.</p><DeleteButton id={id}/></div></div>
}