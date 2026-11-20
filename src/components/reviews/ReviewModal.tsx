"use client";

import React, { useState } from "react";
import { RatingStars } from "../ui/RatingStars";
import { createReviewAction } from "@/app/actions/review.actions";
import { Star, CheckCircle, AlertCircle } from "lucide-react";

interface ReviewModalProps {
  requestId: string;
  partnerName: string;
}

export function ReviewModal({ requestId, partnerName }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("requestId", requestId);
    formData.set("rating", rating.toString());

    const res = await createReviewAction(formData);
    setIsSubmitting(false);

    if (!res.ok) {
      setError(res.message);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-center space-y-2">
        <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
        <h4 className="font-bold text-sm">Merci pour votre évaluation !</h4>
        <p className="text-xs text-emerald-700">
          Votre retour permet de valoriser les contributions et d&apos;attribuer des points de réputation à {partnerName}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-amber-200/80 p-5 rounded-2xl shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Évaluer la séance avec {partnerName}
          </h4>
          <p className="text-xs text-slate-500">
            La séance étant terminée, partagez votre avis sur l&apos;entraide reçue ou apportée.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Note sur 5 étoiles :
        </label>
        <div className="flex items-center gap-3">
          <RatingStars
            rating={rating}
            interactive={true}
            onChange={(r) => setRating(r)}
            size="lg"
          />
          <span className="text-sm font-bold text-amber-600">{rating} / 5</span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Commentaire sur l&apos;entraide (qualité de l&apos;explication, ponctualité...) *
        </label>
        <textarea
          name="comment"
          rows={3}
          required
          placeholder="Ex: Super séance de révision ! Explications très claires sur les arbres binaires, je recommande vivement !"
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
      >
        <Star className="w-4 h-4" />
        {isSubmitting ? "Enregistrement..." : "Soumettre mon évaluation"}
      </button>
    </form>
  );
}
