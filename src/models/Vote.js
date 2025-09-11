import { Schema, model, Types } from 'mongoose';

const schema = new Schema({
  event: { type: Types.ObjectId, ref: 'Event', required: true },
  user: { type: Types.ObjectId, ref: 'User', required: true },
  candidateIndex: { type: Number, required: true }
}, { timestamps: true });

schema.index({ event: 1, user: 1 }, { unique: true });

export const Vote = model('Vote', schema);
