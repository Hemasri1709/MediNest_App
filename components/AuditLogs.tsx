
import React from 'react';
import { History, Search, ShieldCheck, Filter } from 'lucide-react';
import { AuditLog } from '../types';

export const AuditLogs = ({ logs }: { logs: AuditLog[] }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">System Audit Trail</h2>
        <p className="text-slate-500">Compliance monitoring and security tracking.</p>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-bold">
        <ShieldCheck size={18} />
        Live Monitoring Active
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input placeholder="Filter logs by actor or action..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
        </div>
        <button className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50"><Filter size={18} /></button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
            <tr>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Actor</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Target</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.length > 0 ? logs.slice().reverse().map(log => (
              <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-500">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 font-bold text-slate-900 text-sm">{log.actor}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    log.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' :
                    log.role === 'DOCTOR' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {log.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-700 font-medium">{log.action}</td>
                <td className="px-6 py-4 text-xs text-slate-400 font-bold">{log.target}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                  <History size={48} className="mx-auto mb-4 opacity-10" />
                  <p className="font-medium">No system logs recorded yet.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
