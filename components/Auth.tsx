
import React, { useState, useEffect } from 'react';
import { Stethoscope, Mail, Lock, User, UserCircle, Briefcase, ArrowRight, ShieldCheck, Activity, Eye, EyeOff } from 'lucide-react';
import { UserRole } from '../types';

interface AuthProps {
  onLogin: (user: any) => void;
}

const SEED_USERS = [
  { id: 'admin-0', name: 'System Administrator', email: 'admin@medinest.com', password: 'admin123', role: UserRole.ADMIN, avatar: '4' },
  { id: 'doc-1', name: 'Dr. Sarah Johnson', email: 'doctor@medinest.com', password: 'doctor123', role: UserRole.DOCTOR, specialty: 'Chief of Surgery', avatar: '12' },
  { id: '1', name: 'James Rodriguez', email: 'patient@medinest.com', password: 'patient123', role: UserRole.PATIENT, avatar: '25' }
];

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', specialty: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const existingUsers = localStorage.getItem('medinest_users');
    if (!existingUsers) { localStorage.setItem('medinest_users', JSON.stringify(SEED_USERS)); }
  }, []);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Short delay to feel like it's checking
    await new Promise(r => setTimeout(r, 800));

    const storedUsers = JSON.parse(localStorage.getItem('medinest_users') || '[]');

    if (isLogin) {
      const user = storedUsers.find((u: any) => u.email === formData.email && u.password === formData.password);
      if (user) { onLogin(user); } 
      else { setError('Login failed. Please check your email and password.'); setIsSubmitting(false); }
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all the details.'); setIsSubmitting(false); return;
      }
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name, email: formData.email, password: formData.password, role: role,
        specialty: role === UserRole.DOCTOR ? formData.specialty : undefined,
        avatar: Math.floor(Math.random() * 50).toString()
      };
      localStorage.setItem('medinest_users', JSON.stringify([...storedUsers, newUser]));
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row overflow-hidden">
      {/* Brand Section */}
      <div className="hidden md:flex md:w-1/2 relative bg-indigo-600 p-16 flex-col justify-between overflow-hidden">
         <div className="relative z-10 flex items-center gap-3">
            <div className="bg-white p-2.5 rounded-2xl shadow-xl shadow-white/10">
              <Stethoscope className="text-indigo-600" size={28} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">MediNest</h1>
         </div>
         
         <div className="relative z-10 space-y-6 max-w-lg">
            <h2 className="text-6xl font-black text-white leading-[1.1] tracking-tighter">
              Easy Health <br/> <span className="text-indigo-200 italic font-medium tracking-tight text-5xl">Care.</span>
            </h2>
            <p className="text-indigo-100/70 font-medium text-lg leading-relaxed">
              Simple and smart hospital management. Built for patients, doctors, and staff.
            </p>
         </div>

         <div className="relative z-10 flex items-center gap-6 text-white/40 font-bold text-xs uppercase tracking-[0.3em]">
            <span>Secure</span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span>Reliable</span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span>Easy to use</span>
         </div>

         <div className="absolute -right-20 -bottom-20 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>
         <Activity className="absolute -right-10 top-20 text-white/5 w-80 h-80 rotate-12" />
      </div>

      {/* Login/Signup Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="max-w-md w-full animate-in fade-in slide-in-from-right-8 duration-1000">
          <div className="mb-10 text-center md:text-left">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{isLogin ? 'Welcome Back' : 'Create Account'}</h3>
            <p className="text-slate-500 font-medium mt-2">{isLogin ? 'Sign in to manage your health.' : 'Join MediNest to start managing your health today.'}</p>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-900/5 border border-slate-100 overflow-hidden">
            <div className="flex p-2 bg-slate-50/50 m-2 rounded-2xl">
              <button 
                onClick={() => { setIsLogin(true); setError(''); }}
                className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => { setIsLogin(false); setError(''); }}
                className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${!isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAction} className="p-8 space-y-6">
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold flex items-center gap-3">
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                  {error}
                </div>
              )}

              {!isLogin && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required type="text" value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 transition-all focus:bg-white"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Who are you?</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button" onClick={() => setRole(UserRole.PATIENT)}
                        className={`flex items-center justify-center gap-2 p-4 rounded-2xl border text-[11px] font-black uppercase tracking-widest transition-all ${role === UserRole.PATIENT ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white border-slate-200 text-slate-400'}`}
                      >
                        <UserCircle size={18} /> Patient
                      </button>
                      <button
                        type="button" onClick={() => setRole(UserRole.DOCTOR)}
                        className={`flex items-center justify-center gap-2 p-4 rounded-2xl border text-[11px] font-black uppercase tracking-widest transition-all ${role === UserRole.DOCTOR ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white border-slate-200 text-slate-400'}`}
                      >
                        <Briefcase size={18} /> Doctor
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required type="email" value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 transition-all focus:bg-white"
                      placeholder="name@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required type={showPassword ? 'text' : 'password'} value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 transition-all focus:bg-white"
                      placeholder="Enter password"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <button 
                type="submit" disabled={isSubmitting}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 mt-4 active:scale-95 disabled:opacity-70 group"
              >
                {isSubmitting ? 'Working...' : isLogin ? 'Sign In' : 'Sign Up'}
                {!isSubmitting && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="px-8 pb-8 pt-2">
               <div className="p-5 bg-indigo-50 rounded-[1.5rem] border border-indigo-100">
                  <div className="flex items-center gap-3 mb-3">
                    <ShieldCheck size={18} className="text-indigo-600" />
                    <span className="text-[11px] font-black text-indigo-900 uppercase tracking-widest">Demo Login Info</span>
                  </div>
                  <p className="text-[10px] text-indigo-700/80 font-bold leading-relaxed">
                    Admin: admin@medinest.com / admin123 <br/>
                    Doctor: doctor@medinest.com / doctor123 <br/>
                    Patient: patient@medinest.com / patient123
                  </p>
               </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
              MediNest Health v4.0.2
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
