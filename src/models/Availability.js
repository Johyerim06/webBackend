import { Schema, model, Types } from 'mongoose';

const schema = new Schema({
  eventId: { type: String, required: true }, // Meeting ID (문자열)
  eventsID: { type: Types.ObjectId, required: false }, // Events 컬렉션의 _id
  eventTitle: { type: String, required: false }, // Events 컬렉션의 title
  creatorID: { type: Types.ObjectId, ref: 'User', required: false }, // Events 컬렉션의 creator
  meetingUrl: { type: String, required: false }, // 모임 URL
  meetingName: { type: String, required: false }, // 모임 이름 (기존 호환성)
  userId: { type: Types.ObjectId, ref: 'User', required: true }, // 가용시간을 저장한 사용자
  personalEventId: { type: Types.ObjectId, ref: 'PersonalEvent', required: false }, // 선택적
  availability: [{
    date: { type: String, required: true }, // "2024-01-15"
    timeSlots: [{
      startTime: { type: String, required: true }, // "09:00"
      endTime: { type: String, required: true }    // "09:30"
    }]
  }]
}, { timestamps: true });

schema.index({ eventId: 1, userId: 1 }, { unique: true });

export const Availability = model('Availability', schema);
