// frontend/jest.setup.ts
// Polyfill phải ở TRƯỚC khi import MSW server để tránh lỗi khi load module
import { TextEncoder, TextDecoder } from 'util';
// @ts-ignore
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder as any;

import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Bật MSW cho unit/integration test
import { server } from './tests/msw/server';
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
