(function(){
const targetPrefixes={
 guardTarget:'allyUnit',healTargetCore:'allyUnit',matureTarget:'allyUnit',shiftTargetBuff:'allyUnit',readyTarget:'allyUnit',buffTarget:'allyUnit',
 silenceTarget:'anyUnit',bounceTarget:'anyUnit',damageExile:'enemyUnit',damageTarget:'anyUnit',moveEnemy:'enemyUnit'
};
function prefix(effect){return String(effect||'').split(':')[0]}
function targetMode(effect){return targetPrefixes[prefix(effect)]||null}
function num(parts,i,fallback){const x=Number(parts[i]);return Number.isFinite(x)?x:fallback}
async function resolve(api,card,owner,target){
 const e=String(card.effect||'');const p=e.split(':');const code=p[0];
 if(card.type==='cause') api.closeEvents(owner,card.eventType);
 if(!e)return;
 switch(code){
  case'foundation':{const lane=target&&target.slot; if(lane==null)break; for(const era of['Present','Future']){const u=api.state.players[owner].board[era][lane];if(u){u.maxHp+=num(p,1,1);u.hp+=num(p,1,1);api.emit('buff',{unit:u,text:'+HP'});}}break;}
  case'guardSelf': if(target&&target.unit)api.addGuard(target.unit,num(p,1,1),owner);break;
  case'healCore': api.healCore(owner,num(p,1,1));break;
  case'barrier': if(target&&target.unit)target.unit.barrier=num(p,1,1);break;
  case'matureHeal': break;
  case'futureAuraHp': break;
  case'guardTarget': api.addGuard(target.unit,num(p,1,1),owner);if(target.era==='Past')api.healUnit(target.unit,2);break;
  case'healTargetCore': api.healUnit(target.unit,num(p,1,3));api.healCore(owner,num(p,2,2));break;
  case'matureTarget': api.matureUnit(target.unit,owner,true);api.addGuard(target.unit,1,owner);break;
  case'pastDraw':case'matureGuard':case'pastSilence':case'shiftBuff':case'tempFlux':case'futureMature':case'deathFlux':case'entropyBurn':case'forecastOpen':case'causeDiscount':break;
  case'summonGuardian': api.summonToken(owner,'Past',null,{name:'Guardian from Tomorrow',attack:2,hp:3,keyword:'Guard'});break;
  case'draw': api.draw(owner,num(p,1,1));break;
  case'freeShift': api.state.players[owner].turnFlags.freeShift=true;break;
  case'weakenOpposite': break;
  case'fullIntervene': if(target&&target.unit)target.unit.fullIntervene=true;break;
  case'silenceOpposite':{const u=api.opposingUnit(owner,target.era,target.slot);if(u)api.silenceUnit(u);break;}
  case'matureShiftBuff': break;
  case'shiftDamage': break;
  case'shiftTargetBuff': if(api.requestMove(target.unit,owner)){target.unit.maxHp++;target.unit.hp++;api.emit('buff',{unit:target.unit,text:'+1 HP'});}break;
  case'silenceTarget': api.silenceUnit(target.unit);target.unit.guard=0;break;
  case'bounceTarget': api.returnToHand(target.owner,target.unit,1);break;
  case'moveEnemy': api.requestMove(target.unit,target.owner,true);break;
  case'buffTarget':{const a=num(p,1,2),h=num(p,2,2);target.unit.attack+=a;target.unit.maxHp+=h;target.unit.hp+=h;api.emit('buff',{unit:target.unit,text:`+${a}/+${h}`});break;}
  case'discountFuture': api.state.players[owner].discountFuture=(api.state.players[owner].discountFuture||0)+num(p,1,1);break;
  case'gainFlux': api.gainFlux(owner,num(p,1,1));break;
  case'swift': if(target&&target.unit)target.unit.swift=true;break;
  case'drawFutureFlux':{const c=api.draw(owner,1)[0];if(c&&c.era==='Future')api.gainFlux(owner,1);break;}
  case'matureCore': break;
  case'matureDrone': break;
  case'gainFluxDebt': api.gainFlux(owner,num(p,1,2));api.state.players[owner].costDebt=(api.state.players[owner].costDebt||0)+1;break;
  case'readyTarget': target.unit.acted=false;target.unit.summonedTurn=-999;api.emit('buff',{unit:target.unit,text:'READY'});break;
  case'matureAll': for(const u of api.allUnits(owner))if(u.forecast>0)api.matureUnit(u,owner,true);break;
  case'drawFlux': api.draw(owner,1);api.gainFlux(owner,1);break;
  case'deathBothCore':case'sacDraw':case'backlashGrow':case'killParadox':case'recycleDiscount':case'matureEraseDamaged':break;
  case'sacFlux':{const u=target&&target.unit;if(!u)break;const value=Math.ceil((u.baseCost||2)/2);api.eraseUnit(target.owner,u,{sacrifice:true});api.gainFlux(owner,value);break;}
  case'collapseForDamage':{const ev=api.state.players[owner].events.find(x=>!x.closed);if(ev)api.collapseEvent(owner,ev,true);break;}
  case'damageExile': await api.damageUnit(target.owner,target.unit,num(p,1,4),{sourceOwner:owner,exileOnDeath:true});break;
  case'damageTarget': await api.damageUnit(target.owner,target.unit,num(p,1,3),{sourceOwner:owner});break;
  case'eraseLowest':{let units=[];for(let i=0;i<2;i++)units=units.concat(api.allUnits(i).map(u=>({u,owner:i})));units.sort((a,b)=>a.u.hp-b.u.hp);if(units[0])api.eraseUnit(units[0].owner,units[0].u,{});break;}
  case'scry': api.scry(owner,num(p,1,1),false);break;
  case'crossShift': if(target&&target.unit)target.unit.crossShift=true;break;
  case'forecast': if(target&&target.unit)target.unit.forecast=num(p,1,2);break;
  case'breakContingency':{const enemy=api.state.players[1-owner];if(enemy.prepared.length){const c=enemy.prepared.shift();enemy.discard.push(c);api.announce('CONTINGENCY BROKEN');}}break;
  case'salvage':{const pl=api.state.players[owner];if(pl.discard.length){pl.deck.unshift(pl.discard.pop());api.draw(owner,1);}break;}
  case'scryDraw': api.scry(owner,num(p,1,3),true);break;
  case'choiceDrawHeal': api.draw(owner,2);api.healCore(owner,2);break;
  case'copyCheapest':{const all=api.allUnits(owner).slice().sort((a,b)=>(a.baseCost||9)-(b.baseCost||9));if(all[0])api.summonToken(owner,all[0].era,null,{name:'Bootstrap Copy',attack:all[0].attack,hp:all[0].maxHp,keyword:'Copy'});break;}
 }
}
async function mature(api,unit,owner){
 const c=api.card(unit.cardId);if(!c)return;
 const e=String(c.effect||'');const p=e.split(':');
 switch(p[0]){
  case'matureHeal':api.healCore(owner,num(p,1,2));break;
  case'matureShiftBuff':unit.attack++;api.requestMove(unit,owner,false,true);break;
  case'matureCore':api.damageCore(1-owner,num(p,1,1),{sourceOwner:owner});break;
  case'matureDrone':api.summonToken(owner,'Future',unit.slot===0?1:0,{name:'Tomorrow Drone',attack:2,hp:2,keyword:'Drone'});break;
  case'matureEraseDamaged':for(let i=0;i<2;i++)for(const u of api.allUnits(i).slice())if(u.hp<u.maxHp)api.eraseUnit(i,u,{});break;
 }
 const a=api.state.players[owner].anchors.Future;if(a&&api.card(a.cardId).effect==='matureGuard')api.addGuard(unit,1,owner);
}
async function trigger(api,owner,trigger,ctx){
 const pl=api.state.players[owner];const idx=pl.prepared.findIndex(c=>c.trigger===trigger);if(idx<0)return ctx;
 const card=pl.prepared.splice(idx,1)[0];pl.discard.push(card);api.announce(card.name.toUpperCase());api.log(`${pl.name} triggered ${card.name}.`);const e=card.effect;
 if(e==='saveUnit'&&ctx.unit){ctx.preventDeath=true;ctx.unit.hp=Math.max(1,ctx.unit.hp);ctx.unit.guard=(ctx.unit.guard||0)+1;}
 if(e==='preventBacklash'&&ctx.event){ctx.prevent=true;ctx.event.deadline++;}
 if(e==='stealParadox'){ctx.steal=(ctx.steal||0)+1;pl.paradox++;}
 if(e==='shortenEvent'&&ctx.event){ctx.event.deadline--;api.draw(owner,1);}
 if(e==='futureAmbush'&&ctx.era==='Future')api.summonToken(owner,'Future',ctx.slot,{name:'Tomorrow Ambusher',attack:2,hp:2,keyword:'Temporary',temporary:true});
 if(e==='damageBuffDraw'&&ctx.unit){ctx.unit.attack++;api.draw(owner,1);api.emit('buff',{unit:ctx.unit,text:'+1 ATK'});}
 if(e==='revengeDamage'&&ctx.unit){const opp=api.opposingUnit(owner,ctx.unit.era,ctx.unit.slot);if(opp)await api.damageUnit(1-owner,opp,ctx.unit.attack,{sourceOwner:owner});}
 if(e==='forkTax')api.damageCore(1-owner,3,{sourceOwner:owner});
 if(e==='reduceCore')ctx.amount=Math.max(0,ctx.amount-num(String(e).split(':')[1],1));
 if(e==='targetGuard'&&ctx.unit)api.addGuard(ctx.unit,1,owner);
 return ctx;
}
window.ChronoEffects={targetMode,resolve,mature,trigger};
})();
