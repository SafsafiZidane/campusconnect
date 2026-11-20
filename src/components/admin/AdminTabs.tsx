"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Users, FileText, AlertTriangle } from "lucide-react";

const TABS = [
  { key: "users", label: "Utilisateurs", icon: Users },
  { key: "publications", label: "Publications", icon: FileText },
  { key: "reports", label: "Signalements", icon: AlertTriangle },
] as const;

export type AdminTabKey = (typeof TABS)[number]["key"];

export function AdminTabs() {
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get("tab") as AdminTabKey) || "users";

  return (
    <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl">
      {TABS.map(({ key, label, icon: Icon }) => {
        const isActive = currentTab === key;
        return (
          <Link
            key={key}
            href={`/admin?tab=${key}`}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isActive
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        );
      })}
    </div>
  );
}
