const sql = require("sqlite");
sql.open("./servants.sqlite");


exports.run = (client, message, args) => {


	function splitArg(arg) {
 	 return arg.match(/([a-z]+)([^a-z]*)/i);
	}
	function handleFou(vars, strValue) {
	  return parseFloat(strValue, 10);
	}
	function handleCE(vars, strValue) {
	  return parseFloat(strValue, 10);
	}
	function handleNP(vars, strValue) {
	  return parseFloat(strValue, 10);
	}
	function handleCardMod(vars, strValue) {
	  return parseFloat(strValue, 10);
	}
	function handleATKMod(vars, strValue) {
	  return parseFloat(strValue, 10);
	}
	function handleDEFMod(vars, strValue) {
	  return parseFloat(strValue, 10);
	}
	function handleNPMod(vars, strValue) {
	  return parseFloat(strValue, 10);
	}
	function handlePowerMod(vars, strValue) {
	  return parseFloat(strValue, 10);
	}
	function handleSuperEffectiveMod(vars, strValue) {
	  return parseFloat(strValue, 10);
	}
	function handleAddDMG(vars, strValue) {
	  return parseFloat(strValue, 10);
	}

 var vars = {
    servant: args.shift().toLowerCase(),
    fou : 990,
   	ce : 0,
   	np : 5,
  	cardmod : 0,
  	enemyclass : "potato",
  	enemyattribute : "potato",
  	atkmod : 0,
  	defmod : 0,
  	npmod : 0,
  	powermod : 0,
  	supereffectivemod : 0,
  	adddmg : 0
  };

  verbose = false;

  var classes = [
  	"saber",
  	"archer",
  	"lancer",
  	"rider",
  	"caster",
  	"assassin",
  	"berserker",
  	"ruler",
  	"avenger",
  	"mooncancer",
  	"alterego",
  	"foreigner"
  ];
  var attributes = [
  	"man",
  	"earth",
  	"sky",
  	"star",
  	"beast"
  ];
  var prefix_mappings = {
  fou: "fou",
  f: "fou",
  ce: "ce",
  c: "ce",
  np: "np",
  cardmod : "cardmod",
  m : "cardmod",
  atkmod : "atkmod",
  atk : "atkmod",
  attack : "atkmod",
  a : "atkmod",
  defmod : "defmod",
  def : "defmod",
  defense : "defmod",
  d : "defmod",
  npmod : "npmod",
  n : "npmod",
  powermod : "powermod",
  power : "powermod",
  p : "powermod",
  supereffectivemod : "supereffectivemod",
  se : "supereffectivemod",
  super : "supereffectivemod",
  s : "supereffectivemod",
  adddmg : "adddmg",
  flatdamage : "adddmg",
  ad : "adddmg",
  fd : "adddmg",
  dmg : "adddmg"
  };

  var field_handlers = {
  fou : handleFou,
  ce : handleCE,
  np : handleNP,
  cardmod : handleCardMod,
  atkmod : handleATKMod,
  defmod : handleDEFMod,
  npmod : handleNPMod,
  powermod : handlePowerMod,
  supereffectivemod : handleSuperEffectiveMod,
  adddmg : handleAddDMG
}

  function evaluateArg(vars, arg) {
 	if (arg[2]) {
      var field = prefix_mappings[arg[1]];
 		if(typeof field_handlers[field] == 'function') {
      vars[field] = field_handlers[field](vars, arg[2]);
  }	
  		else message.channel.send('invalid argument \"'+arg[1]+'\"')
    } 
    else {
    	if (classes.indexOf(arg[1]) > -1) vars["enemyclass"] = arg[1];
    	else if (attributes.indexOf(arg[1]) > -1) vars["enemyattribute"] = arg[1];
    	else if (arg[1] == "verbose" || arg[1] == "verb" || arg[1] == "v") verbose = true;
    	else message.channel.send('invalid argument \"'+arg[1]+'\"')
    	
    }
     
}


  sql.get(`SELECT * FROM servants WHERE servant ="${vars["servant"]}"`).then(row => {
    if (!row) {
      message.channel.send(`no entry exists for ${encodeURIComponent((vars["servant"]))}, use addservant`);
    } else {


		counter = args.length;
  		for(i=0; i<counter; i++) {		
			evaluateArg(vars, splitArg(args.shift().toLowerCase()));
		}




//variables from command
    fou=vars["fou"];
  	ce=vars["ce"];
  	NPlevel=vars["np"];
  	CardMod=vars["cardmod"];
  	EnemyClass=vars["enemyclass"];
  	EnemyAttribute=vars["enemyattribute"];
  	ATKMod=vars["atkmod"]*0.01;
  	DEFMod=vars["defmod"]*0.01;
  	NPMod=vars["npmod"]*0.01;
 	PowerMod=vars["powermod"]*0.01;
 	SuperEffectiveMod=vars["supereffectivemod"]*0.01;
 	AddDMG=vars["adddmg"];

//variables from servant table
  	servantclass=row.class;
  	attribute=row.attribute;
  	attack=row.attack;
  	cardtype=row.cardtype;
  	cardmod=row.cardmod;
  	flatdamage=row.flatdamage;
  	var nptable = {
  	np1 : row.np1,
  	np2 : row.np2,
  	np3 : row.np3,
 	np4 : row.np4,
  	np5 : row.np5
 					};

 	//validate inputs are in range
 	if(typeof nptable["np"+NPlevel] == "undefined") {
 		NPlevel = 5;
 		message.channel.send('\"np\" can only be 1-5 -- using default value of 5');
 	}

//consolidate some variables
 	var npdamage = nptable["np"+NPlevel]/100;
 	totalattack = parseFloat(attack) + parseFloat(fou) + parseFloat(ce);
 	flatdamage = parseFloat(flatdamage) + parseFloat(AddDMG);
 	cardmod = ((parseFloat(cardmod) + parseFloat(CardMod))*0.01);
 	propername = vars["servant"].charAt(0).toUpperCase() + vars["servant"].slice(1);
//some really gross comparisons
	//cardtype
 		if(cardtype.toLowerCase() == "buster") cardtypemod = 1.5;
 		if(cardtype.toLowerCase() == "arts") cardtypemod = 1;
 		if(cardtype.toLowerCase() == "quick") cardtypemod = 0.8;

	//attribute advantage
 		if(attribute.toLowerCase() == "man") {
 			if(EnemyAttribute.toLowerCase() == "earth") attributeAdvantage = 0.9;
 			else if(EnemyAttribute.toLowerCase() == "sky") attributeAdvantage = 1.1;
 			else attributeAdvantage = 1;
 		}
 		if(attribute.toLowerCase() == "earth") {
 			if(EnemyAttribute.toLowerCase() == "sky") attributeAdvantage = 0.9;
 			else if(EnemyAttribute.toLowerCase() == "man") attributeAdvantage = 1.1;
 			else attributeAdvantage = 1;
 		}
 		if(attribute.toLowerCase() == "sky") {
 			if(EnemyAttribute.toLowerCase() == "man") attributeAdvantage = 0.9;
 			else if(EnemyAttribute.toLowerCase() == "earth") attributeAdvantage = 1.1;
 			else attributeAdvantage = 1;
 		}
 		if(attribute.toLowerCase() == "star") {
 			if(EnemyAttribute.toLowerCase() == "beast") attributeAdvantage = 1.1;
 			else attributeAdvantage = 1;
 		}
 		if(attribute.toLowerCase() == "beast") {
 			if(EnemyAttribute.toLowerCase() == "star") attributeAdvantage = 1.1;
 			else attributeAdvantage = 1;
 		}
 
 
 	//class advantage
 			classmultiplier =1;
 			classadvantage = 1;
 
 		if(servantclass.toLowerCase() == "saber") {
 			classmultiplier =1;
 			if(EnemyClass.toLowerCase().match(/^(lancer|berserker)$/)) classadvantage = 2;
 			if(EnemyClass.toLowerCase().match(/^(archer|ruler)$/)) classadvantage = 0.5;
 		}
 		if(servantclass.toLowerCase() == "archer") {
 			classmultiplier =0.95;
 			if(EnemyClass.toLowerCase().match(/^(saber|berserker)$/)) classadvantage = 2;
 			if(EnemyClass.toLowerCase().match(/^(lancer|ruler)$/)) classadvantage = 0.5;
 		}
 		if(servantclass.toLowerCase() == "lancer") {
 			classmultiplier =1.05;
 			if(EnemyClass.toLowerCase().match(/^(archer|berserker)$/)) classadvantage = 2;
 			if(EnemyClass.toLowerCase().match(/^(saber|ruler)$/)) classadvantage = 0.5;
 		}
 		if(servantclass.toLowerCase() == "rider") {
 			classmultiplier =1;
 			if(EnemyClass.toLowerCase().match(/^(caster|berserker)$/)) classadvantage = 2;
 			if(EnemyClass.toLowerCase().match(/^(assassin|ruler)$/)) classadvantage = 0.5;
 		}
 		if(servantclass.toLowerCase() == "caster") {
 			classmultiplier =0.9;
 			if(EnemyClass.toLowerCase().match(/^(assassin|berserker)$/)) classadvantage = 2;
 			if(EnemyClass.toLowerCase().match(/^(rider|ruler)$/)) classadvantage = 0.5;
 		}
 		if(servantclass.toLowerCase() == "assassin") {
 			classmultiplier =0.9;
 			if(EnemyClass.toLowerCase().match(/^(rider|berserker)$/)) classadvantage = 2;
 			if(EnemyClass.toLowerCase().match(/^(caster|ruler)$/)) classadvantage = 0.5;
 		}
 		if(servantclass.toLowerCase() == "berserker") {
 			classmultiplier =1.1;
 			if(EnemyClass.toLowerCase().match(/^(foreigner)$/)) classadvantage = 0.5;
 			else if(EnemyClass.toLowerCase().match(/^(shielder)$/)) classadvantage = 1;
 			else classadvantage = 1.5;
 		}
 		if(servantclass.toLowerCase() == "ruler") {
 			classmultiplier =1.1;
 			if(EnemyClass.toLowerCase().match(/^(mooncancer|berserker)$/)) classadvantage = 2;
 			if(EnemyClass.toLowerCase().match(/^(avenger)$/)) classadvantage = 0.5;
 		}
 		if(servantclass.toLowerCase() == "avenger") {
 			classmultiplier =1.1;
 			if(EnemyClass.toLowerCase().match(/^(ruler|berserker)$/)) classadvantage = 2;
 			if(EnemyClass.toLowerCase().match(/^(mooncancer)$/)) classadvantage = 0.5;
 		}
 		if(servantclass.toLowerCase() == "mooncancer") {
 			classmultiplier =1;
 			if(EnemyClass.toLowerCase().match(/^(avenger|berserker)$/)) classadvantage = 2;
 			if(EnemyClass.toLowerCase().match(/^(ruler)$/)) classadvantage = 0.5;
 		}
 		if(servantclass.toLowerCase() == "alterego") {
 			classmultiplier =1;
 			if(EnemyClass.toLowerCase().match(/^(foreigner|berserker)$/)) classadvantage = 2;
 			if(EnemyClass.toLowerCase().match(/^(rider|caster|assassin)$/)) classadvantage = 1.5;
 			if(EnemyClass.toLowerCase().match(/^(saber|archer|lancer)$/)) classadvantage = 0.5;
 		}
 		if(servantclass.toLowerCase() == "foreigner") {
 			classmultiplier =1;
 			if(EnemyClass.toLowerCase().match(/^(foreigner|berserker)$/)) classadvantage = 2;
 			if(EnemyClass.toLowerCase().match(/^(alterego)$/)) classadvantage = 0.5;
 		}
 		
 		if (SuperEffectiveMod < 1) SuperEffectiveMod = 1;
 		cardmod = cardmod+1;
 		if (DEFMod < -1) { 
 				DEFMod = -1;
 				message.channel.send('DEF down cannot exceed 100%');
 			}
 		atkdefmod = (1 + ATKMod - DEFMod);
 		powernpmod = (1 + PowerMod + NPMod);


 	if(verbose) {
 	//message.channel.send(`testing Servant ${vars["servant"]}; with stats: base attack=${parseFloat(attack)}, fou attack=${parseFloat(fou)}, ce attack=${parseFloat(ce)}, npdamage=${npdamage*100}%, cardtypemod=${cardtypemod}, cardmod=${Math.round(100*cardmod)/100}, classmultiplier=${classmultiplier}, attributeAdvantage=${attributeAdvantage}, classadvantage=${classadvantage}, ATKMod=${ATKMod}, DEFMod=${DEFMod}, PowerMod=${PowerMod}, NPMod=${NPMod}, SuperEffectiveMod=${SuperEffectiveMod}, flatdamage=${flatdamage}`);
 

message.channel.send({embed: {
    color: 3447003,
    title: `Calculating NP damage for ${propername} using:`,
    description: `Base Attack=${parseFloat(attack)}      Fou Attack=${parseFloat(fou)}
    \nCE Attack=${parseFloat(ce)}     NP Damage=${npdamage*100}%
    \nCardtype Mod=${cardtypemod}     Cardmod=${Math.round(100*cardmod)/100}
    \nClass Multiplier=${classmultiplier}     Attribute Advantage=${attributeAdvantage}
    \nClass Advantage=${classadvantage}     ATKMod=${ATKMod}
    \nDEFMod=${DEFMod}     PowerMod=${PowerMod}     NPMod=${NPMod}
    \nSuperEffectiveMod=${SuperEffectiveMod}     Flat Damage=${flatdamage}`,
      
    }
		});
 }
 	answer = (totalattack * npdamage * cardtypemod * cardmod * classmultiplier * attributeAdvantage * classadvantage * 0.23 * atkdefmod * powernpmod * SuperEffectiveMod);

 		min = Math.floor(answer * 0.9 + flatdamage);
 	 	med = Math.floor(answer + flatdamage);
 	 	max = Math.floor(answer * 1.1 + flatdamage);

 	 	min = min.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
 	 	med = med.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
 	 	max = max.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
 	 
 message.channel.send({embed: {
    color: 3447003,
    title: `NP damage for ${propername}`,
    description: `${med} damage \(${min} to ${max}\)`
    }
		});
// 	 message.channel.send(med + ' (' + min + ' to ' + max + ')');

}
});
}