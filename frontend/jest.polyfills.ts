// frontend/jest.polyfills.ts
// Chạy TRƯỚC toàn bộ modules: polyfill các API thiếu trong môi trường Jest
import { TextEncoder, TextDecoder } from 'util';
import { TransformStream, ReadableStream, WritableStream } from 'stream/web';

// @ts-ignore
if (!global.TextEncoder) global.TextEncoder = TextEncoder;
// @ts-ignore
if (!global.TextDecoder) global.TextDecoder = TextDecoder as any;
// @ts-ignore
if (!(global as any).TransformStream) (global as any).TransformStream = TransformStream;
// @ts-ignore
if (!(global as any).ReadableStream) (global as any).ReadableStream = ReadableStream;
// @ts-ignore
if (!(global as any).WritableStream) (global as any).WritableStream = WritableStream;

// Polyfill BroadcastChannel (MSW có thể tham chiếu trong môi trường node)
class FakeBroadcastChannel {
  name: string;
  onmessage: ((this: BroadcastChannel, ev: MessageEvent) => any) | null = null;
  constructor(name: string) {
    this.name = name;
  }
  postMessage(_message: any) {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
  // @ts-ignore
  dispatchEvent() { return true; }
}
// @ts-ignore
if (!(global as any).BroadcastChannel) (global as any).BroadcastChannel = FakeBroadcastChannel as any;
