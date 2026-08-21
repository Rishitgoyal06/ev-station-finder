import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('http://localhost:5555/', {
      headers: {
        // Forward cookies for session-based auth
        cookie: request.headers.get('cookie') || '',
      },
      redirect: 'manual', // Don't follow redirects — a redirect means not authenticated
    });

    // Flask redirects to /login when not authenticated
    if (response.status === 302 || response.status === 301) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    if (response.ok) {
      return NextResponse.json({ authenticated: true }, { status: 200 });
    }

    return NextResponse.json({ authenticated: false }, { status: 200 });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
