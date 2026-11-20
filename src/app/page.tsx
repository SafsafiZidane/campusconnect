import React from "react";
import Link from "next/link";
import { useCases } from "@/container";
import { getCurrentSession } from "@/lib/auth/session";
import { RequestCard } from "@/components/requests/RequestCard";
import { RecommendedBanner } from "@/components/requests/RecommendedBanner";
import {
  GraduationCap,
  Sparkles,
  Users,
  CheckCircle2,
  ArrowRight,
  PlusCircle,
  Award,
  BookOpen,
} from "lucide-react";

export const revalidate = 0; // Fresh data on request

export default async function HomePage() {
  const session = await getCurrentSession();

  // Fetch recent open requests
  const requestsResult = await useCases.listHelpRequests.execute({ status: "OPEN" });
  const recentRequests = requestsResult.ok ? requestsResult.value.slice(0, 6) : [];

  // Fetch recommendations if user is logged in
  let recommendations: any[] = [];
  if (session) {
    const recResult = await useCases.getRecommendedRequests.execute(session.id);
    if (recResult.ok) {
      recommendations = recResult.value;
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-14 border border-indigo-800/40 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Plateforme académique d&apos;entraide &bull; Clean Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight sm:leading-none text-balance">
            Réussir ensemble grâce au partage de compétences.
          </h1>

          <p className="text-base sm:text-lg text-indigo-100/90 leading-relaxed max-w-2xl">
            Bloqué sur un cours ou un projet ? Demandez de l&apos;aide à un camarade de promo,
            organisez des séances de révision et progressez mutuellement dans un cadre bienveillant.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/requests/new"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 transition-all text-sm sm:text-base hover:scale-[1.02]"
            >
              <PlusCircle className="w-5 h-5" />
              Publier une demande d&apos;aide
            </Link>
            <Link
              href="/requests"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl backdrop-blur border border-white/20 transition-all text-sm sm:text-base"
            >
              Explorer les demandes
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Feature stats counter strip */}
        <div className="mt-12 pt-8 border-t border-indigo-800/50 grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
            <div className="text-xs text-indigo-200 font-medium">Gratuit &amp; Entre étudiants</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">Clean Arch</div>
            <div className="text-xs text-indigo-200 font-medium">Domain &bull; App &bull; Infra</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">Évaluations</div>
            <div className="text-xs text-indigo-200 font-medium">Avis vérifiés post-séance</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">Badges</div>
            <div className="text-xs text-indigo-200 font-medium">Valorisation des tuteurs</div>
          </div>
        </div>
      </section>

      {/* Recommended Requests (Original Feature) */}
      {session && recommendations.length > 0 && (
        <RecommendedBanner recommendations={recommendations} />
      )}

      {/* How it works section */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Comment fonctionne CampusConnect ?
          </h2>
          <p className="text-sm text-slate-500">
            Un cycle d&apos;entraide transparent, encadré et valorisant pour chaque participant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900">1. Publiez une demande</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Indiquez la matière, votre niveau, le détail de votre blocage et vos disponibilités pour la révision.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900">2. Recevez des propositions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Des étudiants qualifiés vous proposent leur aide. Vous choisissez librement la proposition qui vous convient.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900">3. Séance &amp; Évaluation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Une fois la séance réalisée, clôturez la demande et laissez un avis pour attribuer des points de réputation.
            </p>
          </div>
        </div>
      </section>

      {/* Latest Requests Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Dernières demandes ouvertes
            </h2>
            <p className="text-xs text-slate-500">
              Prêtez main forte à un camarade et développez votre pédagogie.
            </p>
          </div>
          <Link
            href="/requests"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Voir tout
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentRequests.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-sm">Aucune demande ouverte</h3>
            <p className="text-xs text-slate-500 mb-4">Soyez le premier à solliciter la communauté !</p>
            <Link
              href="/requests/new"
              className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
            >
              Créer une demande
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentRequests.map((req) => (
              <RequestCard key={req.id} request={req} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
