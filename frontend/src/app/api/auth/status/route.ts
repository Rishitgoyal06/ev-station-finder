import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("chargeiq_token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }


    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
