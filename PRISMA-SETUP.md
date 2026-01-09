# 🔷 Prisma + Supabase Setup Guide

Complete guide for using Prisma ORM with Supabase PostgreSQL.

## 🎯 Why Prisma + Supabase?

- ✅ **Type-safe database queries** with auto-completion
- ✅ **Prisma Studio** for database GUI
- ✅ **Schema-first development** with migrations
- ✅ **Supabase Auth** for authentication (keep the best of both)
- ✅ **Row Level Security** still works
- ✅ **Better DX** than raw SQL queries

## 📋 Prerequisites

1. Supabase project created
2. SQL schema already run (`supabase-schema.sql`)
3. Environment variables configured

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Database Connection Strings

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Scroll down to **Connection string**
4. You need **two** connection strings:

#### Connection Pooler (for Prisma)
```
Mode: Session
Format: URI
Copy the string that looks like:
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

#### Direct Connection (for Migrations)
```
Mode: Direct connection
Format: URI
Copy the string that looks like:
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

### Step 2: Configure Environment Variables

Update your `.env.local`:

```env
# Supabase (keep these for Auth)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Prisma Database URLs
DATABASE_URL="postgresql://postgres.xxxxx:[PASSWORD]@aws-0-region.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres"

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **Replace `[PASSWORD]` with your actual database password from Supabase!**

### Step 3: Install and Generate Prisma Client

```bash
cd /home/lucasmelo/Documentos/concurso-nextjs

# Install dependencies (if not done yet)
npm install

# Generate Prisma Client
npm run prisma:generate

# Expected output:
# ✔ Generated Prisma Client to ./node_modules/@prisma/client
```

### Step 4: Introspect Existing Database

Since we already created tables via SQL, we need to sync Prisma schema:

```bash
# Pull existing database schema into Prisma
npm run prisma:pull

# This updates prisma/schema.prisma to match your database
```

### Step 5: Push Prisma Schema (if needed)

If you modified `prisma/schema.prisma`:

```bash
# Push changes to database
npm run prisma:push

# This syncs your Prisma schema to the database
```

### Step 6: Verify Setup

```bash
# Open Prisma Studio (Database GUI)
npm run prisma:studio

# This opens http://localhost:5555
# You can view and edit data visually!
```

## 📊 Prisma Schema Explained

Our [`prisma/schema.prisma`](./prisma/schema.prisma) defines:

### Profile Model
```prisma
model Profile {
  id        String   @id @db.Uuid
  email     String   @unique
  fullName  String?  @map("full_name")
  // ... more fields
  exams     Exam[]   // One-to-many relationship
}
```

### Exam Model
```prisma
model Exam {
  id                     String    @id @default(dbgenerated("uuid_generate_v4()"))
  userId                 String    @map("user_id") @db.Uuid
  name                   String
  // ... more fields
  documents              Json      @default("[]")
  profile                Profile   @relation(fields: [userId], references: [id])
}
```

## 🔨 Using Prisma in Your Code

### Import Prisma Client

```typescript
import { prisma } from '@/lib/prisma';
```

### Example Queries

#### Get all exams for a user
```typescript
const exams = await prisma.exam.findMany({
  where: { userId: user.id },
  orderBy: { createdAt: 'desc' },
});
```

#### Get single exam
```typescript
const exam = await prisma.exam.findUnique({
  where: { id: examId },
  include: { profile: true }, // Include related profile
});
```

#### Create exam
```typescript
const exam = await prisma.exam.create({
  data: {
    userId: user.id,
    name: 'My Exam',
    publicBody: 'TRF',
    position: 'Analyst',
    status: 'waiting',
    documents: [],
  },
});
```

#### Update exam
```typescript
const updated = await prisma.exam.update({
  where: { id: examId },
  data: {
    status: 'registered',
    registrationDeadline: new Date('2024-12-31'),
  },
});
```

#### Delete exam
```typescript
await prisma.exam.delete({
  where: { id: examId },
});
```

#### Complex query with filters
```typescript
const exams = await prisma.exam.findMany({
  where: {
    userId: user.id,
    status: 'registered',
    examDate: {
      gte: new Date(), // Greater than or equal to today
    },
  },
  orderBy: { examDate: 'asc' },
  take: 10, // Limit to 10 results
});
```

## 📦 Available Prisma Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| Generate | `npm run prisma:generate` | Generate Prisma Client |
| Studio | `npm run prisma:studio` | Open database GUI |
| Push | `npm run prisma:push` | Push schema to DB (dev) |
| Pull | `npm run prisma:pull` | Pull schema from DB |
| Migrate | `npm run prisma:migrate` | Create migration |
| Deploy | `npm run prisma:deploy` | Deploy migrations (prod) |

## 🔄 Migration Workflow

### Development (Schema-first approach)

1. **Edit Prisma Schema**
   ```bash
   # Edit prisma/schema.prisma
   # Add new model or fields
   ```

2. **Create Migration**
   ```bash
   npm run prisma:migrate
   # Name: add_notes_to_exams
   ```

3. **Apply Migration**
   ```bash
   # Automatically applied in dev
   # Check prisma/migrations/ folder
   ```

4. **Generate Client**
   ```bash
   npm run prisma:generate
   ```

### Production Deployment

```bash
# In your CI/CD or deployment script
npm run prisma:deploy  # Applies migrations
npm run prisma:generate  # Generates client
```

## 🎨 Prisma Studio Usage

```bash
npm run prisma:studio
```

Opens at `http://localhost:5555`

### What you can do:
- ✅ View all records in tables
- ✅ Edit data visually
- ✅ Add new records
- ✅ Delete records
- ✅ Test queries
- ✅ No SQL required!

## 🔒 Security with Prisma + Supabase

### Row Level Security (RLS) Still Works!

Even though you're using Prisma, Supabase RLS policies still apply:

1. **Always get userId from Supabase Auth**
2. **Filter queries by userId**
3. **RLS blocks unauthorized access at database level**

### Example: Server Action with RLS

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function getUserExams() {
  // Get authenticated user from Supabase Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }

  // Query with Prisma, filtered by userId
  // RLS ensures only this user's data is returned
  const exams = await prisma.exam.findMany({
    where: { userId: user.id },
  });

  return exams;
}
```

## 🆚 Prisma vs Supabase Client

### When to use Prisma:
- ✅ Complex queries with joins
- ✅ Type-safe database operations
- ✅ Database migrations
- ✅ Server Components and Server Actions
- ✅ Better auto-completion

### When to use Supabase Client:
- ✅ Authentication (always)
- ✅ Real-time subscriptions
- ✅ Storage (file uploads)
- ✅ Edge Functions

### Hybrid Approach (Best Practice):
```typescript
// Authentication with Supabase
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();

// Database queries with Prisma
const exams = await prisma.exam.findMany({
  where: { userId: user.id },
});
```

## 🐛 Troubleshooting

### "Environment variable not found: DATABASE_URL"

**Solution:**
```bash
# Check .env.local exists
cat .env.local

# Add DATABASE_URL
echo 'DATABASE_URL="postgresql://..."' >> .env.local

# Restart dev server
npm run dev
```

### "Can't reach database server"

**Solution:**
1. Check Supabase project is active
2. Verify DATABASE_URL is correct
3. Check firewall/VPN isn't blocking connection
4. Try DIRECT_URL instead

### "Prisma schema is out of sync"

**Solution:**
```bash
# Pull latest schema from database
npm run prisma:pull

# Regenerate client
npm run prisma:generate
```

### "Migration failed"

**Solution:**
```bash
# Reset local database (dev only!)
npm run prisma:push --force-reset

# Or manually fix in Supabase SQL Editor
```

## 📚 Prisma Best Practices

### 1. Use Transactions for Multiple Operations
```typescript
await prisma.$transaction([
  prisma.exam.create({ data: examData }),
  prisma.profile.update({ where: { id }, data: profileData }),
]);
```

### 2. Select Only Needed Fields
```typescript
const exams = await prisma.exam.findMany({
  select: {
    id: true,
    name: true,
    status: true,
    // Don't fetch all fields if not needed
  },
});
```

### 3. Use Indexes for Performance
```prisma
@@index([userId])
@@index([status])
@@index([examDate])
```

### 4. Handle Errors Properly
```typescript
try {
  const exam = await prisma.exam.create({ data });
} catch (error) {
  if (error.code === 'P2002') {
    // Unique constraint violation
  }
  throw error;
}
```

## 🎯 Next Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   # Add DATABASE_URL and DIRECT_URL
   ```

3. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

4. **Open Prisma Studio**
   ```bash
   npm run prisma:studio
   ```

5. **Start developing**
   ```bash
   npm run dev
   ```

## 📖 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma + Next.js](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Prisma + Supabase](https://www.prisma.io/docs/guides/database/supabase)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)

---

**Setup Time:** ~5 minutes
**Difficulty:** 🟢 Easy
**Status:** Production-ready with Supabase Auth + Prisma ORM
