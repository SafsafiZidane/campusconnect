"use client";

import React, { useState } from "react";
import { submitProposalAction } from "@/app/actions/proposal.actions";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

interface ProposalFormProps {
  requestId: string;
}

export function ProposalForm({ requestId }: ProposalFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.set("requestId", requestId);

    const res = await submitProposalAction(formData);
    setIsSubmitting(false);

    if (!res.ok) {
      setError(res.message);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        <p className="text-sm font-medium">
          Votre proposition d&apos;aide a bien été transmise à l&apos;auteur ! Vous serez notifié dès qu&apos;elle sera traitée.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Send className="w-4 h-4 text-indigo-600" />
          Proposer votre aide
        </h4>
        <span className="text-xs text-slate-500">Gratuit et bienveillant</span>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Votre message d&apos;aide ou explication de votre compétence *
        </label>
        <textarea
          name="message"
          rows={3}
          required
          placeholder="Ex: Bonjour ! Je suis à l'aise sur ce sujet, je peux t'expliquer les pointeurs et faire les exercices avec toi..."
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
        ></textarea>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Disponibilité proposée (optionnel)
        </label>
        <input
          type="text"
          name="proposedAvailability"
          placeholder="Ex: Mercredi à 15h à la bibliothèque ou sur Discord"
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
      >
        <Send className="w-4 h-4" />
        {isSubmitting ? "Envoi en cours..." : "Envoyer ma proposition"}
      </button>
    </form>
  );
}
