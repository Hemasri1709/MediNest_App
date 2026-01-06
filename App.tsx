
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AppointmentList } from './components/AppointmentList';
import { PatientList } from './components/PatientList';
import { MedicalRecords } from './components/MedicalRecords';
import { GeminiAssistant } from './components/GeminiAssistant';
import { PatientDashboard } from './components/PatientDashboard';
import { Billing } from './components/Billing';
import { Auth } from './components/Auth';
import { Settings } from './components/Settings';
import { AuditLogs } from './components/AuditLogs';
import { Unauthorized } from './components/Unauthorized';
import { DashboardSkeleton } from './components/Skeletons';
import { AppView, UserRole, UserProfile, Appointment, Patient, AuditLog } from './types';
import { Bell, Search, X } from 'lucide-react';

const MOCK_APPOINTMENTS_INITIAL: Appointment[] = [
  { id: '1', patientName: 'Robert Fox', doctorName: 'Dr. Sarah Johnson', date: '2023-11-12', time: '09:00 AM', status: 'Confirmed', type: 'Surgery' },
  { id: '2', patientName: 'Jane Cooper', doctorName: 'Dr. Michael Chen', date: '2023-11-12', time: '10:30 AM', status: 'Confirmed', type: 'Checkup' },
  { id: '3', patientName: 'James Rodriguez', doctorName: 'Dr. Emily Brooks', date: '2023-11-12', time: '11:15 AM', status: 'Pending', type: 'Follow-up' },
];

const MOCK_PATIENTS_INITIAL: Patient[] = [
  { id: 'PAT-101', name: 'James Rodriguez', age: 42, gender: 'Male', bloodGroup: 'A+', contact: '+1 (555) 012-3456', lastVisit: '2023-10-24', condition: 'Hypertension' },
  { id: 'PAT-102', name: 'Jane Cooper', age: 34, gender: 'Female', bloodGroup: 'O-', contact: '+1 (555) 987-6543', lastVisit: '2023-11-01', condition: 'Type 2 Diabetes' },
];

const MOCK_RECORDS_INITIAL = [
  { id: 'REC-001', patient: 'James Rodriguez', date: '2023-10-24', type: 'Radiology Report', doctor: 'Dr. Sarah Johnson', diagnosis: 'Mild scoliosis', treatment: 'Physical therapy' },
];

const MOCK_INVOICES_INITIAL = [
  { id: 'INV-1001', patient: 'James Rodriguez', date: '2023-11-10', amount: 420, status: 'Paid' },
  { id: 'INV-1002', patient: 'Robert Fox', date: '2023-11-11', amount: 1200, status: 'Pending' },
];

const VIEW_PERMISSIONS: Record<UserRole, AppView[]> = {
  [UserRole.ADMIN]: [AppView.DASHBOARD, AppView.APPOINTMENTS, AppView.PATIENTS, AppView.RECORDS, AppView.BILLING, AppView.ASSISTANT, AppView.SETTINGS, AppView.AUDIT_LOGS],
  [UserRole.DOCTOR]: [AppView.DASHBOARD, AppView.APPOINTMENTS, AppView.PATIENTS, AppView.RECORDS, AppView.ASSISTANT, AppView.SETTINGS],
  [UserRole.PATIENT]: [AppView.DASHBOARD, AppView.MY_HEALTH, AppView.APPOINTMENTS, AppView.RECORDS, AppView.ASSISTANT, AppView.SETTINGS],
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('medinest_audit_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('medinest_appointments');
    return saved ? JSON.parse(saved) : MOCK_APPOINTMENTS_INITIAL;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('medinest_patients');
    return saved ? JSON.parse(saved) : MOCK_PATIENTS_INITIAL;
  });

  const [medicalRecords, setMedicalRecords] = useState<any[]>(() => {
    const saved = localStorage.getItem('medinest_medical_records');
    return saved ? JSON.parse(saved) : MOCK_RECORDS_INITIAL;
  });

  const [invoices, setInvoices] = useState<any[]>(() => {
    const saved = localStorage.getItem('medinest_invoices');
    return saved ? JSON.parse(saved) : MOCK_INVOICES_INITIAL;
  });

  const createAuditLog = useCallback((action: string, target: string) => {
    if (!currentUser) return;
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      actor: currentUser.name,
      role: currentUser.role,
      target,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => {
      const updated = [...prev, newLog];
      localStorage.setItem('medinest_audit_logs', JSON.stringify(updated));
      return updated;
    });
  }, [currentUser]);

  // Route Guard Logic
  useEffect(() => {
    if (currentUser) {
      const allowedViews = VIEW_PERMISSIONS[currentUser.role];
      if (!allowedViews.includes(currentView) && currentView !== AppView.UNAUTHORIZED) {
        console.warn(`Access Denied: User ${currentUser.name} (${currentUser.role}) attempted to access ${currentView}`);
        createAuditLog('SECURITY_VIOLATION', `Unauthorized access attempt to ${currentView}`);
        setCurrentView(AppView.UNAUTHORIZED);
      }
    }
  }, [currentView, currentUser, createAuditLog]);

  // Handle Login & Session
  useEffect(() => {
    const savedSession = localStorage.getItem('medinest_session');
    if (savedSession) {
      setCurrentUser(JSON.parse(savedSession));
    }
  }, []);

  const handleLogin = (user: any) => {
    const profile: UserProfile = { id: user.id, name: user.name, role: user.role as UserRole, specialty: user.specialty, avatar: user.avatar };
    setCurrentUser(profile);
    localStorage.setItem('medinest_session', JSON.stringify(profile));
    createAuditLog('SIGN_IN', 'System Access');
  };

  const handleLogout = () => {
    createAuditLog('SIGN_OUT', 'Manual Logout');
    setCurrentUser(null);
    localStorage.removeItem('medinest_session');
    setCurrentView(AppView.DASHBOARD);
  };

  // Centralized Handlers
  const handleAddPatient = (p: Patient) => {
    setPatients(prev => {
      const updated = [...prev, p];
      localStorage.setItem('medinest_patients', JSON.stringify(updated));
      return updated;
    });
    createAuditLog('PATIENT_CREATE', p.name);
  };

  const handleUpdatePatient = (p: Patient) => {
    setPatients(prev => {
      const updated = prev.map(item => item.id === p.id ? p : item);
      localStorage.setItem('medinest_patients', JSON.stringify(updated));
      return updated;
    });
    createAuditLog('PATIENT_UPDATE', p.name);
  };

  const handleDeletePatient = (id: string) => {
    const patient = patients.find(p => p.id === id);
    setPatients(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('medinest_patients', JSON.stringify(updated));
      return updated;
    });
    createAuditLog('PATIENT_DELETE', patient?.name || id);
  };

  const handleAddAppointment = (apt: Appointment) => {
    setAppointments(prev => {
      const updated = [apt, ...prev];
      localStorage.setItem('medinest_appointments', JSON.stringify(updated));
      return updated;
    });
    // Improved descriptive logging
    createAuditLog('APPOINTMENT_SCHEDULED', `${apt.type} scheduled for ${apt.patientName} with ${apt.doctorName} on ${apt.date}`);
  };

  const handleUpdateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, status } : a);
      localStorage.setItem('medinest_appointments', JSON.stringify(updated));
      return updated;
    });
    const apt = appointments.find(a => a.id === id);
    createAuditLog('APPOINTMENT_STATUS_CHANGE', `${status} for ${apt?.patientName}`);
  };

  const handleAddRecord = (record: any) => {
    setMedicalRecords(prev => {
      const updated = [record, ...prev];
      localStorage.setItem('medinest_medical_records', JSON.stringify(updated));
      return updated;
    });
    createAuditLog('MEDICAL_RECORD_CREATE', `Patient: ${record.patient}`);
  };

  const handleAddInvoice = (inv: any) => {
    setInvoices(prev => {
      const updated = [inv, ...prev];
      localStorage.setItem('medinest_invoices', JSON.stringify(updated));
      return updated;
    });
    createAuditLog('INVOICE_CREATE', `Amount: $${inv.amount}`);
  };

  const handleUpdateInvoiceStatus = (id: string, status: string) => {
    setInvoices(prev => {
      const updated = prev.map(inv => inv.id === id ? { ...inv, status } : inv);
      localStorage.setItem('medinest_invoices', JSON.stringify(updated));
      return updated;
    });
    createAuditLog('INVOICE_STATUS_UPDATE', `Invoice ${id} set to ${status}`);
  };

  const renderView = () => {
    if (!currentUser) return null;
    
    // Safety check for unauthorized states
    if (currentView === AppView.UNAUTHORIZED) {
      return <Unauthorized setView={setCurrentView} />;
    }

    const allowedViews = VIEW_PERMISSIONS[currentUser.role];
    if (!allowedViews.includes(currentView)) {
      return <Unauthorized setView={setCurrentView} />;
    }

    if (isLoading) return <DashboardSkeleton />;

    if (currentUser.role === UserRole.PATIENT && (currentView === AppView.DASHBOARD || currentView === AppView.MY_HEALTH)) {
      return <PatientDashboard patient={currentUser} appointments={appointments} addAppointment={handleAddAppointment} />;
    }

    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard role={currentUser.role} patientCount={patients.length} aptCount={appointments.length} invoiceSum={invoices.reduce((sum, inv) => sum + (inv.status === 'Paid' ? inv.amount : 0), 0)} />;
      case AppView.APPOINTMENTS:
        return <AppointmentList role={currentUser.role} appointments={appointments} onAddAppointment={handleAddAppointment} onUpdateStatus={handleUpdateAppointmentStatus} externalSearch={globalSearch} currentUser={currentUser} />;
      case AppView.PATIENTS:
        return <PatientList patients={patients} role={currentUser.role} onAddPatient={handleAddPatient} onUpdatePatient={handleUpdatePatient} onDeletePatient={handleDeletePatient} externalSearch={globalSearch} />;
      case AppView.RECORDS:
        return <MedicalRecords role={currentUser.role} records={medicalRecords} onAddRecord={handleAddRecord} externalSearch={globalSearch} />;
      case AppView.BILLING:
        return <Billing invoices={invoices} onAddInvoice={handleAddInvoice} onUpdateStatus={handleUpdateInvoiceStatus} externalSearch={globalSearch} />;
      case AppView.AUDIT_LOGS:
        return <AuditLogs logs={auditLogs} />;
      case AppView.ASSISTANT:
        return <GeminiAssistant role={currentUser.role} />;
      case AppView.SETTINGS:
        return <Settings user={currentUser} onUpdateProfile={(u) => { setCurrentUser(u); localStorage.setItem('medinest_session', JSON.stringify(u)); }} />;
      default:
        return <Dashboard role={currentUser.role} patientCount={patients.length} aptCount={appointments.length} invoiceSum={invoices.reduce((sum, inv) => sum + (inv.status === 'Paid' ? inv.amount : 0), 0)} />;
    }
  };

  if (!currentUser) return <Auth onLogin={handleLogin} />;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar currentView={currentView} setView={setCurrentView} role={currentUser.role} onLogout={handleLogout} isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-10 z-[60] sticky top-0">
          <div className="flex items-center flex-1">
            <div className="relative w-full max-w-[500px]">
              <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-400"><Search size={20} /></span>
              <input type="text" value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} placeholder="Search records, patients, or invoices..." className="block w-full pl-14 pr-12 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none" />
              {globalSearch && <button onClick={() => setGlobalSearch('')} className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400"><X size={18} /></button>}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 cursor-pointer hover:bg-slate-100 p-2 pr-4 rounded-2xl" onClick={() => setCurrentView(AppView.SETTINGS)}>
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-slate-900 leading-none">{currentUser.name}</p>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Active Now</p>
              </div>
              <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black overflow-hidden border-2 border-white shadow-xl">
                <img src={`https://picsum.photos/seed/${currentUser.avatar}/48/48`} alt="Avatar" className="object-cover w-full h-full" />
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-10 bg-[#f8fafc]/40"><div className="max-w-[1600px] mx-auto h-full">{renderView()}</div></main>
      </div>
    </div>
  );
};

export default App;
