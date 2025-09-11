import { Schema, model } from 'mongoose';

const schema = new Schema({
  name: { type: String, required: true },
  description: String,
  activities: [String],
  notices: [{ title: String, content: String, createdAt: { type: Date, default: Date.now } }]
}, { timestamps: true });

export const Club = model('Club', schema);
