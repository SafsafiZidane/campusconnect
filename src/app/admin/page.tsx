import React, { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useCases } from "@/container";
import { getCurrentSession } from "@/lib/auth/session";
import { AdminTabs, type AdminTabKey } from "@/components/admin/AdminTabs";
import { AdminUserList } from "@/components/admin/AdminUserList";
import { AdminPublicationList } from "@/components/admin/AdminPublicationList";
import { AdminReportActions } from "@/components/admin/AdminReportActions";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  ShieldAlert,
  ArrowLeft,
  Users,
  FileText,
  AlertTriangle,
  Eye,
  CheckCircle2,
  BarChart3,
} from "lucide-react";

export const revalidate = 0;

interface AdminPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "ADMIN") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
          Accès Administrateur Requis
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Votre compte ({session.email}) dispose du rôle <strong>{session.role}</strong>.
          Cette page de gestion est strictement réservée aux administrateurs.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à mon tableau de bord
        </Link>
      </div>
    );
  }

  // Fetch all data in parallel
  const [usersResult, publicationsResult, reportsResult] = await Promise.all([
    useCases.listAllUsers.execute(session.id),
    useCases.listAllPublications.execute(session.id),
    useCases.listReportedPublications.execute(session.id),
  ]);

  const users = usersResult.ok ? usersResult.value : [];
  const publications = publicationsResult.ok ? publicationsResult.value : [];
  const reports = reportsResult.ok ? reportsResult.value : [];

  const params = await searchParams;
  const currentTab = (params.tab as AdminTabKey) || "users";

  const totalUsers = users.length;
  const totalStudents = users.filter((u) => u.role === "STUDENT").length;
  const totalPublications = publications.length;
  const openPublications = publications.filter((p) => p.status === "OPEN").length;
  const pendingReports = reports.filter((r) => r.reportStatus === "PENDING").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Admin Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Panneau d&apos;Administration
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                  Admin
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Gestion complète des utilisateurs, publications et signalements de CampusConnect.
              </p>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-indigo-50 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Users className="w-4 h-4 text-indigo-600" />
              <span className="text-2xl font-black text-indigo-700">{totalUsers}</span>
            </div>
            <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
              Utilisateurs
            </p>
            <p className="text-[10px] text-indigo-400">{totalStudents} étudiants</p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span className="text-2xl font-black text-emerald-700">{totalPublications}</span>
            </div>
            <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
              Publications
            </p>
            <p className="text-[10px] text-emerald-400">{openPublications} ouvertes</p>
          </div>
          <div className="bg-amber-50 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-2xl font-black text-amber-700">{pendingReports}</span>
            </div>
            <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">
              Signalements
            </p>
            <p className="text-[10px] text-amber-400">en attente</p>
          </div>
          <div className="bg-violet-50 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <BarChart3 className="w-4 h-4 text-violet-600" />
              <span className="text-2xl font-black text-violet-700">
                {publications.filter((p) => p.status === "COMPLETED").length}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-violet-600 uppercase tracking-wider">
              Séances
            </p>
            <p className="text-[10px] text-violet-400">terminées</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Suspense fallback={null}>
        <AdminTabs />
      </Suspense>

      {/* Tab Content */}
      {currentTab === "users" && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            Gestion des Utilisateurs ({totalUsers})
          </h2>

          {users.length === 0 ? (
            <EmptyState
              title="Aucun utilisateur"
              description="Aucun utilisateur inscrit sur la plateforme."
              icon={<Users className="w-8 h-8 text-indigo-600" />}
            />
          ) : (
            <AdminUserList
              users={users.map((u) => ({
                ...u,
                createdAt: u.createdAt.toISOString(),
              }))}
            />
          )}
        </section>
      )}

      {currentTab === "publications" && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            Gestion des Publications ({totalPublications})
          </h2>

          {publications.length === 0 ? (
            <EmptyState
              title="Aucune publication"
              description="Aucune demande d'aide n'a encore été publiée sur la plateforme."
              icon={<FileText className="w-8 h-8 text-emerald-600" />}
            />
          ) : (
            <AdminPublicationList
              publications={publications.map((p) => ({
                ...p,
                createdAt: p.createdAt.toISOString(),
              }))}
            />
          )}
        </section>
      )}

      {currentTab === "reports" && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Publications signalées ({reports.length})
          </h2>

          {reports.length === 0 ? (
            <EmptyState
              title="Aucune publication signalée"
              description="Toutes les publications de la plateforme respectent la charte académique. Aucun signalement en attente."
              icon={<CheckCircle2 className="w-8 h-8 text-emerald-600" />}
            />
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.reportId}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Motif : {report.reason}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          report.reportStatus === "PENDING"
                            ? "bg-amber-100 text-amber-800"
                            : report.reportStatus === "RESOLVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {report.reportStatus === "PENDING"
                          ? "En cours d'examen"
                          : report.reportStatus === "RESOLVED"
                          ? "Résolu (Supprimé)"
                          : "Classé sans suite"}
                      </span>
                      <span className="text-xs text-slate-400">
                        Signalé le {new Date(report.reportDate).toLocaleDateString("fr-FR")} par{" "}
                        <strong>{report.reporter.name}</strong>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      Demande concernée : {report.request.title}
                    </h3>

                    <div className="text-xs text-slate-600 space-x-2">
                      <span>Matière : <strong>{report.request.subject}</strong></span>
                      <span>&bull;</span>
                      <span>Niveau : <strong>{report.request.level}</strong></span>
                      <span>&bull;</span>
                      <span>Auteur de la demande : <strong>{report.request.authorName}</strong></span>
                    </div>

                    {report.details && (
                      <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                        Précisions de l&apos;étudiant : &ldquo;{report.details}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-end gap-3 shrink-0">
                    {report.request.status !== "DELETED" && (
                      <Link
                        href={`/requests/${report.request.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Voir la publication
                      </Link>
                    )}

                    <AdminReportActions
                      reportId={report.reportId}
                      reportStatus={report.reportStatus}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
