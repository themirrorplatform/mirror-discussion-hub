# The Mirror Discussion Hub - Complete Setup Guide

This guide will help you get The Mirror Discussion Hub up and running locally or in production.

## Prerequisites

- **Node.js** 18+ and npm 9+
- **Supabase Account** (free tier works fine)
- **Git** (for version control)

## Quick Start (5 minutes)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd mirror-discussion-hub
npm install
```

### 2. Set Up Supabase

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details and wait ~2 minutes for provisioning

### 3. Create Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Open `supabase/schema.sql` from this repo
3. Copy all contents and paste into SQL Editor
4. Click "Run" to execute

This creates all tables, indexes, RLS policies, and seed data.

### 4. Configure Storage Buckets

1. Go to **Storage** in Supabase dashboard
2. Create bucket named `avatars` (set to **Public**)
3. Create bucket named `banners` (set to **Public**)

### 5. Set Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. In Supabase dashboard, go to **Settings** → **API**

3. Copy your credentials to `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 6. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Detailed Setup

### Environment Variables

Create a `.env` file in the root directory:

```env
# Required - Get from Supabase Dashboard → Settings → API
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional - Only for server-side admin operations (DO NOT expose in client code)
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

⚠️ **Security:**
- Never commit `.env` to version control (it's in `.gitignore`)
- Never expose service role key in client-side code
- Use environment-specific files for different deployments

### Database Schema Details

The `supabase/schema.sql` file creates:

#### Tables (12)
- `profiles` - User profile info
- `reflections` - Main discussion posts
- `mirrorbacks` - Comments/replies
- `reactions` - User reactions (reflect, appreciate, challenge, save)
- `wishlists` - Community feature requests
- `wishlist_votes` - Votes on wishlists
- `events` - Reflection circles/events
- `event_rsvps` - Event attendance
- `follows` - User relationships
- `points` - Gamification system
- `checklist_items` - Onboarding tasks
- `checklist_progress` - User checklist progress

#### Views (2)
- `leaderboard` - Top users by score
- `profile_stats` - Per-user statistics

#### Security
- Row Level Security (RLS) enabled on all tables
- Policies ensure users can only modify their own content
- Admins can delete any content
- Public read access (reflections are viewable by all)

See `supabase/README.md` for detailed schema documentation.

### Supabase Authentication Setup

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Enable **Email** provider
3. Configure email templates (optional but recommended):
   - Customize confirmation email
   - Set sender name to "The Mirror"
   - Add your branding

4. For development, you can disable email confirmation:
   - Go to **Authentication** → **Settings**
   - Disable "Enable email confirmations"

⚠️ **Production:** Always enable email confirmations in production!

### Storage Policies

Storage buckets need proper policies. The schema already includes RLS for tables, but storage needs separate configuration:

#### Avatars Bucket
```sql
-- Allow public read
CREATE POLICY "Public avatars are viewable by everyone"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Users can upload their own avatars
CREATE POLICY "Users can upload own avatars"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );

-- Users can update their own avatars
CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );

-- Users can delete their own avatars
CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
USING ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );
```

#### Banners Bucket
Same policies as avatars, just replace `'avatars'` with `'banners'`.

You can run these in the SQL Editor or configure via the Supabase dashboard UI under Storage → Policies.

---

## Development

### Available Scripts

```bash
# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Project Structure

```
mirror-discussion-hub/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn/Radix UI components
│   │   ├── figma/          # Figma-exported components
│   │   └── *.tsx           # Feature components
│   ├── lib/
│   │   ├── mirrorApi.ts    # API wrapper for Supabase
│   │   ├── supabaseClient.ts
│   │   └── sanitize.ts     # Input validation & XSS prevention
│   ├── types/
│   │   └── index.ts        # TypeScript type definitions
│   ├── styles/             # CSS and Tailwind config
│   ├── assets/             # Images and static files
│   └── App.tsx             # Main app component
├── supabase/
│   ├── schema.sql          # Complete database schema
│   └── README.md           # Database documentation
├── public/                 # Static assets
├── .env.example            # Environment template
├── package.json
├── vite.config.ts
└── README.md
```

### Key Technologies

- **React 18.3.1** - UI framework
- **TypeScript** - Type safety
- **Vite 6.4.1** - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives
- **Supabase** - Backend (PostgreSQL + Auth + Storage)
- **DOMPurify** - XSS protection

---

## Testing Locally

### Create a Test User

1. Visit your local app at `http://localhost:3000`
2. Enter your email in the sign-in box
3. Click "Send magic link"
4. Check your email and click the link
5. You'll be redirected back and signed in

### Test Core Features

- ✅ Create a reflection
- ✅ Add tags to reflection
- ✅ Post a mirrorback (comment)
- ✅ Create a wishlist idea
- ✅ Echo a wishlist
- ✅ Edit your profile (upload avatar/banner)
- ✅ View leaderboard
- ✅ Check your stats

### Database Inspection

Use the Supabase dashboard to inspect data:

1. Go to **Table Editor**
2. Browse tables: `profiles`, `reflections`, `mirrorbacks`, etc.
3. View user data and verify RLS policies work

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repo
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

Vercel automatically builds with `npm run build` and serves the `/build` directory.

### Deploy to Netlify

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Add new site from Git
4. Set build command: `npm run build`
5. Set publish directory: `build`
6. Add environment variables
7. Deploy!

### Environment Variables for Production

Make sure to add these in your hosting platform's environment config:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Production Checklist

- [ ] Enable email confirmation in Supabase Auth settings
- [ ] Configure custom domain in Supabase (Settings → API → Site URL)
- [ ] Set up proper email templates for auth emails
- [ ] Enable RLS on all tables (already done in schema.sql)
- [ ] Create production environment variables
- [ ] Test magic link authentication works from production domain
- [ ] Verify file uploads to storage buckets work
- [ ] Test all CRUD operations (create, read, update, delete)
- [ ] Check that RLS policies prevent unauthorized access
- [ ] Monitor error logs in Supabase dashboard

---

## Troubleshooting

### Issue: "Supabase env vars are missing"

**Solution:** Check that `.env` file exists and has correct variable names (`VITE_` prefix is required for Vite).

### Issue: "permission denied for table profiles"

**Solution:**
1. Make sure you ran the complete `schema.sql` file
2. Check that RLS is enabled: Go to Authentication → Policies in Supabase
3. Verify policies exist for the `profiles` table

### Issue: Magic link emails not arriving

**Solutions:**
1. Check spam folder
2. Verify email provider settings in Supabase (Auth → Email Templates)
3. For development, disable email confirmation (Auth → Settings)
4. Check Supabase logs (Auth → Logs)

### Issue: File uploads fail

**Solutions:**
1. Verify storage buckets exist (`avatars`, `banners`)
2. Check buckets are set to Public
3. Verify storage policies are configured
4. Check browser console for errors
5. Verify file size < 5MB and type is image/*

### Issue: "Cannot read property of undefined"

**Solution:** This usually means data isn't loading. Check:
1. Supabase URL and anon key are correct
2. Database schema was created successfully
3. Browser console for API errors
4. Network tab for failed requests

### Issue: Leaderboard shows empty or "Anonymous User"

**Solution:**
1. Create some reflections/mirrorbacks to generate points
2. Check that `points` table has entries
3. Verify `leaderboard` view exists (run `SELECT * FROM leaderboard` in SQL Editor)
4. Ensure profiles exist for users

### Issue: Build fails

**Common causes:**
1. TypeScript errors - run `npm run build` to see errors
2. Missing dependencies - run `npm install`
3. Wrong Node version - use Node 18+
4. Import errors - check file paths

---

## Security Best Practices

### ✅ Implemented

- XSS protection via DOMPurify sanitization
- Input validation on all forms
- File upload restrictions (5MB max, images only)
- Row Level Security (RLS) on all database tables
- Parameterized queries (Supabase handles this)
- HTTPS enforced (handled by hosting platform)

### ⚠️ To Configure

1. **Content Security Policy (CSP)**
   - Add CSP headers in your hosting platform
   - Restrict script sources to prevent XSS

2. **Rate Limiting**
   - Configure rate limits in Supabase dashboard
   - Prevent spam and abuse

3. **Email Verification**
   - Enable in production (Auth → Settings)
   - Prevents fake accounts

4. **Monitoring**
   - Set up error tracking (Sentry, LogRocket)
   - Monitor Supabase logs regularly

---

## Performance Optimization

### Current Optimizations

- Vite code splitting and tree shaking
- Gzip compression (109KB JS bundle)
- Parallel data fetching with `Promise.all`
- Supabase query optimization with proper indexes

### Recommended Improvements

1. **Image Optimization**
   ```bash
   npm install sharp
   # Optimize images to WebP format
   # Implement responsive images with srcset
   ```

2. **Lazy Loading**
   ```tsx
   const VideoCard = lazy(() => import('./components/VideoCard'));
   ```

3. **Database Indexes**
   - Already included in schema.sql
   - Monitor slow queries in Supabase dashboard

4. **CDN for Assets**
   - Use Vercel/Netlify CDN (automatic)
   - Or configure Cloudflare for extra caching

---

## Contributing

### Code Style

- Use TypeScript for all new files
- Follow existing component patterns
- Sanitize all user input
- Add proper TypeScript types
- Write descriptive commit messages

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "Add feature: description"

# Push to remote
git push origin feature/your-feature

# Create pull request on GitHub
```

---

## Support

### Documentation

- **Supabase Docs:** https://supabase.com/docs
- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev
- **Tailwind CSS:** https://tailwindcss.com/docs

### Issues

Found a bug? [Create an issue](https://github.com/your-repo/issues)

### Community

Join The Mirror community to discuss features and get help.

---

## License

[Your License Here]

---

**Happy Reflecting! 🪞**
