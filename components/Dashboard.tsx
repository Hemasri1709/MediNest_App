
import React from 'react';
import { Users, CalendarCheck, TrendingUp, Activity, ArrowUpRight, Clock, ShieldCheck, Stethoscope, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { UserRole } from '../types';

interface DashboardProps {
  role: UserRole;
  patientCount?: number;
  aptCount?: number;
  invoiceSum?: number;
}

const weeklyData = [
  { name: 'Mon', count: 20 }, { name: 'Tue', count: 35 }, { name: 'Wed', count: 25 }, { name: 'Thu', count: 45 }, { name: 'Fri', count: 30 }, { name: 'Sat', count: 15 }, { name: 'Sun', count: 10 },
];

export const Dashboard: React.FC<DashboardProps> = ({ role, patientCount = 0, aptCount = 0, invoiceSum = 0 }) => {
  const isAdmin = role === UserRole.ADMIN;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Hospital Summary</h2>
          <p className="text-sm text-slate-500 font-medium">The hospital is running smoothly today.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-2xl text-[10px] font-bold uppercase">
          {isAdmin ? <ShieldCheck size={14} /> : <Stethoscope size={14} />} Role: {role}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-600 text-white rounded-xl"><Users size={20} /></div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">+4.2%</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">All Patients</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{patientCount}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-sky-500 text-white rounded-xl"><CalendarCheck size={20} /></div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Today's Visits</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{aptCount}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-violet-600 text-white rounded-xl"><Activity size={20} /></div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Hospital Load</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">Normal</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-500 text-white rounded-xl"><TrendingUp size={20} /></div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Money Made</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">${invoiceSum.toLocaleString()}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Patient Visits (Weekly)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-3xl text-white">
          <h3 className="font-bold text-lg mb-6">Live Updates</h3>
          <div className="space-y-4">
            {['Patient Robert Fox admitted', 'Dr. Sarah updated surgery log', 'Lab results for Cooper ready'].map((log, i) => (
              <div key={i} className="flex gap-3 items-start p-3 bg-white/5 rounded-2xl border border-white/5">
                <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5"></div>
                <div><p className="text-sm font-medium">{log}</p><p className="text-[10px] opacity-40">Just now</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
