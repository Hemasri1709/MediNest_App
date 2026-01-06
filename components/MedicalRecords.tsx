
import React, { useState, useMemo } from 'react';
import { FileText, Search, Plus, X, User, Activity, Filter, Download, Stethoscope } from 'lucide-react';
import { UserRole } from '../types';

interface MedicalRecordsProps {
  role: UserRole;
  records: any[];
  onAddRecord: (record: any) => void;
  externalSearch?: string;
}

export const MedicalRecords: React.FC<MedicalRecordsProps> = ({ role, records, onAddRecord, externalSearch = '' }) => {
  const isPatient = role === UserRole.PATIENT;
  const isClinical = role === UserRole.DOCTOR || role === UserRole.ADMIN;
  
  const [localSearch, setLocalSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ patient: '', type: 'Consultation Report', doctor: 'Dr. Sarah Johnson', diagnosis: '', treatment: '' });

  const searchQuery = (externalSearch || localSearch).toLowerCase();

  const filteredRecords = useMemo(() => {
    return records.filter(r => 
      r.patient.toLowerCase().includes(searchQuery) || 
      r.type.toLowerCase().includes(searchQuery) ||
      (r.diagnosis && r.diagnosis.toLowerCase().includes(searchQuery))
    );
  }, [records, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRec = {
      id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      patient: formData.patient,
      type: formData.type,
      doctor: formData.doctor,
      diagnosis: formData.diagnosis,
      treatment: formData.treatment,
      date: new Date().toISOString().split('T')[0]
    };
    onAddRecord(newRec);
    setIsModalOpen(false);
    setFormData({ patient: '', type: 'Consultation Report', doctor: 'Dr. Sarah Johnson', diagnosis: '', treatment: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Medical Archive</h2>
          <p className="text-sm text-slate-500 font-medium">History of all clinical encounters and lab results.</p>
        </div>
        {isClinical && (
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-slate-800 transition-all shadow-xl">
            <Plus size={18} /> New Entry
          </button>
        )}
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50">
        <div className="relative max-w-sm mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input placeholder="Search archives..." value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRecords.length > 0 ? filteredRecords.map(r => (
            <div key={r.id} className="p-6 border border-slate-100 rounded-3xl hover:bg-indigo-50/50 hover:border-indigo-200 transition-all cursor-pointer group flex flex-col justify-between h-full bg-slate-50/30">
              <div>
                <div className="flex gap-4 items-start mb-4">
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm"><FileText size={24} /></div>
                  <div className="flex-1">
                    <h4 className="font-black text-slate-900 tracking-tight">{r.type}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-bold uppercase tracking-widest">{r.patient} • {r.doctor}</p>
                  </div>
                </div>
                <div className="space-y-3 mt-4 px-1">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Diagnosis</p>
                    <p className="text-sm font-bold text-slate-700 mt-1">{r.diagnosis || 'Standard Observation'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Treatment Plan</p>
                    <p className="text-sm font-bold text-slate-700 mt-1">{r.treatment || 'No specific treatment prescribed.'}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{r.date}</p>
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                  <Download size={14} /> View File
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center text-slate-400 font-bold border-2 border-dashed rounded-[2rem] border-slate-100">
              No medical records matching your query were found.
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 space-y-6 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Clinical Documentation</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient Name</label>
                <input required placeholder="Full legal name..." value={formData.patient} onChange={e => setFormData({...formData, patient: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Diagnosis</label>
                <textarea required placeholder="Clinical findings..." value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none min-h-[80px]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prescribed Treatment</label>
                <textarea required placeholder="Care plan or medication..." value={formData.treatment} onChange={e => setFormData({...formData, treatment: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none min-h-[80px]" />
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                <Stethoscope size={18} />
                Finalize Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
