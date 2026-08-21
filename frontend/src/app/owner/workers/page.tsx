"use client";
import { useRouter } from "next/navigation";

export default function OwnerWorkersPage() {
  const router = useRouter();

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
              <p className="text-sm text-gray-400">Manage station workers and permissions</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-medium rounded-lg transition-colors">
            + Invite Worker
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-[#111] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Workers Management</h3>
          <p className="text-gray-400 mb-6">Invite and manage workers for your charging stations</p>
          <button onClick={() => router.push('/owner')} className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-xl font-semibold transition-colors">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}