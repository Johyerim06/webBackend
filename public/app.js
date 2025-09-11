(function(){
  const grid = document.getElementById('slot-grid');
  if(!grid) return;
  const start = grid.dataset.start; const end = grid.dataset.end; const eventId = grid.dataset.event;

  // 슬롯 생성
  const slots = [];
  let cur = new Date(start); const END = new Date(end);
  cur.setSeconds(0,0);
  while(cur < END){ slots.push(new Date(cur).toISOString()); cur.setMinutes(cur.getMinutes()+30); }

  const selected = new Set();

  const wrap = document.createElement('div');
  wrap.style.display = 'grid';
  wrap.style.gridTemplateColumns = 'repeat(4,1fr)';
  wrap.style.gap = '8px';

  for(const s of slots){
    const btn = document.createElement('button');
    btn.textContent = new Date(s).toLocaleString();
    btn.style.padding = '8px';
    btn.style.border = '1px solid #ddd';
    btn.style.borderRadius = '8px';
    btn.onclick = ()=>{
      if(selected.has(s)){ selected.delete(s); btn.style.background=''; }
      else { selected.add(s); btn.style.background='#a7f3d0'; }
    };
    wrap.appendChild(btn);
  }
  grid.appendChild(wrap);

  document.getElementById('save-slots')?.addEventListener('click', async ()=>{
    await fetch(`/availability/${eventId}`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ slots: Array.from(selected) })
    });
    alert('저장됨');
  });
})();
