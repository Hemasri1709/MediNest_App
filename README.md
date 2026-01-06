
# MediNest - Enterprise Hospital Management Platform

MediNest is a high-aesthetic, role-based clinical operating system designed for modern healthcare facilities. It provides a secure environment for patients, clinicians, and administrators to interact with medical data, billing, and AI-powered clinical assistance.

## 🚀 Key Features

### 🔐 Role-Based Access Control (RBAC)
- **Admin**: Full oversight of hospital operations, billing, and system audit logs.
- **Doctor**: Clinical management of assigned patients, appointment scheduling, and technical AI assistance.
- **Patient**: Personal health dashboard, vitals tracking, and simplified medical history access.

### 🧠 MediNest Intelligence (AI)
- Powered by Gemini 3 Flash.
- **Role-Aware Prompts**: AI behavior changes based on user role (Technical clinical analysis for doctors vs. Wellness coaching for patients).
- **Clinical Guardrails**: Built-in safety logic prevents AI from making final medical diagnoses or prescribing medication.

### 🛡️ Security & Compliance
- **Audit Trail**: Every significant system action is logged (Who, What, When, Target).
- **Session Protection**: Automated session expiry and route guards to prevent unauthorized data access.
- **RBAC Guards**: UI and routing logic strictly enforce permission boundaries.

## 🛠️ Tech Stack
- **Frontend**: React 19, Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts (Medical Trends & Financial Load)
- **AI**: @google/genai (Gemini 2.0 / 1.5 Pro)
- **State Management**: React Hooks + LocalStorage Persistence

## 🗺️ Backend Migration Roadmap

To move from the current `localStorage` prototype to a production environment, the following architecture is proposed:

### 1. Data Models (PostgreSQL)
- `Users`: (id, email, password_hash, role, name, specialty, avatar_seed)
- `Patients`: (id, user_id, dob, gender, blood_group, current_conditions)
- `Appointments`: (id, patient_id, doctor_id, date, time, status, clinical_notes)
- `Vitals`: (id, patient_id, metric_type, value, timestamp)
- `AuditLogs`: (id, actor_id, action_type, target_entity, metadata, created_at)

### 2. API Design (Node.js/Express or Python/FastAPI)
- `GET /api/v1/clinical/patients` (Protected: Doctor, Admin)
- `POST /api/v1/clinical/vitals` (Protected: Patient, Doctor)
- `GET /api/v1/admin/audit-logs` (Protected: Admin Only)
- `POST /api/v1/auth/session` (Refresh tokens & Expiry management)

### 3. Security Considerations
- JWT-based authentication with HttpOnly cookies.
- Row-level security in the database to ensure patients can only see their own records.
- AES-256 encryption for sensitive clinical notes.

## 🧪 Demo Credentials
- **Admin**: `admin@medinest.com` / `admin123`
- **Doctor**: `doctor@medinest.com` / `doctor123`
- **Patient**: `patient@medinest.com` / `patient123`

---
© 2023 MediNest Health Systems.
