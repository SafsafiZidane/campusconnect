"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, RotateCcw } from "lucide-react";

interface RequestFilterBarProps {
  subjects: string[];
  levels: string[];
}

export function RequestFilterBar({ subjects, levels }: RequestFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get("query") || "";
  const currentSubject = searchParams.get("subject") || "TOUS";
  const currentLevel = searchParams.get("level") || "TOUS";
  const currentStatus = searchParams.get("status") || "TOUS";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "TOUS") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/requests?${params.toString()}`);
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = (formData.get("query") as string) || "";
    const params = new URLSearchParams(searchParams.toString());
    if (q.trim()) {
      params.set("query", q.trim());
    } else {
      params.delete("query");
    }
    router.push(`/requests?${params.toString()}`);
  }

  function resetFilters() {
    router.push("/requests");
  }

  const hasActiveFilters =
    currentQuery ||
    currentSubject !== "TOUS" ||
    currentLevel !== "TOUS" ||
    currentStatus !== "TOUS";

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            name="query"
            defaultValue={currentQuery}
            placeholder="Rechercher par titre, mot-clé, matière..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
        >
          Rechercher
        </button>
      </form>

      {/* Select Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
        {/* Subject Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Matière</label>
          <select
            value={currentSubject}
            onChange={(e) => updateFilter("subject", e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          >
            <option value="TOUS">Toutes les matières</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Level Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Niveau</label>
          <select
            value={currentLevel}
            onChange={(e) => updateFilter("level", e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          >
            <option value="TOUS">Tous les niveaux</option>
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Statut</label>
          <select
            value={currentStatus}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          >
            <option value="TOUS">Tous les statuts</option>
            <option value="OPEN">🟢 Ouverte (en attente d&apos;aide)</option>
            <option value="ACCEPTED">🔵 Aide acceptée (en cours)</option>
            <option value="COMPLETED">⚪ Séance terminée</option>
          </select>
        </div>
      </div>

      {/* Reset button if active */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
          <span>Filtres appliqués avec persistance URL</span>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1 font-semibold text-rose-600 hover:text-rose-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}
