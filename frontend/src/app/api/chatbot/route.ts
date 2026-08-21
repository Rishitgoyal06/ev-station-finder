import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, language = 'en' } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Make request to Flask chatbot backend
    const flaskResponse = await fetch('http://localhost:5555/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        language,
      }),
    });

    if (!flaskResponse.ok) {
      throw new Error(`Flask server responded with status: ${flaskResponse.status}`);
    }

    const data = await flaskResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Chatbot API Error:', error);
    
    // Return a fallback response if Flask server is not available
    return NextResponse.json({
      answer: "I'm currently unavailable. Please make sure the EV Assistant backend is running. You can start it by running 'python app.py' in the ChatBot folder."
    });
  }
}