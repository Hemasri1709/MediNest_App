
import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, Info } from 'lucide-react';
import { AppView } from '../types';

export const Unauthorized = ({ setView }: { setView: (v: AppView) => void }) => (
  <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in zoom-in duration-500 px-6">
    <div className="relative">
      <div className="w-32 h-32 bg-rose-50 rounded-[2.5rem] flex items-center justify-center text-rose-500 border border-rose-100 shadow-2xl shadow-rose-100/50 animate-pulse">
        <ShieldAlert size={64} strokeWidth={1.5} />
      </div>
      <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl border border-slate-100 shadow-lg flex items-center justify-center text-slate-900">
        <Lock size={20} />
      </div>
    </div>

    <div className="max-w-md space-y-4">
      <h2 className="text-4xl font-black text-slate-900 tracking-tight">Access Denied</h2>
      <p className="text-slate-500 font-medium leading-relaxed">
        Your current account role does not possess the required clinical or administrative clearance for this section.
      </p>
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
        <Info size={14} /> Security Protocol: RBAC-G4-Active
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full max-w-sm">
      <button 
        onClick={() => setView(AppView.DASHBOARD)}
        className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
      >
        <ArrowLeft size={18} />
        Dashboard
      </button>
      <button 
        disabled
        className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.2em] cursor-not-allowed"
      >
        Request Access
      </button>
    </div>

    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-8">
      Violation logged to MediNest Audit Trail
    </p>
  </div>
);
