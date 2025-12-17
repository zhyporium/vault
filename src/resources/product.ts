import type { CollectiveVaultAPI } from "../types";
import { Resource } from "./resource";

export class ProductResource extends Resource {
  public async list(query: { page?: number; limit?: number }) {
    const response = await this.client.get("/api/v1/products", {
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
    data: CollectiveVaultAPI.Routes["POST"]["/api/v1/products"]["body"]
  ) {
    const response = await this.client.post("/api/v1/products", {
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    if (response.status === "success") {
      return response.data.product;
    }

    throw response.error;
  }

  public async retrieve(productId: string) {
    const response = await this.client.get("/api/v1/products/[productId]", {
      params: {
        productId,
      },
    });

    if (response.status === "success") {
      return response.data.product;
    }

    throw response.error;
  }

  public async listSubscriptions(
    productId: string,
    query: { page?: number; limit?: number }
  ) {
    const response = await this.client.get(
      "/api/v1/products/[productId]/subscriptions",
      {
        params: {
          productId,
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
}
