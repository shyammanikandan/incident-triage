import { describe, expect, it } from 'vitest';
import { generateApiKey, hashApiKey } from './api-key.util.js';

describe('hashApiKey', () => {
  it('returns the same hash for the same key', () => {
    expect(hashApiKey('itk_abc')).toBe(hashApiKey('itk_abc'));
  });

  it('returns different hashes for different keys', () => {
    expect(hashApiKey('key-a')).not.toBe(hashApiKey('key-b'));
  });

  it('returns 64 hex characters', () => {
    expect(hashApiKey('itk_abc')).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe('generateApiKey', () => {
  it('creates a key with the itk_ prefix and a matching display prefix', () => {
    const { key, prefix } = generateApiKey();

    expect(key.startsWith('itk_')).toBe(true);
    expect(prefix).toHaveLength(8);
    expect(key.startsWith(prefix)).toBe(true);
  });

  it('returns the hash of the generated key', () => {
    const { key, hash } = generateApiKey();

    expect(hash).toBe(hashApiKey(key));
  });

  it('generates a different key each time', () => {
    expect(generateApiKey().key).not.toBe(generateApiKey().key);
  });
});
