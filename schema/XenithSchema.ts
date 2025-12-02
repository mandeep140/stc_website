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
  level1Key: { type: String, unique: true, sparse: true },
  level2Key: { type: String, unique: true, sparse: true },
  level3Key: { type: String, unique: true, sparse: true },
  verifiedAt: {
    level1: { type: Date },
    level2: { type: Date },
    level3: { type: Date }
  }
}, { timestamps: true });

export default mongoose.models.Xenith || mongoose.model('Xenith', XenithSchema);