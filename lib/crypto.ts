import "server-only";
import { createHash, createHmac, randomBytes } from "node:crypto";

export function createDeletionToken() {
  return randomBytes(32).toString("base64url");
}
export function hashDeletionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
export function scopedVisitorHash(postId: string, token: string, reaction: string) {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret) throw new Error("RATE_LIMIT_SECRET is not configured");
  return createHmac("sha256", secret).update(`${postId}:${reaction}:${token}`).digest("hex");
}
