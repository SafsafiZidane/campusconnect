"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "@/app/actions/profile.actions";
import { User, Award, CheckCircle2, AlertCircle, Save } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const res = await updateProfileAction(formData);
    setSaving(false);

    if (!res.ok) {
      setError(res.message);
    } else {
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-slate-500">
        Chargement du profil...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:py-14 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-600" />
          Mon Profil Étudiant
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Mettez à jour vos compétences et votre niveau d&apos;études pour optimiser les recommandations d&apos;entraide.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profil mis à jour avec succès !</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nom complet
            </label>
            <input
              type="text"
              name="name"
              defaultValue={user.name}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email universitaire (non modifiable)
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Spécialité / Filière
            </label>
            <select
              name="speciality"
              defaultValue={user.speciality}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
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
              Niveau d&apos;études
            </label>
            <select
              name="level"
              defaultValue={user.level}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
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
            Compétences (séparées par des virgules)
          </label>
          <input
            type="text"
            name="skills"
            defaultValue={Array.isArray(user.skills) ? user.skills.join(", ") : user.skills}
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Ex: Python, React, Algorithmique, SQL, Mathématiques
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Bio personnelle
          </label>
          <textarea
            name="bio"
            rows={3}
            defaultValue={user.bio || ""}
            placeholder="Parlez de vos passions, projets ou disponibilités..."
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          ></textarea>
        </div>

        {/* Badges and Points display */}
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              Réputation académique : {user.reputationPoints} points
            </span>
            <div className="flex flex-wrap gap-1">
              {(user.badges || []).map((b: string) => (
                <span
                  key={b}
                  className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm rounded-xl shadow-md transition-all"
        >
          <Save className="w-4 h-4" />
          {saving ? "Sauvegarde..." : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
}
