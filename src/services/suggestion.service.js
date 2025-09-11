import { Availability } from '../models/Availability.js';
import { Event } from '../models/Event.js';

export async function buildCandidates(eventId, thresholdRate = 0.7){
  const ev = await Event.findById(eventId);
  if(!ev) throw new Error('Event not found');
  const avs = await Availability.find({ event: eventId });
  const total = Math.max(1, avs.length);

  const map = new Map(); // key: ISO, val: count
  for(const a of avs){
    for(const s of a.slots){
      const k = new Date(s).toISOString();
      map.set(k, (map.get(k) || 0) + 1);
    }
  }

  const keys = Array.from(map.keys()).sort();
  const ok = keys.filter(k => (map.get(k) / total) >= thresholdRate);

  const groups = [];
  let run = [];
  const HALF = 30 * 60 * 1000;

  for(let i=0;i<ok.length;i++){
    const cur = new Date(ok[i]);
    const prev = run.length ? new Date(run[run.length-1]) : null;
    if(!prev || (cur.getTime() - prev.getTime() === HALF)){
      run.push(ok[i]);
    } else {
      if(run.length >= 2){
        groups.push({ start: new Date(run[0]), end: new Date(new Date(run[run.length-1]).getTime()+HALF) });
      }
      run = [ok[i]];
    }
  }
  if(run.length >= 2){
    groups.push({ start: new Date(run[0]), end: new Date(new Date(run[run.length-1]).getTime()+HALF) });
  }

  const candidates = groups
    .sort((a,b)=> (b.end-a.end) - (a.start-b.start))
    .slice(0,5);

  ev.candidates = candidates;
  ev.status = 'voting';
  await ev.save();
  return candidates;
}
