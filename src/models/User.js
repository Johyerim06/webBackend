import { Schema, model, Types } from 'mongoose';

const schema = new Schema({
  kakaoId: String,
  email: { type: String, index: true, unique: true, sparse: true },
  passwordHash: String,
  name: String,
  profileImage: String,
  clubs: [{ type: Types.ObjectId, ref: 'Club' }],
  roleByClub: [{ club: { type: Types.ObjectId, ref: 'Club' }, 
    role: { type: String, enum: ['admin','member'], default:'member' } }]
}, { timestamps: true });

export const User = model('User', schema);
