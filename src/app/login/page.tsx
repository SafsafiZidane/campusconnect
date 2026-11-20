"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth.actions";
import { GraduationCap, LogIn, AlertCircle, Sparkles, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);

    const res = await loginAction(formData);
    setIsSubmitting(false);

    if (!res.ok) {
      setError(res.message);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  function fillDemoAccount(demoEmail: string, demoPass: string) {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-100 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-200">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Connexion à CampusConnect
          </h1>
          <p className="text-xs text-slate-500">
            Accédez à vos demandes d&apos;aide, propositions et sessions de révision.
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
              Adresse email académique
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="etudiant@campus.fr"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Mot de passe
              </label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-100 transition-all"
          >
            <LogIn className="w-4 h-4" />
            {isSubmitting ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        {/* Demo Accounts Quick-Fill Section for grading and testing */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Comptes de démonstration (1-clic) :</span>
          </div>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillDemoAccount("alice@campus.fr", "password123")}
              className="p-2 text-left bg-indigo-50/70 hover:bg-indigo-100 text-indigo-900 rounded-xl border border-indigo-200/60 transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-bold">Alice Dubois</span> (Étudiante L3 - Informatique)
                <div className="text-[10px] text-indigo-700">alice@campus.fr &bull; password123</div>
              </div>
              <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded font-bold">Remplir</span>
            </button>

            <button
              type="button"
              onClick={() => fillDemoAccount("karim@campus.fr", "password123")}
              className="p-2 text-left bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 rounded-xl border border-emerald-200/60 transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-bold">Karim Ben Salah</span> (Tuteur M1 - IA &amp; Data)
                <div className="text-[10px] text-emerald-700">karim@campus.fr &bull; password123</div>
              </div>
              <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">Remplir</span>
            </button>

            <button
              type="button"
              onClick={() => fillDemoAccount("admin@campus.fr", "admin123")}
              className="p-2 text-left bg-rose-50/70 hover:bg-rose-100 text-rose-900 rounded-xl border border-rose-200/60 transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-bold flex items-center gap-1">
                  <Shield className="w-3 h-3 text-rose-600" />
                  Admin Campus
                </span>
                <div className="text-[10px] text-rose-700">admin@campus.fr &bull; admin123</div>
              </div>
              <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded font-bold">Remplir</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          Pas encore de compte ?{" "}
          <Link href="/register" className="font-bold text-indigo-600 hover:text-indigo-700">
            Créer un profil étudiant
          </Link>
        </p>
      </div>
    </div>
  );
}
