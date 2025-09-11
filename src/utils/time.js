export function generateSlots(startISO, endISO){
  const start = new Date(startISO);
  const end = new Date(endISO);
  const arr = [];
  const cur = new Date(start);
  cur.setSeconds(0,0);
  while (cur < end){
    arr.push(cur.toISOString());
    cur.setMinutes(cur.getMinutes()+30);
  }
  return arr;
}
