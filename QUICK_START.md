# Quick Start Guide - ConcursoTrack Next.js

## ⚡ Fast Track to Development

### Current Status
✅ **Foundation Complete (40%)**
- Next.js 16 project configured
- All dependencies installed
- Supabase clients configured
- Zod schemas created
- Server Actions implemented
- Global styles migrated
- Components copied

⚠️ **Pages Need Migration (60%)**
- Landing page
- Auth page
- Dashboard pages

---

## 🚀 Get Started in 3 Steps

### Step 1: Set Up Supabase (5 minutes)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to SQL Editor
4. Copy and run this schema:

```sql
-- Open plans/supabase-setup.md
-- Copy the entire SQL schema
-- Paste and execute in Supabase SQL Editor
```

5. Get your credentials from Project Settings → API:
   - Project URL
   - Anon key

### Step 2: Configure Environment (1 minute)

```bash
cd /home/lucasmelo/Documentos/concurso-nextjs
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJxxxx...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 3: Run Development Server (30 seconds)

```bash
npm run dev
```

Open http://localhost:3000

---

## 📝 Next Development Tasks (Priority Order)

### Task 1: Create Root Layout (30 min)
**File:** `src/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "ConcursoTrack - Gerencie seus concursos",
  description: "Organize sua jornada de concurseiro",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${outfit.variable}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

**Location:** `/home/lucasmelo/Documentos/concurso-nextjs/src/app/layout.tsx`

---

### Task 2: Migrate Landing Page (1 hour)
**File:** `src/app/page.tsx`

**Source:** `/home/lucasmelo/Documentos/concurso/src/pages/Landing.tsx`

**Key Changes:**
- Remove `react-router-dom` imports
- Replace with `next/link`
- Keep as Server Component (no "use client")
- Migrate Navbar, Hero, Features, Footer components
- Mark Navbar as Client Component (has interactive elements)

**Steps:**
1. Read original Landing.tsx
2. Create new app/page.tsx
3. Import components from components/landing/
4. Update navigation links to Next.js format

---

### Task 3: Create Auth Page with react-hook-form (2 hours)
**File:** `src/app/(auth)/auth/page.tsx`

**Source:** `/home/lucasmelo/Documentos/concurso/src/pages/Auth.tsx`

**Critical Pattern:**
```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, signupSchema } from "@/lib/schemas/auth";
import { login, signup } from "@/lib/actions/auth";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  const form = useForm({
    resolver: zodResolver(mode === "login" ? loginSchema : signupSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(mode === "signup" && { name: "" })
    }
  });

  async function onSubmit(data) {
    const result = mode === "login"
      ? await login(data)
      : await signup(data);

    if (result?.error) {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields using form.register() */}
    </form>
  );
}
```

**Steps:**
1. Copy Auth.tsx structure
2. Replace ALL useState for form data with useForm
3. Use form.register() for inputs
4. Call Server Actions on submit
5. Add "use client" directive

---

### Task 4: Create Dashboard Layout (1 hour)
**File:** `src/app/(dashboard)/layout.tsx`

**Features:**
- Sidebar integration
- User menu
- Protected route (middleware handles auth check)

**Steps:**
1. Copy DashboardLayout component
2. Mark as Client Component
3. Update navigation to Next.js Link
4. Add user session display

---

### Task 5: Migrate Dashboard Pages (3 hours)

#### 5a. Dashboard Home
**File:** `src/app/(dashboard)/dashboard/page.tsx`
- Server Component
- Fetch exams with `await getUserExams()`
- No useEffect needed

#### 5b. Exam List
**File:** `src/app/(dashboard)/dashboard/exams/page.tsx`
- Server Component for data
- Client components for filters/interactions

#### 5c. New Exam Form
**File:** `src/app/(dashboard)/dashboard/exams/new/page.tsx`
- Client Component
- Use react-hook-form + examSchema
- Call createExam Server Action

#### 5d. Exam Detail/Edit
**File:** `src/app/(dashboard)/dashboard/exams/[id]/page.tsx`
- Server Component wrapper
- Client form component for editing

---

## 🎯 Code Patterns Reference

### ✅ Correct Patterns

**Forms:**
```tsx
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: {...}
});
```

**Data Fetching (Server Component):**
```tsx
async function Page() {
  const { data } = await getUserExams();
  return <div>...</div>;
}
```

**Navigation:**
```tsx
import Link from "next/link";
<Link href="/dashboard">Dashboard</Link>
```

**Client Component:**
```tsx
"use client";
import { useState } from "react";
```

### ❌ Avoid These Patterns

**DON'T use useState for forms:**
```tsx
const [formData, setFormData] = useState({...}); // ❌
```

**DON'T use useEffect for data fetching:**
```tsx
useEffect(() => { fetchData(); }, []); // ❌
```

**DON'T use React Router:**
```tsx
import { Link } from "react-router-dom"; // ❌
```

---

## 📁 File Locations

### Original Project
`/home/lucasmelo/Documentos/concurso/`

### New Project
`/home/lucasmelo/Documentos/concurso-nextjs/`

### Documentation
- Migration Plan: `plans/nextjs-migration-plan.md`
- Supabase Setup: `plans/supabase-setup.md`
- Form Patterns: `plans/react-hook-form-patterns.md`
- Progress Tracker: `MIGRATION_PROGRESS.md`

---

## 🆘 Common Issues

### Issue: "User not authenticated"
**Solution:** Set up Supabase and configure .env.local

### Issue: Form validation not working
**Solution:** Check zodResolver is imported and schema is correct

### Issue: Server Action returns undefined
**Solution:** Check Supabase credentials and RLS policies

### Issue: TypeScript errors
**Solution:** Run `npm run type-check` to see all errors

---

## 📞 Need Help?

1. Check `MIGRATION_PROGRESS.md` for current status
2. Read `plans/react-hook-form-patterns.md` for form examples
3. See `plans/supabase-setup.md` for database setup
4. Review completed Server Actions in `src/lib/actions/`

---

**Ready to continue? Start with Task 1: Create Root Layout! 🚀**
