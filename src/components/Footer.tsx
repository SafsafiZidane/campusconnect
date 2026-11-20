import React from "react";
import Link from "next/link";
import { GraduationCap, Heart, ShieldCheck, Sparkles, BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-800">CampusConnect</span>
            </div>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              Plateforme académique d&apos;entraide et de partage de compétences entre étudiants. 
              Organisez des séances de révision, gagnez en réputation et progressez ensemble.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Architecture Clean &bull; PostgreSQL &bull; Next.js App Router</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/requests" className="hover:text-indigo-600 transition-colors">
                  Explorer les demandes
                </Link>
              </li>
              <li>
                <Link href="/requests/new" className="hover:text-indigo-600 transition-colors">
                  Publier une demande
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">
                  Tableau de bord
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Projet Académique</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>React & Next.js</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Recommandation par compétences</span>
              </li>
              <li className="text-xs text-slate-500 pt-1">
                Enseignant : Mohamed Amine Ben Rhouma
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>&copy; {new Date().getFullYear()} CampusConnect. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            Conçu avec <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> pour la communauté étudiante
          </p>
        </div>
      </div>
    </footer>
  );
}
