export declare namespace CollectiveVaultAPI {
  type Currency = "USD" | "EUR" | "GBP" | "PHP";

  type ProductType = "SUBSCRIPTION" | "ONE_TIME" | "CREDIT";
  type ProductionSubscriptionInterval = "DAY" | "WEEK" | "MONTH";

  type PaymentStatus = "COMPLETED" | "FAILED" | "CANCELLED" | "REFUNDED";
  type PaymentReason = "SUBSCRIPTION" | "CREDIT_PURCHASE" | "ONE_TIME";
  type PaymentTransactionStatus =
    | "PENDING"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED"
    | "PROCESSING"
    | "REJECTED";
  type PaymentTransactionLedgerEntryAccountType = "SYSTEM" | "USER" | "DISCORD";
  type PaymentTransactionLedgerEntryType =
    | "DEPOSIT"
    | "WITHDRAW"
    | "REFERRAL"
    | "EQUITY"
    | "SYSTEM";

  type CustomerSubscriptionStatus = "ACTIVE" | "CANCELLED" | "EXPIRED";

  interface Waitlist {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  }

  interface Product {
    id: string;
    sku: string;
    name: string;
    description: string;
    image: string | null;
    price: number;
    compareAtPrice: number | null;
    type: ProductType;
    subscription: {
      seats: number;
      interval: ProductionSubscriptionInterval;
      intervalCount: number;
    } | null;
    metadata: Record<string, string>;
    createdAt: string;
    updatedAt: string;
  }

  interface Customer {
    id: string;
    name: string;
    email: string;
    discordId: string | null;
    metadata: Record<string, string>;
    createdAt: string;
    updatedAt: string;
  }

  interface Payment {
    id: string;
    idempotentKey: string;
    customer: Pick<Customer, "id" | "name" | "email">;
    product: Pick<Product, "id" | "sku" | "name" | "price" | "type">;
    provider: string; // e.g., "stripe", "paypal"
    providerId: string; // Provider-specific payment ID
    amount: number;
    status: PaymentStatus;
    reason: PaymentReason;
    metadata: Record<string, string>;
    transaction: Pick<Transaction, "id" | "status" | "entries">;
    subscription: Pick<
      CustomerSubscription,
      | "id"
      | "status"
      | "startDate"
      | "endDate"
      | "metadata"
      | "createdAt"
      | "updatedAt"
    > | null;
    createdAt: string;
    updatedAt: string;
  }

  interface Transaction {
    id: string;
    status: PaymentTransactionStatus;
    entries: [];
  }

  interface LedgerEntry {
    id: string;
    accountType: PaymentTransactionLedgerEntryAccountType;
    accountId: string;
    amount: number;
    type: PaymentTransactionLedgerEntryType;
  }

  interface CustomerSubscription {
    id: string;
    customer: Pick<Customer, "id" | "name" | "email">;
    product: Pick<Product, "id" | "sku" | "name" | "price" | "type">;
    status: CustomerSubscriptionStatus;
    startDate: string;
    endDate: string;
    metadata: Record<string, string>;
    createdAt: string;
    updatedAt: string;
  }

  interface Routes {
    GET: {
      "/api/v1/currency": {
        response: {
          currency: Currency;
        };
      };
      "/api/v1/waitlist": {
        query?: {
          page?: string;
          limit?: string;
        };
        response: {
          waitlists: Pick<Waitlist, "id" | "name" | "email">[];
          total: number;
          page: number;
          limit: number;
        };
      };
      "/api/v1/waitlist/[waitlistId]": {
        params: {
          waitlistId: string;
        };
        response: {
          waitlist: Waitlist;
        };
      };
      "/api/v1/products": {
        query?: {
          page?: string;
          limit?: string;
        };
        response: {
          products: Pick<Product, "id" | "sku" | "name" | "price" | "type">[];
          total: number;
          page: number;
          limit: number;
        };
      };
      "/api/v1/products/[productId]": {
        params: {
          productId: string;
        };
        response: {
          product: Product;
        };
      };
      "/api/v1/products/[productId]/subscriptions": {
        params: {
          productId: string;
        };
        query?: {
          page?: string;
          limit?: string;
        };
        response: {
          subscriptions: Pick<
            CustomerSubscription,
            "id" | "status" | "startDate" | "endDate"
          >[];
          total: number;
          page: number;
          limit: number;
        };
      };
      "/api/v1/customers": {
        query?: {
          page?: string;
          limit?: string;
        };
        response: {
          customers: Pick<Customer, "id" | "name" | "email">[];
          total: number;
          page: number;
          limit: number;
        };
      };
      "/api/v1/customers/[customerId]": {
        params: {
          customerId: string;
        };
        response: {
          customer: Customer;
        };
      };
      "/api/v1/customers/[customerId]/subscriptions": {
        params: {
          customerId: string;
        };
        query?: {
          page?: string;
          limit?: string;
        };
        response: {
          subscriptions: Pick<
            CustomerSubscription,
            "id" | "status" | "startDate" | "endDate"
          >[];
          total: number;
          page: number;
          limit: number;
        };
      };
      "/api/v1/customers/[customerId]/subscriptions/[productId]": {
        params: {
          customerId: string;
          productId: string;
        };
        response: {
          subscription: CustomerSubscription;
        };
      };
      "/api/v1/subscriptions": {
        query?: {
          page?: string;
          limit?: string;
        };
        response: {
          subscriptions: Pick<
            CustomerSubscription,
            "id" | "status" | "startDate" | "endDate"
          >[];
          total: number;
          page: number;
          limit: number;
        };
      };
      "/api/v1/subscriptions/[subscriptionId]": {
        params: {
          subscriptionId: string;
        };
        response: {
          subscription: CustomerSubscription;
        };
      };
    };
    POST: {
      "/api/v1/waitlist": {
        headers: {
          "Content-Type": "application/json";
        };
        body: {
          name: string;
          email: string;
        };
        response: {
          waitlist: Waitlist;
        };
      };
      "/api/v1/products": {
        headers: {
          "Content-Type": "application/json";
        };
        body: {
          product: Pick<
            Product,
            | "sku"
            | "name"
            | "description"
            | "price"
            | "compareAtPrice"
            | "metadata"
          >;
          attribute:
            | {
                type: "SUBSCRIPTION";
                subscription: {
                  seats: number;
                  interval: ProductionSubscriptionInterval;
                  intervalCount: number;
                };
              }
            | {
                type: "ONE_TIME";
              }
            | {
                type: "CREDIT";
              };
        };
        response: {
          product: Product;
        };
      };
      "/api/v1/customers": {
        headers: {
          "Content-Type": "application/json";
        };
        body: {
          name: string;
          email: string;
          discordId?: string;
          metadata?: Record<string, string>;
        };
        response: {
          customer: Customer;
        };
      };
      "/api/v1/payments": {
        headers: {
          "Content-Type": "application/json";
        };
        body: {
          idempotentKey: string;
          customerId: string;
          productId: string;
          provider: string;
          providerId: string;
          metadata?: Record<string, string>;
          referral?: {
            accountType: PaymentTransactionLedgerEntryAccountType;
            accountId: string;
            percentage: number;
          };
          discount?:
            | {
                type: "PERCENTAGE";
                percentage: number;
              }
            | {
                type: "FIXED_AMOUNT";
                amount: number;
              };
          customEquities?: {
            accountType: PaymentTransactionLedgerEntryAccountType;
            accountId: string;
            percentage: number;
          }[];
        };
        response: {
          payment: Payment;
        };
      };
      "/api/v1/subscriptions/sync": {
        response: {};
      };
    };
    PATCH: {};
    PUT: {
      "/api/v1/waitlist/[waitlistId]": {
        params: {
          waitlistId: string;
        };
        body: {
          name: string;
          email: string;
        };
        response: {
          waitlist: Waitlist;
        };
      };
      "/api/v1/customers/[customerId]": {
        params: {
          customerId: string;
        };
        body: {
          name: string;
          email: string;
          metadata?: Record<string, string>;
        };
        response: {
          customer: Customer;
        };
      };
    };
    DELETE: {
      "/api/v1/waitlist/[waitlistId]": {
        params: {
          waitlistId: string;
        };
        response: {
          waitlist: Waitlist;
        };
      };
      "/api/v1/customers/[customerId]": {
        params: {
          customerId: string;
        };
        response: {
          customer: Customer;
        };
      };
    };
  }

  interface WebhookEventPayloads {
    "user.signin.oauth2": {
      user: {
        id: string;
        name: string;
        email: string;
        superuser: boolean;
        admin: boolean;
      };
      discord: {
        id: string;
        accessToken: string | null;
        scope: string | null;
      };
      customer: Pick<Customer, "id" | "name" | "email"> | null;
    };
    "currency.update": {
      currency: Currency;
    };
    "waitlist.created": Waitlist;
    "waitlist.updated": Waitlist;
    "waitlist.deleted": Waitlist;
    "product.created": Product;
    "product.updated": Product;
    "product.deleted": Product;
    "customer.created": Customer;
    "customer.updated": Customer;
    "customer.deleted": Customer;
    "customer.subscription.created": CustomerSubscription;
    "customer.subscription.renewed": CustomerSubscription;
    "customer.subscription.grace_started": CustomerSubscription;
    "customer.subscription.cancelled": CustomerSubscription;
    "customer.subscription.expired": CustomerSubscription;
    "customer.subscription.deleted": CustomerSubscription;
    "payment.created": Payment;
  }

  type WebhookBody<T extends keyof WebhookEventPayloads> = {
    event: T;
    payload: WebhookEventPayloads[T];
  };

  type WebhookEvent =
    | WebhookBody<"user.signin.oauth2">
    | WebhookBody<"currency.updated">
    | WebhookBody<"waitlist.created">
    | WebhookBody<"waitlist.updated">
    | WebhookBody<"waitlist.deleted">
    | WebhookBody<"product.created">
    | WebhookBody<"product.updated">
    | WebhookBody<"product.deleted">
    | WebhookBody<"customer.created">
    | WebhookBody<"customer.updated">
    | WebhookBody<"customer.deleted">
    | WebhookBody<"customer.subscription.created">
    | WebhookBody<"customer.subscription.renewed">
    | WebhookBody<"customer.subscription.grace_started">
    | WebhookBody<"customer.subscription.cancelled">
    | WebhookBody<"customer.subscription.expired">
    | WebhookBody<"customer.subscription.deleted">
    | WebhookBody<"payment.created">
    | WebhookBody<"payment.updated">
    | WebhookBody<"payment.deleted">;
}
