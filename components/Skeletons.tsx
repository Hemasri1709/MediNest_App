
import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
      <div className="w-16 h-6 bg-slate-100 rounded-full"></div>
    </div>
    <div className="h-4 w-24 bg-slate-100 rounded mb-2"></div>
    <div className="h-8 w-32 bg-slate-100 rounded"></div>
  </div>
);

export const TableRowSkeleton = () => (
  <div className="flex items-center gap-4 px-6 py-4 animate-pulse border-b border-slate-50">
    <div className="w-10 h-10 bg-slate-100 rounded-full"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-slate-100 rounded w-1/4"></div>
      <div className="h-3 bg-slate-100 rounded w-1/6"></div>
    </div>
    <div className="w-20 h-4 bg-slate-100 rounded"></div>
    <div className="w-24 h-4 bg-slate-100 rounded"></div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="h-[400px] bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
      <div className="h-[400px] bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
    </div>
  </div>
);
