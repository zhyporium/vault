import { createHmac, timingSafeEqual } from "crypto";

export class WebhookError extends Error {
  public constructor(message: string) {
    super(message);
  }
}

export class Webhook<WebhookPayload> {
  public constructor(
    private options: {
      secret: string;
      signatureHeader: string;
      algorithm?: string;
    }
  ) {}

  public verifySignature(body: string, signature: string) {
    // 1. Compute expected HMAC as raw buffer (NOT hex string)
    const expected = createHmac(
      this.options.algorithm || "sha256",
      this.options.secret
    )
      .update(body)
      .digest(); // Buffer

    // 2. Decode provided signature — if invalid, normalize timing
    let provided: Buffer;

    try {
      provided = Buffer.from(signature, "hex");
    } catch {
      // normalize timing to avoid leaking invalid hex vs wrong signature
      timingSafeEqual(expected, expected);

      return false;
    }

    // 3. Length mismatch handling — must normalize timing
    if (provided.length !== expected.length) {
      timingSafeEqual(expected, expected); // normalize timing

      return false;
    }

    // 4. Constant-time comparison
    return timingSafeEqual(provided, expected);
  }

  public unwrap(body: string, headers: Record<string, string>): WebhookPayload {
    if (!headers[this.options.signatureHeader]) {
      throw new WebhookError(
        `Signature header '${this.options.signatureHeader}' was not provided`
      );
    }

    if (this.verifySignature(body, headers[this.options.signatureHeader])) {
      try {
        return JSON.parse(body) as WebhookPayload;
      } catch (error) {
        throw new WebhookError("Invalid webhook payload");
      }
    }

    throw new WebhookError("Invalid webhook signature");
  }
}
