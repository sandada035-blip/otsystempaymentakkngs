# School System PRO MAX FULL

Full Next.js + Supabase scaffold for a school management system.

## Features
- Admin / User login
- Dashboard statistics
- Students CRUD
- Teachers CRUD
- Payments CRUD
- 80% teacher / 20% school auto-calculation
- Monthly reports
- CSV export
- Print-ready receipt
- Multi-school database structure
- Mobile responsive UI
- Secure login structure example with `password_hash`

## Default demo accounts
These are inserted by SQL:

- Admin: `admin@school.com` / `123456`
- User: `user@school.com` / `123456`

## Setup
1. Copy `.env.example` to `.env.local`
2. Fill Supabase URL and anon key
3. Run the SQL files in `/sql`
4. Install and run:

```bash
npm install
npm run dev
```

## Deploy
- Upload the whole project to GitHub
- Import the repo into Vercel
- Add environment variables in Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
