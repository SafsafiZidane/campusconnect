"use client";

import React, { useState } from "react";
import { ProposalDetailDTO } from "@/application/use-cases/help-request/get-help-request-by-id.use-case";
import { acceptProposalAction, rejectProposalAction } from "@/app/actions/proposal.actions";
import { Check, X, Clock, Award, CheckCircle, XCircle } from "lucide-react";

interface ProposalListProps {
  proposals: ProposalDetailDTO[];
  requestId: string;
  isAuthor: boolean;
  requestStatus: "OPEN" | "ACCEPTED" | "COMPLETED";
}

export function ProposalList({
  proposals,
  requestId,
  isAuthor,
  requestStatus,
}: ProposalListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleAccept(proposalId: string) {
    if (!confirm("Voulez-vous accepter cette proposition ? La demande passera au statut 'Aide acceptée'.")) {
      return;
    }
    setLoadingId(proposalId);
    setActionError(null);

    const res = await acceptProposalAction(proposalId, requestId);
    setLoadingId(null);
    if (!res.ok) {
      setActionError(res.message);
    }
  }

  async function handleReject(proposalId: string) {
    if (!confirm("Voulez-vous refuser cette proposition ?")) {
      return;
    }
    setLoadingId(proposalId);
    setActionError(null);

    const res = await rejectProposalAction(proposalId, requestId);
    setLoadingId(null);
    if (!res.ok) {
      setActionError(res.message);
    }
  }

  if (proposals.length === 0) {
    return (
      <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-sm">
        Aucune proposition d&apos;aide n&apos;a encore été déposée.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actionError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
          {actionError}
        </div>
      )}

      {proposals.map((proposal) => {
        const isPending = proposal.status === "PENDING";
        const isAccepted = proposal.status === "ACCEPTED";
        const isRejected = proposal.status === "REJECTED";

        return (
          <div
            key={proposal.id}
            className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              isAccepted
                ? "bg-indigo-50/70 border-indigo-200 shadow-sm"
                : isRejected
                ? "bg-slate-50 border-slate-200 opacity-60"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            {/* Header: Helper Info & Status */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  {proposal.helper.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {proposal.helper.name}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      <Award className="w-3 h-3 text-amber-600" />
                      {proposal.helper.reputationPoints} pts
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {proposal.helper.speciality} &bull; {proposal.helper.level}
                  </span>
                </div>
              </div>

              {/* Status Indicator */}
              <div>
                {isAccepted && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Acceptée
                  </span>
                )}
                {isRejected && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                    <XCircle className="w-3.5 h-3.5" />
                    Refusée
                  </span>
                )}
                {isPending && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                    <Clock className="w-3.5 h-3.5" />
                    En attente
                  </span>
                )}
              </div>
            </div>

            {/* Helper Message */}
            <p className="text-sm text-slate-700 leading-relaxed bg-white/70 p-3 rounded-xl border border-slate-100 mb-3">
              {proposal.message}
            </p>

            {/* Availability proposed */}
            {proposal.proposedAvailability && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3 font-medium">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Disponibilité : {proposal.proposedAvailability}</span>
              </div>
            )}

            {/* Helper Skills */}
            {proposal.helper.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {proposal.helper.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-md text-[11px] bg-slate-100 text-slate-600 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Author Actions (Only if author, and request is OPEN, and proposal is PENDING) */}
            {isAuthor && requestStatus === "OPEN" && isPending && (
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60">
                <button
                  type="button"
                  disabled={loadingId === proposal.id}
                  onClick={() => handleReject(proposal.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Refuser
                </button>
                <button
                  type="button"
                  disabled={loadingId === proposal.id}
                  onClick={() => handleAccept(proposal.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  Accepter l&apos;aide
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
