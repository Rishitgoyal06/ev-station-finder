import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await fetch('http://localhost:5555/logout', {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
      redirect: 'manual',
    });
  } catch {
    // Best effort logout
  }
  return NextResponse.json({ ok: true });
}
