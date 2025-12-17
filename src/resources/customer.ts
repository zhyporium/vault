import type { CollectiveVaultAPI } from "../types";
import { Resource } from "./resource";

export class CustomerResource extends Resource {
  public async list(query: { page?: number; limit?: number }) {
    const response = await this.client.get("/api/v1/customers", {
      query: {
        page: query.page ? query.page.toString() : undefined,
        limit: query.limit ? query.limit.toString() : undefined,
      },
    });

    if (response.status === "success") {
      return response.data;
    }

    throw response.error;
  }

  public async create(
    data: CollectiveVaultAPI.Routes["POST"]["/api/v1/customers"]["body"]
  ) {
    const response = await this.client.post("/api/v1/customers", {
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    if (response.status === "success") {
      return response.data.customer;
    }

    throw response.error;
  }

  public async update(
    customerId: string,
    data: CollectiveVaultAPI.Routes["PUT"]["/api/v1/customers/[customerId]"]["body"]
  ) {
    const response = await this.client.put("/api/v1/customers/[customerId]", {
      params: {
        customerId,
      },
      body: data,
    });

    if (response.status === "success") {
      return response.data.customer;
    }

    throw response.error;
  }

  public async delete(customerId: string) {
    const response = await this.client.delete(
      "/api/v1/customers/[customerId]",
      {
        params: {
          customerId,
        },
      }
    );

    if (response.status === "success") {
      return response.data.customer;
    }

    throw response.error;
  }

  public async listSubscriptions(
    customerId: string,
    query: { page?: number; limit?: number }
  ) {
    const response = await this.client.get(
      "/api/v1/customers/[customerId]/subscriptions",
      {
        params: {
          customerId,
        },
        query: {
          page: query.page ? query.page.toString() : undefined,
          limit: query.limit ? query.limit.toString() : undefined,
        },
      }
    );

    if (response.status === "success") {
      return response.data;
    }

    throw response.error;
  }

  public async retrieveSubscriptionByProduct(
    customerId: string,
    productId: string
  ) {
    const response = await this.client.get(
      "/api/v1/customers/[customerId]/subscriptions/[productId]",
      {
        params: {
          customerId,
          productId,
        },
      }
    );

    if (response.status === "success") {
      return response.data.subscription;
    }

    throw response.error;
  }
}
