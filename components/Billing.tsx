
import React, { useState, useMemo } from 'react';
import { CreditCard, Download, Plus, Search, X, CheckCircle, Clock } from 'lucide-react';

interface BillingProps {
  invoices: any[];
  onAddInvoice: (inv: any) => void;
  onUpdateStatus: (id: string, status: string) => void;
  externalSearch?: string;
}

export const Billing: React.FC<BillingProps> = ({ invoices, onAddInvoice, onUpdateStatus, externalSearch = '' }) => {
  const [localSearch, setLocalSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ patient: '', amount: '' });

  const searchQuery = (externalSearch || localSearch).toLowerCase();

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => 
      inv.patient.toLowerCase().includes(searchQuery) || inv.id.toLowerCase().includes(searchQuery)
    );
  }, [invoices, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInv = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      patient: formData.patient,
      amount: parseFloat(formData.amount) || 0,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    onAddInvoice(newInv);
    setIsModalOpen(false);
    setFormData({ patient: '', amount: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Financial Hub</h2>
          <p className="text-sm text-slate-500 font-medium">Monitoring all clinical revenue and invoice status.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-slate-950 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl">
          <Plus size={18} /> Generate Invoice
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-6 bg-slate-50/50 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input placeholder="Search transactions..." value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[9px] uppercase font-black text-slate-400 border-b tracking-[0.2em]">
                <th className="px-8 py-5">Transaction ID</th>
                <th className="px-8 py-5">Client Name</th>
                <th className="px-8 py-5">Net Amount</th>
                <th className="px-8 py-5">Payment Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredInvoices.length > 0 ? filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-6 text-sm font-black text-slate-900 tracking-tight">{inv.id}</td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-600">{inv.patient}</td>
                  <td className="px-8 py-6 text-sm font-black text-indigo-600">${inv.amount.toLocaleString()}</td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {inv.status === 'Paid' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {inv.status === 'Pending' && (
                        <button onClick={() => onUpdateStatus(inv.id, 'Paid')} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-colors" title="Mark as Paid"><CheckCircle size={18} /></button>
                      )}
                      <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors" title="Download"><Download size={18} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400 font-bold">No financial records detected.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 space-y-6 animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Generate Invoice</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Billed To</label>
                <input required placeholder="Patient full name..." value={formData.patient} onChange={e => setFormData({...formData, patient: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Billable Amount ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">$</span>
                  <input type="number" required placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 mt-4">
                <CreditCard size={18} />
                Finalize Billing
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
