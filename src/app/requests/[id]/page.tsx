import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useCases } from "@/container";
import { getCurrentSession } from "@/lib/auth/session";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProposalForm } from "@/components/proposals/ProposalForm";
import { ProposalList } from "@/components/proposals/ProposalList";
import { CompleteSessionButton } from "@/components/requests/CompleteSessionButton";
import { EditRequestModal } from "@/components/requests/EditRequestModal";
import { ReviewModal } from "@/components/reviews/ReviewModal";
import { ReportModal } from "@/components/requests/ReportModal";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  User,
  Award,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  Star,
} from "lucide-react";

interface RequestDetailPageProps {
  params: {
    id: string;
  };
}

export const revalidate = 0;

export default async function RequestDetailPage({ params }: RequestDetailPageProps) {
  const session = await getCurrentSession();

  const result = await useCases.getHelpRequestById.execute(params.id, session?.id);
  if (!result.ok) {
    notFound();
  }

  const request = result.value;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Top back navigation & report action */}
      <div className="flex items-center justify-between">
        <Link
          href="/requests"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux demandes
        </Link>
        <ReportModal requestId={request.id} />
      </div>

      {/* Main Request Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-sm space-y-6">
        {/* Header Tags & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              <BookOpen className="w-3.5 h-3.5" />
              {request.subject}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
              Niveau : {request.level}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={request.status} />
            {request.isAuthor && request.status !== "COMPLETED" && (
              <EditRequestModal
                request={{
                  id: request.id,
                  title: request.title,
                  description: request.description,
                  subject: request.subject,
                  level: request.level,
                  availability: request.availability,
                }}
              />
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
            {request.title}
          </h1>
          <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-5 rounded-2xl border border-slate-100">
            {request.description}
          </p>
        </div>

        {/* Metadata info: Availability, Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>
              <strong>Disponibilité souhaitée :</strong> {request.availability}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 sm:justify-end">
            <span>Publiée le {new Date(request.createdAt).toLocaleDateString("fr-FR")}</span>
          </div>
        </div>

        {/* Author & Helper Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          {/* Author info */}
          <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/70 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {request.author.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">{request.author.name}</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">
                  Auteur
                </span>
              </div>
              <span className="text-xs text-slate-500 block">
                {request.author.speciality} &bull; {request.author.level}
              </span>
            </div>
          </div>

          {/* Assigned Helper if accepted or completed */}
          {request.selectedHelper ? (
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                {request.selectedHelper.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">
                    {request.selectedHelper.name}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    Tuteur choisi
                  </span>
                </div>
                <span className="text-xs text-slate-500 block">
                  {request.selectedHelper.speciality} &bull; {request.selectedHelper.reputationPoints} pts
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center gap-3 text-slate-400">
              <HelpCircle className="w-8 h-8" />
              <span className="text-xs">En attente de sélection d&apos;un tuteur bénévole</span>
            </div>
          )}
        </div>

        {/* Action button to complete session (When status is ACCEPTED) */}
        {request.status === "ACCEPTED" && request.isParticipant && (
          <div className="pt-2">
            <CompleteSessionButton requestId={request.id} />
          </div>
        )}
      </div>

      {/* Review Section (After completion, for participants) */}
      {request.status === "COMPLETED" && request.isParticipant && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            Évaluation de la séance
          </h2>

          {request.hasUserReviewed ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Vous avez déjà partagé votre évaluation pour cette séance terminée. Merci !</span>
            </div>
          ) : (
            <ReviewModal
              requestId={request.id}
              partnerName={
                request.isAuthor
                  ? request.selectedHelper?.name || "votre tuteur"
                  : request.author.name
              }
            />
          )}
        </section>
      )}

      {/* Proposals Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            Propositions d&apos;entraide
            <span className="ml-1 text-sm font-semibold text-slate-500">
              ({request.proposals.length})
            </span>
          </h2>
          {request.status === "COMPLETED" && (
            <span className="text-xs text-slate-500 font-medium">
              Demande clôturée : aucune nouvelle proposition acceptée
            </span>
          )}
        </div>

        {/* Propose Help Form (If another student, request is OPEN, and hasn't proposed) */}
        {request.canUserPropose && (
          <ProposalForm requestId={request.id} />
        )}

        {!session && request.status === "OPEN" && (
          <div className="p-6 bg-indigo-50/60 border border-indigo-100 rounded-2xl text-center space-y-2">
            <p className="text-sm text-indigo-900 font-semibold">
              Vous maîtrisez ce sujet et souhaitez aider cet étudiant ?
            </p>
            <p className="text-xs text-indigo-700">
              Connectez-vous pour lui proposer votre soutien et gagner des points de réputation.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
              >
                Se connecter pour proposer son aide
              </Link>
            </div>
          </div>
        )}

        {/* Proposals List */}
        <ProposalList
          proposals={request.proposals}
          requestId={request.id}
          isAuthor={request.isAuthor}
          requestStatus={request.status}
        />
      </section>
    </div>
  );
}
