
import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  Shield, 
  Eye, 
  EyeOff,
  Smartphone, 
  Globe, 
  Trash2, 
  Save, 
  CheckCircle,
  Camera
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';

interface SettingsProps {
  user: UserProfile;
  onUpdateProfile: (updatedUser: UserProfile) => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [formData, setFormData] = useState({
    name: user.name,
    specialty: user.specialty || '',
    email: 'user@medinest.com', // Mock email
  });
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: false,
    smsAlerts: true,
    appointmentReminders: true
  });
  const [isSaved, setIsSaved] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...user,
      name: formData.name,
      specialty: user.role === UserRole.DOCTOR ? formData.specialty : undefined
    });
    showSuccess();
  };

  const showSuccess = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const Toggle = ({ enabled, onClick, label }: { enabled: boolean; onClick: () => void; label: string }) => (
    <div className="flex items-center justify-between py-4">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <button
        onClick={onClick}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          enabled ? 'bg-indigo-600' : 'bg-slate-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
          <p className="text-slate-500">Manage your account preferences and security.</p>
        </div>
        {isSaved && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold border border-emerald-100 animate-in zoom-in duration-300">
            <CheckCircle size={18} />
            Changes Saved Successfully
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'profile' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <User size={18} />
            Public Profile
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'notifications' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Bell size={18} />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'security' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Shield size={18} />
            Security & Privacy
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-900">Profile Information</h3>
                <p className="text-xs text-slate-500 mt-1">Update your photo and personal details.</p>
              </div>
              <form onSubmit={handleSaveProfile} className="p-8 space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                  <div className="relative">
                    <img 
                      src={`https://picsum.photos/seed/${user.avatar}/100/100`} 
                      alt="Avatar" 
                      className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-md"
                    />
                    <button type="button" className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg border-2 border-white hover:bg-indigo-700 transition-colors">
                      <Camera size={16} />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Profile Photo</h4>
                    <p className="text-xs text-slate-500 mt-1">JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  {user.role === UserRole.DOCTOR && (
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Professional Specialty</label>
                      <input 
                        type="text"
                        value={formData.specialty}
                        onChange={e => setFormData({...formData, specialty: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                    <Save size={18} />
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-900">Notification Preferences</h3>
                <p className="text-xs text-slate-500 mt-1">Control how and when you receive alerts.</p>
              </div>
              <div className="p-8 divide-y divide-slate-100">
                <Toggle 
                  label="Email Alerts" 
                  enabled={notifications.emailAlerts} 
                  onClick={() => setNotifications({...notifications, emailAlerts: !notifications.emailAlerts})} 
                />
                <Toggle 
                  label="Push Notifications" 
                  enabled={notifications.pushNotifications} 
                  onClick={() => setNotifications({...notifications, pushNotifications: !notifications.pushNotifications})} 
                />
                <Toggle 
                  label="SMS Status Alerts" 
                  enabled={notifications.smsAlerts} 
                  onClick={() => setNotifications({...notifications, smsAlerts: !notifications.smsAlerts})} 
                />
                <Toggle 
                  label="Appointment Reminders" 
                  enabled={notifications.appointmentReminders} 
                  onClick={() => setNotifications({...notifications, appointmentReminders: !notifications.appointmentReminders})} 
                />
                
                <div className="pt-8 mt-4">
                  <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Smartphone size={18} className="text-indigo-600" />
                    Connected Devices
                  </h4>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Smartphone size={20} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">iPhone 14 Pro Max</p>
                        <p className="text-xs text-slate-500">Last active: 2 hours ago</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-rose-600 hover:text-rose-700">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">Password & Security</h3>
                  <button 
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                    {showPasswords ? 'Hide Characters' : 'Show Characters'}
                  </button>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                      <input type={showPasswords ? 'text' : 'password'} placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                        <input type={showPasswords ? 'text' : 'password'} placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                        <input type={showPasswords ? 'text' : 'password'} placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                      </div>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                    <Lock size={18} />
                    Update Password
                  </button>
                </div>
              </div>

              <div className="bg-rose-50 rounded-3xl border border-rose-100 overflow-hidden">
                <div className="p-8 flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-rose-600 shadow-sm border border-rose-100 shrink-0">
                    <Trash2 size={28} />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-bold text-rose-900">Delete Account</h3>
                    <p className="text-sm text-rose-700 mt-1 opacity-80">Permanently delete your account and all of your health data. This action is irreversible.</p>
                  </div>
                  <button className="px-6 py-3 bg-rose-600 text-white rounded-2xl font-bold text-sm hover:bg-rose-700 transition-all shadow-lg shadow-rose-200">
                    Delete Permanently
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
