import React from "react";
import Link from "next/link";
import { getCurrentSession } from "@/lib/auth/session";
import { logoutAction } from "@/app/actions/auth.actions";
import {
  GraduationCap,
  PlusCircle,
  LayoutDashboard,
  ShieldAlert,
  User,
  LogOut,
  Award,
} from "lucide-react";

export async function Navbar() {
  const session = await getCurrentSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:bg-indigo-700 transition-colors">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
              CampusConnect
            </span>
            <span className="hidden sm:block text-[11px] font-medium text-slate-500 -mt-1">
              Entraide & Partage Étudiant
            </span>
          </div>
        </Link>

        {/* Center navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            href="/requests"
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors"
          >
            Toutes les demandes
          </Link>
          {session && (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-500" />
              Tableau de bord
            </Link>
          )}
          {session?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100/80 transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
              Espace Admin
            </Link>
          )}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/requests/new"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Demander de l&apos;aide
          </Link>

          {session ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Reputation & Badge pill */}
              <Link
                href="/dashboard"
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-xs font-semibold text-amber-800"
                title="Points de réputation et badges"
              >
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>{session.reputationPoints} pts</span>
              </Link>

              {/* User menu link */}
              <Link
                href="/profile"
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-700"
                title="Mon profil"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs border border-indigo-200">
                  {session.name.substring(0, 2).toUpperCase()}
                </div>
                <span className="hidden md:inline text-sm font-medium">{session.name.split(" ")[0]}</span>
              </Link>

              {/* Logout form */}
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                Inscription
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
