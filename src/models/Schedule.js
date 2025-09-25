import { Schema, model, Types } from 'mongoose';

const scheduleSchema = new Schema({
  name: { type: String, required: true },
  user: { type: Types.ObjectId, ref: 'User', required: true },
  timeSlots: [{
    time: { type: String, required: true }, // "09:00"
    day: { type: String, required: true },  // "Mon", "Tue", etc.
  }],
  selectedDates: [Date],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

scheduleSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Schedule = model('Schedule', scheduleSchema);

