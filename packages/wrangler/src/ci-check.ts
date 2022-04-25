import { readConfig } from "./config";
import type { State } from "./user";

/**
 * Inside a CI/CD environment, you want to check if all the required variables are in scope
 * and if not, throw a helpful error message with missing variables and documentation link.
 */
export function ciCheck(localState: State) {
  if (process.stdout.isTTY) {
    const config = readConfig(undefined, {});

    if (
      !localState.accessToken &&
      !config.account_id &&
      !process.env.CLOUDFLARE_ACCOUNT_ID
    ) {
      throw new Error(
        `Missing "account_id" from "wrangler.toml" and "CLOUDFLARE_ACCOUNT_ID" "CLOUDFLARE_API_TOKEN" from CI environment, please see docs for more info: TBD`
      );
    }

    if (!process.env.CLOUDFLARE_API_TOKEN) {
      throw new Error(
        `Missing "CLOUDFLARE_API_TOKEN" from CI environment, please see docs for more info: TBD`
      );
    }

    if (!config.account_id && !process.env.CLOUDFLARE_ACCOUNT_ID) {
      throw new Error(
        `Missing "account_id" from "wrangler.toml" and "CLOUDFLARE_ACCOUNT_ID" from CI environment, one is required, please see docs for more info: TBD`
      );
    }
  }
}
