# Supabase Database Setup

## Your Supabase Connection Details

**Connection URL Format:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.wbpfuwgshznenphtvmwe.supabase.co:5432/postgres
```

**Details:**
- Host: `db.wbpfuwgshznenphtvmwe.supabase.co`
- Port: `5432`
- Database: `postgres`
- User: `postgres`
- Password: *Replace `[YOUR-PASSWORD]` with your actual password*

## Quick Start

### Step 1: Test Connection
```cmd
.\test-supabase-connection.bat
```
Enter your Supabase password when prompted. This will verify the connection works.

### Step 2: Start Server with Supabase
```cmd
.\run-supabase.bat
```
Enter your Supabase password when prompted. The server will start using Supabase PostgreSQL.

### Alternative: Manual Setup (PowerShell)
```powershell
$env:DATABASE_URL = "postgresql://postgres:YOUR_PASSWORD@db.wbpfuwgshznenphtvmwe.supabase.co:5432/postgres"
cd server
node index.js
```

## How to Verify It's Working

When the server starts, you should see:
- ✅ **SUCCESS**: `✅ Connected to PostgreSQL database (Supabase)`
- ❌ **FAILED**: `Connected to SQLite database (local dev)`

## Current Status

❌ **Not using Supabase yet** - Currently using SQLite (local database)

## Finding Your Supabase Password

If you don't know your password:
1. Go to https://supabase.com
2. Log into your project
3. Go to **Settings** → **Database**
4. Look for "Connection string" section
5. Copy the password or reset it if needed

## Deployment (Render/Fly.io/etc.)

When deploying, set this environment variable:
- **Key**: `DATABASE_URL`
- **Value**: `postgresql://postgres:YOUR_PASSWORD@db.wbpfuwgshznenphtvmwe.supabase.co:5432/postgres`

Replace `YOUR_PASSWORD` with your actual password.

