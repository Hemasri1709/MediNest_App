
import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search, Plus, X, CheckCircle, User, Stethoscope, Ban, Activity } from 'lucide-react';
import { Appointment, UserRole, UserProfile } from '../types';

interface AppointmentListProps {
  role: UserRole;
  appointments: Appointment[];
  onAddAppointment: (apt: Appointment) => void;
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
  externalSearch?: string;
  currentUser: UserProfile;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({ role, appointments, onAddAppointment, onUpdateStatus, externalSearch = '', currentUser }) => {
  const isPatient = role === UserRole.PATIENT;
  const isClinical = role === UserRole.DOCTOR || role === UserRole.ADMIN;
  
  const [localSearch, setLocalSearch] = useState('');
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date('2023-11-12')); 
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    patientName: isPatient ? currentUser.name : '',
    doctorName: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00 AM',
    type: 'Checkup' as Appointment['type']
  });

  const searchQuery = (externalSearch || localSearch).toLowerCase();

  const getWeekRange = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { start, end };
  };

  const filteredAppointments = useMemo(() => {
    const { start, end } = getWeekRange(currentDate);
    
    return appointments.filter(apt => {
      if (isPatient && apt.patientName !== currentUser.name) return false;

      const aptDate = new Date(apt.date);
      if (viewMode === 'day') {
        if (apt.date !== currentDate.toISOString().split('T')[0]) return false;
      } else if (viewMode === 'week') {
        if (aptDate < start || aptDate > end) return false;
      } else if (viewMode === 'month') {
        if (aptDate.getMonth() !== currentDate.getMonth() || aptDate.getFullYear() !== currentDate.getFullYear()) return false;
      }

      return apt.patientName.toLowerCase().includes(searchQuery) ||
             apt.doctorName.toLowerCase().includes(searchQuery) ||
             apt.type.toLowerCase().includes(searchQuery);
    });
  }, [searchQuery, isPatient, appointments, viewMode, currentDate, currentUser.name]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: Appointment = {
      id: `APT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      patientName: bookingForm.patientName,
      doctorName: bookingForm.doctorName || 'Dr. Unassigned',
      date: bookingForm.date,
      time: bookingForm.time,
      type: bookingForm.type,
      status: 'Pending'
    };
    onAddAppointment(newApt);
    setIsBookingModalOpen(false);
    setBookingForm({
      patientName: isPatient ? currentUser.name : '',
      doctorName: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00 AM',
      type: 'Checkup'
    });
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  // Calendar Grid Logic for Month View
  const renderCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const calendarDays = [];
    // Leading empty days
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null);
    }
    // Days of month
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(i);
    }

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/40">
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
          {weekdays.map(wd => (
            <div key={wd} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100 last:border-r-0">
              {wd}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} className="h-32 bg-slate-50/30 border-r border-b border-slate-100 last:border-r-0"></div>;
            
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayAppointments = appointments.filter(a => a.date === dateStr && (!isPatient || a.patientName === currentUser.name));
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            return (
              <div 
                key={day} 
                onClick={() => {
                  setCurrentDate(new Date(year, month, day));
                  setViewMode('day');
                }}
                className={`h-32 p-3 border-r border-b border-slate-100 last:border-r-0 hover:bg-slate-50 transition-all cursor-pointer group relative ${isToday ? 'bg-indigo-50/30' : 'bg-white'}`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-xs font-black w-6 h-6 flex items-center justify-center rounded-lg transition-colors ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-400 group-hover:text-slate-900'}`}>
                    {day}
                  </span>
                  {dayAppointments.length > 0 && (
                    <span className="text-[10px] font-black text-indigo-400 bg-indigo-50 px-1.5 py-0.5 rounded-md">
                      {dayAppointments.length}
                    </span>
                  )}
                </div>
                <div className="mt-2 space-y-1 overflow-hidden">
                  {dayAppointments.slice(0, 3).map((apt, aIdx) => (
                    <div 
                      key={apt.id} 
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md truncate ${
                        apt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' : 
                        apt.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {apt.time.split(' ')[0]} {isPatient ? apt.doctorName : apt.patientName}
                    </div>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-tighter pl-1">
                      + {dayAppointments.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">{isPatient ? 'My Clinical Visits' : 'Hospital Schedule'}</h2>
          <p className="text-sm text-slate-500 font-medium tracking-tight">Manage clinical encounters and specialist consultations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-1 flex shadow-sm">
            {(['day', 'week', 'month'] as const).map(m => (
              <button 
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase rounded-xl transition-all ${viewMode === m ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {m}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsBookingModalOpen(true)}
            className="bg-slate-950 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl"
          >
            <Plus size={16} />
            Book Visit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-4">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button onClick={() => handleNavigate('prev')} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><ChevronLeft size={20} /></button>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest px-4">
                  {viewMode === 'month' 
                    ? currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
                    : viewMode === 'week' 
                      ? 'Active Range' 
                      : currentDate.toDateString()
                  }
                </h3>
                <button onClick={() => handleNavigate('next')} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><ChevronRight size={20} /></button>
              </div>
              <div className="flex-1 w-full max-w-sm relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  placeholder="Filter by name or specialty..." 
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          {viewMode === 'month' ? (
            renderCalendarGrid()
          ) : (
            <div className="space-y-3">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map(apt => (
                  <div key={apt.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-indigo-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between group shadow-lg shadow-slate-200/30">
                    <div className="flex items-center gap-5">
                      <div className="bg-slate-950 p-4 rounded-2xl text-center min-w-[80px] shadow-lg shadow-slate-200">
                        <p className="text-white text-base font-black leading-none">{apt.time.split(' ')[0]}</p>
                        <p className="text-indigo-400 text-[9px] font-black uppercase mt-1 tracking-widest">{apt.time.split(' ')[1]}</p>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 tracking-tight text-lg leading-tight">{isPatient ? apt.doctorName : apt.patientName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[9px] font-black uppercase tracking-widest">{apt.type}</span>
                           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">• {apt.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                      <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] border ${
                        apt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        apt.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {apt.status}
                      </span>
                      {isClinical && apt.status === 'Pending' && (
                        <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => onUpdateStatus(apt.id, 'Confirmed')} className="p-2.5 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-colors" title="Confirm"><CheckCircle size={20} /></button>
                          <button onClick={() => onUpdateStatus(apt.id, 'Cancelled')} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors" title="Cancel"><Ban size={20} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-24 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                  <CalendarIcon className="mx-auto text-slate-200 mb-4" size={48} />
                  <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No scheduled encounters found</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
            <h3 className="font-black text-xl tracking-tight mb-4 relative z-10">Clinical Protocol</h3>
            <p className="text-sm text-indigo-50/80 leading-relaxed font-medium relative z-10">
              Please verify patient records and past clinical history at least 24 hours prior to any high-risk surgical encounter or emergency follow-up.
            </p>
            <Activity className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32" />
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-100">
            <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-[0.2em] mb-4">Quick Stats</h4>
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <span className="text-sm font-bold text-slate-500">Confirmed</span>
                 <span className="text-sm font-black text-emerald-600">{appointments.filter(a => a.status === 'Confirmed').length}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-sm font-bold text-slate-500">Pending</span>
                 <span className="text-sm font-black text-amber-600">{appointments.filter(a => a.status === 'Pending').length}</span>
               </div>
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
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Visit Request Form</p>
              </div>
              <button onClick={() => setIsBookingModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    required 
                    readOnly={isPatient} 
                    value={bookingForm.patientName} 
                    onChange={e => setBookingForm({...bookingForm, patientName: e.target.value})} 
                    placeholder="Enter full legal name..."
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
              </div>

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
                    <option value="">Select a Doctor</option>
                    <option>Dr. Sarah Johnson</option>
                    <option>Dr. Michael Chen</option>
                    <option>Dr. Emily Brooks</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reason for Visit</label>
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
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visit Date</label>
                  <input 
                    type="date" 
                    required 
                    value={bookingForm.date} 
                    onChange={e => setBookingForm({...bookingForm, date: e.target.value})} 
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prefered Slot</label>
                  <select 
                    required 
                    value={bookingForm.time} 
                    onChange={e => setBookingForm({...bookingForm, time: e.target.value})} 
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none"
                  >
                    <option>09:00 AM</option>
                    <option>10:30 AM</option>
                    <option>11:15 AM</option>
                    <option>02:00 PM</option>
                    <option>03:30 PM</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] mt-4"
              >
                Confirm Visit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
