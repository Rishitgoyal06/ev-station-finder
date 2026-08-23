import { NextRequest, NextResponse } from "next/server";

import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    let body;
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      body = Object.fromEntries(formData.entries());
    }

    const { email, username, password } = body;
    const loginIdentifier = email || username;

    if (!loginIdentifier || !password) {
      return NextResponse.json(
        { ok: false, error: "Please enter your Email/Username and Password" },
        { status: 400 }
      );
    }



    // Find user by email or name
    const user = await User.findOne({
      $or: [
        { email: loginIdentifier.toLowerCase() },
        { name: loginIdentifier }
      ]
    }).select("+password");

    if (!user || !user.password) {
      return NextResponse.json(
        { ok: false, error: "Invalid credentials. Please check your username/email and password." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { ok: false, error: "Invalid credentials. Please check your password." },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const res = NextResponse.json({
      ok: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    });

    res.cookies.set("chargeiq_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return res;
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Login failed" },
      { status: 500 }
    );
  }
}
