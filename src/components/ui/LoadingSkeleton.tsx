import React from "react";

export function RequestCardSkeleton() {
  return (
    <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-sm animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-5 bg-slate-200 rounded-full w-24"></div>
        <div className="h-5 bg-slate-200 rounded-full w-20"></div>
      </div>
      <div className="space-y-2">
        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
        <div className="h-4 bg-slate-100 rounded w-full"></div>
        <div className="h-4 bg-slate-100 rounded w-2/3"></div>
      </div>
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="h-4 bg-slate-200 rounded w-28"></div>
        <div className="h-4 bg-slate-200 rounded w-16"></div>
      </div>
    </div>
  );
}

export function RequestsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }, (_, i) => (
        <RequestCardSkeleton key={i} />
      ))}
    </div>
  );
}
