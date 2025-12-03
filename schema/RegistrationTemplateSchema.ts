import mongoose, { Schema, Document } from 'mongoose';

export interface IField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'date' | 'time' | 'url' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'image';
  placeholder?: string;
  required: boolean;
  important: boolean;
  options?: Array<{ label: string; value: string }>;
  order: number;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    maxLength?: number;
    minLength?: number;
    customMessage?: string;
  };
  conditional?: {
    fieldKey: string;
    operator: '==' | '!=' | 'in' | 'notin' | '>' | '<';
    value: unknown;
  };
  // For email field
  emailRestriction?: 'all' | 'iitp'; // 'all' = all emails, 'iitp' = only @iitp.ac.in
  // For image field
  imageFolder?: string;
  maxFileSize?: number; // in MB
}

export interface IRegistrationTemplate extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  imageFileId?: string;
  fields: IField[];
  active: boolean;
  passwordProtected: boolean;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FieldSchema = new Schema({
  key: { type: String, required: true },
  label: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['text', 'email', 'tel', 'number', 'date', 'time', 'url', 'textarea', 'select', 'radio', 'checkbox', 'image']
  },
  placeholder: String,
  required: { type: Boolean, default: false },
  important: { type: Boolean, default: false },
  options: [{
    label: String,
    value: String
  }],
  order: { type: Number, required: true },
  validation: {
    min: Number,
    max: Number,
    pattern: String,
    maxLength: Number,
    minLength: Number,
    customMessage: String
  },
  conditional: {
    fieldKey: String,
    operator: { type: String, enum: ['==', '!=', 'in', 'notin', '>', '<'] },
    value: Schema.Types.Mixed
  },
  emailRestriction: { 
    type: String, 
    enum: ['all', 'iitp'],
    default: 'all'
  },
  imageFolder: { type: String, default: '/registrations' },
  maxFileSize: { type: Number, default: 5 } // MB
});

const RegistrationTemplateSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  image: String,
  imageFileId: String,
  fields: [FieldSchema],
  active: { type: Boolean, default: true },
  passwordProtected: { type: Boolean, default: false },
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

RegistrationTemplateSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const RegistrationTemplate = mongoose.models.RegistrationTemplate || 
  mongoose.model<IRegistrationTemplate>('RegistrationTemplate', RegistrationTemplateSchema);

export default RegistrationTemplate;
