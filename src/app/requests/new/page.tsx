"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createHelpRequestAction } from "@/app/actions/request.actions";
import { PlusCircle, ArrowLeft, AlertCircle, HelpCircle } from "lucide-react";

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
  "Autre matière",
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

export default function NewRequestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await createHelpRequestAction(formData);
    setIsSubmitting(false);

    if (!res.ok) {
      setError(res.message);
    } else {
      router.push(`/requests/${res.requestId}`);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <Link
        href="/requests"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux demandes
      </Link>

      <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-100 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <PlusCircle className="w-6 h-6 text-indigo-600" />
            Publier une demande d&apos;aide
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Décrivez clairement votre besoin afin qu&apos;un camarade compétent puisse vous proposer son soutien.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Titre clair de la demande * (min. 5 caractères)
            </label>
            <input
              type="text"
              name="title"
              required
              minLength={5}
              placeholder="Ex: Aide pour comprendre les jointures SQL et les sous-requêtes"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Matière concernée *
              </label>
              <select
                name="subject"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
              >
                {COMMON_SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Niveau d&apos;études concerné *
              </label>
              <select
                name="level"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
              >
                {COMMON_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Disponibilité pour la séance *
            </label>
            <input
              type="text"
              name="availability"
              required
              placeholder="Ex: Mardi après 16h ou Jeudi matin (à la BU ou via Discord)"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description détaillée du blocage / exercices * (min. 10 caractères)
            </label>
            <textarea
              name="description"
              required
              minLength={10}
              rows={4}
              placeholder="Expliquez ce que vous avez déjà essayé, le TP en cours ou les notions théoriques qui vous posent problème..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-100 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              {isSubmitting ? "Publication en cours..." : "Publier ma demande d'aide"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
