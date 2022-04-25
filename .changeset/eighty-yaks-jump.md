---
"wrangler": patch
---

feat: Added a check in CI/CD environments for `account_id`, `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`. If `account_id` exists in `wrangler.toml`
then `CLOUDFLARE_ACCOUNT_ID` is not needed in CI/CD scope. The `CLOUDFLARE_API_TOKEN` is necessary in CI/CD scope and will always error if missing.

resolves #827
