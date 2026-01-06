
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  APPOINTMENTS = 'APPOINTMENTS',
  PATIENTS = 'PATIENTS',
  RECORDS = 'RECORDS',
  BILLING = 'BILLING',
  ASSISTANT = 'ASSISTANT',
  SETTINGS = 'SETTINGS',
  MY_HEALTH = 'MY_HEALTH',
  AUDIT_LOGS = 'AUDIT_LOGS',
  UNAUTHORIZED = 'UNAUTHORIZED'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT'
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  specialty?: string;
  avatar?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  contact: string;
  lastVisit: string;
  condition: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  type: 'Checkup' | 'Surgery' | 'Follow-up' | 'Emergency';
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  role: UserRole;
  target: string;
  timestamp: string;
}

export interface RecordEntry {
  id: string;
  patientId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  doctor: string;
}
