# VERCEL DEPLOYMENT MANIFEST

## Project Analysis
- Framework: Next.js 16.2.6 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS v4
- Build Tool: Turbopack (Next.js built-in)
- Node Version: 18+ (recommended)

## Build Configuration
- Build Command: `npm run build`
- Output Directory: `.next` (standard Next.js output)
- Install Command: `npm ci` (recommended for production)
- Dev Command: `npm run dev`

## Files Modified/Created for Vercel

### 1. next.config.js (Production Optimized)
- Removed `output: 'standalone'` (causes `next start` incompatibility)
- Added image optimization (AVIF, WebP)
- Added security headers
- Enabled compression
- Set static page generation timeout

### 2. vercel.json (Vercel Framework Configuration)
- Framework override: nextjs
- Function timeouts: 10s for all routes
- Clean URLs enabled
- Security headers defined
- Regions: iad1 (US East)

## Local Verification Results

Build: SUCCESS
Server: STARTED on http://localhost:3000

Route Tests:
- GET / → 200 OK
- GET /convert → 200 OK
- GET /convert/length → 200 OK
- GET /convert/length/kilometer-to-mile → 200 OK
- GET /search → 200 OK
- GET /robots.txt → 200 OK
- GET /nonexistent-page → 200 (custom 404 page)

All routes render correctly with proper SEO metadata.

## Vercel Deployment Settings (CRITICAL)

### Project Configuration
1. **Root Directory**: `conversion-hub` (if your repo root is NOT the Next.js app root)
   - If your GitHub repo structure:
     ```
     your-repo/
     └── conversion-hub/   ← package.json lives here
         ├── package.json
         ├── app/
         ├── next.config.js
         └── vercel.json
     ```
     → Set Root Directory to: `conversion-hub`

   - If your GitHub repo root IS the Next.js app:
     ```
     your-repo/
     ├── package.json
     ├── app/
     └── next.config.js
     ```
     → Set Root Directory to: `/` (blank)

2. **Build Command**: `npm run build` (default)
3. **Output Directory**: `.next` (default — leave blank OR set to `.next`)
4. **Framework Preset**: Next.js (should auto-detect from vercel.json)
5. **Install Command**: `npm ci` (or leave default)

### Important Notes
- Do NOT override framework to "Static" or "Other"
- Do NOT set custom output directory unless using `output: 'standalone'` (not recommended)
- Ensure Node.js version is 18+ (set in Package.json `engines` if needed)

## Common 404 Causes & Fixes

### Cause 1: Wrong Root Directory
**Symptom**: Build succeeds but site shows 404
**Fix**: Set Root Directory to `conversion-hub` (or `/` if app at repo root)

### Cause 2: Framework Not Detected
**Symptom**: Vercel treats as static site → all routes 404
**Fix**: Ensure `vercel.json` has `"framework": "nextjs"` at repo root or in Root Directory

### Cause 3: Build Failed
**Symptom**: Deployment status: "Build Failed"
**Fix**: Check build logs in Vercel dashboard for errors, fix and redeploy

### Cause 4: Not Committed
**Symptom**: Old code deployed, config changes not live
**Fix**: Commit and push `next.config.js` and `vercel.json`, then redeploy

## Post-Deployment Verification

After redeploying, test:
1. Homepage loads
2. /convert page loads
3. /convert/length loads
4. /convert/length/kilometer-to-mile loads
5. Refresh on nested route (no 404)
6. /search loads
7. /sitemap.xml loads
8. /robots.txt loads

All should return 200 with proper content.

## If 404 Persists After Following This Manifest

1. **Clear Vercel cache**:
   - Dashboard → Project Settings → Git → "Clear Cache & Redeploy"

2. **Check deployment logs**:
   - Click on the deployment
   - View "Build & Deployment" logs
   - Look for errors in build step

3. **Verify Git connection**:
   - Ensure correct repository connected
   - Ensure correct branch (main) selected

4. **Manual redeploy**:
   - Dashboard → Deployments → "Redeploy" on latest

5. **Contact support** if all else fails with:
   - Repo URL
   - Vercel Project ID
   - Build logs from last deployment

## Files Committed
- next.config.js
- vercel.json
- All existing source files (unchanged)

## No Breaking Changes
- UI/UX unchanged
- SEO metadata intact
- Routing structure unchanged
- Converter functionality unchanged
- Responsive design intact
