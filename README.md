# ORO Operations Dashboard

Spreadsheet-style internal operations app for the ORO storefront.

## Shared database
This app connects to the **same Supabase project** as the ORO storefront. It reads and writes the existing `products`, `product_inventory`, `orders`, `order_items`, and `customer_profiles` tables.

## Vercel environment variables
- `NEXT_PUBLIC_SUPABASE_URL`: same project URL as storefront
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: same anon/publishable key as storefront
- `SUPABASE_SERVICE_ROLE_KEY`: same project service-role key (server-only; never prefix with NEXT_PUBLIC)
Staff access is assigned by an owner/admin from the Staff Access screen. The server checks `public.admin_users` on every protected request.
- `NEXT_PUBLIC_STORE_URL`: storefront URL

Use the same Supabase Auth project. The dashboard checks the `admin_users` table for every protected request. Never share the service-role key with employees.

## First owner setup
1. Create your own account through the ORO storefront using the same Supabase Auth project.
2. In Supabase Dashboard → Authentication → Users, copy that account's UUID.
3. After running the admin migration below, execute this once in SQL Editor, replacing the placeholder:

```sql
insert into public.admin_users (user_id, role)
values ('YOUR_SUPABASE_AUTH_USER_UUID', 'owner')
on conflict (user_id) do update set role = 'owner';
```

4. Sign in to the admin app using that same email/password. From Staff Access, add employees after they have registered their own ORO account. Give them the `staff` role, not `admin`, unless they should manage staff access.

## Database compatibility
Run `supabase/admin-dashboard.sql` in the existing ORO Supabase project after the storefront migrations. It adds a product-images Storage bucket and staff upload policies. It does not reset existing commerce data.

## Current modules
Overview, spreadsheet-style product list, create/edit product, publish/hide, main and colour-specific galleries, per-variant inventory, order status changes with courier/tracking fields, customer list.

## Order states
Uses current storefront status values: `pending_payment`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`. UI labels are Payment pending, Accepted, Processing, Shipped, Delivered and Cancelled.

Products referenced by order history are archived instead of hard-deleted.
