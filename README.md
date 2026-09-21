# Personal Website

Interactive macOS-style personal portfolio. See `PROJECT_BRIEF.md` for the full spec.

## Requirements

- Node.js >= 20.19.0
- npm
- A Cloudflare account with `gavinle.com` added as a zone (only needed for deploy, not for local dev)

## Install & develop

```bash
npm install       # install dependencies
npm run dev       # start the dev server
```

## Scripts

```bash
npm run build     # type-check and build for production (outputs to ./dist)
npm run preview   # preview the production build locally
npm run lint      # lint the project
npm run format    # format with Prettier
npm run test      # run unit tests (Vitest)
npm run deploy    # build, then `wrangler deploy` to Cloudflare Workers
```

## Deployment

Hosting is Cloudflare Workers static assets (`wrangler.jsonc`), with single-page-application
fallback so unknown routes still serve `index.html`. The Worker is also bound to the custom
domain `gavinle.com` via a `routes` entry with `custom_domain: true`.

Before deploying for the first time on a machine:

```bash
npx wrangler login   # authenticates with your Cloudflare account in the browser
```

Then:

```bash
npm run deploy        # build + wrangler deploy
```

Notes:

- `gavinle.com` must already exist as a zone in the Cloudflare account running the deploy —
  Wrangler attaches the custom domain to the Worker but does not register the domain or manage
  DNS records; that's a one-time setup step in the Cloudflare dashboard, not part of this repo.
- `wrangler deploy` reconciles `routes` declaratively: whatever custom domains aren't listed in
  `wrangler.jsonc` are removed on the account. Only `gavinle.com` is configured here.
- There is no other environment configuration (no env vars, no secrets, no backend) — this is a
  fully static build.

## Editing content

- Site name and GitHub link: `src/config/brand.ts`
- Logo mark: `src/components/shared/BrandMark.tsx` (not currently config-driven — the `‹G›` mark is hardcoded there, unlike site name/links in `brand.ts`)
- All page content (bilingual EN/VI): `src/data/content.ts`

## Status

See `PROGRESS.md` for current milestone status.
