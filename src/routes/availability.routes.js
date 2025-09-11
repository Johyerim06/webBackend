import { Router } from 'express';
import { Availability } from '../models/Availability.js';

export const availabilityRouter = Router();

availabilityRouter.post('/:eventId', async (req,res)=>{
  const userId = req.userId;
  const { slots } = req.body; // ISO 문자열 배열
  await Availability.findOneAndUpdate(
    { event: req.params.eventId, user: userId },
    { event: req.params.eventId, user: userId, slots },
    { upsert: true }
  );
  res.json({ ok:true });
});
