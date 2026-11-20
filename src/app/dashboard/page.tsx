import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useCases } from "@/container";
import { getCurrentSession } from "@/lib/auth/session";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RatingStars } from "@/components/ui/RatingStars";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  LayoutDashboard,
  PlusCircle,
  Clock,
  BookOpen,
  MessageSquare,
  Award,
  Star,
  CheckCircle2,
  CalendarCheck,
  User,
  ArrowRight,
} from "lucide-react";

export const revalidate = 0;

export default async function DashboardPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  const result = await useCases.getStudentDashboard.execute(session.id);
  if (!result.ok) {
    throw new Error(result.message);
  }

  const { student, myRequests, myProposals, completedSessions, reviewsReceived } =
    result.value;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* Top Banner / Student Profile Highlights */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-9 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white text-indigo-700 font-black text-2xl flex items-center justify-center shadow-lg">
            {student.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight">{student.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-indigo-100">
                {student.level}
              </span>
            </div>
            <p className="text-xs text-indigo-200">
              {student.speciality} &bull; {student.email}
            </p>
            {/* Badges list */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {student.badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400 text-indigo-950 shadow-sm"
                >
                  <Award className="w-3 h-3 text-indigo-950" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Reputation stats & Quick action */}
        <div className="flex flex-wrap items-center gap-4 self-stretch md:self-auto justify-between md:justify-end">
          <div className="bg-white/10 backdrop-blur px-5 py-3 rounded-2xl border border-white/10 text-center">
            <span className="text-2xl font-extrabold text-amber-300 block">
              {student.reputationPoints}
            </span>
            <span className="text-[11px] text-indigo-200 uppercase font-bold tracking-wider">
              Points Réputation
            </span>
          </div>
          <Link
            href="/requests/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-bold text-sm rounded-2xl shadow-md transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            Nouvelle demande
          </Link>
        </div>
      </div>

      {/* 3 Main Sections according to PDF requirement: */}
      {/* "demandes publiées, aides proposées et séances réalisées" */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section 1: Demandes publiées */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Mes demandes publiées
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-bold">
                {myRequests.length}
              </span>
            </h2>
          </div>

          {myRequests.length === 0 ? (
            <div className="p-6 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-500 mb-3">Vous n&apos;avez publié aucune demande.</p>
              <Link
                href="/requests/new"
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                + Créer une demande
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-2 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-indigo-600">{req.subject}</span>
                    <StatusBadge status={req.status} />
                  </div>
                  <Link
                    href={`/requests/${req.id}`}
                    className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors block line-clamp-1"
                  >
                    {req.title}
                  </Link>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {req.proposalsCount} proposition{req.proposalsCount > 1 ? "s" : ""}
                    </span>
                    <Link
                      href={`/requests/${req.id}`}
                      className="text-indigo-600 font-semibold hover:underline inline-flex items-center gap-0.5"
                    >
                      Gérer <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Aides proposées */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-500" />
              Mes aides proposées
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-bold">
                {myProposals.length}
              </span>
            </h2>
          </div>

          {myProposals.length === 0 ? (
            <div className="p-6 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-500 mb-3">Vous n&apos;avez proposé aucune aide.</p>
              <Link
                href="/requests"
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Explorer les demandes ouvertes
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myProposals.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-600">{prop.requestSubject}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        prop.status === "ACCEPTED"
                          ? "bg-emerald-100 text-emerald-800"
                          : prop.status === "REJECTED"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {prop.status === "ACCEPTED"
                        ? "Acceptée !"
                        : prop.status === "REJECTED"
                        ? "Refusée"
                        : "En attente"}
                    </span>
                  </div>
                  <Link
                    href={`/requests/${prop.requestId}`}
                    className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors block line-clamp-1"
                  >
                    {prop.requestTitle}
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-2 italic">
                    &ldquo;{prop.message}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 3: Séances réalisées */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-emerald-600" />
              Séances réalisées
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-bold">
                {completedSessions.length}
              </span>
            </h2>
          </div>

          {completedSessions.length === 0 ? (
            <div className="p-6 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-500">
                Aucune séance terminée pour le moment.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedSessions.map((sessionItem) => (
                <div
                  key={sessionItem.requestId}
                  className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Rôle : {sessionItem.role}
                    </span>
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Clôturée
                    </span>
                  </div>
                  <Link
                    href={`/requests/${sessionItem.requestId}`}
                    className="font-bold text-sm text-slate-900 hover:text-indigo-600 block line-clamp-1"
                  >
                    {sessionItem.title}
                  </Link>
                  <div className="text-xs text-slate-500">
                    Avec : <strong>{sessionItem.partnerName}</strong>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    {sessionItem.hasReviewed ? (
                      <span className="text-emerald-700 font-semibold">✓ Évaluation laissée</span>
                    ) : (
                      <Link
                        href={`/requests/${sessionItem.requestId}`}
                        className="text-amber-600 font-bold hover:underline"
                      >
                        Laisser un avis &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews Received Section */}
      <section className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          Évaluations reçues de vos camarades ({reviewsReceived.length})
        </h2>

        {reviewsReceived.length === 0 ? (
          <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
            Aucun avis reçu pour l&apos;instant. Réalisez des séances d&apos;aide pour obtenir vos premières étoiles !
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviewsReceived.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <RatingStars rating={rev.rating} size="sm" />
                  <span className="text-[10px] text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
                <div className="text-[11px] font-bold text-slate-900 pt-1 border-t border-slate-100">
                  Par {rev.reviewerName}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
