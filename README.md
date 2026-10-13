# IJICS Vue website

The IJICS website now uses Vue 3, Vite and Vue Router. The existing journal styling and all 20 original pages are retained as Vue components. Every paper entry opens the new `/articles/:id` detail page; 36 linked papers have sanitized public records from the official API.

## Run locally

```sh
npm ci
npm run dev:full
```

Open http://127.0.0.1:4174/ . This starts Vue and a read-only test API on http://127.0.0.1:4181/api . Test records are real public snapshots; usage counts show their observation date and are not simulated live counters.

For the Vue site without a gateway, `npm run dev` reads the bundled dated records. For the real public upstream, run `IJICS_API_MODE=live npm run dev:full` (the gateway always uses the fixed official IJICS upstream). Browser clients call the same-origin `/api` through Vite's proxy.

## Build and test

```sh
npm run build
npm test
npm run preview
```

Open http://127.0.0.1:4175/ . The build prerenders all public page/article/issue routes and legacy aliases. Unknown paths return 404 on the included preview server. Vue hydrates the HTML to enable navigation, search, filters, issue selection, citation export and image dialogs.

`npm run data:refresh` updates the entire public snapshot batch only after every record succeeds. It never publishes raw author emails, internal account/manuscript fields or source DOCX URLs. Failed refreshes leave the previous batch intact and fail CI.

## API configuration

See [API_CONTRACT.md](API_CONTRACT.md) and `.env.example`. `VITE_API_BASE` empty selects bundled snapshots; `/api` selects the local normalized gateway; an absolute URL selects a deployed compatible gateway (that deployment must allow the website origin). `IJICS_API_MODE=fixture` is the test mode, `live` uses the official upstream. Live failures stay visible; dated fallback records are not reported as fresh metrics.

Build with `IJICS_BASE_PATH=/repository-name/` for a GitHub Pages project path. The Pages workflow uses its configured base path, installs locked dependencies, refreshes public records, builds/prerenders, runs tests, then publishes `dist/`. Source pages in `demo/` are retained as migration references and are not the deployed site.

## Coverage

The migration covers every original page and every paper ID linked by the existing site. It does not claim a full independent crawl of the old journal's entire publication database. Missing abstract, figures, affiliations or reference lists have explicit empty states; paper PDFs remain served by the official download/browse endpoints. Production counter deduplication rules and citation-database coverage remain the upstream service's responsibility.
