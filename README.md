# ConcursoTrack - Next.js

A modern web application for managing Brazilian public exam preparations, built with Next.js 16, React, TypeScript, and Supabase.

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Forms**: react-hook-form + Zod
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Notifications**: Sonner

## 📋 Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun
- A Supabase account

## 🛠️ Installation

### 1. Clone the Repository

```bash
cd concurso-nextjs
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready
3. Note your project URL and anon key from Settings > API

#### Run Database Migrations

Execute the SQL from [`/plans/supabase-setup.md`](../concurso/plans/supabase-setup.md) in your Supabase SQL Editor:

1. Go to SQL Editor in your Supabase dashboard
2. Create a new query
3. Copy and paste the schema from the setup document
4. Run the query

This will create:
- `profiles` table for user data
- `exams` table for exam tracking
- Row Level Security (RLS) policies
- Database functions and triggers

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key

# Application URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important**: Replace the placeholder values with your actual Supabase credentials.

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
concurso-nextjs/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Auth route group
│   │   │   └── auth/
│   │   │       └── page.tsx     # Login/Signup page
│   │   ├── (dashboard)/         # Dashboard route group
│   │   │   ├── layout.tsx       # Dashboard layout with sidebar
│   │   │   └── dashboard/
│   │   │       ├── page.tsx     # Dashboard home
│   │   │       └── exams/
│   │   │           ├── page.tsx           # Exam list
│   │   │           ├── new/page.tsx       # Create exam
│   │   │           └── [id]/page.tsx      # Edit exam
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Landing page
│   │   ├── not-found.tsx        # 404 page
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── landing/            # Landing page components
│   │   └── ui/                 # shadcn/ui components
│   ├── lib/
│   │   ├── actions/            # Server Actions
│   │   │   ├── auth.ts         # Auth actions
│   │   │   └── exams.ts        # Exam CRUD actions
│   │   ├── schemas/            # Zod validation schemas
│   │   │   ├── auth.ts         # Auth schemas
│   │   │   └── exam.ts         # Exam schemas
│   │   ├── supabase/           # Supabase clients
│   │   │   ├── client.ts       # Browser client
│   │   │   ├── server.ts       # Server client
│   │   │   └── middleware.ts   # Middleware helper
│   │   └── utils.ts            # Utility functions
│   ├── hooks/                  # Custom React hooks
│   └── types/                  # TypeScript types
├── middleware.ts               # Next.js middleware (route protection)
├── next.config.mjs            # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```

## 🔑 Key Features

### Authentication
- Email/password signup and login
- Password reset functionality
- Protected routes with middleware
- Server-side session management
- Profile creation on signup

### Exam Management
- Create, read, update, delete exams
- Track exam status (waiting, registered, taken, approved, rejected)
- Manage important dates (registration, payment, exam, results)
- Document checklist per exam
- Filter and search exams

### Dashboard
- Stats overview (total exams, registered, upcoming, completed)
- Upcoming deadlines widget
- Visual exam cards with progress indicators

## 🏗️ Architecture Highlights

### Server Components
- Landing page, dashboard, and exam list use Server Components
- Data fetching happens on the server
- No loading spinners for initial render
- Better SEO and performance

### Client Components
- Interactive forms and UI elements
- Marked with `"use client"` directive
- Uses react-hook-form for form management
- Zod validation for type-safe input

### Server Actions
- Form mutations handled with Server Actions
- `createExam()`, `updateExam()`, `deleteExam()`
- `login()`, `signup()`, `logout()`
- Automatic revalidation

### Middleware Protection
- Routes starting with `/dashboard` require authentication
- Automatic redirect to `/auth` if not authenticated
- Session refresh on each request

## 🧪 Testing the Application

### Manual Testing Checklist

1. **Landing Page** (`/`)
   - [ ] Page loads correctly
   - [ ] Navigation works
   - [ ] CTA buttons navigate to auth

2. **Authentication** (`/auth`)
   - [ ] Sign up with email/password
   - [ ] Log in with credentials
   - [ ] Validation errors display correctly
   - [ ] Redirect to dashboard after login

3. **Dashboard** (`/dashboard`)
   - [ ] Protected route (requires login)
   - [ ] Stats display correctly
   - [ ] Sidebar navigation works

4. **Exam List** (`/dashboard/exams`)
   - [ ] Exams display in cards
   - [ ] Search and filter work
   - [ ] Click card navigates to edit page

5. **Create Exam** (`/dashboard/exams/new`)
   - [ ] Form validation works
   - [ ] Dates validate correctly
   - [ ] Documents can be added/removed
   - [ ] Success creates exam and redirects

6. **Edit Exam** (`/dashboard/exams/[id]`)
   - [ ] Exam data pre-populates form
   - [ ] Updates save correctly
   - [ ] Delete removes exam
   - [ ] Confirmation dialog works

7. **Logout**
   - [ ] Logout button works
   - [ ] Redirects to landing page
   - [ ] Cannot access dashboard after logout

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   Add these in Vercel's environment variables section:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_key
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live!

### Alternative Deployment Options

- **Netlify**: Also supports Next.js
- **Railway**: Good for full-stack apps
- **Docker**: Use the included Dockerfile (if added)
- **Self-hosted**: Deploy on any Node.js server

## 📊 Database Schema

### `profiles` Table
```sql
- id (uuid, primary key, references auth.users)
- email (text, unique, not null)
- full_name (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### `exams` Table
```sql
- id (uuid, primary key)
- user_id (uuid, references profiles)
- name (text, not null)
- public_body (text, not null)
- position (text, not null)
- exam_board (text)
- city (text)
- state (text)
- status (text, not null)
- registration_open (date)
- registration_deadline (date)
- payment_deadline (date)
- exam_date (date)
- results_date (date)
- documents (jsonb, default [])
- created_at (timestamp)
- updated_at (timestamp)
```

## 🔒 Security

### Row Level Security (RLS)
- Users can only access their own exams
- All queries automatically filtered by user_id
- Profile data protected

### Authentication
- Passwords hashed by Supabase
- Session tokens stored in HTTP-only cookies
- Middleware validates sessions server-side

### Input Validation
- Zod schemas validate all form inputs
- Server-side validation in Server Actions
- Cross-field validation (dates, etc.)

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for CSS variables
- Update `tailwind.config.ts` for theme changes
- Design tokens support light/dark mode

### Components
- shadcn/ui components are customizable
- Located in `src/components/ui/`
- Can be modified directly

### Forms
- Zod schemas in `src/lib/schemas/`
- Update schemas to add/remove fields
- react-hook-form handles form state

## 📚 Learn More

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

### Supabase
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

### UI Libraries
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)

## 🐛 Troubleshooting

### "Failed to fetch" errors
- Check your Supabase credentials in `.env.local`
- Ensure RLS policies are set up correctly
- Verify your Supabase project is active

### Authentication not working
- Check NEXT_PUBLIC_SITE_URL matches your domain
- Verify Supabase Auth is enabled
- Check browser console for errors

### Build errors
- Run `npm run build` locally to test
- Check TypeScript errors with `npm run type-check`
- Ensure all environment variables are set

### Styling issues
- Clear `.next` folder and rebuild
- Check Tailwind configuration
- Verify CSS variables in globals.css

## 🤝 Contributing

This is a migrated version of the ConcursoTrack application. The original React + Vite version is in the parent directory.

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the documentation in `/plans/` directory
3. Check Supabase logs in your dashboard
4. Review Next.js and Supabase documentation

---

**Built with ❤️ using Next.js 16 and Supabase**
