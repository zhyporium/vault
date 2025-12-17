## @zhyporium/vault

**Type‑safe Collective Vault API client for TypeScript.**

`@zhyporium/vault` is a thin, fully typed wrapper around the Collective Vault HTTP API, built on top of `@zhyporium/rest`. It provides a single `CollectiveVault` client with strongly‑typed resources for currency, waitlists, products, customers, payments, subscriptions, and webhook handling.

### Installation

```bash
pnpm add @zhyporium/vault
# or
npm install @zhyporium/vault
# or
yarn add @zhyporium/vault
```

### Quick start

```ts
import { CollectiveVault } from "@zhyporium/vault";

const vault = new CollectiveVault("http://localhost:3000", {
  apiKey: process.env.VAULT_API_KEY!,
  webhookSecret: process.env.VAULT_WEBHOOK_SECRET!,
});
```

The client exposes the following resources:

- **`vault.currency`** – retrieve the current currency.
- **`vault.waitlists`** – manage waitlist entries.
- **`vault.products`** – list/create products and inspect subscriptions per product.
- **`vault.customers`** – list/create/update/delete customers and inspect their subscriptions.
- **`vault.payments`** – create payments.
- **`vault.subscriptions`** – list/retrieve/sync subscriptions.
- **`vault.webhook`** – verify and unwrap webhook payloads.

### Examples

- **Get active currency**

```ts
const currency = await vault.currency.retrieve();
// currency: "USD" | "EUR" | "GBP" | "PHP"
```

- **Work with waitlists**

```ts
const list = await vault.waitlists.list({ page: 1, limit: 20 });
const created = await vault.waitlists.create({ name: "Jane Doe", email: "jane@example.com" });
const updated = await vault.waitlists.update(created.id, {
  name: "Jane D.",
  email: "jane@example.com",
});
await vault.waitlists.delete(created.id);
```

- **Manage products**

```ts
const products = await vault.products.list({ page: 1, limit: 10 });

const product = await vault.products.create({
  product: {
    sku: "pro-monthly",
    name: "Pro Plan",
    description: "Monthly subscription",
    price: 1900,
    compareAtPrice: null,
    metadata: {},
  },
  attribute: {
    type: "SUBSCRIPTION",
    subscription: {
      seats: 1,
      interval: "MONTH",
      intervalCount: 1,
    },
  },
});
```

- **Manage customers and subscriptions**

```ts
const customers = await vault.customers.list({ page: 1, limit: 20 });

const customer = await vault.customers.create({
  name: "Jane Doe",
  email: "jane@example.com",
});

const subs = await vault.customers.listSubscriptions(customer.id, { page: 1, limit: 10 });
```

- **Create a payment**

```ts
const payment = await vault.payments.create({
  idempotentKey: "order_123",
  customerId: customer.id,
  productId: product.id,
  provider: "stripe",
  providerId: "pi_123",
});
```

- **Subscriptions**

```ts
const subscriptions = await vault.subscriptions.list({ page: 1, limit: 20 });
const subscription = await vault.subscriptions.retrieve("sub_123");
await vault.subscriptions.sync();
```

### Webhooks

`CollectiveVault` ships with a small helper for verifying webhook signatures and parsing the payload. Signatures use an HMAC (default `sha256`) with constant‑time comparison.

```ts
import type { CollectiveVaultAPI } from "@zhyporium/vault";
import { CollectiveVault } from "@zhyporium/vault";

const vault = new CollectiveVault(process.env.VAULT_BASE_URL!, {
  apiKey: process.env.VAULT_API_KEY!,
  webhookSecret: process.env.VAULT_WEBHOOK_SECRET!,
});

// Example in a Node HTTP handler / framework route:
const rawBody = requestBodyAsString; // ensure this is the raw string body
const headers = {
  "x-vault-signature": req.headers["x-vault-signature"] as string,
};

try {
  const event = vault.webhook.unwrap(
    rawBody,
    headers as Record<string, string>,
  ) as CollectiveVaultAPI.WebhookEvent;

  switch (event.event) {
    case "payment.created":
      // handle payment
      break;
    case "customer.subscription.created":
      // handle subscription
      break;
    // ...
  }
} catch (error) {
  // invalid signature or payload
}
```

### Types & API surface

All routes and payloads are described in the `CollectiveVaultAPI` namespace (exported types), including:

- **`CollectiveVaultAPI.Routes`** – input/output for every HTTP route.
- **`CollectiveVaultAPI.Product`**, **`Customer`**, **`Waitlist`**, **`Payment`**, **`CustomerSubscription`**, etc.
- **`CollectiveVaultAPI.WebhookEvent`** – discriminated union for webhook events.

These types power full compile‑time type checking for all resource methods.

### Development

- **Build**: `pnpm build`
- **Tests**: `pnpm test`
- **Typecheck**: `pnpm typecheck`

This package is MIT‑licensed. See `LICENSE` for details.