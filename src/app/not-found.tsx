import Link from "next/link";
import { HelpCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-6">
        <HelpCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
        Page introuvable (404)
      </h1>
      <p className="text-slate-600 mb-8 max-w-md mx-auto">
        La demande ou la page que vous recherchez n&apos;existe pas ou a été déplacée par son auteur ou la modération.
      </p>
      <Link
        href="/requests"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux demandes d&apos;aide
      </Link>
    </div>
  );
}
