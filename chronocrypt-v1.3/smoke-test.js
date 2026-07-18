const fs=require('fs'),vm=require('vm'),assert=require('assert');
global.window=global;
for(const file of['cards.js','effects.js','engine.js','rules.js']){
  vm.runInThisContext(fs.readFileSync(__dirname+'/app/src/main/assets/'+file,'utf8'),{filename:file});
}
const G=global.ChronoGame;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  assert.strictEqual(G.data.cards.length,72,'foundational card set must contain 72 cards');
  G.start({mode:'local',p1Doctrine:'preservation',p2Doctrine:'revision'});
  G.finishMulligan(false);
  await sleep(20);
  assert.strictEqual(G.state.globalTurn,1,'first turn must begin after mulligan');
  const p=G.state.players[0];

  const cheapUnitIndex=p.deck.findIndex(ci=>{const c=G.card(ci.cardId);return c.type==='unit'&&c.cost<=2});
  assert(cheapUnitIndex>=0,'deck must contain an affordable unit');
  const cheapUnit=p.deck.splice(cheapUnitIndex,1)[0];p.hand.push(cheapUnit);p.flux=10;
  const unitCard=G.card(cheapUnit.cardId);
  const legal=G.legalPlacements(unitCard,0);
  assert(legal.some(x=>x.slot===1),'slot 2 must be an explicit legal destination');
  let result=await G.playCard(0,cheapUnit.uid,{era:unitCard.era,slot:1,type:'unit'},null);
  assert(result.ok,'unit deployment should succeed');
  assert(G.state.players[0].board[unitCard.era][1],'unit must remain in the selected second slot');
  assert.strictEqual(G.state.players[0].board[unitCard.era][0],null,'slot 1 must remain empty');

  const deployed=G.state.players[0].board[unitCard.era][1];
  deployed.summonedTurn=-999;
  assert(G.commandUnit(0,deployed.uid,'Anchor'),'unit command should be accepted');
  assert(G.previewCombat(0).some(x=>x.includes('anchors')),'combat forecast should describe Anchor');

  const contingencyIndex=p.deck.findIndex(ci=>G.card(ci.cardId).type==='contingency');
  assert(contingencyIndex>=0,'deck must contain a Contingency');
  const contingency=p.deck.splice(contingencyIndex,1)[0];p.hand.push(contingency);p.flux=10;
  result=await G.playCard(0,contingency.uid,null,null);
  assert(result.ok&&p.prepared.length===1,'Contingency should enter the prepared zone');

  const causeIndex=p.deck.findIndex(ci=>G.card(ci.cardId).type==='cause'&&!global.ChronoEffects.targetMode(G.card(ci.cardId).effect));
  assert(causeIndex>=0,'deck must contain a non-targeted Cause card');
  const cause=p.deck.splice(causeIndex,1)[0],causeCard=G.card(cause.cardId);p.hand.push(cause);p.flux=10;
  p.events.push({id:'test-loop',eventType:causeCard.eventType,name:'Test Unknown Origin',causeName:causeCard.name,deadline:99,closed:false});
  result=await G.playCard(0,cause.uid,null,null);await sleep(30);
  assert(result.ok,'Cause card should resolve');
  assert(p.events[0].closed,'playing the named Cause must close its matching loop');
  assert(p.paradox>0||p.forkReady,'closing a loop must award Paradox progress');

  console.log('Chronocrypt smoke test passed: 72 cards, explicit slot targeting, commands, Contingencies, persistent rules, and causal closure.');
})().catch(err=>{console.error(err);process.exit(1)});
