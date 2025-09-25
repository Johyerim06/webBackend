import { Schema, model, Types } from 'mongoose';

const schema = new Schema({
  email: { type: String, index: true, unique: true, sparse: true },
  passwordHash: String,
  name: String,
  profileImage: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  clubs: [{ type: Types.ObjectId, ref: 'Club' }],
  roleByClub: [{ club: { type: Types.ObjectId, ref: 'Club' }, 
    role: { type: String, enum: ['admin','member'], default:'member' } }]
}, { timestamps: true });

export const User = model('User', schema);
