import type { CollectiveVaultAPI } from "../types";
import { Resource } from "./resource";

export class PaymentResource extends Resource {
  public async create(
    data: CollectiveVaultAPI.Routes["POST"]["/api/v1/payments"]["body"]
  ) {
    const response = await this.client.post("/api/v1/payments", {
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    if (response.status === "success") {
      return response.data.payment;
    }

    throw response.error;
  }
}
