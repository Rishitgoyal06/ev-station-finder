import { NextRequest, NextResponse } from 'next/server';

// Local dev: http://localhost:5555
// Production: set CHATBOT_BASE_URL env var in Vercel to your Render chatbot URL
const CHATBOT_BASE_URL =
  process.env.CHATBOT_BASE_URL || 'http://localhost:5555';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, language = 'en' } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const flaskResponse = await fetch(`${CHATBOT_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language }),
    });

    if (!flaskResponse.ok) {
      throw new Error(`Chatbot service responded with status: ${flaskResponse.status}`);
    }

    const data = await flaskResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Chatbot API Error:', error);
    return NextResponse.json({
      answer: "I'm currently unavailable. The EV Assistant service may be starting up — please try again in a moment.",
    });
  }
}
