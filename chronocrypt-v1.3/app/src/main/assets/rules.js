(function(){
const G=window.ChronoGame,ERAS=['Past','Present','Future'];
const cultivator=G.data.cards.find(c=>c.name==='Ruin Cultivator');
if(cultivator){cultivator.text='Whenever another allied unit is erased, draw a card once per turn.';cultivator.effect='allyDeathDraw';}
const originalStart=G.start;
function ensureCauses(ids,doctrine){
 if(!Array.isArray(ids)||ids.length!==24)return ids;
 const deck=ids.slice(),causes=G.data.cards.filter(c=>c.type==='cause'&&(c.doctrine===doctrine||c.doctrine==='neutral'));
 let count=deck.filter(id=>G.card(id)&&G.card(id).type==='cause').length;
 for(let i=0;count<2&&i<causes.length;i++){
  if(deck.filter(id=>id===causes[i].id).length>=2)continue;
  let replace=deck.length-1;
  while(replace>=0&&G.card(deck[replace])&&G.card(deck[replace]).type==='cause')replace--;
  if(replace<0)break;deck[replace]=causes[i].id;count++;
 }
 return deck;
}
G.start=function(opts={}){const next=Object.assign({},opts);next.p1Deck=ensureCauses(next.p1Deck,next.p1Doctrine||'preservation');next.p2Deck=ensureCauses(next.p2Deck,next.p2Doctrine||'revision');return originalStart(next);};
function def(u){return u&&u.cardId?G.card(u.cardId):null}
function recalcScribes(){
 for(let o=0;o<2;o++)for(const u of G.allUnits(o)){if(u.scribePenalty){u.attack+=u.scribePenalty;u.scribePenalty=0}}
 for(let o=0;o<2;o++)for(const era of ERAS)for(let s=0;s<2;s++){
  const scribe=G.state.players[o].board[era][s],c=def(scribe);if(!scribe||!c||c.effect!=='weakenOpposite'||scribe.silenced)continue;
  const target=G.state.players[1-o].board[era][s];if(target){target.attack=Math.max(0,target.attack-1);target.scribePenalty=(target.scribePenalty||0)+1;}
 }
}
function recalcFutureAuras(){
 for(let o=0;o<2;o++){
  const future=G.state.players[o].board.Future.filter(Boolean);
  const desired=future.filter(u=>{const c=def(u);return c&&c.effect==='futureAuraHp'&&!u.silenced}).length;
  for(const u of future){const current=u.futureAuraBonus||0,delta=desired-current;if(delta){u.maxHp+=delta;if(delta>0)u.hp+=delta;else u.hp=Math.max(1,Math.min(u.hp,u.maxHp));u.futureAuraBonus=desired;}}
 }
}
function onDeploy(p){
 const owner=p.owner,unit=p.unit,c=def(unit);if(!c)return;
 const mine=G.state.players[owner],enemy=G.state.players[1-owner];
 if(p.era==='Past'){
  const library=mine.anchors.Past&&G.card(mine.anchors.Past.cardId);
  if(library&&library.effect==='pastDraw'&&!mine.turnFlags.libraryDraw){mine.turnFlags.libraryDraw=true;G.draw(owner,1);G.api.announce('FIRST LIBRARY');}
  const redaction=enemy.anchors.Past&&G.card(enemy.anchors.Past.cardId);
  if(redaction&&redaction.effect==='pastSilence'&&!enemy.turnFlags.redactionUsed&&enemy.board.Past[p.slot]){enemy.turnFlags.redactionUsed=true;G.api.silenceUnit(unit);G.api.announce('HALL OF REDACTIONS');}
 }
 recalcScribes();recalcFutureAuras();
}
function onErased(p){
 const owner=p.owner,mine=G.state.players[owner];
 const cult=G.allUnits(owner).find(u=>{const c=def(u);return c&&c.effect==='allyDeathDraw'&&!u.silenced});
 if(cult&&!mine.turnFlags.cultivatorDraw&&cult.uid!==p.unit.uid){mine.turnFlags.cultivatorDraw=true;G.draw(owner,1);G.api.announce('RUIN CULTIVATED');}
 recalcScribes();recalcFutureAuras();
}
async function onTurn(){
 recalcScribes();recalcFutureAuras();
 if(G.state.active!==0||G.state.globalTurn<=1)return;
 let burn=0;for(let o=0;o<2;o++){const a=G.state.players[o].anchors.Future&&G.card(G.state.players[o].anchors.Future.cardId);if(a&&a.effect==='entropyBurn')burn++;}
 if(!burn)return;
 const unstable=G.state.players.filter(p=>p.entropy>=2).length;if(unstable){const amount=burn*unstable;G.api.announce('ENTROPY HORIZON');await G.api.damageCore(0,amount,{entropy:true});await G.api.damageCore(1,amount,{entropy:true});}
}
G.subscribe((type,p)=>{
 if(!G.state.players)return;
 if(type==='deploy')onDeploy(p);
 if(type==='erased')onErased(p);
 if(type==='move'||type==='status'){recalcScribes();recalcFutureAuras();}
 if(type==='turn')onTurn();
});
})();
