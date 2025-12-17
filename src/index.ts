import { REST } from "@zhyporium/rest";
export * from "./types.d";
import type { CollectiveVaultAPI } from "./types";
import { Webhook } from "./internal/webhook";
import { WaitlistResource } from "./resources/waitlist";
import { ProductResource } from "./resources/product";
import { CustomerResource } from "./resources/customer";
import { CurrencyResource } from "./resources/currency";
import { PaymentResource } from "./resources/payment";
import { SubscriptionResource } from "./resources/subscription";

export class CollectiveVault extends REST<CollectiveVaultAPI.Routes> {
  // Internal
  public webhook: Webhook<CollectiveVaultAPI.WebhookEvent>;

  // Resources
  public currency: CurrencyResource;
  public waitlists: WaitlistResource;
  public products: ProductResource;
  public customers: CustomerResource;
  public payments: PaymentResource;
  public subscriptions: SubscriptionResource;

  public constructor(
    baseUrl: string,
    options: {
      apiKey: string;
      webhookSecret: string;
    }
  ) {
    super(baseUrl, {
      Authorization: options.apiKey,
    });

    this.webhook = new Webhook({
      secret: options.webhookSecret,
      signatureHeader: "x-vault-signature",
    });

    this.currency = new CurrencyResource(this);
    this.waitlists = new WaitlistResource(this);
    this.products = new ProductResource(this);
    this.customers = new CustomerResource(this);
    this.payments = new PaymentResource(this);
    this.subscriptions = new SubscriptionResource(this);
  }
}
