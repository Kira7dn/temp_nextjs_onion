// frontend/tests/msw/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Ví dụ mock API: lấy giỏ hàng theo userId (MSW v2 API)
  // Dùng path-only để khớp mọi origin trong JSDOM
  http.get('/api/cart/:userId', ({ params }) => {
    const { userId } = params as { userId: string };
    return HttpResponse.json(
      { items: [{ productId: 'p1', quantity: userId === 'user1' ? 1 : 0 }] },
      { status: 200 }
    );
  }),
  // Lưu giỏ hàng
  http.post('/api/cart/:userId', async ({ request }) => {
    const _body = await request.json().catch(() => ({}));
    return HttpResponse.json({ ok: true }, { status: 200 });
  }),
];
