import { Schema, model, Types } from 'mongoose';

const personalEventSchema = new Schema({
  name: { type: String, required: true },
  user: { type: Types.ObjectId, ref: 'User', required: true },
  timeSlots: [{
    time: { type: String, required: true }, // "09:00"
    day: { type: String, required: true },  // "sun", "mon", etc.
  }],
  selectedDates: [Date],
  originalScheduleId: { type: Types.ObjectId, ref: 'Schedule' }, // 원본 시간표 참조
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

personalEventSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const PersonalEvent = model('PersonalEvent', personalEventSchema);

