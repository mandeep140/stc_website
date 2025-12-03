import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistrationSubmission extends Document {
  registrationTemplateId: mongoose.Types.ObjectId;
  registrationSlug: string;
  data: { [key: string]: unknown };
  submittedAt: Date;
  metadata: {
    emailVerified: boolean;
    verifiedAt?: Date;
  };
}

const RegistrationSubmissionSchema = new Schema({
  registrationTemplateId: { 
    type: Schema.Types.ObjectId, 
    ref: 'RegistrationTemplate', 
    required: true 
  },
  registrationSlug: { type: String, required: true },
  data: { type: Schema.Types.Mixed, required: true },
  submittedAt: { type: Date, default: Date.now },
  metadata: {
    emailVerified: { type: Boolean, default: false },
    verifiedAt: Date
  }
});

// Indexes for efficient queries
RegistrationSubmissionSchema.index({ registrationTemplateId: 1, submittedAt: -1 });
RegistrationSubmissionSchema.index({ registrationSlug: 1 });
RegistrationSubmissionSchema.index({ 'data.email': 1 });

// Unique constraint: same email cannot submit to same form twice
RegistrationSubmissionSchema.index(
  { registrationSlug: 1, 'data.email': 1 }, 
  { unique: true, sparse: true }
);

const RegistrationSubmission = mongoose.models.RegistrationSubmission || 
  mongoose.model<IRegistrationSubmission>('RegistrationSubmission', RegistrationSubmissionSchema);

export default RegistrationSubmission;
