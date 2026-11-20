"use client";

import React, { useState } from "react";
import { resolveReportAction } from "@/app/actions/admin.actions";
import { Trash2, CheckCircle2, AlertCircle } from "lucide-react";

interface AdminReportActionsProps {
  reportId: string;
  reportStatus: "PENDING" | "RESOLVED" | "DISMISSED";
}

export function AdminReportActions({ reportId, reportStatus }: AdminReportActionsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAction(action: "DELETE_PUBLICATION" | "DISMISS") {
    const confirmMessage =
      action === "DELETE_PUBLICATION"
        ? "Confirmez-vous la suppression définitive de cette publication signalée ?"
        : "Voulez-vous rejeter ce signalement et maintenir la publication en ligne ?";

    if (!confirm(confirmMessage)) return;

    setLoading(true);
    setError(null);

    const res = await resolveReportAction(reportId, action);
    setLoading(false);

    if (!res.ok) {
      setError(res.message);
    }
  }

  if (reportStatus !== "PENDING") {
    return (
      <span className="text-xs text-slate-400 italic">
        Signalement {reportStatus === "RESOLVED" ? "traité (publication supprimée)" : "classé sans suite"}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      {error && <span className="text-[10px] text-rose-600">{error}</span>}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleAction("DISMISS")}
          disabled={loading}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
          Classer sans suite
        </button>
        <button
          onClick={() => handleAction("DELETE_PUBLICATION")}
          disabled={loading}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Supprimer la publication
        </button>
      </div>
    </div>
  );
}
