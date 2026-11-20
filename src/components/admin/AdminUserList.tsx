"use client";

import React, { useState } from "react";
import { adminDeleteUserAction } from "@/app/actions/admin.actions";
import { Trash2, Shield, GraduationCap, Star, Award } from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  speciality: string;
  level: string;
  skills: string[];
  reputationPoints: number;
  badges: string[];
  createdAt: string;
}

interface AdminUserListProps {
  users: AdminUser[];
}

export function AdminUserList({ users }: AdminUserListProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(userId: string, userName: string) {
    if (
      !confirm(
        `Confirmez-vous la suppression définitive de l'utilisateur "${userName}" ?\n\nToutes ses publications, propositions et avis seront également supprimés.`
      )
    )
      return;

    setLoading(userId);
    setError(null);
    const res = await adminDeleteUserAction(userId);
    setLoading(null);
    if (!res.ok) {
      setError(res.message);
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700 font-medium">
          {error}
        </div>
      )}

      {/* Table header (desktop only) */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_1fr_120px_120px_100px_80px] gap-4 px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        <span>Utilisateur</span>
        <span>Spécialité / Niveau</span>
        <span>Réputation</span>
        <span>Badges</span>
        <span>Inscrit le</span>
        <span className="text-right">Actions</span>
      </div>

      {users.map((user) => (
        <div
          key={user.id}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 lg:px-6 lg:py-4 lg:grid lg:grid-cols-[1fr_1fr_120px_120px_100px_80px] lg:items-center gap-4"
        >
          {/* User info */}
          <div className="flex items-center gap-3 mb-3 lg:mb-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                user.role === "ADMIN"
                  ? "bg-rose-100 text-rose-700"
                  : "bg-indigo-100 text-indigo-700"
              }`}
            >
              {user.role === "ADMIN" ? (
                <Shield className="w-5 h-5" />
              ) : (
                <GraduationCap className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                {user.name}
                {user.role === "ADMIN" && (
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-700">
                    ADMIN
                  </span>
                )}
              </p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>

          {/* Speciality / Level */}
          <div className="mb-2 lg:mb-0">
            <p className="text-xs font-semibold text-slate-700">{user.speciality}</p>
            <p className="text-[11px] text-slate-400">{user.level}</p>
          </div>

          {/* Reputation */}
          <div className="flex items-center gap-1.5 mb-2 lg:mb-0">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-slate-900">{user.reputationPoints}</span>
            <span className="text-[10px] text-slate-400">pts</span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1 mb-3 lg:mb-0">
            {user.badges.slice(0, 2).map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-700"
              >
                <Award className="w-3 h-3" />
                {badge}
              </span>
            ))}
            {user.badges.length > 2 && (
              <span className="text-[10px] text-slate-400">+{user.badges.length - 2}</span>
            )}
          </div>

          {/* Join date */}
          <div className="text-xs text-slate-500 mb-3 lg:mb-0">
            {new Date(user.createdAt).toLocaleDateString("fr-FR")}
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            {user.role === "ADMIN" ? (
              <span className="text-[10px] text-slate-400 italic">Protégé</span>
            ) : (
              <button
                onClick={() => handleDelete(user.id, user.name)}
                disabled={loading === user.id}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {loading === user.id ? "..." : "Supprimer"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
