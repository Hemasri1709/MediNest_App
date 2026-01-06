import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  actor: string;
  actorId: mongoose.Types.ObjectId;
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
  target: string;
  targetId?: mongoose.Types.ObjectId;
  timestamp: Date;
  ipAddress?: string;
  details?: Record<string, any>;
  createdAt: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    action: {
      type: String,
      required: [true, 'Action is required'],
      trim: true,
    },
    actor: {
      type: String,
      required: [true, 'Actor name is required'],
      trim: true,
    },
    actorId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Actor ID is required'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: ['ADMIN', 'DOCTOR', 'PATIENT'],
    },
    target: {
      type: String,
      required: [true, 'Target is required'],
      trim: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
    },
    details: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Index for efficient queries
AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ actorId: 1, timestamp: -1 });
AuditLogSchema.index({ role: 1, timestamp: -1 });

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
