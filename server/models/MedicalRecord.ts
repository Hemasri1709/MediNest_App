import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicalRecord extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  doctor: string;
  date: Date;
  diagnosis: string;
  treatment: string;
  symptoms: string[];
  prescriptions: {
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  labTests: {
    testName: string;
    result: string;
    date: Date;
  }[];
  vitals?: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    weight: number;
    height: number;
  };
  followUpDate?: Date;
  notes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MedicalRecordSchema: Schema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient ID is required'],
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor ID is required'],
    },
    doctor: {
      type: String,
      required: [true, 'Doctor name is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    diagnosis: {
      type: String,
      required: [true, 'Diagnosis is required'],
      trim: true,
    },
    treatment: {
      type: String,
      required: [true, 'Treatment is required'],
      trim: true,
    },
    symptoms: {
      type: [String],
      default: [],
    },
    prescriptions: [
      {
        medication: {
          type: String,
          required: true,
        },
        dosage: {
          type: String,
          required: true,
        },
        frequency: {
          type: String,
          required: true,
        },
        duration: {
          type: String,
          required: true,
        },
      },
    ],
    labTests: [
      {
        testName: String,
        result: String,
        date: Date,
      },
    ],
    vitals: {
      bloodPressure: String,
      heartRate: Number,
      temperature: Number,
      weight: Number,
      height: Number,
    },
    followUpDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
    attachments: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
MedicalRecordSchema.index({ patientId: 1, date: -1 });
MedicalRecordSchema.index({ doctorId: 1, date: -1 });

export default mongoose.model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema);
