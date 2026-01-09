# 🔄 Database Migrations Guide

This guide explains how to run and manage database migrations for ConcursoTrack.

## 🎯 Quick Start - Run Initial Migration

### Method 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase project**
   ```
   https://app.supabase.com/project/YOUR-PROJECT-ID
   ```

2. **Open SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New query" button

3. **Run the schema**
   ```bash
   # Copy the SQL file
   cat supabase-schema.sql
   ```
   - Select ALL the SQL content
   - Paste into SQL Editor
   - Click "Run" button (or Ctrl+Enter / Cmd+Enter)

4. **Verify it worked**
   ```bash
   npm run db:status
   ```

### Method 2: Using Supabase CLI

```bash
# 1. Install Supabase CLI (if not installed)
npm install -g supabase

# 2. Login to Supabase
npx supabase login

# 3. Link your project
npx supabase link --project-ref your-project-ref

# 4. Apply the migration
npx supabase db push
```

### Method 3: Using npm script (GUI reminder)

```bash
npm run db:push
# This shows a reminder to copy and paste in Supabase
```

## 📂 Migration File Structure

The project uses this structure:

```
concurso-nextjs/
├── supabase-schema.sql          # Initial schema (run once)
├── supabase/
│   └── migrations/              # Future migrations go here
│       ├── 20260108000000_initial_schema.sql
│       ├── 20260109000000_add_exam_notes.sql
│       └── 20260110000000_add_notifications.sql
└── scripts/
    ├── check-db.js              # Verify database
    └── run-migration.js         # Run migrations locally
```

## 🆕 Creating New Migrations

### When to create a migration:
- Adding new tables
- Adding new columns
- Changing column types
- Adding indexes
- Updating RLS policies
- Adding triggers or functions

### How to create a migration:

1. **Create migration file**
   ```bash
   # Create supabase/migrations directory
   mkdir -p supabase/migrations
   
   # Create new migration file (use timestamp)
   touch supabase/migrations/$(date +%Y%m%d%H%M%S)_your_migration_name.sql
   ```

2. **Write your migration**
   ```sql
   -- supabase/migrations/20260109120000_add_exam_notes.sql
   
   -- Add notes column to exams table
   ALTER TABLE exams 
   ADD COLUMN notes TEXT;
   
   -- Create index for faster searches
   CREATE INDEX exams_notes_idx ON exams USING gin(to_tsvector('portuguese', notes));
   ```

3. **Test locally first** (if using Supabase CLI)
   ```bash
   npx supabase db reset  # Resets local DB
   npx supabase db push   # Applies all migrations
   ```

4. **Apply to production**
   - Go to Supabase Dashboard → SQL Editor
   - Copy and paste your migration SQL
   - Click Run
   - Or use: `npx supabase db push --db-url your-production-url`

## 🔄 Migration Best Practices

### ✅ DO:
- **Always backup first**: Supabase has automatic backups, but be safe
- **Test locally**: Test migrations on a development project first
- **Use transactions**: Wrap in `BEGIN;` and `COMMIT;` for safety
- **Add comments**: Explain what each migration does
- **Use timestamps**: Name files with timestamp prefix
- **Make incremental changes**: Small migrations are easier to debug
- **Keep rollback in mind**: Document how to undo if needed

### ❌ DON'T:
- Don't delete data without backup
- Don't change column types without migration path
- Don't remove columns that might be in use
- Don't skip testing
- Don't apply untested SQL to production

## 📋 Example Migrations

### Example 1: Add new column

```sql
-- supabase/migrations/20260109120000_add_exam_notes.sql

BEGIN;

-- Add notes column
ALTER TABLE exams 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add comment
COMMENT ON COLUMN exams.notes IS 'Personal notes about the exam';

COMMIT;
```

### Example 2: Create new table

```sql
-- supabase/migrations/20260109130000_create_notifications.sql

BEGIN;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  exam_id UUID REFERENCES exams ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deadline', 'reminder', 'result')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX notifications_user_id_idx ON notifications(user_id);
CREATE INDEX notifications_is_read_idx ON notifications(is_read);

COMMIT;
```

### Example 3: Modify existing table

```sql
-- supabase/migrations/20260109140000_add_exam_status_dates.sql

BEGIN;

-- Add new columns for tracking status changes
ALTER TABLE exams 
ADD COLUMN IF NOT EXISTS registered_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS taken_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS result_at TIMESTAMP WITH TIME ZONE;

-- Add comments
COMMENT ON COLUMN exams.registered_at IS 'When user registered for exam';
COMMENT ON COLUMN exams.taken_at IS 'When user took the exam';
COMMENT ON COLUMN exams.result_at IS 'When results were published';

-- Create function to auto-update status dates
CREATE OR REPLACE FUNCTION update_exam_status_dates()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'registered' AND OLD.status != 'registered' THEN
    NEW.registered_at = NOW();
  END IF;
  
  IF NEW.status = 'taken' AND OLD.status != 'taken' THEN
    NEW.taken_at = NOW();
  END IF;
  
  IF NEW.status IN ('approved', 'rejected') AND OLD.status NOT IN ('approved', 'rejected') THEN
    NEW.result_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS exam_status_dates ON exams;
CREATE TRIGGER exam_status_dates
  BEFORE UPDATE ON exams
  FOR EACH ROW
  EXECUTE FUNCTION update_exam_status_dates();

COMMIT;
```

## 🔧 Migration Commands

### Check current state
```bash
npm run db:status
```

### Generate types after migration
```bash
export PROJECT_ID=your-project-id
npm run db:types
```

### Verify schema
```bash
# Check tables exist
npm run db:status

# Check specific table
npx supabase db diff --linked
```

## 🚨 Rollback Procedures

If a migration fails or causes issues:

### Method 1: Using Supabase Dashboard
1. Go to Database → Backups
2. Restore from before migration
3. Fix the migration SQL
4. Try again

### Method 2: Write rollback migration
```sql
-- supabase/migrations/20260109150000_rollback_exam_notes.sql

BEGIN;

-- Remove the column we added
ALTER TABLE exams 
DROP COLUMN IF EXISTS notes;

COMMIT;
```

### Method 3: Manual rollback
```sql
-- Run in SQL Editor to undo specific changes
BEGIN;

-- Example: Remove trigger
DROP TRIGGER IF EXISTS exam_status_dates ON exams;
DROP FUNCTION IF EXISTS update_exam_status_dates();

-- Example: Remove columns
ALTER TABLE exams 
DROP COLUMN IF EXISTS registered_at,
DROP COLUMN IF EXISTS taken_at,
DROP COLUMN IF EXISTS result_at;

COMMIT;
```

## 📊 Migration Tracking

### Keep a migration log:

```markdown
# Migration Log

## 2026-01-08 - Initial Schema
- Created profiles table
- Created exams table  
- Set up RLS policies
- Created triggers
- Status: ✅ Applied

## 2026-01-09 - Add Notes
- Added notes column to exams
- Status: ✅ Applied

## 2026-01-10 - Notifications
- Created notifications table
- Added RLS policies
- Status: 🚧 Pending
```

## 🔍 Verify Migration Success

After running a migration:

```bash
# 1. Check database connection
npm run db:status

# 2. Check in Supabase Dashboard
# - Go to Table Editor
# - Verify new tables/columns exist
# - Check RLS policies tab

# 3. Regenerate types
export PROJECT_ID=your-project-id
npm run db:types

# 4. Test in your app
npm run dev
# Try creating/editing records
```

## 🎯 Current Project Status

Your initial migration is in:
- **File**: `supabase-schema.sql`
- **Status**: Ready to run
- **Contents**:
  - ✅ profiles table
  - ✅ exams table
  - ✅ RLS policies
  - ✅ Triggers
  - ✅ Functions

**To apply it:**
```bash
# Option 1: Dashboard (easiest)
# 1. Go to Supabase → SQL Editor
# 2. Copy supabase-schema.sql
# 3. Paste and Run

# Option 2: Verify after running
npm run db:status
```

## 📚 Additional Resources

- [Supabase Migrations Guide](https://supabase.com/docs/guides/cli/managing-environments)
- [PostgreSQL ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)

---

**Need help?** Check [`DATABASE-SETUP-GUIDE.md`](./DATABASE-SETUP-GUIDE.md) for detailed setup instructions.
