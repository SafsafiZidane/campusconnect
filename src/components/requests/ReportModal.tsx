"use client";

import React, { useState } from "react";
import { reportPublicationAction } from "@/app/actions/admin.actions";
import { Flag, CheckCircle, AlertCircle, X } from "lucide-react";

interface ReportModalProps {
  requestId: string;
}

export function ReportModal({ requestId }: ReportModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("requestId", requestId);

    const res = await reportPublicationAction(formData);
    setIsSubmitting(false);

    if (!res.ok) {
      setError(res.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 2500);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-rose-600 transition-colors"
        title="Signaler un contenu abusif ou hors charte"
      >
        <Flag className="w-3.5 h-3.5" />
        <span>Signaler la publication</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Flag className="w-4 h-4 text-rose-600" />
                Signaler cette demande
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {success ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">Signalement transmis</h4>
                <p className="text-xs text-slate-500">
                  L&apos;équipe d&apos;administration examinera cette publication dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                {error && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Motif du signalement *
                  </label>
                  <select
                    name="reason"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Contenu inapproprié ou offensant">
                      Contenu inapproprié ou offensant
                    </option>
                    <option value="Spam ou publicité non sollicitée">
                      Spam ou publicité non sollicitée
                    </option>
                    <option value="Fraude académique ou triche">
                      Fraude académique ou triche
                    </option>
                    <option value="Demande hors sujet ou non étudiante">
                      Demande hors sujet ou non étudiante
                    </option>
                    <option value="Autre motif">Autre motif</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Précisions additionnelles (facultatif)
                  </label>
                  <textarea
                    name="details"
                    rows={3}
                    placeholder="Détaillez le problème constaté..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 rounded-xl shadow-sm transition-colors"
                  >
                    {isSubmitting ? "Envoi..." : "Envoyer le signalement"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
