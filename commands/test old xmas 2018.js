const sql = require("sqlite");
sql.open("./servants.sqlite");
var fs = require('fs');
exports.run = (client, message, args) => {

input = args.shift().toLowerCase();
propername = input.charAt(0).toUpperCase() + input.slice(1);
///defaults
imputedcardtype = 'np';
imputedcardposition = 'no';
busterfirst = false;
chain = false;
attributeadvantage = 1;
classadvantage = 1;
classmultiplier =1;
strengthen = false;
verbose = false;
servantId = 0;
interlude = 0;
//mapping tables
  var classes = {
    "saber" : 1,
    "archer" : 2,
    "lancer" : 3,
    "rider" : 4,
    "caster" : 5,
    "assassin" : 6,
    "berserker" : 7,
    "shielder" : 8,
    "ruler" : 9 ,
    "alterego" : 10,
    "avenger" : 11,
    "mooncancer" : 23,
    "foreigner" : 25
  };
  var attributes = {
    "man" : 1,
    "sky" : 2,
    "earth" : 3,
    "star" : 4,
    "beast" : 5
  };
  var cardtypes = {
    "buster" : 1.5,
    "arts" : 1,
    "quick" : 0.8,
    "extra" : 0,
  };
  var cardpositions = {
    "first" : 1,
    "1st" : 1,
    "second" : 1.2,
    "2nd" : 1.2,
    "third" : 1.4,
    "3rd" : 1.4,
    "fourth" : 1,
    "4th" : 1
  };

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
  pmod: "powermod",
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
  dmg : "adddmg",
  level : "level",
  lvl : "level",
  lv : "level",
  l : "level",
  strengthen : "strengthen",
  str : "strengthen",
  lewd : "strengthen",
  interlude : "strengthen",
  npvalue : "npvalue",
  npv : "npvalue",
  npoverride : "npvalue"
  };

  var field_handlers = {
  fou : handleArgument,
  ce : handleArgument,
  np : handleArgument,
  cardmod : handleArgument,
  atkmod : handleArgument,
  defmod : handleArgument,
  npmod : handleArgument,
  powermod : handleArgument,
  supereffectivemod : handleArgument,
  adddmg : handleArgument,
  level : handleArgument,
  strengthen : handleArgument,
  npvalue : handleArgument
}
  function splitArg(arg) {
   return arg.match(/([a-z]+)([^a-z]*)/i);
  }

  function handleArgument(vars, strValue) {
    return parseFloat(strValue, 10);
  }

  function evaluateArg(vars, arg) {
  if(arg) {
  if (arg[2]) {
      var field = prefix_mappings[arg[1]];
    if(typeof field_handlers[field] == 'function') {
      vars[field] = field_handlers[field](vars, arg[2]);
  } 
      else message.channel.send('invalid argument \"'+arg[1]+'\"')
    } 
    else {
      if (classes[arg[1]]) vars["enemyclass"] = arg[1];
      else if (attributes[arg[1]]) vars["enemyattribute"] = arg[1];
      else if (cardtypes[arg[1]]) imputedcardtype = arg[1];
      else if (cardpositions[arg[1]]) imputedcardposition = arg[1];
      else if (arg[1] == 'bf') busterfirst = true;
      else if (arg[1] == 'busterchain' || arg[1] == 'bbb') chain = true;
      else if (arg[1] == "verbose" || arg[1] == "verb" || arg[1] == "v") verbose = true;
      else message.channel.send('invalid argument \"'+arg[1]+'\"')  
    }   
}
}
function getId() {
  return new Promise(
  function (resolve, reject) {
    if (!input.match(/^[0-9]*$/g)) { //if input contains non numbers(not a valid servant ID)
    if (input.match(/[^a-z0-9]/g) == null) { //if input contains only legal characters check sql table
    sql.get(`SELECT * FROM names WHERE name ="${input}"`).then(row => {
    if (!row) { //reject nickname not in table
      var reason = new Error(`no servantId mapped to ${input}, use !addname alias servantId`);
      message.channel.send(reason.message);
      reject(reason);
    }
    resolve(parseInt(row.servantId)); //return servant ID
     }); }
    else { //reject invalid input
    var reason = new Error(' \"'+input.match(/[^a-z0-9]/g)+'\" cannot be used'); 
    reject(reason);
    }
  }
  else resolve(parseInt(input)); //if input is only numbers(valid servant ID)
  });
}
function getStr(arg) {
  return new Promise(
  function (resolve, reject) {
    sql.get(`SELECT * FROM strengthens WHERE servant ="${arg}"`).then(row => {
    if (!row) { //reject nickname not in table
      var reason = new Error(`${arg} not in strengthen table`);
      reject(reason);
    }
    resolve(parseInt(row.interlude)); //return servant ID
     }); 
  });
}


function setId(arg) {
  return new Promise (function (resolve) {
  servantId = arg;
  resolve(servantId);
  }
  );
}
function setStr(arg) {
  return new Promise (function (resolve) {
    interlude = arg;
  resolve(interlude);
  }
  );
}
function readData() {
fs.readFile('data.json', (err, data) => {
if (err) throw err;
var database = JSON.parse(data);

var servants = new Map(JSON.parse(data).servants.map(s => [s.id, s]))

if (typeof servants.get(servantId) == "object") {

 var vars = {
    servant: parseInt(servantId),
    fou : 990,
    ce : 0,
    np : 5,
    cardmod : 0,
    enemyclass : 'shielder',
    enemyattribute : '5',
    atkmod : 0,
    defmod : 0,
    npmod : 0,
    powermod : 0,
    supereffectivemod : 0,
    adddmg : 0,
    level : 0,
    strengthen : 0,
    npvalue : 0
  };

var servant = servants.get(vars["servant"]);
vars["level"] = servant["defaultLevelCap"];
vars["strengthen"] = interlude;

    counter = args.length;
      for(i=0; i<counter; i++) {    
      evaluateArg(vars, splitArg(args.shift().toLowerCase()));
    }


//variables from command
    fou=vars["fou"];
    ce=vars["ce"];
    NPlevel=vars["np"];
    cardmod=vars["cardmod"]/100;
    ATKMod=vars["atkmod"]/100;
    DEFMod=vars["defmod"]/100;
    NPMod=vars["npmod"]/100;
    PowerMod=vars["powermod"]/100;
    SuperEffectiveMod=vars["supereffectivemod"]/100;
    AddDMG=vars["adddmg"];
//validate level
if (vars["level"] < 1 || vars["level"] > 100) vars["level"] = servant["defaultLevelCap"];
//variables from servant table
    servantclass=servant["classId"];
    attribute=servant["attributeId"];
    attack=servant["atkPerLevel"][vars["level"]-1];
    cardtype=servant["npCardType"];
    flatdamage=servant["passives"]["flatDamage"];
    damaging=servant["hasDamagingNP"];

  if(chain) imputedcardtype = 'buster';

    if(damaging || imputedcardtype != 'np') {
    	if(damaging) {
   		 if (vars["strengthen"] == 1 && servant["npStrengthen"]) strengthen = true;
   		 if(strengthen) {
    		var nptable = {
    		np1 : servant["npStrengthen"]["mods"][0]/database["scaleFactor"],
   			np2 : servant["npStrengthen"]["mods"][1]/database["scaleFactor"],
    		np3 : servant["npStrengthen"]["mods"][2]/database["scaleFactor"],
    		np4 : servant["npStrengthen"]["mods"][3]/database["scaleFactor"],
    		np5 : servant["npStrengthen"]["mods"][4]/database["scaleFactor"]
          };
    }
    		else {
    		var nptable = {
    		np1 : servant["np"]["mods"][0]/database["scaleFactor"],
    		np2 : servant["np"]["mods"][1]/database["scaleFactor"],
    		np3 : servant["np"]["mods"][2]/database["scaleFactor"],
    		np4 : servant["np"]["mods"][3]/database["scaleFactor"],
    		np5 : servant["np"]["mods"][4]/database["scaleFactor"]
          };
    }
}
else {
    		var nptable = {
    		np1 : '0',
    		np2 : '0',
    		np3 : '0',
    		np4 : '0',
    		np5 : '0'
          };
}

  //validate inputs are in range
  if(typeof nptable["np"+NPlevel] == "undefined") {
    NPlevel = 5;
    message.channel.send('\"np\" can only be 1-5 -- using default value of 5');
  }

//consolidate some variables
	
 if(chain) { 
    flatdamage = flatdamage + 0.2*totalattack;
    busterfirst = true;
  }
  var npdamage = nptable["np"+NPlevel];
  if (vars["npvalue"] > 0) npdamage = vars["npvalue"]/100;
  totalattack = parseFloat(attack) + parseFloat(fou) + parseFloat(ce);
  flatdamage = parseFloat(flatdamage) + parseFloat(AddDMG);
  if (imputedcardtype != 'np') npdamage = 1;
//  propername = vars["servant"].charAt(0).toUpperCase() + vars["servant"].slice(1);
//some really gross comparisons
  //cardtype
    if (imputedcardtype != 'np') {
    	cardtypemod = cardtypes[imputedcardtype];
		passivecardmod=servant["passives"]["cardMods"][imputedcardtype]/database["scaleFactor"]; 
								}
    else { 
    	cardtypemod = cardtypes[cardtype.toLowerCase()];
    	passivecardmod=servant["passives"]["cardMods"][cardtype]/database["scaleFactor"]; 
   		 }
  //position
    if (imputedcardposition != 'no') cardtypemod = Math.round(cardtypemod * cardpositions[imputedcardposition]*10)/10;
  //cardmod, cardtypemod, and buster first card
    cardmod += passivecardmod;
    cardmod += 1;
    cardmultiplier = cardtypemod * cardmod;
    if (busterfirst || (imputedcardposition == 'no' && imputedcardtype == 'buster')) cardmultiplier = cardmultiplier + 0.5;

  //class multiplier
  if(database["classes"][servantclass]){
    classmultiplier = database["classes"][servantclass]["attackMod"]/database["scaleFactor"];
  }
  //attribute advantage
  if (vars["enemyattribute"] != '5') {
    attributeadvantage = database["attributes"][attribute][attributes[vars["enemyattribute"]]] / database["scaleFactor"];
  }
  else attributeadvantage = '1';
  //class advantage
    classadvantage = database["affinities"][servantclass][classes[vars["enemyclass"]]] / database["scaleFactor"];
	if (servant["affinityOverrides"]) {
		if(servant["affinityOverrides"][classes[vars["enemyclass"]]]) classadvantage = servant["affinityOverrides"][classes[vars["enemyclass"]]] / database["scaleFactor"];
	};
    if (SuperEffectiveMod < 1) SuperEffectiveMod = 1;
    if (DEFMod < -1) { 
        DEFMod = -1;
        message.channel.send('DEF down cannot exceed 100%');
      }
    atkdefmod = (1 + ATKMod - DEFMod);
    powernpmod = (1 + PowerMod + NPMod);


  if(verbose) {
    message.channel.send({embed: {
       color: 3447003,
       title: `Calculating ${imputedcardtype} damage for ${propername} using:`,
       description: `Base Attack=${parseFloat(attack)}      Fou Attack=${parseFloat(fou)}
    \nLevel=${parseFloat(vars["level"])}     Strengthen=${strengthen}
    \nCE Attack=${parseFloat(ce)}     NP Damage=${npdamage*100}%
    \nCardtype Mod=${cardtypemod}     Cardmod=${cardmod}
    \nClass Multiplier=${classmultiplier}     Attribute Advantage=${attributeadvantage}
    \nClass Advantage=${classadvantage}     ATKMod=${ATKMod}
    \nDEFMod=${DEFMod}     PowerMod=${PowerMod}     NPMod=${NPMod}
    \nSuperEffectiveMod=${SuperEffectiveMod}     Flat Damage=${flatdamage}`,
      
    }
    });
          }    
  answer = (totalattack * npdamage * cardmultiplier * classmultiplier * attributeadvantage * classadvantage * 0.23 * atkdefmod * powernpmod * SuperEffectiveMod);
   


    min = Math.floor(answer * 0.9 + flatdamage);
    med = Math.floor(answer + flatdamage);
    max = Math.floor(answer * 1.1 + flatdamage);

    min = min.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    med = med.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    max = max.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   
 message.channel.send({embed: {
    color: 3447003,
    title: `${imputedcardtype} damage for ${propername}`,
    description: `${med} damage \(${min} to ${max}\)`
    }
    });
//   message.channel.send(med + ' (' + min + ' to ' + max + ')');


}
	else {
	message.channel.send({embed: {
    color: 3447003,
    title: `${propername} NP does not deal damage`,
    }
    });
}


}
})  

}

function calcNP() {
getId()
.then(setId)
.then(getStr)
.then(setStr)
.then(readData);
}
calcNP();
}