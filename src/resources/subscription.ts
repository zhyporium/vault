import { Resource } from "./resource";

export class SubscriptionResource extends Resource {
  public async list(query: { page?: number; limit?: number }) {
    const response = await this.client.get("/api/v1/subscriptions", {
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

  public async retrieve(subscriptionId: string) {
    const response = await this.client.get(
      "/api/v1/subscriptions/[subscriptionId]",
      {
        params: {
          subscriptionId,
        },
      }
    );

    if (response.status === "success") {
      return response.data.subscription;
    }

    throw response.error;
  }

  public async sync() {
    const response = await this.client.post("/api/v1/subscriptions/sync", {});

    if (response.status === "success") {
      return;
    }

    throw response.error;
  }
}
