"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";

export function SignupForm({
  className,
  onLoginClick,
  onSuccess,
  ...props
}: React.ComponentProps<"div"> & {
  onLoginClick?: () => void;
  onSuccess?: () => void;
}) {
  const { signup, googleLogin } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<string>("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    const res = await signup(name, email, password, role);
    setLoading(false);

    if (res.ok) {
      onSuccess?.();
      router.push(res.user?.role === "owner" ? "/owner" : res.user?.role === "admin" ? "/admin" : "/dashboard");
    } else {
      setError(res.error || "Failed to create account.");
    }
  };

  const handleGoogleSuccess = async (tokenResponse: any) => {
    setLoading(true);
    setError("");
    try {
      const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const userInfo = await userInfoRes.json();
      
      const res = await googleLogin({ userInfo, role });
      setLoading(false);
      if (res.ok) {
        onSuccess?.();
        router.push(res.user?.role === "owner" ? "/owner" : res.user?.role === "admin" ? "/admin" : "/dashboard");
      } else {
        setError(res.error || "Google Sign-Up failed.");
      }
    } catch {
      setLoading(false);
      setError("Failed to fetch Google profile info");
    }
  };

  const googleLoginTrigger = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError("Google Sign-Up popup was closed or blocked."),
  });

  const handleSimulatedGoogleSignup = async () => {
    setLoading(true);
    setError("");
    const dummyUser = {
      email: "google.user@example.com",
      name: "Google User",
      sub: "google-oauth-1001",
      picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    };
    const res = await googleLogin({ userInfo: dummyUser, role });
    setLoading(false);
    if (res.ok) {
      onSuccess?.();
      router.push(res.user?.role === "owner" ? "/owner" : res.user?.role === "admin" ? "/admin" : "/dashboard");
    } else {
      setError(res.error || "Google Sign-Up failed.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 bg-black/90 backdrop-blur-md border border-green-500/30">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold text-white">
                  Join <span className="text-green-500">Charge</span><span className="text-white">IQ</span>
                </h1>
                <p className="text-gray-300 text-sm text-balance">
                  Start your EV journey with us today
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2 rounded-lg text-center">
                  {error}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="name" className="text-white">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-black/50 border-green-500/30 text-white placeholder:text-gray-400 focus:border-green-500"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email" className="text-white">Email Address</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/50 border-green-500/30 text-white placeholder:text-gray-400 focus:border-green-500"
                />
              </Field>

              <Field>
                <FieldLabel className="text-white">Select Account Type</FieldLabel>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-black/50 border border-green-500/30 text-white rounded-md p-2 text-sm focus:border-green-500 outline-none"
                >
                  <option value="user" className="bg-gray-900 text-white">EV Owner / Driver</option>
                  <option value="owner" className="bg-gray-900 text-white">Station Owner</option>
                  <option value="worker" className="bg-gray-900 text-white">Station Operator / Worker</option>
                </select>
              </Field>

              <Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel htmlFor="password" className="text-white">Password</FieldLabel>
                    <Input 
                      id="password" 
                      type="password" 
                      required 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-black/50 border-green-500/30 text-white focus:border-green-500"
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="confirm-password" className="text-white">
                      Confirm Password
                    </FieldLabel>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      required 
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-black/50 border-green-500/30 text-white focus:border-green-500"
                    />
                  </div>
                </div>
              </Field>

              <Field>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold disabled:opacity-60 transition-all duration-200"
                >
                  {loading ? "Creating Account..." : "Create Account with Email"}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-black text-gray-400">
                Or sign up with
              </FieldSeparator>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
                      googleLoginTrigger();
                    } else {
                      handleSimulatedGoogleSignup();
                    }
                  }}
                  className="w-full border border-green-500/30 text-white bg-white/5 hover:bg-green-500/20 hover:border-green-400/60 transition-all duration-200 rounded-md flex items-center justify-center gap-3 py-3 text-sm font-medium"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="text-white font-medium">Sign up with Google</span>
                </button>
              </div>

              <FieldDescription className="text-center text-gray-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onLoginClick}
                  className="text-green-500 hover:text-green-400 underline-offset-4 hover:underline bg-transparent border-none p-0 cursor-pointer transition-colors duration-200"
                >
                  Sign in
                </button>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="bg-gradient-to-br from-green-500/20 to-black relative hidden md:block">
            <div className="absolute inset-0 flex items-center justify-center">
              <LottieAnimation 
                src="/animations/Sign up.json"
                className="w-full h-full max-w-md max-h-md"
                fallback={<div className="w-full h-full bg-green-400/10 rounded-xl animate-pulse" />}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
