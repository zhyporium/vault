import { expect, test, describe } from "vitest";
import { CollectiveVault } from "../src";

describe("CollectiveVault", () => {
  test("should create a new CollectiveVault instance", () => {
    const vault = new CollectiveVault("http://localhost:3000", {
      apiKey: "123",
      webhookSecret: "123",
    });

    expect(vault).toBeInstanceOf(CollectiveVault);
  });
});
