# Al Waheed Group of Companies website

A static site: plain HTML, CSS and JavaScript, no frameworks or libraries. `public/` is the finished website.

## Folders

| Path | What it is |
| --- | --- |
| `public/` | **The website. Upload everything inside this folder to Hostinger `public_html`.** |
| `public/downloads/` | United Palm Greens payment schedule (PDF) and layout plan (PDF and JPG) |
| `src/data.mjs` | All content and settings: contacts, projects, payment plan, companies, leadership, testimonials, FAQs, jobs |
| `src/pages.mjs` | Page layouts (Home, About, Chairman, Board, Companies, Projects, United Palm Greens, Careers, Contact and more) |
| `src/layout.mjs` | Shared header, footer, components and SEO tags / structured data |
| `src/css/main.css` | Design system (inlined into every page at build time) |
| `src/js/main.js` | Menu, scroll reveals, counters, sliders, forms, gallery, map |
| `assets/` | Original photos, logos, team photos and the layout plan (not uploaded) |
| `tools/` | Build scripts |

## Building

```bash
python tools/images.py      # when photos change (needs Pillow 11+, PyMuPDF, NumPy, opencv-python)
node tools/documents.mjs    # when the payment plan or contact details change (needs Chrome or Edge)
node tools/build.mjs        # rebuilds every page into public/
```

- `images.py` makes AVIF and WebP sizes, phone crops for heroes, blurred teaser images for coming soon projects, the logos cut from the layout plan and the matched leadership portraits (`tools/portraits.py`).
- `documents.mjs` prints the branded payment schedule (A4) and layout plan (A3) PDFs from `paymentPlan` in `src/data.mjs`, so the PDF and the table on the page always match. It stops if the rows do not add up to the cash price.
- `build.mjs` fails if an em dash or en dash appears anywhere in the output, warns when a title or description is too long, and removes pages that no longer exist.

To preview locally: `python -m http.server 8765 --directory public`, then open http://localhost:8765

## Projects

- `projects` in `src/data.mjs`: **United Palm Greens** (developed by Al Waheed) and **Khairunnisa Heights** (by Al Ghaffar Group, sponsored by Al Waheed). A project with `units` gets the apartment page with Ruby / Opal / Diamond tabs, floor plans and payment tables.
- `upcoming`: **United Sky View, United Greens, United Lodges**, shown as blurred cards with a rotating "Coming Soon" seal. To use a real teaser render, point its entry in `TEASERS` (tools/images.py) at the file; it is blurred automatically. When a project launches, move it into `projects` and it gets its own page.
- Downloads live in `public/downloads/`. The Khairunnisa Heights PDF is the developer's own file (`assets/brand/khairunnisa/`), re-saved under an SEO friendly name.
- Check the site with `node tools/audit.mjs` after a build.

## Domains

- **Main address: https://alwaheedgroup.com.** All canonical links, the sitemap and structured data use it (`site.url` in `src/data.mjs`).
- `alwaheedgroupofcompanies.com`, `www.alwaheedgroupofcompanies.com` and `www.alwaheedgroup.com` send visitors to the same page on the main address with a permanent (301) redirect, set in `src/static/.htaccess`. One address keeps Google from treating the site as duplicate content.
- On Hostinger: point both domains to the hosting account, add `alwaheedgroupofcompanies.com` as a parked domain (alias) of `alwaheedgroup.com` so it serves the same `public_html`, and turn on the free SSL for both domains so the redirect works over https.

## Before going live

1. **Remaining placeholders** in `src/data.mjs`: email addresses (create `info@` and `careers@alwaheedgroup.com` or replace them), map coordinates, office hours, "Families Served" stat, testimonials and jobs.
2. **Web3Forms**: create an access key at https://web3forms.com with the client's email, then set `web3formsKey`. Until then, forms ask visitors to call or WhatsApp instead. The free plan has no file uploads, so the careers form asks for a CV link.
3. **Video**: set `storyVideoId` to show the "Watch Our Story" button.
4. **Indexing**: set `launchReady: true`. While it is `false`, every page has `noindex` and `robots.txt` blocks crawlers, so placeholder content never reaches Google.
5. Rebuild and upload `public/`. Once SSL works on both domains, enable the HSTS line in `.htaccess`.
6. Submit `https://<domain>/sitemap.xml` in Google Search Console and Bing Webmaster Tools, and make sure the Google Business Profile uses the exact same name, address and phone.
