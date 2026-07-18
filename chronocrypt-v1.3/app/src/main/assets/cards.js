(function(){
const D={
 preservation:{name:'Preservation',color:'#86efac',summary:'Guard, healing, stable history.',passive:'Your Core starts at 27. The first Guard gained each turn gains +1.',leader:'Astra Vale'},
 revision:{name:'Revision',color:'#c4b5fd',summary:'Movement, rewriting, disruption.',passive:'Your first Shift each turn is free and draws a card once per round.',leader:'Mara Quill'},
 acceleration:{name:'Acceleration',color:'#67e8f9',summary:'Flux, Future power, rapid tempo.',passive:'Start with +1 Flux. The first Future card each turn costs 1 less.',leader:'Ivo Meridian'},
 entropy:{name:'Entropy',color:'#fb7185',summary:'Sacrifice, backlash, dangerous value.',passive:'When your unit is erased, gain 1 Flux once per turn. Recycle backlash is reduced by 1.',leader:'Nox Iridian'}
};
const L={
 preservation:{name:'Astra Vale, Keeper of First Light',ability:'Once per match: give every allied unit Guard 1.',doctrine:'preservation'},
 revision:{name:'Mara Quill, Author of Elsewhen',ability:'Once per match: swap any two allied units, even across eras.',doctrine:'revision'},
 acceleration:{name:'Ivo Meridian, Horizon Runner',ability:'Once per match: gain 3 Flux and mature all Forecast units.',doctrine:'acceleration'},
 entropy:{name:'Nox Iridian, Last Witness',ability:'Once per match: erase an allied unit; deal its Attack to the enemy Core.',doctrine:'entropy'}
};
let n=0;const cards=[];const id=(d,name)=>d.slice(0,3)+'_'+(++n)+'_'+name.toLowerCase().replace(/[^a-z0-9]+/g,'_');
function unit(d,name,era,cost,atk,hp,text,effect,keyword){cards.push({id:id(d,name),name,type:'unit',doctrine:d,era,cost,attack:atk,hp,text,effect:effect||null,keyword:keyword||'',rarity:cost>=5?'Mythic':cost>=4?'Rare':'Common'});}
function tactic(d,name,era,cost,text,effect){cards.push({id:id(d,name),name,type:'tactic',doctrine:d,era,cost,text,effect,rarity:cost>=4?'Rare':'Common'});}
function contingency(d,name,cost,trigger,text,effect){cards.push({id:id(d,name),name,type:'contingency',doctrine:d,era:'Present',cost,trigger,text,effect,rarity:'Rare'});}
function anchor(d,name,era,cost,text,effect){cards.push({id:id(d,name),name,type:'anchor',doctrine:d,era,cost,text,effect,rarity:'Rare'});}
function cause(d,name,era,cost,eventType,text,effect){cards.push({id:id(d,name),name,type:'cause',doctrine:d,era,cost,eventType,text,effect,rarity:'Mythic'});}
// PRESERVATION
unit('preservation','Rootline Sentinel','Past',2,1,4,'Foundation. On deploy, allied units in this lane gain +1 maximum health.','foundation:1','Foundation');
unit('preservation','Archive Warden','Past',3,2,5,'On deploy, gain Guard 1.','guardSelf:1','Guard');
unit('preservation','Civic Mediator','Present',2,2,3,'On deploy, heal your Core 1.','healCore:1','Mend');
unit('preservation','Continuity Knight','Present',4,3,6,'The first damage this unit takes each round is reduced by 1.','barrier:1','Barrier');
unit('preservation','Dawn Refugee','Future',3,2,4,'Forecast. When this matures, heal your Core 2.','matureHeal:2','Forecast');
unit('preservation','Citadel Beyond Years','Future',6,4,8,'Forecast. Allied units in this era have +1 health.','futureAuraHp:1','Forecast');
tactic('preservation','Seal the Record','Past',2,'Give a unit Guard 2. If it is in the Past, also heal it 2.','guardTarget:2');
tactic('preservation','Merciful Present','Present',3,'Heal a unit 3 and your Core 2.','healTargetCore:3:2');
tactic('preservation','Safe Arrival','Future',3,'Mature a Forecast unit immediately, then give it Guard 1.','matureTarget');
contingency('preservation','Temporal Shield',2,'allyWouldDie','When an allied unit would be erased, prevent that damage and give it Guard 1.','saveUnit');
contingency('preservation','Unbroken Promise',2,'loopBacklash','When your loop would collapse, prevent its Core damage and add one turn to its deadline.','preventBacklash');
anchor('preservation','The First Library','Past',3,'The first Past unit you deploy each turn draws a card.','pastDraw');
anchor('preservation','Sanctuary at Last','Future',4,'Your Forecast units gain Guard 1 when they mature.','matureGuard');
cause('preservation','Dispatch the Guardians','Future',4,'ghost_guardians','Cause: close every Ghost Guardians event. Create a 2/3 Guardian in an open Past slot.','summonGuardian');
cause('preservation','Preserve the Message','Present',3,'warning_from_nowhere','Cause: close every Warning from Nowhere event. Draw 2 cards.','draw:2');
// REVISION
unit('revision','Palimpsest Scout','Past',2,2,2,'On deploy, you may Shift another allied unit.','freeShift','Rewrite');
unit('revision','Contradiction Scribe','Past',3,2,4,'Enemy units opposite this have -1 Attack.','weakenOpposite:1','Rewrite');
unit('revision','Nowhere Duelist','Present',2,3,2,'Intervene deals full damage instead of -1.','fullIntervene','Intervene');
unit('revision','Timeline Editor','Present',4,3,4,'On deploy, Silence the opposing unit this turn.','silenceOpposite','Silence');
unit('revision','Unwritten Agent','Future',3,3,3,'Forecast. When mature, Shift to any open slot and gain +1 Attack.','matureShiftBuff','Forecast');
unit('revision','Queen of Alternate Ends','Future',6,5,5,'Whenever an allied unit Shifts, deal 1 to the opposing unit in its new lane.','shiftDamage:1','Rewrite');
tactic('revision','Redraft Position','Past',1,'Shift an allied unit. It gains +1 health.','shiftTargetBuff');
tactic('revision','Erase the Clause','Present',3,'Silence a unit and remove all Guard from it.','silenceTarget');
tactic('revision','Choose Another Ending','Future',4,'Return a unit to its owner’s hand. It costs 1 less this match.','bounceTarget');
contingency('revision','False History',2,'enemyClosesLoop','When the enemy closes a loop, steal 1 Paradox from the reward.','stealParadox');
contingency('revision','Causal Rejection',2,'enemyCreatesEvent','When the enemy creates an Unknown Origin, shorten its deadline by 1 and draw a card.','shortenEvent');
anchor('revision','Hall of Redactions','Past',3,'The first enemy deployed opposite a Past unit each turn is Silenced for the turn.','pastSilence');
anchor('revision','Mirror Parliament','Present',4,'Once per turn after you Shift, give that unit +1 Attack this turn.','shiftBuff');
cause('revision','Plant the Impossible Evidence','Past',3,'impossible_evidence','Cause: close every Impossible Evidence event. Move an enemy unit to another open slot.','moveEnemy');
cause('revision','Send the Counterfactual','Future',4,'borrowed_victory','Cause: close every Borrowed Victory event. Give an allied unit +2/+2.','buffTarget:2:2');
// ACCELERATION
unit('acceleration','Spark Ancestor','Past',1,1,2,'Foundation. Your next Future card costs 1 less.','discountFuture:1','Foundation');
unit('acceleration','Engine Founder','Past',3,2,4,'On deploy, gain 1 Flux.','gainFlux:1','Engine');
unit('acceleration','Moment Runner','Present',2,3,2,'May Advance the turn it is deployed.','swift','Swift');
unit('acceleration','Flux Courier','Present',3,2,3,'On deploy, draw a card. If it is Future, gain 1 Flux.','drawFutureFlux','Courier');
unit('acceleration','Horizon Lancer','Future',3,4,2,'Forecast. When mature, deal 1 to the enemy Core.','matureCore:1','Forecast');
unit('acceleration','Tomorrow’s Armada','Future',6,6,5,'Forecast. When mature, create a 2/2 Drone in the other Future slot.','matureDrone','Forecast');
tactic('acceleration','Overclock History','Past',2,'Gain 2 Flux. Your next card costs 1 more.','gainFluxDebt:2');
tactic('acceleration','Act Between Seconds','Present',2,'Ready a unit that already acted; it may act again this turn.','readyTarget');
tactic('acceleration','Pull Tomorrow Forward','Future',3,'Mature every allied Forecast unit.','matureAll');
contingency('acceleration','Ambush from Tomorrow',2,'emptyLaneAttacked','When an empty allied Future lane is attacked, create a temporary 2/2 defender there.','futureAmbush');
contingency('acceleration','Emergency Refit',1,'allyDamaged','The first time an allied unit takes damage, give it +1 Attack and draw a card.','damageBuffDraw');
anchor('acceleration','Prototype Reactor','Past',3,'At the start of your turn, gain 1 temporary Flux.','tempFlux');
anchor('acceleration','Endless Launch Window','Future',4,'Your first Future unit each turn enters mature.','futureMature');
cause('acceleration','Launch the Cache Backward','Future',3,'future_cache','Cause: close every Future Cache event. Gain 3 Flux.','gainFlux:3');
cause('acceleration','Transmit the Shortcut','Present',2,'stolen_moment','Cause: close every Stolen Moment event. Draw a card and gain 1 Flux.','drawFlux');
// ENTROPY
unit('entropy','Ashen Progenitor','Past',2,2,3,'When erased, deal 1 to both Cores.','deathBothCore:1','Decay');
unit('entropy','Ruin Cultivator','Past',3,3,3,'On deploy, you may erase another allied unit to draw 2.','sacDraw:2','Sacrifice');
unit('entropy','Backlash Feeder','Present',2,2,3,'Whenever a loop collapses, gain +1 Attack permanently.','backlashGrow','Backlash');
unit('entropy','Paradox Butcher','Present',4,5,3,'When this erases a unit, gain 1 Paradox.','killParadox','Predator');
unit('entropy','Last Survivor','Future',3,3,4,'Forecast. Costs 1 less for each recycle you have made.','recycleDiscount','Forecast');
unit('entropy','Heat Death Incarnate','Future',7,7,7,'Forecast. On mature, erase every damaged unit.','matureEraseDamaged','Forecast');
tactic('entropy','Profitable Collapse','Past',2,'Erase an allied unit. Gain Flux equal to half its cost, rounded up.','sacFlux');
tactic('entropy','Weaponize Backlash','Present',3,'Choose one of your unresolved events. Collapse it now; deal equal damage to the enemy Core.','collapseForDamage');
tactic('entropy','Erase Tomorrow','Future',4,'Deal 4 to a Future unit. If it is erased, permanently remove it from the match.','damageExile:4');
contingency('entropy','Mutual Ruin',2,'allyWouldDie','When an allied unit would be erased, also deal its Attack to the opposing unit.','revengeDamage');
contingency('entropy','Paradox Tax',2,'enemyForks','When the enemy forks a tactic, deal 3 to their Core.','forkTax');
anchor('entropy','Grave of First Causes','Past',3,'The first allied unit erased each turn grants 1 Flux.','deathFlux');
anchor('entropy','Entropy Horizon','Future',4,'At end of each round, deal 1 to both Cores for each player with 2+ Entropy.','entropyBurn');
cause('entropy','Author the Disaster','Past',3,'disaster_without_cause','Cause: close every Disaster Without Cause event. Deal 3 to any unit.','damageTarget:3');
cause('entropy','Complete the Dying Signal','Future',4,'dying_signal','Cause: close every Dying Signal event. Erase the lowest-health unit.','eraseLowest');
// Twelve neutral cards
unit('neutral','Chronal Surveyor','Past',2,2,3,'On deploy, inspect the top card; keep it or put it on the bottom.','scry:1','Survey');
unit('neutral','Era Walker','Present',3,3,3,'May Shift across eras instead of only within its era.','crossShift','Walker');
unit('neutral','Deferred Colossus','Future',5,6,6,'Forecast 2: this needs two maturation steps.','forecast:2','Forecast');
tactic('neutral','Universal Rebuttal','Present',3,'Cancel one prepared enemy Contingency.','breakContingency');
tactic('neutral','Temporal Salvage','Past',2,'Return a card from discard to the bottom of your deck and draw a card.','salvage');
tactic('neutral','Threefold Survey','Future',2,'Look at the top three cards; draw one and reorder the rest.','scryDraw:3');
contingency('neutral','Core Insurance',2,'coreDamaged','The first time your Core takes 3+ damage at once, reduce it by 2.','reduceCore:2');
contingency('neutral','Witness Protection',1,'targetedByTactic','When an allied unit is targeted by a tactic, give it Guard 1.','targetGuard');
anchor('neutral','Clockwork Observatory','Present',3,'Both players see combat forecasts before confirming End Turn.','forecastOpen');
anchor('neutral','Causal Junction','Present',4,'The first Cause card each turn costs 1 less.','causeDiscount');
cause('neutral','Close the Nameless Loop','Present',4,'nameless_intervention','Cause: close every Nameless Intervention event. Choose: draw 2 or heal 4.','choiceDrawHeal');
cause('neutral','Become Your Own Ancestor','Past',5,'ancestral_bootstrap','Cause: close every Ancestral Bootstrap event. Create a copy of your cheapest unit in an open slot.','copyCheapest');
window.CHRONO_DATA={doctrines:D,leaders:L,cards};
})();
