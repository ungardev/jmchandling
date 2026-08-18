# DEPLOYMENT.md — JMC Handling

This document covers deployment of the JMC Handling Astro site to Vercel (recommended, immediate) and HostGator Mexico (static FTP upload, post-October).

---

## Target Environments

| Environment | Host | Method | Status |
|---|---|---|---|
| **Staging / Immediate** | Vercel | Git push auto-deploy | ✅ Recommended now |
| **Production** | HostGator Mexico | FTP / cPanel static upload | After current hosting expires |

---

## Vercel Deployment (Recommended)

### Prerequisites
- GitHub repository with this project pushed
- Vercel account connected to GitHub

### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: initial JMC Handling site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/jmchandling.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click **"Import Project"**
   - Select the `jmchandling` repository
   - **Framework Preset:** Astro (detected automatically)
   - **Build Command:** `npm run build` (pre-filled)
   - **Output Directory:** `dist` (pre-filled)
   - **Environment Variables:** None required (static site)

3. **Deploy**
   - Click **"Deploy"**
   - Vercel builds automatically on every push to `main`

4. **Custom Domain (optional)**
   - Project Settings → Domains → Add `jmchandling.com`
   - Update DNS at your registrar to point to Vercel

### Vercel Configuration

The `astro.config.mjs` is pre-configured for static export:
```js
output: 'static',  // ✅ compatible with Vercel
site: 'https://jmchandling.vercel.app',
```

No Vercel configuration file (`vercel.json`) is needed for static sites.

---

## HostGator Mexico — Static FTP Upload

### Prerequisites
- `npm run build` completed locally
- `dist/` folder ready
- cPanel or FTP credentials from HostGator

### Steps

1. **Build locally**
   ```bash
   npm run build
   ```
   Output: `dist/` folder containing all static files

2. **Connect via FTP/cPanel**
   - **FTP Host:** `ftp.yourdomain.com` (or IP provided by HostGator)
   - **Username:** Your cPanel username
   - **Password:** Your cPanel password
   - **Port:** 21 (or 22 for SFTP)

3. **Upload contents of `dist/`**
   - Upload the **entire contents** of `dist/` to your `public_html/` directory
   - Do NOT upload the `dist/` folder itself — only its contents
   - Required files at root of `public_html/`:
     - `index.html`
     - `favicon.ico`
     - `robots.txt`
     - `sitemap-index.xml` (generated after build)
     - `_assets/` (bundled CSS/JS from Astro)

4. **File permissions**
   - `public_html/` — 755
   - All files — 644

5. **Verify**
   - Visit `https://jmchandling.com` (or your domain)
   - All 9 routes should resolve:
     - `/es/`, `/es/servicios`, `/es/contacto`, `/es/cotizacion`
     - `/en/`, `/en/services`, `/en/contact`, `/en/quote`
     - `/` (redirects to `/es/`)

### Troubleshooting HostGator

| Problem | Solution |
|---|---|
| 404 on all pages | `dist/` contents not in `public_html/` root — move files up one level |
| CSS/JS not loading | `_assets/` folder not uploaded or path incorrect |
| Redirect loop | `.htaccess` conflict — delete any existing HostGator `.htaccess` in `public_html/` |
| `robots.txt` missing | Upload `public/robots.txt` contents to `public_html/robots.txt` |

---

## Static Export Requirements

Astro must be configured with `output: 'static'` (already set):

```js
// astro.config.mjs
export default defineConfig({
  output: 'static',  // ✅ Required for both Vercel and HostGator
  site: 'https://jmchandling.vercel.app',
});
```

Never change to `output: 'server'` or `output: 'hybrid'` without:
1. Adding a Node.js adapter
2. Updating this document
3. Switching to server-compatible hosting

---

## Post-Deployment Checklist

- [ ] Verify all 8 locale pages load (ES + EN)
- [ ] Test language toggle switches `/es/` ↔ `/en/` correctly
- [ ] Verify contact form submits to FormSubmit.co
- [ ] Test AWB tracker accepts `000-12345678` format
- [ ] Run Lighthouse audit (target ≥90 Performance)
- [ ] Verify sitemap at `/sitemap-index.xml`
- [ ] Test mobile responsiveness (320px → 1440px)
- [ ] Verify skip-to-content link works
- [ ] Test keyboard navigation on contact form
