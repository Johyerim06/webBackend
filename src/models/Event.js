import { Schema, model, Types } from 'mongoose';

const schema = new Schema({
  club: { type: Types.ObjectId, ref: 'Club', required: true },
  title: { type: String, required: true },
  description: String,
  location: { name: String, address: String, lat: Number, lng: Number },
  windowStart: Date,
  windowEnd: Date,
  status: { type: String, enum: ['draft','collecting','voting','confirmed'], default: 'draft' },
  candidates: [{ start: Date, end: Date }],
  confirmed: { start: Date, end: Date },
  participants: [{
    name: { type: String, required: true },
    email: { type: String, required: true },
    availability: [{
      date: Date,
      timeSlots: [{
        startTime: String,
        endTime: String
      }]
    }],
    joinedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export const Event = model('Event', schema);
