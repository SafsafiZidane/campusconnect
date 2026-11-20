import React from "react";
import Link from "next/link";
import { RecommendedRequestDTO } from "@/application/use-cases/help-request/get-recommended-requests.use-case";
import { Sparkles, ArrowRight, Zap, BookOpen } from "lucide-react";

interface RecommendedBannerProps {
  recommendations: RecommendedRequestDTO[];
}

export function RecommendedBanner({ recommendations }: RecommendedBannerProps) {
  if (recommendations.length === 0) return null;

  return (
    <section className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-indigo-900/10 mb-10 overflow-hidden relative">
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-indigo-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold tracking-tight">
                  Recommandations basées sur vos compétences
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  IA &amp; Matching
                </span>
              </div>
              <p className="text-xs text-indigo-200">
                Des camarades ont besoin d&apos;aide sur des sujets que vous maîtrisez !
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((item) => (
            <Link
              key={item.id}
              href={`/requests/${item.id}`}
              className="group bg-white/10 hover:bg-white/15 border border-white/10 hover:border-amber-400/50 p-4 rounded-2xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-300">
                    <Zap className="w-3.5 h-3.5 fill-amber-300" />
                    {item.matchScore}% de compatibilité
                  </span>
                  <span className="text-indigo-200 text-[11px]">{item.level}</span>
                </div>

                <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-1 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-indigo-200 line-clamp-2 leading-relaxed mb-3">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {item.matchingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-1.5 py-0.5 rounded bg-indigo-500/40 text-amber-200 text-[10px] font-semibold"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-indigo-200">
                <span>Par {item.authorName}</span>
                <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 text-amber-300 font-semibold">
                  Aider <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
