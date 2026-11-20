import React from "react";
import Link from "next/link";
import { StatusBadge } from "../ui/StatusBadge";
import { HelpRequestListItemDTO } from "@/application/use-cases/help-request/list-help-requests.use-case";
import { Clock, BookOpen, User, MessageSquare, Award } from "lucide-react";

interface RequestCardProps {
  request: HelpRequestListItemDTO;
}

export function RequestCard({ request }: RequestCardProps) {
  return (
    <article className="group relative bg-white rounded-2xl border border-slate-200/90 p-5 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50/50 transition-all flex flex-col justify-between">
      <div>
        {/* Top meta tags */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700">
            <BookOpen className="w-3.5 h-3.5" />
            {request.subject}
          </span>
          <StatusBadge status={request.status} />
        </div>

        {/* Title & snippet */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
          <Link href={`/requests/${request.id}`} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {request.title}
          </Link>
        </h3>
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {request.description}
        </p>

        {/* Level and Availability */}
        <div className="space-y-1.5 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>Niveau visé : {request.level}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{request.availability}</span>
          </div>
        </div>
      </div>

      {/* Card footer: Author & Proposals count */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
            {request.author.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="truncate max-w-[120px]">
            <span className="font-semibold text-slate-800 block truncate">
              {request.author.name}
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              {request.author.speciality}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md">
          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
          <span>{request.proposalsCount} prop.</span>
        </div>
      </div>
    </article>
  );
}
