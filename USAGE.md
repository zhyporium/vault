## Usage Guide

This document walks through the full usage of `@zhyporium/vault`, including the client, all resources, and webhook handling.

---

## 1. Client setup

```ts
import { CollectiveVault } from "@zhyporium/vault";

const vault = new CollectiveVault("http://localhost:3000", {
  apiKey: process.env.VAULT_API_KEY!,
  webhookSecret: process.env.VAULT_WEBHOOK_SECRET!,
});
```

- **`baseUrl`**: your Collective Vault API base URL.
- **`apiKey`**: secret API key used for authenticating HTTP requests.
- **`webhookSecret`**: shared secret used to verify webhook signatures.

### Available properties

- **`vault.currency`** – `CurrencyResource`
- **`vault.waitlists`** – `WaitlistResource`
- **`vault.products`** – `ProductResource`
- **`vault.customers`** – `CustomerResource`
- **`vault.payments`** – `PaymentResource`
- **`vault.subscriptions`** – `SubscriptionResource`
- **`vault.webhook`** – `Webhook<CollectiveVaultAPI.WebhookEvent>`

All methods throw on non‑success responses, returning strongly‑typed data on success.

---

## 2. Currency

### `vault.currency.retrieve()`

Retrieve the current currency in use.

```ts
const currency = await vault.currency.retrieve();
// type: CollectiveVaultAPI.Currency
// "USD" | "EUR" | "GBP" | "PHP"
```

---

## 3. Waitlists

### `vault.waitlists.list({ page?, limit? })`

List waitlist entries with pagination.

```ts
const result = await vault.waitlists.list({ page: 1, limit: 20 });

// type:
// {
//   waitlists: Pick<CollectiveVaultAPI.Waitlist, "id" | "name" | "email">[];
//   total: number;
//   page: number;
//   limit: number;
// }
```

### `vault.waitlists.create(body)`

Create a waitlist entry.

```ts
const waitlist = await vault.waitlists.create({
  name: "Jane Doe",
  email: "jane@example.com",
});
// type: CollectiveVaultAPI.Waitlist
```

### `vault.waitlists.retrieve(waitlistId)`

```ts
const waitlist = await vault.waitlists.retrieve("wl_123");
```

### `vault.waitlists.update(waitlistId, body)`

```ts
const waitlist = await vault.waitlists.update("wl_123", {
  name: "Jane D.",
  email: "jane@example.com",
});
```

### `vault.waitlists.delete(waitlistId)`

```ts
await vault.waitlists.delete("wl_123");
```

---

## 4. Products

### `vault.products.list({ page?, limit? })`

```ts
const result = await vault.products.list({ page: 1, limit: 20 });

// {
//   products: Pick<Product, "id" | "sku" | "name" | "price" | "type">[];
//   total: number;
//   page: number;
//   limit: number;
// }
```

### `vault.products.create(body)`

Create a product with attributes.

```ts
const created = await vault.products.create({
  product: {
    sku: "pro-monthly",
    name: "Pro Plan",
    description: "Monthly subscription",
    price: 1900,
    compareAtPrice: null,
    metadata: {},
  },
  attribute: {
    type: "SUBSCRIPTION", // or "ONE_TIME" | "CREDIT"
    subscription: {
      seats: 1,
      interval: "MONTH",
      intervalCount: 1,
    },
  },
});
// type: CollectiveVaultAPI.Product
```

### `vault.products.retrieve(productId)`

```ts
const product = await vault.products.retrieve("prod_123");
```

### `vault.products.listSubscriptions(productId, { page?, limit? })`

List subscriptions for a given product.

```ts
const subs = await vault.products.listSubscriptions("prod_123", {
  page: 1,
  limit: 20,
});

// {
//   subscriptions: Pick<CustomerSubscription, "id" | "status" | "startDate" | "endDate">[];
//   total: number;
//   page: number;
//   limit: number;
// }
```

---

## 5. Customers

### `vault.customers.list({ page?, limit? })`

```ts
const customers = await vault.customers.list({ page: 1, limit: 20 });

// {
//   customers: Pick<Customer, "id" | "name" | "email">[];
//   total: number;
//   page: number;
//   limit: number;
// }
```

### `vault.customers.create(body)`

```ts
const customer = await vault.customers.create({
  name: "Jane Doe",
  email: "jane@example.com",
  discordId: "1234567890", // optional
  metadata: {
    plan: "pro",
  },
});
// type: CollectiveVaultAPI.Customer
```

### `vault.customers.update(customerId, body)`

```ts
const updated = await vault.customers.update("cus_123", {
  name: "Jane D.",
  email: "jane@example.com",
  metadata: { plan: "enterprise" },
});
```

### `vault.customers.delete(customerId)`

```ts
await vault.customers.delete("cus_123");
```

### `vault.customers.listSubscriptions(customerId, { page?, limit? })`

```ts
const subs = await vault.customers.listSubscriptions("cus_123", {
  page: 1,
  limit: 20,
});
```

### `vault.customers.retrieveSubscriptionByProduct(customerId, productId)`

```ts
const sub = await vault.customers.retrieveSubscriptionByProduct(
  "cus_123",
  "prod_123",
);
// type: CollectiveVaultAPI.CustomerSubscription
```

---

## 6. Payments

### `vault.payments.create(body)`

Create a payment and associated transaction/subscription (if applicable).

```ts
const payment = await vault.payments.create({
  idempotentKey: "order_123", // ensure this is unique per logical payment
  customerId: "cus_123",
  productId: "prod_123",
  provider: "stripe",
  providerId: "pi_123",
  metadata: {
    orderId: "order_123",
  },
  referral: {
    accountType: "USER", // "SYSTEM" | "USER" | "DISCORD"
    accountId: "referrer_123",
    percentage: 10,
  },
  discount: {
    type: "PERCENTAGE", // or "FIXED_AMOUNT"
    percentage: 20,
  },
  customEquities: [
    {
      accountType: "USER",
      accountId: "partner_1",
      percentage: 50,
    },
  ],
});

// type: CollectiveVaultAPI.Payment
```

---

## 7. Subscriptions

### `vault.subscriptions.list({ page?, limit? })`

```ts
const result = await vault.subscriptions.list({ page: 1, limit: 20 });

// {
//   subscriptions: Pick<CustomerSubscription, "id" | "status" | "startDate" | "endDate">[];
//   total: number;
//   page: number;
//   limit: number;
// }
```

### `vault.subscriptions.retrieve(subscriptionId)`

```ts
const subscription = await vault.subscriptions.retrieve("sub_123");
// type: CollectiveVaultAPI.CustomerSubscription
```

### `vault.subscriptions.sync()`

Trigger a sync of subscriptions (implementation‑specific on the server).

```ts
await vault.subscriptions.sync();
```

---

## 8. Webhooks

The `vault.webhook` helper verifies signatures and parses the webhook body in a constant‑time manner using HMAC (default `sha256`).

### Verifying and unwrapping

```ts
import type { CollectiveVaultAPI } from "@zhyporium/vault";
import { CollectiveVault } from "@zhyporium/vault";

const vault = new CollectiveVault(process.env.VAULT_BASE_URL!, {
  apiKey: process.env.VAULT_API_KEY!,
  webhookSecret: process.env.VAULT_WEBHOOK_SECRET!,
});

// In your HTTP handler / route:
const rawBody = requestBodyAsString; // must be the exact raw body string
const headers = {
  "x-vault-signature": req.headers["x-vault-signature"] as string,
};

try {
  const event = vault.webhook.unwrap(
    rawBody,
    headers as Record<string, string>,
  ) as CollectiveVaultAPI.WebhookEvent;

  switch (event.event) {
    case "user.signin.oauth2":
      // event.payload.user, event.payload.discord, event.payload.customer
      break;
    case "currency.update":
      // event.payload.currency
      break;
    case "waitlist.created":
    case "waitlist.updated":
    case "waitlist.deleted":
      // event.payload: Waitlist
      break;
    case "product.created":
    case "product.updated":
    case "product.deleted":
      // event.payload: Product
      break;
    case "customer.created":
    case "customer.updated":
    case "customer.deleted":
      // event.payload: Customer
      break;
    case "customer.subscription.created":
    case "customer.subscription.renewed":
    case "customer.subscription.grace_started":
    case "customer.subscription.cancelled":
    case "customer.subscription.expired":
    case "customer.subscription.deleted":
      // event.payload: CustomerSubscription
      break;
    case "payment.created":
    case "payment.updated":
    case "payment.deleted":
      // event.payload: Payment
      break;
  }
} catch (error) {
  // Signature mismatch or invalid payload
}
```

If the signature is missing or invalid, `unwrap` throws a `WebhookError`.

---

## 9. Types

All public API shapes are available via the `CollectiveVaultAPI` namespace:

- **`CollectiveVaultAPI.Currency`**
- **`CollectiveVaultAPI.Product`**
- **`CollectiveVaultAPI.Customer`**
- **`CollectiveVaultAPI.Waitlist`**
- **`CollectiveVaultAPI.Payment`**
- **`CollectiveVaultAPI.Transaction`**
- **`CollectiveVaultAPI.LedgerEntry`**
- **`CollectiveVaultAPI.CustomerSubscription`**
- **`CollectiveVaultAPI.Routes`** – input/output contract for every HTTP route.
- **`CollectiveVaultAPI.WebhookEvent`** – discriminated union of webhook events.

You can import and use these types directly in your application for additional type safety:

```ts
import type { CollectiveVaultAPI } from "@zhyporium/vault";

function handlePayment(p: CollectiveVaultAPI.Payment) {
  // ...
}
```


