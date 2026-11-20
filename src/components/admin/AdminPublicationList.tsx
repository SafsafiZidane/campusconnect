"use client";

import React, { useState } from "react";
import Link from "next/link";
import { adminDeletePublicationAction } from "@/app/actions/admin.actions";
import { Trash2, Eye, AlertTriangle, MessageSquare } from "lucide-react";

interface AdminPublication {
  id: string;
  title: string;
  subject: string;
  level: string;
  status: string;
  isReported: boolean;
  authorName: string;
  authorEmail: string;
  proposalCount: number;
  createdAt: string;
}

interface AdminPublicationListProps {
  publications: AdminPublication[];
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Ouverte", color: "bg-emerald-100 text-emerald-800" },
  ACCEPTED: { label: "En cours", color: "bg-blue-100 text-blue-800" },
  COMPLETED: { label: "Terminée", color: "bg-slate-100 text-slate-600" },
};

export function AdminPublicationList({ publications }: AdminPublicationListProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(requestId: string, title: string) {
    if (
      !confirm(
        `Confirmez-vous la suppression définitive de la publication "${title}" ?\n\nToutes les propositions et avis liés seront également supprimés.`
      )
    )
      return;

    setLoading(requestId);
    setError(null);
    const res = await adminDeletePublicationAction(requestId);
    setLoading(null);
    if (!res.ok) {
      setError(res.message);
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700 font-medium">
          {error}
        </div>
      )}

      {/* Table header (desktop only) */}
      <div className="hidden lg:grid lg:grid-cols-[1.5fr_1fr_100px_100px_100px_120px] gap-4 px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        <span>Publication</span>
        <span>Auteur</span>
        <span>Statut</span>
        <span>Propositions</span>
        <span>Créée le</span>
        <span className="text-right">Actions</span>
      </div>

      {publications.map((pub) => {
        const statusInfo = STATUS_LABELS[pub.status] || {
          label: pub.status,
          color: "bg-slate-100 text-slate-600",
        };

        return (
          <div
            key={pub.id}
            className={`bg-white rounded-2xl border shadow-sm p-5 lg:px-6 lg:py-4 lg:grid lg:grid-cols-[1.5fr_1fr_100px_100px_100px_120px] lg:items-center gap-4 ${
              pub.isReported ? "border-rose-200 ring-1 ring-rose-100" : "border-slate-200"
            }`}
          >
            {/* Title & Subject */}
            <div className="mb-3 lg:mb-0">
              <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                {pub.isReported && (
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                )}
                <span className="truncate">{pub.title}</span>
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-slate-500">{pub.subject}</span>
                <span className="text-[10px] text-slate-300">&bull;</span>
                <span className="text-[11px] text-slate-500">{pub.level}</span>
              </div>
            </div>

            {/* Author */}
            <div className="mb-2 lg:mb-0">
              <p className="text-xs font-semibold text-slate-700">{pub.authorName}</p>
              <p className="text-[11px] text-slate-400">{pub.authorEmail}</p>
            </div>

            {/* Status */}
            <div className="mb-2 lg:mb-0">
              <span
                className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusInfo.color}`}
              >
                {statusInfo.label}
              </span>
            </div>

            {/* Proposals count */}
            <div className="flex items-center gap-1.5 mb-2 lg:mb-0">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-sm font-bold text-slate-700">{pub.proposalCount}</span>
            </div>

            {/* Created date */}
            <div className="text-xs text-slate-500 mb-3 lg:mb-0">
              {new Date(pub.createdAt).toLocaleDateString("fr-FR")}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
              <Link
                href={`/requests/${pub.id}`}
                target="_blank"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Voir
              </Link>
              <button
                onClick={() => handleDelete(pub.id, pub.title)}
                disabled={loading === pub.id}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {loading === pub.id ? "..." : "Supprimer"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
