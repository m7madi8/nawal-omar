# Fonts

## Self-hosted (no third-party request)

`public/css/fonts.css` + `public/fonts/*.woff2`. Loaded via `SITE_FONT_STYLES` in `lib/siteChrome.js` and directly by `/nawal`.

| Family | Used for | Weights / styles | Subsets | License |
|---|---|---|---|---|
| El Messiri | Arabic headings | variable 400-700 | arabic, latin, latin-ext | OFL 1.1 |
| Instrument Serif | English display headings | 400 normal + italic | latin, latin-ext | OFL 1.1 |
| Tajawal | Arabic body | 400, 500, 700 | arabic, latin | OFL 1.1 |

- Files are the **unmodified woff2 subsets** Google Fonts serves for these families (13 files, ~169 KB). `unicode-range` is copied from Google's CSS so a page only downloads what it renders.
- Cyrillic subsets are not used by the site and were not copied.
- License texts: `public/fonts/licenses/*-OFL.txt` (from github.com/google/fonts).
- OFL permits self-hosting and redistribution of unmodified files; keep the license texts next to the files.

## NOT yet self-hosted: General Sans (Fontshare)

Still loaded from `api.fontshare.com` / `cdn.fontshare.com` (weights 400, 500, 600) by `SITE_FONT_STYLES`. This is the one remaining third-party request on public pages, and it happens before consent.

It is not hosted locally because the Indian Type Foundry Free Font License terms could not be verified from here, and no look-alike substitute is acceptable.

To finish (owner action):
1. Download the official General Sans webfont kit from fontshare.com while signed in as the site owner.
2. Read the ITF FFL in the kit and confirm web self-hosting is allowed.
3. Put the woff2 files for 400/500/600 in `public/fonts/` with the license file in `public/fonts/licenses/`.
4. Add three `@font-face` rules to `public/css/fonts.css` (`font-display: swap`).
5. Remove the Fontshare URL from `SITE_FONT_STYLES`.

Until then, either keep it and disclose it in the privacy text, or load it only after consent.

## Other font references

- `/nawal` (`public/legacy/css/nawal.css`) names `Inter` and `Playfair Display`, which are not loaded anywhere (the original static page loaded them from Google). The page falls back to system fonts. Both are OFL and can be self-hosted the same way if the original look is wanted.
- Admin (`lib/adminWorkspace.js`) loads Inter and Playfair Display from Google. It is behind login and was left unchanged.
