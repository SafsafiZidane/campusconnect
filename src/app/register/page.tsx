"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerAction } from "@/app/actions/auth.actions";
import { GraduationCap, UserPlus, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await registerAction(formData);
    setIsSubmitting(false);

    if (!res.ok) {
      setError(res.message);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10 sm:py-14">
      <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-100 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-200">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Créer un profil étudiant
          </h1>
          <p className="text-xs text-slate-500">
            Rejoignez la communauté CampusConnect pour échanger et progresser.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nom complet *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Ex: Sarah Mansour"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email universitaire *
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="sarah@campus.fr"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mot de passe (min. 6 caractères) *
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Spécialité / Filière *
              </label>
              <select
                name="speciality"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
              >
                <option value="Informatique">Informatique</option>
                <option value="Génie Logiciel">Génie Logiciel</option>
                <option value="Mathématiques">Mathématiques</option>
                <option value="Génie Civil">Génie Civil</option>
                <option value="Génie Électrique">Génie Électrique</option>
                <option value="Gestion & Économie">Gestion &amp; Économie</option>
                <option value="Physique & Chimie">Physique &amp; Chimie</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Niveau d&apos;études *
              </label>
              <select
                name="level"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
              >
                <option value="Licence 1">Licence 1</option>
                <option value="Licence 2">Licence 2</option>
                <option value="Licence 3">Licence 3</option>
                <option value="Master 1">Master 1</option>
                <option value="Master 2">Master 2</option>
                <option value="Cycle Ingénieur 1">Cycle Ingénieur 1</option>
                <option value="Cycle Ingénieur 2">Cycle Ingénieur 2</option>
                <option value="Cycle Ingénieur 3">Cycle Ingénieur 3</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Vos compétences (séparées par des virgules) *
            </label>
            <input
              type="text"
              name="skills"
              required
              placeholder="Ex: Python, Algorithmique, SQL, React, Probabilités"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Ces compétences permettront à l&apos;algorithme de vous recommander les demandes d&apos;aide pertinentes.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Courte bio / Présentation (facultatif)
            </label>
            <textarea
              name="bio"
              rows={2}
              placeholder="Ex: Étudiante passionnée de développement web et de structures de données..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-100 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            {isSubmitting ? "Création du profil..." : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Vous avez déjà un compte ?{" "}
          <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-700">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
