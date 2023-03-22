import * as fetch from 'node-fetch';

(global as any).fetch = fetch.default;
(globalThis as any).fetch = fetch.default;
