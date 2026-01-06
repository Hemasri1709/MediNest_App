import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  patientId: mongoose.Types.ObjectId;
  patientName: string;
  doctorId: mongoose.Types.ObjectId;
  doctorName: string;
  date: Date;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  type: 'Checkup' | 'Surgery' | 'Follow-up' | 'Emergency';
  reason?: string;
  notes?: string;
  prescriptions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema: Schema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient ID is required'],
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor ID is required'],
    },
    doctorName: {
      type: String,
      required: [true, 'Doctor name is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
    type: {
      type: String,
      enum: ['Checkup', 'Surgery', 'Follow-up', 'Emergency'],
      required: [true, 'Appointment type is required'],
    },
    reason: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    prescriptions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
AppointmentSchema.index({ patientId: 1, date: 1 });
AppointmentSchema.index({ doctorId: 1, date: 1 });

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
