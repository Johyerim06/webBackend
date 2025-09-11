import { Router } from 'express';
import { Vote } from '../models/Vote.js';
import { Event } from '../models/Event.js';

export const voteRouter = Router();

voteRouter.post('/:eventId', async (req,res)=>{
  const userId = req.userId;
  const { candidateIndex } = req.body;
  const ev = await Event.findById(req.params.eventId);
  if(!ev || !ev.candidates?.[candidateIndex]) return res.status(400).send('invalid candidate');
  await Vote.findOneAndUpdate(
    { event: req.params.eventId, user: userId },
    { event: req.params.eventId, user: userId, candidateIndex },
    { upsert: true }
  );
  res.json({ ok: true });
});

voteRouter.get('/:eventId/result', async (req,res)=>{
  const votes = await Vote.find({ event: req.params.eventId });
  const count = {};
  for(const v of votes){ count[v.candidateIndex] = (count[v.candidateIndex]||0)+1; }
  const winner = Object.entries(count).sort((a,b)=> b[1]-a[1])[0] || null;
  res.json({ count, winnerIndex: winner? Number(winner[0]) : null });
});
