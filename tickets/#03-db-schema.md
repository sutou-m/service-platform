# #03 DB スキーマ設計・Prisma 設定

## 概要

Prisma v7 でスキーマを定義し、Supabase（PostgreSQL）に適用する。
`prisma/schema.prisma` に全テーブルを記述し、`prisma migrate dev` で反映する。

## 対象ファイル

- `prisma/schema.prisma`
- `prisma/seed.ts`（初期マスタデータ投入）
- `lib/prisma.ts`（PrismaClient シングルトン）

## タスク

### PrismaClient シングルトン（`lib/prisma.ts`）

- [ ] 開発時のホットリロードで接続が増殖しないよう `global` キャッシュパターンで実装

### `prisma/schema.prisma` のモデル定義

以下のモデルを定義する（リレーションを含む）。

#### `User`（NextAuth 用）

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  role          UserRole  @default(ADMIN)
  createdAt     DateTime  @default(now())
  accounts      Account[]
  sessions      Session[]
}

enum UserRole {
  ADMIN
  CONTRACTOR
}
```

#### NextAuth テーブル群

- [ ] `Account`, `Session`, `VerificationToken`（NextAuth Prisma Adapter 標準スキーマ）

#### `Inquiry`（問い合わせ）

```prisma
model Inquiry {
  id          String        @id @default(cuid())
  name        String
  phone       String
  email       String
  address     String
  workContent String
  preferredAt DateTime?
  notes       String?
  photoUrls   String[]
  status      InquiryStatus @default(NEW)
  memo        String?
  createdAt   DateTime      @default(now())
  order       Order?
  customerId  String?
  customer    Customer?     @relation(fields: [customerId], references: [id])
}

enum InquiryStatus {
  NEW
  CONVERTED
  CLOSED
}
```

#### `Customer`（顧客）

```prisma
model Customer {
  id        String    @id @default(cuid())
  name      String
  phone     String
  email     String    @unique
  address   String?
  memo      String?
  createdAt DateTime  @default(now())
  inquiries Inquiry[]
  orders    Order[]
  invoices  Invoice[]
}
```

#### `Contractor`（登録業者）

```prisma
model Contractor {
  id              String            @id @default(cuid())
  companyName     String
  ownerName       String
  address         String
  phone           String
  email           String            @unique
  areas           String[]
  serviceTypes    String[]
  bio             String?
  status          ContractorStatus  @default(PENDING)
  creditBalance   Int               @default(0)
  creditLimit     Int               @default(0)
  userId          String?           @unique
  user            User?             @relation(fields: [userId], references: [id])
  orders          Order[]
  reports         OrderReport[]
  createdAt       DateTime          @default(now())
}

enum ContractorStatus {
  PENDING
  ACTIVE
  INACTIVE
}
```

#### `Order`（案件）

```prisma
model Order {
  id             String      @id @default(cuid())
  customerId     String
  customer       Customer    @relation(fields: [customerId], references: [id])
  inquiryId      String?     @unique
  inquiry        Inquiry?    @relation(fields: [inquiryId], references: [id])
  contractorId   String?
  contractor     Contractor? @relation(fields: [contractorId], references: [id])
  workContent    String
  workAddress    String
  visitAt        DateTime?
  workAt         DateTime?
  status         OrderStatus @default(NEW)
  internalMemo   String?
  statusHistory  OrderStatusHistory[]
  reports        OrderReport[]
  invoices       Invoice[]
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
}

enum OrderStatus {
  NEW
  VISIT_SCHEDULING
  WORK_SCHEDULED
  WORKING
  WORK_DONE
  INVOICED
  PAID
  CLOSED
}
```

#### `OrderStatusHistory`

```prisma
model OrderStatusHistory {
  id        String      @id @default(cuid())
  orderId   String
  order     Order       @relation(fields: [orderId], references: [id])
  status    OrderStatus
  changedAt DateTime    @default(now())
  changedBy String?
}
```

#### `OrderReport`（作業報告）

```prisma
model OrderReport {
  id           String     @id @default(cuid())
  orderId      String
  order        Order      @relation(fields: [orderId], references: [id])
  contractorId String
  contractor   Contractor @relation(fields: [contractorId], references: [id])
  workedAt     DateTime
  content      String
  photoUrls    String[]
  createdAt    DateTime   @default(now())
}
```

#### `Invoice`（請求書）・`InvoiceItem`・`Payment`

```prisma
model Invoice {
  id          String        @id @default(cuid())
  orderId     String
  order       Order         @relation(fields: [orderId], references: [id])
  customerId  String
  customer    Customer      @relation(fields: [customerId], references: [id])
  issueDate   DateTime      @default(now())
  dueDate     DateTime?
  totalAmount Int
  status      InvoiceStatus @default(UNPAID)
  items       InvoiceItem[]
  payments    Payment[]
  createdAt   DateTime      @default(now())
}

enum InvoiceStatus {
  UNPAID
  PARTIAL
  PAID
}

model InvoiceItem {
  id          String  @id @default(cuid())
  invoiceId   String
  invoice     Invoice @relation(fields: [invoiceId], references: [id])
  description String
  quantity    Int
  unitPrice   Int
  amount      Int
}

model Payment {
  id        String   @id @default(cuid())
  invoiceId String
  invoice   Invoice  @relation(fields: [invoiceId], references: [id])
  amount    Int
  paidAt    DateTime
  note      String?
}
```

#### `CmsPost`（事例記事）

```prisma
model CmsPost {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String?
  content     String
  imageUrls   String[]
  area        String?
  serviceType String?
  completedAt DateTime?
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### `Notification`（通知ログ）

```prisma
model Notification {
  id        String   @id @default(cuid())
  type      String
  payload   Json
  sentAt    DateTime @default(now())
  success   Boolean
}
```

### マイグレーション・シード

- [ ] `npx prisma migrate dev --name init` で初回マイグレーション作成
- [ ] `prisma/seed.ts` にサービス種別マスタ（配列定数）とテスト用 Admin ユーザーを投入
- [ ] `package.json` に `"prisma": { "seed": "ts-node prisma/seed.ts" }` を追加

## 依存チケット

- なし（#01 と並行可能）
