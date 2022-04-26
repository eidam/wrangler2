import { getConfigCache, saveToConfigCache } from "../config-cache";
import { runInTempDir } from "./helpers/run-in-tmp";

describe("config cache", () => {
  runInTempDir();

  it("should return an empty config if no file exists", () => {
    expect(getConfigCache()).toMatchInlineSnapshot(`Object {}`);
  });

  it("should read and write values without overriding old ones", () => {
    saveToConfigCache({
      account_id: "some-account-id",
      pages_project_name: "foo",
    });
    expect(getConfigCache().account_id).toEqual("some-account-id");

    saveToConfigCache({
      pages_project_name: "bar",
    });
    expect(getConfigCache().account_id).toEqual("some-account-id");
  });
});
