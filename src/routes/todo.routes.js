import { Router } from 'express';
import mongoose from 'mongoose';
import { Todo } from '../models/Todo.js';
import { Club } from '../models/Club.js';

export const todoRouter = Router();

todoRouter.get('/club/:clubId', async (req,res)=>{
  const { clubId } = req.params;
  // DEMO 슬러그 지원: 없으면 생성 후 ObjectId로 리다이렉트
  if(!mongoose.Types.ObjectId.isValid(clubId)){
    if(clubId === 'DEMO'){
      const demo = await Club.findOneAndUpdate(
        { name: 'DEMO' },
        { name: 'DEMO', description: '샘플 클럽' },
        { upsert: true, new: true }
      );
      return res.redirect(`/todos/club/${demo._id}`);
    }
    return res.status(400).send('invalid clubId');
  }
  const list = await Todo.find({ club: clubId });
  res.render('todo', { list, clubId });
});

todoRouter.post('/', async (req,res)=>{
  const body = { ...req.body };
  if(!body.title || !String(body.title).trim()){
    return res.status(400).send('title is required');
  }
  if(!body.assignee && req.userId) body.assignee = req.userId;
  const t = await Todo.create(body);
  res.redirect(`/todos/club/${t.club}`);
});

todoRouter.post('/:id/move', async (req,res)=>{
  await Todo.findByIdAndUpdate(req.params.id, { status: req.body.status });
  res.json({ ok:true });
});
