# funnel-tracker-cdn

Cloudflare Worker that powers **cdn.founderplus.id** — the Founder+ funnel
toolkit: checkout tracker, marketing widgets (countdown, sticky CTA), a human
guide, and an agent (LLM) directive pointing users to the Founder+ CLI.

## What it serves

| Route | What |
|---|---|
| `/funnel-tracker.js` | The JS funnel toolkit (drop into any landing page) |
| `/funnel-tracker.min.js` | Same, comments + whitespace stripped |
| `/`, `/guide`, `/guide.html` | Human HTML guide — install fp CLI, skills, business guidance, templates |
| `/llms.txt` | Agent/dev plain-text version with explicit "FOR AI AGENTS" directive |
| `/health` | JSON status + version |

CORS is `*` on every route — works from any domain.

## Layout

```
src/funnel-tracker.js    # tracker source of truth (IIFE)
src/guide.html           # human guide
src/llms.txt             # agent / plain-text guide
build.mjs                # embed src/* into worker.js (JSON.stringify — bulletproof escaping)
worker.js                # GENERATED — do not edit by hand
wrangler.jsonc           # CF Worker config (account, name)
```

## Develop

Edit anything in `src/` then rebuild:

```bash
node build.mjs
```

Verify locally without deploying:

```bash
node -e 'import("./worker.js").then(async m => { const r = await m.default.fetch(new Request("https://x/funnel-tracker.js")); console.log(r.status, r.headers.get("content-type"), (await r.text()).length, "bytes"); })'
```

## Deploy

```bash
wrangler deploy
```

Custom domain (`cdn.founderplus.id`) is configured on the worker — wrangler
deploy only swaps the script, the domain binding stays.

## Pricing logic — single source of truth

The tracker's checkout pricing (priority `early_bird > sell_price > price >
ticket_price`, learning-program → subscription-package resolver) mirrors the
`founderplus-commerce-sdk` (in
[founderplus-pages](https://gitlab.com/founderplus1/products/funnel-pages)).
When the SDK's price rules change, update `src/funnel-tracker.js` here too.

## Usage on a landing page

```html
<!-- last thing before </body> -->
<script src="https://cdn.founderplus.id/funnel-tracker.js" defer></script>

<!-- checkout button (Founder+ processes payment) -->
<button data-product-slug="my-ebook-abcd1234" data-product-type="customProduct">Beli</button>

<!-- learning program early-bird tier -->
<button data-product-type="learningPath" data-product-slug="my-bundle" data-prefer="subscription">Beli</button>

<!-- explicit mode — no fetch, any domain -->
<button data-product-type="subscriptionPackage" data-product-uuid="…" data-product-price="99000">Beli</button>

<!-- countdown — evergreen, per visitor 60 min -->
<div data-countdown-evergreen="60"></div>
<div data-countdown="2026-12-31T23:59"></div>

<!-- sticky buy bar -->
<button data-sticky-cta data-product-slug="…" data-product-type="customProduct">Beli</button>
```

> **CRITICAL — never guess a product slug.** Founder+ slugs are NOT always the
> title — custom products usually carry a `-<uuid8>` suffix. Verify before
> shipping: `fp products list` or
> `curl https://academy.founderplus.id/api/dev/products/<slug>` returns 200.
