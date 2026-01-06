
import React, { useState, useMemo } from 'react';
import { MoreHorizontal, Plus, Search, X, Edit2, Trash2, UserPlus, User, ArrowRight, Save } from 'lucide-react';
import { Patient, UserRole } from '../types';

interface PatientListProps {
  patients: Patient[];
  role: UserRole;
  onAddPatient: (p: Patient) => void;
  onUpdatePatient: (p: Patient) => void;
  onDeletePatient: (id: string) => void;
  externalSearch?: string;
}

export const PatientList: React.FC<PatientListProps> = ({ 
  patients, role, onAddPatient, onUpdatePatient, onDeletePatient, externalSearch = ''
}) => {
  const [localSearch, setLocalSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  
  const [formData, setFormData] = useState<Partial<Patient>>({
    name: '', age: 30, gender: 'Male', bloodGroup: 'O+', contact: '', condition: ''
  });

  const isAdmin = role === UserRole.ADMIN;
  const isClinical = role === UserRole.DOCTOR || role === UserRole.ADMIN;
  const searchQuery = (externalSearch || localSearch).toLowerCase();

  const filteredPatients = useMemo(() => {
    return patients.filter(p => 
      p.name.toLowerCase().includes(searchQuery) ||
      p.condition.toLowerCase().includes(searchQuery) ||
      p.id.toLowerCase().includes(searchQuery)
    );
  }, [patients, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPatient) {
      onUpdatePatient({ ...editingPatient, ...formData } as Patient);
    } else {
      const newPatient: Patient = {
        id: `PAT-${Math.floor(100 + Math.random() * 900)}`,
        name: formData.name || 'Anonymous',
        age: formData.age || 30,
        gender: formData.gender as any,
        bloodGroup: formData.bloodGroup || 'O+',
        contact: formData.contact || '',
        lastVisit: new Date().toISOString().split('T')[0],
        condition: formData.condition || 'General'
      };
      onAddPatient(newPatient);
    }
    closeModal();
  };

  const openEdit = (p: Patient) => {
    setEditingPatient(p);
    setFormData(p);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPatient(null);
    setFormData({ name: '', age: 30, gender: 'Male', bloodGroup: 'O+', contact: '', condition: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Patient Directory</h2>
          <p className="text-sm text-slate-500 font-medium tracking-tight">Managing {patients.length} registered health profiles.</p>
        </div>
        {isClinical && (
          <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl">
            <UserPlus size={18} /> Register Patient
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
        <div className="p-5 bg-slate-50/50 flex gap-4 border-b border-slate-100">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input placeholder="Search name, ID, or condition..." value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[9px] uppercase font-black tracking-[0.2em] border-b border-slate-100">
                <th className="px-8 py-5">Patient Information</th>
                <th className="px-8 py-5">Demographics</th>
                <th className="px-8 py-5">Primary Condition</th>
                <th className="px-8 py-5">Last Encounter</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPatients.length > 0 ? filteredPatients.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div>
                      <p className="font-black text-slate-900 leading-none">{p.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{p.id}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-700">{p.age} Years • {p.gender}</p>
                    <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-0.5">{p.bloodGroup} Blood Group</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {p.condition}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-400 font-medium">{p.lastVisit}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(p)} className="p-2 text-indigo-400 hover:bg-indigo-50 rounded-xl transition-colors"><Edit2 size={16} /></button>
                      {isAdmin && (
                        <button onClick={() => onDeletePatient(p.id)} className="p-2 text-rose-400 hover:bg-rose-50 rounded-xl transition-colors"><Trash2 size={16} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400 font-bold">No patients found matches your query.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{editingPatient ? 'Edit Record' : 'Register New Patient'}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Full Name</label>
                <input required placeholder="Enter name..." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Age</label>
                  <input type="number" placeholder="Years" value={formData.age} onChange={e => setFormData({...formData, age: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as any})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clinical Observation</label>
                <input required placeholder="Primary illness or concern..." value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none" />
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 mt-4">
                {editingPatient ? <Save size={18} /> : <Plus size={18} />}
                {editingPatient ? 'Update Profile' : 'Finalize Registration'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
