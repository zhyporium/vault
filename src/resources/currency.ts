import { Resource } from "./resource";

export class CurrencyResource extends Resource {
  public async retrieve() {
    const response = await this.client.get("/api/v1/currency", {});

    if (response.status === "success") {
      return response.data.currency;
    }

    throw response.error;
  }
}
