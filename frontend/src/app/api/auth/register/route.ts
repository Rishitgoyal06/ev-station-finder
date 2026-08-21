import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
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

    const { name, username, email, password, role = "user" } = body;
    const displayName = name || username;

    if (!displayName || !email || !password) {
      return NextResponse.json(
        { ok: false, error: "Please fill in all required fields (Name/Username, Email, Password)" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { ok: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: displayName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });

    const token = signToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });

    const res = NextResponse.json({
      ok: true,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
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
    console.error("Register Error:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Registration failed. Database error." },
      { status: 500 }
    );
  }
}
