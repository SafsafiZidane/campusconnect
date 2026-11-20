import React, { Suspense } from "react";
import Link from "next/link";
import { useCases } from "@/container";
import { RequestCard } from "@/components/requests/RequestCard";
import { RequestFilterBar } from "@/components/requests/RequestFilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { RequestsGridSkeleton } from "@/components/ui/LoadingSkeleton";
import { PlusCircle } from "lucide-react";

interface RequestsPageProps {
  searchParams: {
    query?: string;
    subject?: string;
    level?: string;
    status?: "OPEN" | "ACCEPTED" | "COMPLETED" | "TOUS";
  };
}

const COMMON_SUBJECTS = [
  "Algorithmique & C",
  "Bases de Données & SQL",
  "Développement Web & React",
  "Mathématiques & Algèbre",
  "Systèmes d'Exploitation",
  "Réseaux Informatiques",
  "Intelligence Artificielle",
  "Physique",
  "Génie Logiciel",
];

const COMMON_LEVELS = [
  "Licence 1",
  "Licence 2",
  "Licence 3",
  "Master 1",
  "Master 2",
  "Cycle Ingénieur 1",
  "Cycle Ingénieur 2",
  "Cycle Ingénieur 3",
];

export const revalidate = 0; // Dynamic server rendering with query params

export default async function RequestsPage({ searchParams }: RequestsPageProps) {
  const filterParams = {
    query: searchParams.query,
    subject: searchParams.subject === "TOUS" ? undefined : searchParams.subject,
    level: searchParams.level === "TOUS" ? undefined : searchParams.level,
    status:
      searchParams.status && searchParams.status !== "TOUS"
        ? (searchParams.status as "OPEN" | "ACCEPTED" | "COMPLETED")
        : undefined,
  };

  const result = await useCases.listHelpRequests.execute(filterParams);
  const requests = result.ok ? result.value : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Demandes d&apos;entraide
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Recherchez et filtrez les séances d&apos;aide publiées par les étudiants.
          </p>
        </div>
        <Link
          href="/requests/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-100 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Publier une demande
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <Suspense fallback={<div className="h-28 bg-white rounded-2xl animate-pulse" />}>
        <RequestFilterBar subjects={COMMON_SUBJECTS} levels={COMMON_LEVELS} />
      </Suspense>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
        <span>
          {requests.length} demande{requests.length > 1 ? "s" : ""} trouvée{requests.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Requests Grid or Empty State */}
      {requests.length === 0 ? (
        <EmptyState
          title="Aucune demande correspondante"
          description="Aucune demande d'aide ne correspond à vos critères de recherche. Essayez d'ajuster vos filtres ou de créer votre propre demande."
          actionText="Publier une nouvelle demande"
          actionHref="/requests/new"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}
