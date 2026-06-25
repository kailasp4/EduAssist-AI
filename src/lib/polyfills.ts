// src/lib/polyfills.ts
// Polyfill global Headers, Request, and Response for Node using undici.
// This file is imported at the very top of the server entry point (src/server/index.ts) so that fetch‑based code works in Node.

export {};

import { Headers as UndiciHeaders, Request as UndiciRequest, Response as UndiciResponse } from 'undici';

// Assign to the global object. Cast to any to avoid clashes with the DOM‑provided type definitions.
(globalThis as any).Headers = UndiciHeaders;
(globalThis as any).Request = UndiciRequest;
(globalThis as any).Response = UndiciResponse;
