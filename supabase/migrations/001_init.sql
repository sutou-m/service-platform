-- ─── Enums ─────────────────────────────────────────────────────────────────

create type user_role as enum ('ADMIN', 'CONTRACTOR');
create type inquiry_status as enum ('NEW', 'CONVERTED', 'CLOSED');
create type contractor_status as enum ('PENDING', 'ACTIVE', 'INACTIVE');
create type order_status as enum (
  'NEW', 'VISIT_SCHEDULING', 'WORK_SCHEDULED', 'WORKING',
  'WORK_DONE', 'INVOICED', 'PAID', 'CLOSED'
);
create type invoice_status as enum ('UNPAID', 'PARTIAL', 'PAID');

-- ─── NextAuth ───────────────────────────────────────────────────────────────

create table if not exists users (
  id            text primary key,
  name          text,
  email         text unique not null,
  email_verified timestamptz,
  image         text,
  password      text,
  role          user_role not null default 'ADMIN',
  created_at    timestamptz not null default now()
);

create table if not exists accounts (
  id                  text primary key,
  user_id             text not null references users(id) on delete cascade,
  type                text not null,
  provider            text not null,
  provider_account_id text not null,
  refresh_token       text,
  access_token        text,
  expires_at          integer,
  token_type          text,
  scope               text,
  id_token            text,
  session_state       text,
  unique (provider, provider_account_id)
);

create table if not exists sessions (
  id            text primary key,
  session_token text unique not null,
  user_id       text not null references users(id) on delete cascade,
  expires       timestamptz not null
);

create table if not exists verification_tokens (
  identifier text not null,
  token      text unique not null,
  expires    timestamptz not null,
  unique (identifier, token)
);

-- ─── Customer ───────────────────────────────────────────────────────────────

create table if not exists customers (
  id         text primary key,
  name       text not null,
  phone      text not null,
  email      text unique not null,
  address    text,
  memo       text,
  created_at timestamptz not null default now()
);

-- ─── Inquiry ────────────────────────────────────────────────────────────────

create table if not exists inquiries (
  id           text primary key,
  name         text not null,
  phone        text not null,
  email        text not null,
  address      text not null,
  work_content text not null,
  preferred_at timestamptz,
  notes        text,
  photo_urls   text[] not null default '{}',
  status       inquiry_status not null default 'NEW',
  memo         text,
  created_at   timestamptz not null default now(),
  customer_id  text references customers(id)
);

-- ─── Contractor ─────────────────────────────────────────────────────────────

create table if not exists contractors (
  id             text primary key,
  company_name   text not null,
  owner_name     text not null,
  address        text not null,
  phone          text not null,
  email          text unique not null,
  areas          text[] not null default '{}',
  service_types  text[] not null default '{}',
  bio            text,
  status         contractor_status not null default 'PENDING',
  credit_balance integer not null default 0,
  credit_limit   integer not null default 0,
  user_id        text unique references users(id),
  created_at     timestamptz not null default now()
);

-- ─── Order ──────────────────────────────────────────────────────────────────

create table if not exists orders (
  id             text primary key,
  customer_id    text not null references customers(id),
  inquiry_id     text unique references inquiries(id),
  contractor_id  text references contractors(id),
  work_content   text not null,
  work_address   text not null,
  visit_at       timestamptz,
  work_at        timestamptz,
  status         order_status not null default 'NEW',
  internal_memo  text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists order_status_history (
  id         text primary key,
  order_id   text not null references orders(id),
  status     order_status not null,
  changed_at timestamptz not null default now(),
  changed_by text
);

-- ─── OrderReport ────────────────────────────────────────────────────────────

create table if not exists order_reports (
  id            text primary key,
  order_id      text not null references orders(id),
  contractor_id text not null references contractors(id),
  worked_at     timestamptz not null,
  content       text not null,
  photo_urls    text[] not null default '{}',
  created_at    timestamptz not null default now()
);

-- ─── Invoice / InvoiceItem / Payment ────────────────────────────────────────

create table if not exists invoices (
  id           text primary key,
  order_id     text not null references orders(id),
  customer_id  text not null references customers(id),
  issue_date   timestamptz not null default now(),
  due_date     timestamptz,
  total_amount integer not null,
  status       invoice_status not null default 'UNPAID',
  created_at   timestamptz not null default now()
);

create table if not exists invoice_items (
  id          text primary key,
  invoice_id  text not null references invoices(id),
  description text not null,
  quantity    integer not null,
  unit_price  integer not null,
  amount      integer not null
);

create table if not exists payments (
  id         text primary key,
  invoice_id text not null references invoices(id),
  amount     integer not null,
  paid_at    timestamptz not null,
  note       text
);

-- ─── CmsPost ────────────────────────────────────────────────────────────────

create table if not exists cms_posts (
  id           text primary key,
  title        text not null,
  slug         text unique not null,
  description  text,
  content      text not null,
  image_urls   text[] not null default '{}',
  area         text,
  service_type text,
  completed_at timestamptz,
  published    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ─── Notification ───────────────────────────────────────────────────────────

create table if not exists notifications (
  id      text primary key,
  type    text not null,
  payload jsonb not null,
  sent_at timestamptz not null default now(),
  success boolean not null
);

-- ─── SystemConfig ────────────────────────────────────────────────────────────

create table if not exists system_configs (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);
