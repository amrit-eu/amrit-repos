import { NextResponse } from 'next/server';
import { fetchAlertSubscriptions } from '@/lib/alertSubscriptions/fetchSubscriptions.server';

export async function GET() {
  try {
    const subscriptions = await fetchAlertSubscriptions();
    return NextResponse.json(subscriptions);
  } catch (err) {
    console.error('[get-subscriptions] Failed:', err);
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
  }
}
