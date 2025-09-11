import { Router } from 'express';
import { Event } from '../models/Event.js';
import { buildCandidates } from '../services/suggestion.service.js';

export const eventRouter = Router();

// 폼 화면
eventRouter.get('/new/:clubId', (req,res)=>{
  res.render('event_form', { clubId: req.params.clubId });
});

// 생성
eventRouter.post('/', async (req,res)=>{
  const ev = await Event.create(req.body);
  res.redirect(`/events/${ev._id}/schedule`);
});

// 상세
eventRouter.get('/:id', async (req,res)=>{
  const ev = await Event.findById(req.params.id);
  res.json(ev);
});

// 일정 조율 화면
eventRouter.get('/:id/schedule', async (req,res)=>{
  const ev = await Event.findById(req.params.id);
  res.render('schedule', { ev });
});

// 후보 생성(관리자)
eventRouter.post('/:id/candidates', async (req,res)=>{
  const list = await buildCandidates(req.params.id, Number(req.body.thresholdRate || 0.7));
  res.redirect(`/events/${req.params.id}/vote`);
});

// 투표 화면
eventRouter.get('/:id/vote', async (req,res)=>{
  const ev = await Event.findById(req.params.id);
  res.render('vote', { ev });
});

// 확정(관리자)
eventRouter.post('/:id/confirm', async (req,res)=>{
  const { start, end } = req.body;
  const ev = await Event.findByIdAndUpdate(req.params.id, { status:'confirmed', confirmed: { start, end } }, { new: true });
  res.render('admin', { ev, ok:true });
});
