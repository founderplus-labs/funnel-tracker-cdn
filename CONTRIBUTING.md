# Contributing — funnel-tracker-cdn

Source of truth for the Cloudflare Worker behind `cdn.founderplus.id`.

## Layout

```
src/funnel-tracker.js    # tracker (IIFE, no deps)
src/guide.html           # /guide content
src/llms.txt             # /llms.txt content
build.mjs                # embeds src/* into worker.js via JSON.stringify
worker.js                # GENERATED — do not edit by hand
wrangler.jsonc           # CF Worker config (name, account, main)
```

## Develop

Edit anything in `src/` then rebuild:

```bash
node build.mjs
```

Smoke-check the worker locally:

```bash
node -e 'import("./worker.js").then(async m => {
  for (const p of ["/funnel-tracker.js","/guide","/llms.txt","/health"]) {
    const r = await m.default.fetch(new Request("https://x" + p));
    console.log(p, r.status, r.headers.get("content-type"));
  }
})'
```

## Deploy

```bash
wrangler deploy
```

Wrangler reads `wrangler.jsonc`. The custom domain `cdn.founderplus.id` is
configured on the worker — `wrangler deploy` only swaps the script, the domain
binding stays.

Verify live:

```bash
curl https://cdn.founderplus.id/health
```

## Pricing logic — keep in sync

The tracker's checkout pricing (priority `early_bird > sell_price > price >
ticket_price`, learning-program → subscription-package resolver) mirrors the
`founderplus-commerce-sdk` (in
[funnel-pages](https://gitlab.com/founderplus1/products/funnel-pages)). When
the SDK's price rules change, update `src/funnel-tracker.js` here too.

## Embedding gotchas

`build.mjs` uses `JSON.stringify` to embed source files into the worker — this
escapes backticks, `${`, newlines, and `</script>` cleanly, so editing `src/`
doesn't require manual escaping.
