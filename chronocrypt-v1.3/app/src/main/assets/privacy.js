(function(){
const G=window.ChronoGame,overlay=document.getElementById('overlay');
function sync(){
 const s=G.state;if(!s||!s.players)return;
 if(s.mode==='local'){
  const zones=document.querySelectorAll('.contingency-zone .prepared');
  if(zones.length===2){
   const me=s.active;
   const mine=s.players[me].prepared.map(x=>G.card(x.cardId).name).join(' · ')||'NONE';
   zones[0].innerHTML=me===0?`YOUR CONTINGENCIES<br>${mine}`:`RIVAL CONTINGENCIES<br>${s.players[0].prepared.length} PREPARED`;
   zones[1].innerHTML=me===1?`YOUR CONTINGENCIES<br>${mine}`:`RIVAL CONTINGENCIES<br>${s.players[1].prepared.length} PREPARED`;
  }
 }
 const aiThinking=s.mode==='ai'&&s.players[s.active].isAI&&s.winner==null&&!s.mulliganPhase;
 if(aiThinking){
  if(overlay.dataset.aiBlock!=='true'){
   overlay.dataset.aiBlock='true';overlay.classList.add('show');
   overlay.innerHTML='<div class="modal hero" data-ai-modal><h2>CONTINUUM AI</h2><p>Calculating causal lines, prepared reactions, and combat commands…</p></div>';
  }
 }else if(overlay.dataset.aiBlock==='true'){
  delete overlay.dataset.aiBlock;
  if(overlay.querySelector('[data-ai-modal]')){overlay.classList.remove('show');overlay.innerHTML='';}
 }
}
G.subscribe(()=>setTimeout(sync,0));
})();
