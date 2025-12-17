import type { CollectiveVaultAPI } from "../types";
import { Resource } from "./resource";

export class WaitlistResource extends Resource {
  public async list(query: { page?: number; limit?: number }) {
    const response = await this.client.get("/api/v1/waitlist", {
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
    data: CollectiveVaultAPI.Routes["POST"]["/api/v1/waitlist"]["body"]
  ) {
    const response = await this.client.post("/api/v1/waitlist", {
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    if (response.status === "success") {
      return response.data.waitlist;
    }

    throw response.error;
  }

  public async retrieve(waitlistId: string) {
    const response = await this.client.get("/api/v1/waitlist/[waitlistId]", {
      params: {
        waitlistId,
      },
    });

    if (response.status === "success") {
      return response.data.waitlist;
    }

    throw response.error;
  }

  public async update(
    waitlistId: string,
    data: CollectiveVaultAPI.Routes["PUT"]["/api/v1/waitlist/[waitlistId]"]["body"]
  ) {
    const response = await this.client.put("/api/v1/waitlist/[waitlistId]", {
      params: {
        waitlistId,
      },
      body: data,
    });

    if (response.status === "success") {
      return response.data.waitlist;
    }

    throw response.error;
  }

  public async delete(waitlistId: string) {
    const response = await this.client.delete("/api/v1/waitlist/[waitlistId]", {
      params: {
        waitlistId,
      },
    });

    if (response.status === "success") {
      return response.data.waitlist;
    }

    throw response.error;
  }
}
