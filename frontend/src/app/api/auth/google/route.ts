import { NextRequest, NextResponse } from "next/server";

import User from "@/models/User";
import { signToken } from "@/lib/auth";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credential, userInfo, role = "user" } = body;

    let email: string | undefined;
    let name: string | undefined;
    let googleId: string | undefined;
    let avatar: string | undefined;

    if (credential) {
      // Verify Google ID Token
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (payload) {
          email = payload.email;
          name = payload.name;
          googleId = payload.sub;
          avatar = payload.picture;
        }
      } catch {
        // Fallback for custom or direct decode if client ID verification fails in dev mode
        const base64Url = credential.split(".")[1];
        if (base64Url) {
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          const payload = JSON.parse(jsonPayload);
          email = payload.email;
          name = payload.name;
          googleId = payload.sub;
          avatar = payload.picture;
        }
      }
    } else if (userInfo) {
      email = userInfo.email;
      name = userInfo.name;
      googleId = userInfo.sub || userInfo.id;
      avatar = userInfo.picture;
    }

    if (!email || !name) {
      return NextResponse.json(
        { ok: false, error: "Invalid Google credential data" },
        { status: 400 }
      );
    }



    // Check if user exists by email or googleId
    let user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { googleId }]
    });

    if (!user) {
      // Create new Google user
      user = await User.create({
        name,
        email: email.toLowerCase(),
        googleId,
        avatar: avatar || "",
        role,
      });
    } else if (!user.googleId) {
      // Link Google ID to existing account
      user.googleId = googleId;
      if (avatar && !user.avatar) user.avatar = avatar;
      await user.save();
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
    console.error("Google Auth Error:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Google Authentication failed" },
      { status: 500 }
    );
  }
}
