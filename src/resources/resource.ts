import type { CollectiveVault } from "..";

export abstract class Resource {
  public constructor(protected client: CollectiveVault) {}
}
