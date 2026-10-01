# Al Waheed Group of Companies website

A static site: plain HTML, CSS and JavaScript, no frameworks or libraries.
The **repository root is the website**, so Hostinger can deploy it straight from GitHub into `public_html`.

## Structure

| Path | What it is |
| --- | --- |
| `index.html`, `about/`, `projects/`, `contact/` ... | Built pages (generated, do not edit by hand) |
| `assets/` | Built images, logos and the hashed JavaScript file |
| `downloads/` | Payment schedules, layout plan and floor plans (PDF and JPG) |
| `.htaccess`, `robots.txt`, `sitemap.xml`, `llms.txt`, `site.webmanifest`, `favicon.ico` | Server and SEO files (generated) |
| `_dev/src/data.mjs` | All content and settings: contacts, projects, payment plans, companies, leadership, FAQs, jobs |
| `_dev/src/pages.mjs`, `_dev/src/layout.mjs` | Page templates, shared header and footer, SEO tags and structured data |
| `_dev/src/css/main.css`, `_dev/src/js/main.js` | Design system and site behaviour |
| `_dev/src/static/.htaccess` | Source of the live `.htaccess` |
| `_dev/assets/` | Original photos, logos, team pictures and PDFs from the client |
| `_dev/tools/` | Build scripts |

`_dev/`, `.git/` and this README are deployed with the repository but blocked by `.htaccess` (they return 404), so visitors cannot open them.

## Editing and building

Edit files in `_dev/`, then run from the repository root:

```bash
python _dev/tools/images.py      # when photos or logos change (needs Pillow 11+, PyMuPDF, NumPy, opencv-python)
node _dev/tools/documents.mjs    # when payment plans or contact details change (needs Chrome or Edge)
node _dev/tools/build.mjs        # rebuilds every page into the repository root
node _dev/tools/audit.mjs        # checks headings, links, images, structured data
```

- `images.py` makes AVIF and WebP sizes, phone crops for heroes, blurred teaser images for coming soon projects, transparent logos and the matched leadership portraits (`portraits.py`).
- `documents.mjs` prints the branded United Palm Greens payment schedule (A4) and layout plan (A3) from `paymentPlan` in `data.mjs`, and re-saves the Khairunnisa Heights PDF. It stops if payment rows do not add up to the total.
- `build.mjs` fails if an em dash or en dash appears anywhere in the output, warns when a title or description is too long, and removes pages that no longer exist. It never touches `_dev/` or `.git/`.

Commit the rebuilt files together with the source changes, then push. Hostinger deploys what is on `main`.

To preview locally: `python -m http.server 8765`, then open http://localhost:8765

## Deploying on Hostinger (Git)

1. hPanel, Websites, Manage, **Advanced, Git**.
2. Repository: `https://github.com/onecinfinity/alwaheedgroup.git`, branch `main`, directory left **empty** (deploys into `public_html`). `public_html` must be empty before the first deploy, so delete Hostinger's default files first.
3. For a private repository, add the SSH key Hostinger shows to the GitHub repository (Settings, Deploy keys) and use the SSH address `git@github.com:onecinfinity/alwaheedgroup.git`.
4. Turn on **Auto deployment** and add the webhook URL Hostinger gives you to the GitHub repository (Settings, Webhooks), so every push to `main` goes live.

## Domains

- **Main address: https://alwaheedgroup.com.** All canonical links, the sitemap and structured data use it (`site.url` in `_dev/src/data.mjs`).
- `alwaheedgroupofcompanies.com`, `www.alwaheedgroupofcompanies.com` and `www.alwaheedgroup.com` send visitors to the same page on the main address with a permanent (301) redirect in `.htaccess`. One address keeps Google from treating the site as duplicate content.
- On Hostinger: point both domains to the hosting account, add `alwaheedgroupofcompanies.com` as a parked domain (alias) of `alwaheedgroup.com`, and turn on the free SSL for both domains so the redirect works over https.

## Projects

- `projects` in `_dev/src/data.mjs`: **United Palm Greens** (developed by Al Waheed) and **Khairunnisa Heights** (by Al Ghaffar Group, sponsored by Al Waheed). A project with `units` gets the apartment page with Ruby / Opal / Diamond tabs, floor plans and payment tables.
- `companies`: the **Affiliated Groups** (page `/affiliated-groups/`). Their logos are prepared in `_dev/tools/images.py` (`GOLD_LOGOS`, `other_logos`) from the files in `_dev/assets/brand/partners/`. Entries with `dealer: true` (Falaknaz Group, Al Ghafoor Group) are the developers Al Waheed represents as an authorized dealer; their cards carry the "Authorized Dealer" label.
- `upcoming`: **United Sky View, United Greens, United Lodges**, shown as blurred cards with a rotating "Coming Soon" seal. To use a real teaser render, point its entry in `TEASERS` (`_dev/tools/images.py`) at the file; it is blurred automatically. When a project launches, move it into `projects` and it gets its own page.

## Before going live

1. **Remaining placeholders** in `_dev/src/data.mjs`: email addresses (create `info@` and `careers@alwaheedgroup.com` or replace them), map coordinates, office hours, "Families Served" stat, testimonials and jobs.
2. **Web3Forms**: create an access key at https://web3forms.com with the client's email, then set `web3formsKey`. Until then, forms ask visitors to call or WhatsApp instead. The free plan has no file uploads, so the careers form asks for a CV link.
3. **Video**: set `storyVideoId` to show the "Watch Our Story" button.
4. **Indexing**: set `launchReady: true`. While it is `false`, every page has `noindex` and `robots.txt` blocks crawlers, so placeholder content never reaches Google.
5. Rebuild, commit and push. Once SSL works on both domains, enable the HSTS line in `_dev/src/static/.htaccess`.
6. Submit `https://alwaheedgroup.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools, and make sure the Google Business Profile uses the exact same name, address and phone.
