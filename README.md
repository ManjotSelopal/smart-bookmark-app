# Smart Bookmark App

A simple realtime bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Live App
Paste your Vercel URL here

## GitHub Repo
Paste your GitHub repo link here

---

## Features

- Google OAuth login (Supabase Auth)
- Add bookmarks (title + URL)
- Bookmarks are private per user (Row Level Security)
- Realtime updates across browser tabs
- Delete bookmarks
- Deployed on Vercel

---

## Tech Stack

- Next.js (App Router)
- Supabase Auth
- Supabase Postgres
- Supabase Realtime
- Tailwind CSS
- Vercel

---

## Challenges Faced

### Google OAuth configuration
Initially, Supabase showed “provider not enabled”. This was fixed by correctly adding the Google Client ID and Client Secret in the Supabase Authentication provider settings.

### Environment variables in Vercel
Deployment failed due to incorrect environment variable names. Fixed by using:
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

### Realtime updates
Realtime updates did not work initially until replication was enabled for the bookmarks table in Supabase.

### Windows npm execution policy
npm scripts were blocked in PowerShell. Fixed by running:
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

---

## Run locally

npm install
npm run dev
