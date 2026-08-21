import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("chargeiq_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return res;
}

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("chargeiq_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return res;
}
