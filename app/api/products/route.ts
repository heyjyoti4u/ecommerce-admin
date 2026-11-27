import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getAdminSupabase } from '@/lib/supabase/admin'

const categories=['Clothing','Bags','Accessories']
const text=(v:unknown,max=1200)=>typeof v==='string'?v.trim().slice(0,max):''

function validate(body:any, creating:boolean) {
 const id=text(body.id,80),name=text(body.name,160),category=text(body.category,40)
 const price=Number(body.price),oldPrice=body.old_price===''||body.old_price==null?null:Number(body.old_price)
 const sizes=Array.isArray(body.sizes)?body.sizes.map((v:any)=>text(v,40)).filter(Boolean):[]
 const colors=Array.isArray(body.colors)?body.colors.map((v:any)=>text(v,40)).filter(Boolean):[]
 const images=body.variant_images&&typeof body.variant_images==='object'&&!Array.isArray(body.variant_images)?body.variant_images:{}
 const inventory=Array.isArray(body.inventory)?body.inventory:[]
 if(creating&&!/^[a-z0-9-]{2,80}$/.test(id))throw new Error('Product ID must use lowercase letters, numbers and hyphens.')
 if(!name||!categories.includes(category)||!Number.isFinite(price)||price<0||!text(body.image)||!text(body.alt,300)||!text(body.description,2000)||!sizes.length||!colors.length)throw new Error('Complete all required product fields.')
 if(oldPrice!==null&&(!Number.isFinite(oldPrice)||oldPrice<price))throw new Error('Compare-at price must be higher than selling price.')
 for(const [color,urls] of Object.entries(images)){if(!colors.includes(color)||!Array.isArray(urls)||(urls as any[]).some(url=>typeof url!=='string'||url.length>1600))throw new Error('Invalid variant image gallery.')}
 for(const row of inventory){if(!sizes.includes(row.size)||!colors.includes(row.color)||!Number.isInteger(Number(row.stock_on_hand))||Number(row.stock_on_hand)<0)throw new Error('Invalid stock row.')}
 return {id,name,category,price,old_price:oldPrice,image:text(body.image),alt:text(body.alt,300),description:text(body.description,2000),sizes,colors,badge:text(body.badge,80)||null,variant_images:images,active:Boolean(body.active),inventory}
}
async function save(body:any,creating:boolean) {
 await requireAdmin()
 const db=getAdminSupabase(),value=validate(body,creating),{inventory,...product}=value
 const result=creating?await db.from('products').insert(product):await db.from('products').update(product).eq('id',product.id)
 if(result.error)throw result.error
 for(const row of inventory){
  const {error}=await db.from('product_inventory').upsert({product_id:product.id,size:row.size,color:row.color,stock_on_hand:Number(row.stock_on_hand),updated_at:new Date().toISOString()},{onConflict:'product_id,size,color'})
  if(error)throw error
 }
 return product.id
}
export async function POST(request:Request){try{const id=await save(await request.json(),true);return NextResponse.json({ok:true,id},{status:201})}catch(error){const message=error instanceof Error?error.message:'Could not save product.';return NextResponse.json({error:message},{status:message==='UNAUTHORIZED'?401:400})}}
export async function PATCH(request:Request){try{const id=await save(await request.json(),false);return NextResponse.json({ok:true,id})}catch(error){const message=error instanceof Error?error.message:'Could not update product.';return NextResponse.json({error:message},{status:message==='UNAUTHORIZED'?401:400})}}
