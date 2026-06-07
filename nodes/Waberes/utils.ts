import { createHmac, createHash, timingSafeEqual } from "crypto";

export function signRequest(
  method: string,
  path: string,
  body: string,
  secretKey: string,
): { signature: string; timestamp: string } {
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const bodyHash = createHash('sha256').update(body, 'utf8').digest('hex');
  const payload = `${method.toUpperCase()}${path}${timestamp}${bodyHash}`;
  const signature = createHmac('sha256', secretKey).update(payload).digest('hex');

  return { signature, timestamp };
}

export function verifyWebhookSignature(
  payload: string,
  signature: string | undefined | null,
  webhookId: string | undefined | null,
  timestamp: string | undefined | null,
  secret: string,
): boolean {
  if (!signature || !webhookId || !timestamp) return false;

  const expectedSignature = createHmac('sha256', secret)
    .update(webhookId + timestamp)
    .update(payload, 'utf8')
    .digest('hex');

  const sigBuffer = Buffer.from(signature, 'hex');
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');

  if (sigBuffer.length !== expectedBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, sigBuffer);
}