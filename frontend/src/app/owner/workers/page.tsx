"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

type Worker = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
};

export default function OwnerWorkersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) router.replace("/");
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/users");
        if (res.ok) {
          const data = await res.json();
          // Filter to only worker role accounts
          setWorkers((data.users || []).filter((u: Worker) => u.role === "worker"));
        }
      } catch {
        setWorkers([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (isAuthenticated) load();
  }, [isAuthenticated]);

  const handleInvite = () => {
    const subject = encodeURIComponent("Join ChargeIQ as a Station Worker");
    const body = encodeURIComponent(
      `Hi,\n\nYou've been invited to join ChargeIQ as a station worker.\n\nPlease sign up at: ${window.location.origin}/signup\n\nWhen registering, select "Worker" as your role.\n\nOnce registered, you'll have access to the worker dashboard to manage station slots and bookings.\n\nThanks`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      <div className="bg-[#111] border-b border-[#1a1a1a] px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-[#1f1f1f] rounded-xl transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold">Workers Management</h1>
              <p className="text-sm text-gray-400">Station workers registered on ChargeIQ</p>
            </div>
          </div>
          <button
            onClick={handleInvite}
            className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-medium rounded-lg transition-colors text-sm"
          >
            + Invite Worker
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1f1f1f] rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#1f1f1f] rounded w-1/3" />
                    <div className="h-3 bg-[#1f1f1f] rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : workers.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#111] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Workers Yet</h3>
            <p className="text-gray-400 text-sm mb-2">Workers who register with the "Worker" role will appear here.</p>
            <p className="text-xs text-gray-500 mb-6">
              Ask them to sign up at <span className="text-green-400 font-mono">/signup</span> and choose the Worker role.
            </p>
            <button
              onClick={handleInvite}
              className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Send Invite Email
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-400 mb-4">{workers.length} worker{workers.length !== 1 ? "s" : ""} registered</p>
            {workers.map((worker) => (
              <div key={worker.id} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">
                    {worker.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{worker.name}</p>
                    <p className="text-sm text-gray-400">{worker.email}</p>
                    {worker.createdAt && (
                      <p className="text-xs text-gray-600">
                        Joined {new Date(worker.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                      </p>
                    )}
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-medium">
                  Worker
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
