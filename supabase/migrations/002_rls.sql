-- ─── Enable RLS on all tables ────────────────────────────────────────────────
-- service_role key (supabaseAdmin) automatically bypasses all RLS policies.
-- Policies below apply only to anon / authenticated (JWT) access.

alter table users                 enable row level security;
alter table accounts              enable row level security;
alter table sessions              enable row level security;
alter table verification_tokens   enable row level security;
alter table customers             enable row level security;
alter table inquiries             enable row level security;
alter table contractors           enable row level security;
alter table orders                enable row level security;
alter table order_status_history  enable row level security;
alter table order_reports         enable row level security;
alter table invoices              enable row level security;
alter table invoice_items         enable row level security;
alter table payments              enable row level security;
alter table cms_posts             enable row level security;
alter table notifications         enable row level security;
alter table system_configs        enable row level security;

-- ─── users: 本人のみ参照可 ───────────────────────────────────────────────────
create policy "users: self select"
  on users for select
  using (id = auth.uid()::text);

-- ─── 管理者（role=ADMIN）: 全テーブルフルアクセス ─────────────────────────────
create policy "customers: admin all"
  on customers for all
  using ((auth.jwt() ->> 'role') = 'ADMIN');

create policy "inquiries: admin all"
  on inquiries for all
  using ((auth.jwt() ->> 'role') = 'ADMIN');

create policy "contractors: admin all"
  on contractors for all
  using ((auth.jwt() ->> 'role') = 'ADMIN');

create policy "orders: admin all"
  on orders for all
  using ((auth.jwt() ->> 'role') = 'ADMIN');

create policy "order_status_history: admin all"
  on order_status_history for all
  using ((auth.jwt() ->> 'role') = 'ADMIN');

create policy "order_reports: admin all"
  on order_reports for all
  using ((auth.jwt() ->> 'role') = 'ADMIN');

create policy "invoices: admin all"
  on invoices for all
  using ((auth.jwt() ->> 'role') = 'ADMIN');

create policy "invoice_items: admin all"
  on invoice_items for all
  using ((auth.jwt() ->> 'role') = 'ADMIN');

create policy "payments: admin all"
  on payments for all
  using ((auth.jwt() ->> 'role') = 'ADMIN');

create policy "cms_posts: admin all"
  on cms_posts for all
  using ((auth.jwt() ->> 'role') = 'ADMIN');

create policy "notifications: admin all"
  on notifications for all
  using ((auth.jwt() ->> 'role') = 'ADMIN');

create policy "system_configs: admin all"
  on system_configs for all
  using ((auth.jwt() ->> 'role') = 'ADMIN');

-- ─── 業者（role=CONTRACTOR）: 自分に関連するデータのみ ────────────────────────

-- 自分の contractor レコードは参照可
create policy "contractors: self select"
  on contractors for select
  using (
    (auth.jwt() ->> 'role') = 'CONTRACTOR'
    and user_id = auth.uid()::text
  );

-- 担当 orders のみ参照可
create policy "orders: contractor select own"
  on orders for select
  using (
    (auth.jwt() ->> 'role') = 'CONTRACTOR'
    and contractor_id = (
      select id from contractors
      where user_id = auth.uid()::text
      limit 1
    )
  );

-- 担当 order_reports のみ参照・投稿可
create policy "order_reports: contractor select own"
  on order_reports for select
  using (
    (auth.jwt() ->> 'role') = 'CONTRACTOR'
    and contractor_id = (
      select id from contractors
      where user_id = auth.uid()::text
      limit 1
    )
  );

create policy "order_reports: contractor insert own"
  on order_reports for insert
  with check (
    (auth.jwt() ->> 'role') = 'CONTRACTOR'
    and contractor_id = (
      select id from contractors
      where user_id = auth.uid()::text
      limit 1
    )
  );
