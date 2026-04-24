"use client";

import { useEffect } from "react";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);
  return (
    <div className="px-10 py-10">
      <div className="rounded-lg border border-danger-400 bg-danger-50 p-6 text-danger-600 max-w-xl">
        <h2 className="text-[18px] font-semibold mb-2">Couldn&rsquo;t load admin view</h2>
        <p className="text-[13px] mb-4 opacity-80">{error.message || "Unknown error"}</p>
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 rounded-sm bg-danger-600 text-white text-[13px] font-medium hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
