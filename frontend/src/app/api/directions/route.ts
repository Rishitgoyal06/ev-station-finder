import { NextRequest, NextResponse } from "next/server";
import { BACKEND_BASE_URL } from "@/lib/backend";

export async function GET(request: NextRequest) {
  try {
    const upstream = await fetch(
      `${BACKEND_BASE_URL}/directions?${request.nextUrl.searchParams.toString()}`,
      { cache: "no-store" },
    );

    const body = await upstream.text();
    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Directions backend request failed:", error);
    return NextResponse.json(
      { detail: "Unable to reach the directions service" },
      { status: 502 },
    );
  }
}
