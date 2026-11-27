import ProductsGrid from '@/components/products-grid'
import { getAdminSupabase } from '@/lib/supabase/admin'
export const dynamic='force-dynamic'
export default async function ProductsPage(){
 const {data,error}=await getAdminSupabase().from('products').select('id,name,category,price,old_price,active,image,sizes,colors,badge,created_at').order('created_at',{ascending:false})
 if(error) throw new Error('Could not load products: '+error.message)
 return <div className="page-wrap"><div className="page-heading"><div><p className="eyebrow">CATALOGUE</p><h1>Products</h1><p className="muted">Manage the products customers see in your ORO store.</p></div><a className="primary-button link-button" href="/products/new">+ Add product</a></div><ProductsGrid initialProducts={data??[]}/></div>
}