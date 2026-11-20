"use client";

import React, { useState } from "react";
import { completeSessionAction } from "@/app/actions/request.actions";
import { CheckCheck, AlertCircle } from "lucide-react";

interface CompleteSessionButtonProps {
  requestId: string;
}

export function CompleteSessionButton({ requestId }: CompleteSessionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleComplete() {
    if (!confirm("Confirmez-vous que la séance d'entraide a bien été effectuée ? Cela clôturera la demande et débloquera les évaluations.")) {
      return;
    }

    setLoading(true);
    setError(null);
    const res = await completeSessionAction(requestId);
    setLoading(false);

    if (!res.ok) {
      setError(res.message);
    }
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <button
        onClick={handleComplete}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-100 transition-all"
      >
        <CheckCheck className="w-4 h-4" />
        {loading ? "Clôture en cours..." : "Marquer la séance comme réalisée / terminée"}
      </button>
    </div>
  );
}
