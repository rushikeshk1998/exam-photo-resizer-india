# Exam Photo Resizer

A static website that resizes photos, signatures, thumb impressions and handwritten declarations to the size, DPI and file size required by Indian exam and government portals. Everything runs in the visitor's browser, so no image is ever uploaded to a server.

No frameworks, no build step, no bundler. Plain HTML, CSS and JavaScript.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Main tool + size reference table, error fixes, FAQ, internal links |
| `ssc-photo-resizer.html` | SSC photo preset and instructions |
| `ssc-signature-resizer.html` | SSC signature preset and instructions |
| `ibps-signature-resizer.html` | IBPS / SBI signature preset and instructions |
| `pan-photo-signature-resizer.html` | NSDL and UTIITSL PAN photo and signature |
| `upsc-photo-resizer.html` | UPSC and civil service photo and signature |
| `mpsc-photo-resizer.html` | MPSC and Maharashtra recruitment |
| `mpsc-photo-resizer-mr.html` | Same page in Marathi (`hreflang` pair with the page above) |
| `ibps-sbi-kit.html` | Four-file banking kit with ZIP download |
| `privacy.html` | Privacy policy (needed for AdSense and trust) |
| `contact.html` | Contact page for corrections and new presets |

Shared files: `styles.css` (light/dark theme), `app.js` (engine), `kit.js` (4-file kit), `zip-store.js` (client-side ZIP), `robots.txt`, `sitemap.xml`.

## Running it locally

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`. Opening `index.html` directly also works, but a local server is closer to production.

## Deploying

Upload every file in this folder to any static host — GitHub Pages, Netlify, Cloudflare Pages, Vercel static, or plain Nginx/Apache/cPanel. There is nothing to build.

Before going live:

1. Replace `https://example.com` in `sitemap.xml`, `robots.txt` and every `<link rel="canonical">` with the real domain.
2. Replace `help@example.com` on `contact.html` with a real inbox.
3. Submit `sitemap.xml` in Google Search Console.
4. Bump the `?v=` query on `styles.css`, `app.js`, `kit.js` and `zip-store.js` in each HTML file whenever you change those files, so visitors do not get a cached old copy.

## Google AdSense

1. Get approved for AdSense.
2. Add the AdSense loader script in the `<head>` of each page with your publisher ID.
3. Replace the `.ad` placeholder blocks with your ad unit snippets.
4. Keep the "Advertisement" labels, follow the placement rules, and make sure the ads never sit on top of the tool controls.

## Design notes

- Plain system font stack, no web fonts, no icon library, no gradients. Total CSS is about 12 KB.
- Light and dark themes through one `data-theme` attribute on `<html>`; the choice is stored in `localStorage` and the system preference is used on the first visit.
- All content that search engines need is in the HTML source: spec tables, error fixes, FAQ answers, per-page instructions. The JavaScript only powers the tool.
- Structured data: `SoftwareApplication` and `FAQPage` on the home page, `FAQPage` on the landing pages, `HowTo` on the kit page.
- Mobile first: single column under 900 px, 16 px base font, tap targets sized for phones.

## Engine notes

- Images are decoded with `createImageBitmap` when the browser supports it.
- Cleanup work runs on a capped working resolution (1800 px with cleanup on, 2400 px without) so phone photos stay responsive.
- Output pixel size is never silently changed. If a JPG cannot reach the maximum KB at the required size, the tool says so instead of resizing the image and breaking the portal check.
- The target KB search uses a ratio-based quality search and writes the DPI into the JFIF header of the exported JPG.
- "Reach the minimum KB" adds very light noise for small images that are otherwise under a portal's minimum file size.

## Before you promote it

- Confirm each preset against the current notification. Sizes change between exam cycles.
- Test the final files in the real portal preview, not only in the browser.
- Check the layout on a real phone, and on Android Chrome and iOS Safari.
- Some browsers cannot decode HEIC photos taken on iPhones. If that matters to your users, add a client-side HEIC converter.
