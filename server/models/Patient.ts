import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IPatient extends Document {
  name: string;
  email: string;
  password: string;
  role: 'PATIENT';
  phone: string;
  avatar?: string;
  age: number;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalHistory: {
    allergies: string[];
    chronicDiseases: string[];
    surgeries: string[];
    medications: string[];
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    expiryDate: Date;
  };
  lastVisit?: Date;
  condition?: string;
  registrationDate: Date;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const PatientSchema: Schema = new Schema(
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
      default: 'PATIENT',
      enum: ['PATIENT'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [0, 'Age cannot be negative'],
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
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    emergencyContact: {
      name: {
        type: String,
        required: [true, 'Emergency contact name is required'],
      },
      relationship: {
        type: String,
        required: [true, 'Relationship is required'],
      },
      phone: {
        type: String,
        required: [true, 'Emergency contact phone is required'],
      },
    },
    medicalHistory: {
      allergies: {
        type: [String],
        default: [],
      },
      chronicDiseases: {
        type: [String],
        default: [],
      },
      surgeries: {
        type: [String],
        default: [],
      },
      medications: {
        type: [String],
        default: [],
      },
    },
    insurance: {
      provider: String,
      policyNumber: String,
      expiryDate: Date,
    },
    lastVisit: {
      type: Date,
    },
    condition: {
      type: String,
      default: 'Stable',
    },
    registrationDate: {
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
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
PatientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
PatientSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IPatient>('Patient', PatientSchema);
