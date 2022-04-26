import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { cwd } from "process";

interface ConfigCache {
  account_id?: string;
  pages_project_name?: string;
}

const relativeCacheLocation = join(
  "node_modules",
  ".cache",
  "wrangler",
  "config-cache.json"
);

const getConfigCacheLocation = () => join(cwd(), relativeCacheLocation);

export const getConfigCache = (): ConfigCache => {
  try {
    const configCacheLocation = getConfigCacheLocation();
    const configCache = JSON.parse(readFileSync(configCacheLocation, "utf-8"));
    console.log(
      `Using cached values from '${relativeCacheLocation}'. This is used as a temporary store to improve the developer experience for some commands. It may be purged at any time. It doesn't contain any sensitive information, but it should not be commited into source control.`
    );
    return configCache;
  } catch {
    return {};
  }
};

export const saveToConfigCache = (newValues: ConfigCache) => {
  const configCacheLocation = getConfigCacheLocation();
  const existingValues = getConfigCache();

  mkdirSync(dirname(configCacheLocation), { recursive: true });
  writeFileSync(
    configCacheLocation,
    JSON.stringify({ ...existingValues, ...newValues }, null, 2)
  );
  console.log(
    `Caching values into '${relativeCacheLocation}'. This is used as a temporary store to improve the developer experience for some commands. It may be purged at any time. It doesn't contain any sensitive information, but it should not be commited into source control.`
  );
};
