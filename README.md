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

Use the same Supabase Auth project. Only accounts whose Auth UUID appears in ADMIN_USER_IDS can access the dashboard. Never share the service-role key with employees.

## Database compatibility
Run `supabase/admin-dashboard.sql` in the existing ORO Supabase project after the storefront migrations. It adds a product-images Storage bucket and staff upload policies. It does not reset existing commerce data.

## Current modules
Overview, spreadsheet-style product list, create/edit product, publish/hide, main and colour-specific galleries, per-variant inventory, order status changes with courier/tracking fields, customer list.

## Order states
Uses current storefront status values: `pending_payment`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`. UI labels are Payment pending, Accepted, Processing, Shipped, Delivered and Cancelled.

Products referenced by order history are archived instead of hard-deleted.
