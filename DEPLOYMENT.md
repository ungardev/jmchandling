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

4. **Custom Domain**
   - Project Settings → Domains → Add `jmc-handling.com`
   - Update DNS at your registrar to point to Vercel

5. **Dominio principal: el apex, no `www`** (recomendado)

   Vercel añade automáticamente `www.jmc-handling.com` y, si el host principal
   quedara siendo `www`, el apex responde con un **308** a `www`. Eso obliga a
   la URL canónica, al sitemap y a los `hreflang` a apuntar a un host que
   redirige, y añade un salto extra en cada visita.

   - Project Settings → Domains → **Make Primary** en `jmc-handling.com`
   - El repo ya apunta al apex: `astro.config.mjs` (`site`), `Layout.astro`
     (`siteUrl`, de donde salen canonical, `hreflang`, `og:url` y el JSON-LD) y
     `public/robots.txt` (`Sitemap:`).
   - Resultado: `jmc-handling.com` → `/es/` sin saltos y sin `www`.

   > **No añadas un redirect `www → apex` en `vercel.json`.** Si Vercel mantiene
   > `www` como principal, ese redirect junto al 308 de Vercel formaría un bucle
   > de redirección infinito.

### Vercel Configuration

The `astro.config.mjs` is pre-configured for static export:
```js
output: 'static',  // ✅ compatible with Vercel
site: 'https://jmc-handling.com',  // dominio canónico (apex)
```

`vercel.json` **sí** se usa: define la redirección de la raíz (`/` → `/es/`,
302), los stubs de redirect (`/es/servicios`, `/es/cotizacion`, …) y las
cabeceras de seguridad y caché.

### Canonical, sitemap y `www`

El host que se sirve y el host que se declara deben ser el mismo:

| Dónde | Valor |
|---|---|
| `astro.config.mjs` → `site` | `https://jmc-handling.com` |
| `src/layouts/Layout.astro` → `siteUrl` | `https://jmc-handling.com` |
| `public/robots.txt` → `Sitemap:` | `https://jmc-handling.com/sitemap-index.xml` |
| Dominio principal en Vercel | `jmc-handling.com` (apex) |

Si alguna vez se cambia el host principal en Vercel, hay que actualizar los
tres sitios del repo a la vez.

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
   - Visit `https://jmc-handling.com` (or your domain)
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
