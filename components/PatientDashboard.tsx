
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Heart, Activity, Thermometer, Droplets, Calendar, FileText, ChevronRight, Plus, X, Edit3, TrendingUp, History, User, Clock, MapPin, Stethoscope } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Appointment } from '../types';

interface PatientDashboardProps {
  patient: any;
  appointments: Appointment[];
  addAppointment: (apt: Appointment) => void;
}

interface VitalEntry {
  value: number;
  label: string; 
  timestamp: string;
}

interface VitalsHistory {
  heartRate: VitalEntry[];
  bloodSugar: VitalEntry[];
  bodyTemp: VitalEntry[];
  bloodPressure: VitalEntry[]; 
}

const INITIAL_HISTORY: VitalsHistory = {
  heartRate: [{ value: 72, label: '72 bpm', timestamp: '2023-11-12' }],
  bloodSugar: [{ value: 98, label: '98 mg/dL', timestamp: '2023-11-12' }],
  bodyTemp: [{ value: 98.6, label: '98.6 °F', timestamp: '2023-11-12' }],
  bloodPressure: [{ value: 120, label: '120/80', timestamp: '2023-11-12' }],
};

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ patient, appointments, addAppointment }) => {
  const [history, setHistory] = useState<VitalsHistory>(INITIAL_HISTORY);
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const [newVitals, setNewVitals] = useState({ heartRate: '', bloodSugar: '', bodyTemp: '', bloodPressure: '' });
  const [bookingForm, setBookingForm] = useState({
    doctorName: '',
    type: 'Checkup' as Appointment['type'],
    date: new Date().toISOString().split('T')[0],
    time: '09:00 AM'
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: Appointment = {
      id: `APT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      patientName: patient.name,
      doctorName: bookingForm.doctorName || 'Dr. Sarah Johnson',
      date: bookingForm.date,
      time: bookingForm.time,
      type: bookingForm.type,
      status: 'Pending'
    };
    addAppointment(newApt);
    setIsBookingModalOpen(false);
    // Reset form
    setBookingForm({
      doctorName: '',
      type: 'Checkup',
      date: new Date().toISOString().split('T')[0],
      time: '09:00 AM'
    });
  };

  const handleUpdateVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date().toISOString().split('T')[0];
    const updated = { ...history };
    if (newVitals.heartRate) updated.heartRate.push({ value: parseInt(newVitals.heartRate), label: `${newVitals.heartRate} bpm`, timestamp });
    setHistory(updated);
    setIsVitalsModalOpen(false);
    setNewVitals({ heartRate: '', bloodSugar: '', bodyTemp: '', bloodPressure: '' });
  };

  const nextApt = appointments.find(a => a.patientName === patient.name && a.status !== 'Cancelled');

  const stats = [
    { label: 'Heart Rate', val: history.heartRate.at(-1)?.label, data: history.heartRate, icon: Heart, color: '#f43f5e', bg: 'bg-rose-50' },
    { label: 'Blood Sugar', val: history.bloodSugar.at(-1)?.label, data: history.bloodSugar, icon: Droplets, color: '#3b82f6', bg: 'bg-blue-50' },
    { label: 'Body Temp', val: history.bodyTemp.at(-1)?.label, data: history.bodyTemp, icon: Thermometer, color: '#f59e0b', bg: 'bg-amber-50' },
    { label: 'Blood Pressure', val: history.bloodPressure.at(-1)?.label, data: history.bloodPressure, icon: Activity, color: '#10b981', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Welcome, {patient.name.split(' ')[0]}</h2>
          <p className="text-slate-500 font-medium">Here is your health summary for today.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsVitalsModalOpen(true)} className="px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all">
            <Edit3 size={16} /> Update Health
          </button>
          <button onClick={() => setIsBookingModalOpen(true)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
            <Plus size={16} /> Book Visit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl ${s.bg}`} style={{ color: s.color }}><s.icon size={20} /></div>
              <div className="h-8 w-16 opacity-40">
                <ResponsiveContainer width="100%" height="100%"><LineChart data={s.data}><Line type="monotone" dataKey="value" stroke={s.color} dot={false} strokeWidth={2} /></LineChart></ResponsiveContainer>
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">{s.val || 'No Data'}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Your Next Visit</h3>
          {nextApt ? (
            <div className="bg-indigo-600 p-6 rounded-3xl text-white flex gap-6 items-center shadow-2xl shadow-indigo-100 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="bg-white/20 p-4 rounded-2xl text-center min-w-[80px]">
                <p className="text-xs font-bold uppercase">Nov</p>
                <p className="text-2xl font-black">{nextApt.date.split('-')[2]}</p>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">{nextApt.type}</h4>
                <div className="flex flex-wrap gap-4 mt-2 text-xs opacity-80 font-medium">
                  <span className="flex items-center gap-1.5"><User size={14} /> {nextApt.doctorName}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {nextApt.time}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 border border-dashed border-slate-200 rounded-3xl text-center text-slate-400">
              <Calendar className="mx-auto mb-2 opacity-20" size={32} />
              <p className="text-sm font-bold">No appointments scheduled.</p>
            </div>
          )}
        </div>
        <div className="bg-slate-950 p-8 rounded-3xl text-white shadow-xl">
          <h3 className="font-bold text-lg mb-4">Daily Medicine</h3>
          <div className="space-y-4">
            <div className="flex gap-4 items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-default group">
              <div className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform"></div>
              <div><p className="text-sm font-bold">Lisinopril</p><p className="text-[10px] opacity-50 uppercase font-black tracking-widest mt-0.5">8:00 AM • Daily</p></div>
            </div>
          </div>
        </div>
      </div>

      {isBookingModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Schedule New Visit</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Direct Patient Booking</p>
              </div>
              <button onClick={() => setIsBookingModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Consulting Physician</label>
                <div className="relative">
                  <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <select 
                    required 
                    value={bookingForm.doctorName} 
                    onChange={e => setBookingForm({...bookingForm, doctorName: e.target.value})} 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                  >
                    <option value="">Select a Specialist</option>
                    <option>Dr. Sarah Johnson</option>
                    <option>Dr. Michael Chen</option>
                    <option>Dr. Emily Brooks</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visit Classification</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['Checkup', 'Surgery', 'Follow-up', 'Emergency'] as Appointment['type'][]).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBookingForm({...bookingForm, type})}
                      className={`py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                        bookingForm.type === type 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                          : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Desired Date</label>
                  <input 
                    type="date" 
                    required 
                    value={bookingForm.date} 
                    onChange={e => setBookingForm({...bookingForm, date: e.target.value})} 
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time Slot</label>
                  <select 
                    required 
                    value={bookingForm.time} 
                    onChange={e => setBookingForm({...bookingForm, time: e.target.value})} 
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none"
                  >
                    <option>09:00 AM</option>
                    <option>10:30 AM</option>
                    <option>02:00 PM</option>
                    <option>03:30 PM</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] mt-4"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}

      {isVitalsModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 space-y-8 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Health Metrics</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Vital Logs Update</p>
              </div>
              <button onClick={() => setIsVitalsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleUpdateVitals} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Heart Rate (bpm)</label>
                   <input placeholder="e.g. 72" value={newVitals.heartRate} onChange={e => setNewVitals({...newVitals, heartRate: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Temp (°F)</label>
                   <input placeholder="e.g. 98.6" value={newVitals.bodyTemp} onChange={e => setNewVitals({...newVitals, bodyTemp: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" />
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Update Health Profile</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
