import { createHmac, timingSafeEqual } from "node:crypto";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function encodeBase32(input) {
  const bytes = Buffer.from(input);
  let bits = 0;
  let value = 0;
  let output = "";
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  return output;
}

export function decodeBase32(value) {
  const normalized = String(value).toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = 0;
  let buffer = 0;
  const bytes = [];
  for (const char of normalized) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index < 0) throw new Error("Invalid base32 secret");
    buffer = (buffer << 5) | index;
    bits += 5;
    if (bits >= 8) {
      bytes.push((buffer >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

export function generateTotp(secret, counter) {
  if (!Number.isSafeInteger(counter) || counter < 0) throw new Error("Invalid TOTP counter");
  const key = decodeBase32(secret);
  const message = Buffer.alloc(8);
  message.writeBigUInt64BE(BigInt(counter));
  const digest = createHmac("sha1", key).update(message).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary = ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);
  return String(binary % 1_000_000).padStart(6, "0");
}

export function verifyTotp(secret, code, nowMs = Date.now(), lastAcceptedCounter = -1) {
  if (!/^\d{6}$/.test(String(code))) return null;
  const currentCounter = Math.floor(nowMs / 30_000);
  for (const counter of [currentCounter, currentCounter - 1, currentCounter + 1]) {
    if (counter <= lastAcceptedCounter || counter < 0) continue;
    const expected = Buffer.from(generateTotp(secret, counter));
    const supplied = Buffer.from(String(code));
    if (expected.length === supplied.length && timingSafeEqual(expected, supplied)) return counter;
  }
  return null;
}
