// src/lib/httpHeaders.ts
/**
 * Unified header creator – works both in browsers and in Node (via undici).
 * Returns a Headers instance compatible with the native fetch API.
 */
export function createHeaders(init?: HeadersInit): Headers {
  // Browser environment provides a global `Headers` class.
  // In a Node environment we fall back to the implementation from `undici`.
  const HeadersClass: typeof Headers = (globalThis as any).Headers
    ? (globalThis as any).Headers
    : // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('undici').Headers;

  return new HeadersClass(init);
}
