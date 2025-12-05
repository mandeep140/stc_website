import mongoose from 'mongoose';

const XenithSchema = new mongoose.Schema({
  teamName: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    trim: true,
    lowercase: true,
    match: [/^[^@\s]+@iitp\.ac\.in$/, 'Please use an IITP email address']
  },
  name: { type: String, required: true, trim: true },
  SunKey: { type: String, unique: true, sparse: true },
  MoonKey: { type: String, unique: true, sparse: true },
  verifiedAt: {
    Sun: { type: Date },
    Moon: { type: Date }
  }
}, { timestamps: true });

export default mongoose.models.Xenith || mongoose.model('Xenith', XenithSchema);