# Personal Website

Interactive macOS-style personal portfolio. See `PROJECT_BRIEF.md` for the full spec.

## Requirements

- Node.js >= 20.19.0
- npm

## Scripts

```bash
npm install       # install dependencies
npm run dev       # start the dev server
npm run build     # type-check and build for production
npm run preview   # preview the production build locally
npm run lint      # lint the project
npm run format    # format with Prettier
npm run test      # run unit tests (Vitest)
npm run deploy    # build and deploy to Cloudflare Workers
```

## Editing content

- Logo icon and site name: `src/config/brand.ts`
- All page content (bilingual EN/VI): `src/data/content.ts` (added in a later milestone)

## Status

M0 (scaffold) in progress. See `PROJECT_BRIEF.md` section 12 for the full milestone plan.
