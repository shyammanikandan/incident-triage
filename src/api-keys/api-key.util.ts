import { createHash, randomBytes } from 'node:crypto';

const KEY_PREFIX = 'itk_';
const DISPLAY_LENGTH = 8;

export function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex');
}

export function generateApiKey() {
  const key = KEY_PREFIX + randomBytes(32).toString('base64url');

  return {
    key,
    prefix: key.slice(0, DISPLAY_LENGTH),
    hash: hashApiKey(key),
  };
}
