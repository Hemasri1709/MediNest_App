import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IDoctor extends Document {
  name: string;
  email: string;
  password: string;
  role: 'DOCTOR';
  phone: string;
  specialty: string;
  avatar?: string;
  qualification: string;
  experience: number; // in years
  licenseNumber: string;
  department: string;
  availableSlots: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  consultationFee: number;
  address: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other';
  joinDate: Date;
  isActive: boolean;
  lastLogin?: Date;
  rating?: number;
  patientCount?: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const DoctorSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      default: 'DOCTOR',
      enum: ['DOCTOR'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    specialty: {
      type: String,
      required: [true, 'Specialty is required'],
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    qualification: {
      type: String,
      required: [true, 'Qualification is required'],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, 'Experience is required'],
      min: [0, 'Experience cannot be negative'],
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    availableSlots: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
        startTime: String,
        endTime: String,
      },
    ],
    consultationFee: {
      type: Number,
      required: [true, 'Consultation fee is required'],
      min: [0, 'Consultation fee cannot be negative'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['Male', 'Female', 'Other'],
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0,
    },
    patientCount: {
      type: Number,
      default: 0,
      min: [0, 'Patient count cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
DoctorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
DoctorSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IDoctor>('Doctor', DoctorSchema);
