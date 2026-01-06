# MediNest Backend - MongoDB Setup Guide

## Overview

The MediNest Hospital Management System now includes a complete backend with MongoDB integration. This backend provides RESTful APIs for managing admins, doctors, patients, appointments, and medical records.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## MongoDB Setup

### Option 1: Local MongoDB

1. Install MongoDB locally from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/medinest`)

## Environment Setup

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your MongoDB connection string:
   ```env
   MONGODB_URI=your_mongodb_connection_string_here
   PORT=5000
   JWT_SECRET=your_random_secret_key_here
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

   **Examples:**
   - Local MongoDB: `mongodb://localhost:27017/medinest`
   - MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/medinest`

## Database Schemas

### 1. Admin Schema
- name, email, password (hashed)
- phone, avatar
- permissions array
- isActive status
- lastLogin timestamp

### 2. Doctor Schema
- name, email, password (hashed)
- phone, specialty, qualification
- experience, licenseNumber
- department, consultationFee
- availableSlots (days and times)
- rating, patientCount
- dateOfBirth, gender, address

### 3. Patient Schema
- name, email, password (hashed)
- age, dateOfBirth, gender
- bloodGroup, phone, address
- emergencyContact (name, relationship, phone)
- medicalHistory (allergies, chronicDiseases, surgeries, medications)
- insurance details
- lastVisit, condition

### 4. Appointment Schema
- patientId, patientName
- doctorId, doctorName
- date, time, status
- type (Checkup, Surgery, Follow-up, Emergency)
- reason, notes, prescriptions

### 5. Medical Record Schema
- patientId, doctorId, doctor name
- date, diagnosis, treatment
- symptoms, prescriptions
- labTests, vitals
- followUpDate, notes, attachments

### 6. Audit Log Schema
- action, actor, actorId, role
- target, targetId
- timestamp, ipAddress
- details

## Installation & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Seed the database with sample data:**
   ```bash
   npm run seed
   ```

3. **Run the backend server only:**
   ```bash
   npm run server
   ```

4. **Run the frontend only:**
   ```bash
   npm run dev
   ```

5. **Run both frontend and backend together:**
   ```bash
   npm run dev:all
   ```

The backend server will run on `http://localhost:5000` and the frontend on `http://localhost:3000`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires authentication)

### Patients
- `GET /api/patients` - Get all patients (Admin, Doctor)
- `GET /api/patients/:id` - Get single patient
- `POST /api/patients` - Create patient (Admin)
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Deactivate patient (Admin)
- `GET /api/patients/:id/medical-history` - Get patient medical history

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get single doctor
- `POST /api/doctors` - Create doctor (Admin)
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Deactivate doctor (Admin)
- `GET /api/doctors/specialty/:specialty` - Get doctors by specialty
- `GET /api/doctors/:id/availability` - Get doctor's available slots

### Appointments
- `GET /api/appointments` - Get all appointments (Admin, Doctor)
- `GET /api/appointments/:id` - Get single appointment
- `GET /api/appointments/patient/:patientId` - Get patient appointments
- `GET /api/appointments/doctor/:doctorId` - Get doctor appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment
- `PATCH /api/appointments/:id/status` - Update appointment status

### Medical Records
- `GET /api/medical-records` - Get all medical records (Admin, Doctor)
- `GET /api/medical-records/:id` - Get single medical record
- `GET /api/medical-records/patient/:patientId` - Get patient medical records
- `POST /api/medical-records` - Create medical record (Admin, Doctor)
- `PUT /api/medical-records/:id` - Update medical record (Admin, Doctor)
- `DELETE /api/medical-records/:id` - Delete medical record (Admin)

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

The token is returned when you login or register.

## Sample Login Credentials

After running `npm run seed`, you can use these credentials:

**Admin:**
- Email: `admin@medinest.com`
- Password: `admin123`

**Doctors:**
- Email: `sarah.johnson@medinest.com` / Password: `doctor123`
- Email: `michael.chen@medinest.com` / Password: `doctor123`
- Email: `emily.rodriguez@medinest.com` / Password: `doctor123`

**Patients:**
- Email: `john.doe@email.com` / Password: `patient123`
- Email: `mary.smith@email.com` / Password: `patient123`
- Email: `robert.wilson@email.com` / Password: `patient123`

## Testing the API

You can test the API using:
1. **Postman** - Import the endpoints and test
2. **cURL** - Command line testing
3. **Thunder Client** (VS Code extension)

Example login request:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@medinest.com",
    "password": "admin123",
    "role": "ADMIN"
  }'
```

## Project Structure

```
server/
├── config/
│   └── database.ts          # MongoDB connection
├── controllers/
│   ├── authController.ts    # Authentication logic
│   ├── patientController.ts # Patient management
│   ├── doctorController.ts  # Doctor management
│   ├── appointmentController.ts
│   └── medicalRecordController.ts
├── middleware/
│   └── auth.ts              # Authentication & authorization
├── models/
│   ├── Admin.ts             # Admin schema
│   ├── Doctor.ts            # Doctor schema
│   ├── Patient.ts           # Patient schema
│   ├── Appointment.ts       # Appointment schema
│   ├── MedicalRecord.ts     # Medical record schema
│   └── AuditLog.ts          # Audit log schema
├── routes/
│   ├── auth.ts              # Auth routes
│   ├── patients.ts          # Patient routes
│   ├── doctors.ts           # Doctor routes
│   ├── appointments.ts      # Appointment routes
│   └── medicalRecords.ts    # Medical record routes
├── scripts/
│   └── seed.ts              # Database seeding script
└── index.ts                 # Server entry point
```

## Security Features

- Password hashing using bcryptjs
- JWT-based authentication
- Role-based access control (RBAC)
- Protected routes with middleware
- Audit logging for tracking actions
- Input validation
- Soft delete for data preservation

## Troubleshooting

1. **Connection Error:**
   - Check if MongoDB is running
   - Verify connection string in `.env.local`
   - Check firewall settings for MongoDB Atlas

2. **Authentication Error:**
   - Ensure JWT_SECRET is set in `.env.local`
   - Check if token is properly included in headers

3. **Port Already in Use:**
   - Change PORT in `.env.local`
   - Kill the process using the port

## Next Steps

1. Set up your MongoDB connection
2. Run the seed script to populate sample data
3. Start the server
4. Test the API endpoints
5. Integrate the frontend with the backend APIs

For any issues or questions, please refer to the project documentation or create an issue on GitHub.
