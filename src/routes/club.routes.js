import { Router } from 'express';
import { Club } from '../models/Club.js';

export const clubRouter = Router();

clubRouter.get('/:id', async (req,res)=>{
  const club = await Club.findById(req.params.id);
  res.render('club', { club });
});

clubRouter.post('/', async (req,res)=>{
  const club = await Club.create(req.body);
  res.redirect(`/club/${club._id}`);
});
