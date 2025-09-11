import { Schema, model, Types } from 'mongoose';

const schema = new Schema({
  club: { type: Types.ObjectId, ref: 'Club', required: true },
  event: { type: Types.ObjectId, ref: 'Event' },
  title: { type: String, required: true },
  assignee: { type: Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['todo','doing','done'], default: 'todo' }
}, { timestamps: true });

export const Todo = model('Todo', schema);
