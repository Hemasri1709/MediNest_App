import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin';
import Doctor from '../models/Doctor';
import Patient from '../models/Patient';
import Appointment from '../models/Appointment';
import MedicalRecord from '../models/MedicalRecord';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medinest';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Admin.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    await MedicalRecord.deleteMany({});

    // Create Admin
    console.log('👤 Creating admin...');
    const admin = await Admin.create({
      name: 'Admin User',
      email: 'admin@medinest.com',
      password: 'admin123',
      phone: '+1234567890',
    });

    // Create Doctors
    console.log('👨‍⚕️ Creating doctors...');
    const doctor1 = await Doctor.create({
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@medinest.com',
      password: 'doctor123',
      phone: '+1234567891',
      specialty: 'Cardiology',
      qualification: 'MD, FACC',
      experience: 15,
      licenseNumber: 'MD-CARD-12345',
      department: 'Cardiology',
      consultationFee: 200,
      address: '123 Medical Center, New York, NY',
      dateOfBirth: new Date('1980-05-15'),
      gender: 'Female',
      availableSlots: [
        { day: 'Monday', startTime: '09:00', endTime: '17:00' },
        { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
        { day: 'Friday', startTime: '09:00', endTime: '17:00' },
      ],
      rating: 4.8,
    });

    const doctor2 = await Doctor.create({
      name: 'Dr. Michael Chen',
      email: 'michael.chen@medinest.com',
      password: 'doctor123',
      phone: '+1234567892',
      specialty: 'Neurology',
      qualification: 'MD, PhD',
      experience: 12,
      licenseNumber: 'MD-NEURO-67890',
      department: 'Neurology',
      consultationFee: 250,
      address: '123 Medical Center, New York, NY',
      dateOfBirth: new Date('1982-08-20'),
      gender: 'Male',
      availableSlots: [
        { day: 'Tuesday', startTime: '10:00', endTime: '18:00' },
        { day: 'Thursday', startTime: '10:00', endTime: '18:00' },
      ],
      rating: 4.9,
    });

    const doctor3 = await Doctor.create({
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@medinest.com',
      password: 'doctor123',
      phone: '+1234567893',
      specialty: 'Pediatrics',
      qualification: 'MD, FAAP',
      experience: 10,
      licenseNumber: 'MD-PED-11223',
      department: 'Pediatrics',
      consultationFee: 180,
      address: '123 Medical Center, New York, NY',
      dateOfBirth: new Date('1985-03-10'),
      gender: 'Female',
      availableSlots: [
        { day: 'Monday', startTime: '08:00', endTime: '16:00' },
        { day: 'Tuesday', startTime: '08:00', endTime: '16:00' },
        { day: 'Thursday', startTime: '08:00', endTime: '16:00' },
      ],
      rating: 4.7,
    });

    // Create Patients
    console.log('🏥 Creating patients...');
    const patient1 = await Patient.create({
      name: 'John Doe',
      email: 'john.doe@email.com',
      password: 'patient123',
      phone: '+1234567894',
      age: 45,
      dateOfBirth: new Date('1979-07-12'),
      gender: 'Male',
      bloodGroup: 'O+',
      address: '456 Oak Street, New York, NY',
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1234567895',
      },
      medicalHistory: {
        allergies: ['Penicillin'],
        chronicDiseases: ['Hypertension'],
        surgeries: ['Appendectomy (2010)'],
        medications: ['Lisinopril 10mg'],
      },
      condition: 'Stable',
    });

    const patient2 = await Patient.create({
      name: 'Mary Smith',
      email: 'mary.smith@email.com',
      password: 'patient123',
      phone: '+1234567896',
      age: 32,
      dateOfBirth: new Date('1992-02-28'),
      gender: 'Female',
      bloodGroup: 'A+',
      address: '789 Pine Avenue, New York, NY',
      emergencyContact: {
        name: 'Robert Smith',
        relationship: 'Husband',
        phone: '+1234567897',
      },
      medicalHistory: {
        allergies: [],
        chronicDiseases: [],
        surgeries: [],
        medications: [],
      },
      condition: 'Healthy',
    });

    const patient3 = await Patient.create({
      name: 'Robert Wilson',
      email: 'robert.wilson@email.com',
      password: 'patient123',
      phone: '+1234567898',
      age: 67,
      dateOfBirth: new Date('1957-11-05'),
      gender: 'Male',
      bloodGroup: 'B+',
      address: '321 Maple Drive, New York, NY',
      emergencyContact: {
        name: 'Susan Wilson',
        relationship: 'Daughter',
        phone: '+1234567899',
      },
      medicalHistory: {
        allergies: ['Aspirin'],
        chronicDiseases: ['Diabetes Type 2', 'Hypertension'],
        surgeries: ['Knee Replacement (2018)'],
        medications: ['Metformin 500mg', 'Amlodipine 5mg'],
      },
      condition: 'Under Treatment',
    });

    // Create Appointments
    console.log('📅 Creating appointments...');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    await Appointment.create([
      {
        patientId: patient1._id,
        patientName: patient1.name,
        doctorId: doctor1._id,
        doctorName: doctor1.name,
        date: tomorrow,
        time: '10:00 AM',
        status: 'Confirmed',
        type: 'Checkup',
        reason: 'Routine cardiac checkup',
      },
      {
        patientId: patient2._id,
        patientName: patient2.name,
        doctorId: doctor3._id,
        doctorName: doctor3.name,
        date: today,
        time: '02:00 PM',
        status: 'Confirmed',
        type: 'Checkup',
        reason: 'General health checkup',
      },
      {
        patientId: patient3._id,
        patientName: patient3.name,
        doctorId: doctor2._id,
        doctorName: doctor2.name,
        date: tomorrow,
        time: '11:00 AM',
        status: 'Pending',
        type: 'Follow-up',
        reason: 'Follow-up for headaches',
      },
    ]);

    // Create Medical Records
    console.log('📋 Creating medical records...');
    await MedicalRecord.create([
      {
        patientId: patient1._id,
        doctorId: doctor1._id,
        doctor: doctor1.name,
        date: new Date('2024-12-15'),
        diagnosis: 'Hypertension - Stage 1',
        treatment: 'Prescribed ACE inhibitor, lifestyle modifications',
        symptoms: ['Elevated blood pressure', 'Headache'],
        prescriptions: [
          {
            medication: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            duration: '30 days',
          },
        ],
        vitals: {
          bloodPressure: '145/92',
          heartRate: 78,
          temperature: 98.6,
          weight: 180,
          height: 70,
        },
      },
      {
        patientId: patient3._id,
        doctorId: doctor2._id,
        doctor: doctor2.name,
        date: new Date('2024-12-20'),
        diagnosis: 'Migraine with aura',
        treatment: 'Prescribed preventive medication, advised lifestyle changes',
        symptoms: ['Severe headache', 'Visual disturbances', 'Nausea'],
        prescriptions: [
          {
            medication: 'Topiramate',
            dosage: '25mg',
            frequency: 'Twice daily',
            duration: '60 days',
          },
        ],
        vitals: {
          bloodPressure: '138/88',
          heartRate: 72,
          temperature: 98.4,
          weight: 165,
          height: 68,
        },
      },
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('Admin: admin@medinest.com / admin123');
    console.log('Doctor 1: sarah.johnson@medinest.com / doctor123');
    console.log('Doctor 2: michael.chen@medinest.com / doctor123');
    console.log('Doctor 3: emily.rodriguez@medinest.com / doctor123');
    console.log('Patient 1: john.doe@email.com / patient123');
    console.log('Patient 2: mary.smith@email.com / patient123');
    console.log('Patient 3: robert.wilson@email.com / patient123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
