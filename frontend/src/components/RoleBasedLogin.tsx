"use client";
import { useState } from "react";
import { useRole, UserRole } from "@/contexts/RoleContext";

interface RoleBasedLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RoleBasedLogin({ isOpen, onClose }: RoleBasedLoginProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useRole();

  const roles = [
    {
      id: "customer" as UserRole,
      name: "Customer",
      description: "Book and manage charging sessions",
      icon: "👤",
      demoEmail: "customer@test.com"
    },
    {
      id: "owner" as UserRole,
      name: "Station Owner",
      description: "Manage your charging stations",
      icon: "🏢",
      demoEmail: "owner@test.com"
    },
    {
      id: "worker" as UserRole,
      name: "Station Worker",
      description: "Update slot status and assist customers",
      icon: "👷",
      demoEmail: "worker@test.com"
    },
    {
      id: "admin" as UserRole,
      name: "Admin",
      description: "System administration and oversight",
      icon: "⚙️",
      demoEmail: "admin@test.com"
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password, selectedRole);
      if (success) {
        onClose();
      } else {
        setError("Invalid credentials. Try password: password123");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (role: UserRole) => {
    const roleData = roles.find(r => r.id === role);
    if (roleData) {
      setEmail(roleData.demoEmail);
      setPassword("password123");
      setSelectedRole(role);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Sign In</h2>
              <p className="text-sm text-gray-400">Choose your role and sign in</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#1f1f1f] rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">Select Role</h3>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    selectedRole === role.id
                      ? "bg-green-500/20 border border-green-500/40"
                      : "bg-[#161616] border border-[#2a2a2a] hover:border-[#3a3a3a]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{role.icon}</span>
                    <span className={`font-medium text-sm ${
                      selectedRole === role.id ? "text-green-400" : "text-white"
                    }`}>
                      {role.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{role.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mb-6 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="text-xs font-medium text-blue-400">Demo Mode</span>
            </div>
            <p className="text-xs text-blue-300 mb-2">Use these credentials to test different roles:</p>
            <div className="space-y-1">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => fillDemoCredentials(role.id)}
                  className="block text-xs text-blue-200 hover:text-blue-100 transition-colors"
                >
                  {role.name}: {role.demoEmail}
                </button>
              ))}
            </div>
            <p className="text-xs text-blue-300 mt-2">Password: password123</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-500/50 text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In as {roles.find(r => r.id === selectedRole)?.name}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Don't have an account? 
              <button className="text-green-400 hover:text-green-300 ml-1">
                Contact admin
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}