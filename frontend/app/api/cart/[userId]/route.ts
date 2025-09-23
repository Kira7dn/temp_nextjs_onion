import { createAddItemToCart } from '@presentation/dependency/cart';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const useCase = createAddItemToCart();
    // Temporary: access repo directly
    const repo = (useCase as any).repo;
    const cart = await repo.load(params.userId);
    return NextResponse.json({ items: cart?.getItems() ?? [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load cart' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const body = await request.json();
    const useCase = createAddItemToCart();
    await useCase.execute(params.userId, body.productId, body.qty);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 });
  }
}
