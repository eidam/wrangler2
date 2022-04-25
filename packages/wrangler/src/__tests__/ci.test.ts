import { mockConsoleMethods } from "./helpers/mock-console";
import { useMockIsTTY } from "./helpers/mock-istty";
import { runInTempDir } from "./helpers/run-in-tmp";
import { runWrangler } from "./helpers/run-wrangler";
import writeWranglerToml from "./helpers/write-wrangler-toml";

const ENV_COPY = process.env;
mockConsoleMethods();
runInTempDir();

afterEach(() => {
  process.env = ENV_COPY;
});

describe("CI", () => {
  const { setIsTTY } = useMockIsTTY();
  setIsTTY(false);

  it("should not throw an error in CI if 'CLOUDFLARE_API_TOKEN' & 'account_id' are in scope", async () => {
    writeWranglerToml({
      account_id: "IG-88",
    });

    process.env = {
      CLOUDFLARE_API_TOKEN: "123456789",
    };

    await runWrangler().catch((err) => {
      expect(err).toMatchInlineSnapshot(`""`);
    });
  });

  it("should not throw an error if 'CLOUDFLARE_ACCOUNT_ID' & 'CLOUDFLARE_API_TOKEN' are in scope", async () => {
    process.env = {
      CLOUDFLARE_API_TOKEN: "hunter2",
      CLOUDFLARE_ACCOUNT_ID: "IG-88",
    };

    await runWrangler().catch((err) => {
      expect(err).toMatchInlineSnapshot(`""`);
    });
  });

  it("should throw an error in CI if 'account_id' & 'CLOUDFLARE_ACCOUNT_ID' is missing", async () => {
    writeWranglerToml({
      account_id: undefined,
    });

    process.env = {
      CLOUDFLARE_API_TOKEN: "hunter2",
      CLOUDFLARE_ACCOUNT_ID: undefined,
    };

    await runWrangler().catch((err) => {
      expect(err).toMatchInlineSnapshot(
        `[Error: Missing "account_id" from "wrangler.toml" and "CLOUDFLARE_ACCOUNT_ID" from CI environment, one is required, please see docs for more info: TBD]`
      );
    });
  });

  it("should throw error in CI if 'CLOUDFLARE_API_TOKEN' is missing", async () => {
    writeWranglerToml({
      account_id: undefined,
    });

    process.env = {
      CLOUDFLARE_API_TOKEN: undefined,
      CLOUDFLARE_ACCOUNT_ID: "badwolf",
    };
    await runWrangler().catch((err) => {
      expect(err).toMatchInlineSnapshot(
        `[Error: Missing "CLOUDFLARE_API_TOKEN" from CI environment, please see docs for more info: TBD]`
      );
    });
  });

  it("should throw errors in CI if 'CLOUDFLARE_API_TOKEN', 'account_id' & 'CLOUDFLARE_ACCOUNT_ID is missing", async () => {
    await runWrangler().catch((err) => {
      expect(err).toMatchInlineSnapshot(
        `[Error: Missing "account_id" from "wrangler.toml" and "CLOUDFLARE_ACCOUNT_ID" "CLOUDFLARE_API_TOKEN" from CI environment, please see docs for more info: TBD]`
      );
    });
  });
});
