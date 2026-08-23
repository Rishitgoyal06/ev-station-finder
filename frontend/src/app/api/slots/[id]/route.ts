import { NextRequest, NextResponse } from "next/server";
import { BACKEND_BASE_URL, getForwardHeaders } from "@/lib/backend";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/slots/${params.id}`, {
      method: "PATCH",
      headers: getForwardHeaders(request),
      body: await request.text(),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Slot update error:", error);
    return NextResponse.json({ error: "Failed to update slot" }, { status: 500 });
  }
}
