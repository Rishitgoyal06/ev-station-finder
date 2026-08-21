import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();

    const flaskResponse = await fetch('http://localhost:5555/login', {
      method: 'POST',
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
      body: body,
      redirect: 'manual',
    });

    // Forward set-cookie header so the browser gets the Flask session cookie
    const setCookie = flaskResponse.headers.get('set-cookie');
    const res = NextResponse.json(
      { ok: flaskResponse.ok || flaskResponse.status === 302 },
      { status: 200 }
    );
    if (setCookie) {
      res.headers.set('set-cookie', setCookie);
    }
    return res;
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
