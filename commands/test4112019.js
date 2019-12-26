const sql = require("sqlite");
sql.open("./servants.sqlite");
var fs = require('fs');
var Discord = require('discord.js');
const client = new Discord.Client();
exports.run = (client, message, args) => {

servantInput = args.shift().toLowerCase();
properName = servantInput.charAt(0).toUpperCase() + servantInput.slice(1);
///defaults
inputedCardType = 'np'; //specifying a card type only for cards, therefore not np
inputedCardPosition = 'first'; 
busterFirst = false;
artsFirst = 0;
quickFirst = 0;
chain = false; 
attributeAdvantage = 1;
classAdvantage = 1;
classMultiplier =1;
strengthen = false;
verbose = false;
servantID = 0;
interlude = 0;
isCrit = false;

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
    "ruler" : 9,
    "alterego" : 10,
    "avenger" : 11,
    "mooncancer" : 23,
    "foreigner" : 25
  };

  var classIcons = {
  	"1" : "481495559023362061",
    "2" : "481495558670909450",
    "3" : "481495559434272789",
    "4" : "481495558872236035",
    "5" : "481495559128219667",
    "6" : "481495558658457632",
    "7" : "481495559245398026",
    "8" : "481495559270563860",
    "9" : "481495558926630913",
    "10" : "481495557257560125",
    "11" : "481495558553337877",
    "23" : "481495559438336012",
    "25" : "481495559681736726"
  };

  var cardTypeIcons = {
  	"buster" : "557298101505884162",
  	"arts" : "557298102042624010",
  	"quick" : "557298101627518986"
  };

  var cardModIcons = {
    "buster" : "530647522973057035",
    "arts" : "530647793094754305",
    "quick" : "530647627046584330"
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

  var cardNPValueTable = {
    "arts" : 3,
    "quick" : 1,
    "buster" : 0,
    "extra" : 1,
    "first" : 1,
    "second" : 1.5,
    "third" : 2,
    "np" : 1, 
    "extra" : 1
  };
  var enemyServerModDefaults = {
    "saber" : 1,
    "archer" : 1,
    "lancer" : 1,
    "rider" : 1.1,
    "caster" : 1.2,
    "assassin" : 0.9,
    "berserker" : 0.8,
    "ruler" : 1 ,
    "mooncancer" : 1.2
  };

  var prefix_mappings = {  //discord argument aliases 
  fou: "fou",
  f: "fou",
  ce: "ce",
  c: "ce",
  np: "np",
  cardmod : "cardmod",
  carmod : "cardmod",
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
  flatdamage : "flatdamage",
  adddmg : "flatdamage",
  ad : "flatdamage",
  fd : "flatdamage",
  dmg : "flatdamage",
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
  npoverride : "npvalue",
  specialdefensemod : "specialdefensemod",
  sdm : "specialdefensemod",
  npgain : "npgain",
  npgen : "npgain",
  ng : "npgain",
  stargain : "stargain",
  stargen : "stargain",
  sg : "stargain",
  enemyhp : "enemyhp",
  hp : "enemyhp",
  enemyservermod : "enemyservermod",
  esm : "enemyservermod",
  sm : "enemyservermod"
  };

  var field_handlers = {  //pretty useless atm, but might be nice to have a different function later
  fou : handleArgument,
  ce : handleArgument,
  np : handleArgument,
  cardmod : handleArgument,
  atkmod : handleArgument,
  defmod : handleArgument,
  npmod : handleArgument,
  powermod : handleArgument,
  supereffectivemod : handleArgument,
  flatdamage : handleArgument,
  level : handleArgument,
  strengthen : handleArgument,
  npvalue : handleArgument,
  specialdefensemod : handleArgument,
  npgain : handleArgument,
  stargain : handleArgument,
  enemyhp : handleArgument,
  enemyservermod : handleArgument
}

  function splitArg(arg) {
   return arg.match(/([a-z]+)([^a-z]*)/i);
  }

  function handleArgument(dataFromUser, strValue) {
    return parseFloat(strValue, 10);
  }

  function evaluateArg(dataFromUser, arg) {  //looks at an argument and figures out what it do
  if(arg) {
  if (arg[2]) {  //if it has a number value
      var field = prefix_mappings[arg[1]];
    if(typeof field_handlers[field] == 'function') { 
      dataFromUser[field] = field_handlers[field](dataFromUser, arg[2]); //set input 
  } 
      else message.channel.send('invalid argument \"'+arg[1]+'\"')
    } 
    else {  //no number value
      if (classes[arg[1]]) dataFromUser["enemyclass"] = arg[1];  //if in class name table it's enemy class
      else if (attributes[arg[1]]) dataFromUser["enemyattribute"] = arg[1]; //if in attribute table it's enemy attribute
      else if (cardtypes[arg[1]]) inputedCardType = arg[1]; //if it's in card type table user inputed a card type(assumes it's not an np later)
      else if (cardpositions[arg[1]]) inputedCardPosition = arg[1]; //if it's in card position table user inputed a card position
      else if (arg[1] == 'bf') busterFirst = true;  //buster first card bonus flag
      else if (arg[1] == 'af') artsFirst = 1;  //arts first card bonus flag
      else if (arg[1] == 'qf') quickFirst = 0.2;  //quick first card bonus flag
      else if (arg[1] == 'busterchain' || arg[1] == 'bbb') chain = true;  //bbb flag
      else if (arg[1] == 'crit') isCrit = true;  //crit
      else if (arg[1] == "verbose" || arg[1] == "verb" || arg[1] == "v") verbose = true; //verbose flag
      else message.channel.send('invalid argument \"'+arg[1]+'\"')  //if none of these then invalid
    }   
}
}


function getId() {
  return new Promise(
  function (resolve, reject) {
    if (!servantInput.match(/^[0-9]*$/g)) { //if servantInput contains non numbers(not a valid servant ID)
    if (servantInput.match(/[^a-z0-9]/g) == null) { //if servantInput contains only legal characters check sql table
    sql.get(`SELECT * FROM names WHERE name ="${servantInput}"`).then(row => {
    if (!row) { //reject nickname not in table
      var reason = new Error(`no servantID mapped to ${servantInput}, use !addname alias servantID`);
      message.channel.send(reason.message);
      reject(reason);
    }
    resolve(parseInt(row.servantId)); //return servant ID
     }); }
    else { //reject invalid input
    var reason = new Error(' \"'+servantInput.match(/[^a-z0-9]/g)+'\" cannot be used'); 
    reject(reason);
    }
  }
  else resolve(parseInt(servantInput)); //if servantInput is only numbers(valid servant ID)
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
    resolve(parseInt(row.interlude)); //return strengthen
     }); 
  });
}


function setId(arg) {
  return new Promise (function (resolve) {
  servantID = arg;
  resolve(servantID);
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

if (typeof servants.get(servantID) == "object") {

 var dataFromUser = {  //more defaults, overriden by user inputs 
    servant: parseInt(servantID),
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
    supereffectivemod : 100,
    flatdamage : 0,
    level : 0,
    strengthen : 0,
    npvalue : 0,
    specialdefensemod : 0,
    npgain : 0,
    stargain : 0,
    enemyhp : -1,
    enemyservermod : 1
  };

var servant = servants.get(dataFromUser["servant"]);
dataFromUser["level"] = servant["defaultLevelCap"];
dataFromUser["strengthen"] = interlude;

    counter = args.length;
      for(i=0; i<counter; i++) {    
      evaluateArg(dataFromUser, splitArg(args.shift().toLowerCase()));
    }


//pull variables from discord command
    fouAttack=dataFromUser["fou"];
    ceAttack=dataFromUser["ce"];
    NPlevel=dataFromUser["np"];
    cardmod=dataFromUser["cardmod"]/100;
    ATKMod=dataFromUser["atkmod"]/100;
    DEFMod=dataFromUser["defmod"]/100;
    specialDefenseMod=1-dataFromUser["specialdefensemod"]/100;
    NPMod=dataFromUser["npmod"]/100;
    powerMod=dataFromUser["powermod"]/100;
    superEffectiveMod=dataFromUser["supereffectivemod"]/100;
    flatDamageFromInput=dataFromUser["flatdamage"];
    npGainMod=dataFromUser["npgain"]/100+1;
    enemyHP=dataFromUser["enemyhp"];
    enemyServerMod=dataFromUser["enemyservermod"];
//validate level
if (dataFromUser["level"] < 1 || dataFromUser["level"] > 100) dataFromUser["level"] = servant["defaultLevelCap"];
//variables from scraper
    servantClass=servant["classId"];
    servantAttribute=servant["attributeId"];
    baseAttack=servant["atkPerLevel"][dataFromUser["level"]-1];
    cardType=servant["npCardType"];
    flatDamage=servant["passives"]["flatDamage"];
    isDamaging=servant["hasDamagingNP"];
    starRate=servant['starRate']/database["scaleFactor"];
    if(servant["npStrengthen"] && inputedCardType == 'np') npGen = servant["npStrengthen"]["npGen"]/100;
    else if (inputedCardType == 'np') npGen = servant["np"]["npGen"]/100;
    else if (inputedCardType != 'np') npGen = servant["np"]["cardGen"][inputedCardType]/100;

  if(chain) inputedCardType = 'buster'; //TEMPORARY - 'chain' can only be set by 'bbb' currently

    if(isDamaging || inputedCardType != 'np') { //contains entire operation start
    	if(isDamaging) {
   		 if (dataFromUser["strengthen"] == 1 && servant["npStrengthen"]) {
        strengthen = true; 
        strengthenIcon = "<:NPInterlude:557297262376779806>";
      }
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
        strengthenIcon = "<:nolewd:557676710821101568>";
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

  //validate np level 
  if(typeof nptable["np"+NPlevel] == "undefined") {
    NPlevel = 5;
    message.channel.send('\"np\" can only be 1-5 -- using default value of 5');
  }

//consolidate some variables

  var npMultiplier = nptable["np"+NPlevel]; //pull np % from table

  if (dataFromUser["npvalue"] > 0) npMultiplier = dataFromUser["npvalue"]/100; //manual override flag np %

  totalAttack = parseFloat(baseAttack) + parseFloat(fouAttack) + parseFloat(ceAttack);

  flatDamage = parseFloat(flatDamage) + parseFloat(flatDamageFromInput);

	
 if(chain) { //TEMPORARY - 'chain' currently only set by 'bbb'
    flatDamage = flatDamage + 0.2*totalAttack; //buster chain flat damage
    busterFirst = true;
  }

  //get passive cardmod
    if (inputedCardType != 'np') { //if b/a/q specified
    	npMultiplier = 1; //remove np multiplier
    	cardDamageValue = cardtypes[inputedCardType];
		passiveCardMod=servant["passives"]["cardMods"][inputedCardType]/database["scaleFactor"]; 
		}
    else { //not specified use np card type from scraper and make sure we all know np's can't crit
    	cardDamageValue = cardtypes[cardType.toLowerCase()];
    	passiveCardMod=servant["passives"]["cardMods"][cardType]/database["scaleFactor"]; 
    	isCrit = false;
   		 }

    if (isCrit) powerMod += servant["passives"]["critDamageMod"]/database["scaleFactor"];
  //if card position (second/third) specified, increase cardDamageValue
    if (inputedCardPosition != 'first') cardDamageValue = Math.round(cardDamageValue * cardpositions[inputedCardPosition]*10)/10;

  //cardmod
    cardmod += 1+passiveCardMod;
    cardMultiplier = cardDamageValue * cardmod; //precombine cardmod with cardDamageValue(buster 1.5x etc)
    if (busterFirst || (inputedCardPosition == 'first' && inputedCardType == 'buster')) cardMultiplier = cardMultiplier + 0.5;

  //class multiplier
  if(database["classes"][servantClass]){
    classMultiplier = database["classes"][servantClass]["attackMod"]/database["scaleFactor"];
  }

  //attribute advantage
  if (dataFromUser["enemyattribute"] != '5') {
    attributeAdvantage = database["attributes"][servantAttribute][attributes[dataFromUser["enemyattribute"]]] / database["scaleFactor"];
  }
  else attributeAdvantage = '1';


  //class advantage
    classAdvantage = database["affinities"][servantClass][classes[dataFromUser["enemyclass"]]] / database["scaleFactor"];
	if (servant["affinityOverrides"]) {
		if(servant["affinityOverrides"][classes[dataFromUser["enemyclass"]]]) classAdvantage = servant["affinityOverrides"][classes[dataFromUser["enemyclass"]]] / database["scaleFactor"];
	};


//check for a few bad inputs
    if (superEffectiveMod < 1) { //no negative super effective
    	superEffectiveMod = 1;
    	message.channel.send('supereffective is formatted differently -- \'se150\' is a 50% damage increase, like enuma elish');
    }

    if (DEFMod < -1) { //def down cap at -100
        DEFMod = -1;
        message.channel.send('DEF down is capped at 100%(after summing with def up)');
      }

//combine atk/def and power/np
    ATKDEFMod = (1 + ATKMod - DEFMod);
    powerNpMod = (1 + powerMod + NPMod);

//prepare output images, etc
	classIconURL = classIcons[servantClass];
	classIcon = client.emojis.get(classIcons[servantClass]);
	if (servantID < 100 && servantID > 9) iconID = "0" + servantID;
  else if (servantID < 10) iconID = "00" + servantID;
	else iconID = servantID;

	if(inputedCardType != "np") {
    cardTypeIcon = client.emojis.get(cardTypeIcons[inputedCardType]);
    cardModIcon = client.emojis.get(cardModIcons[inputedCardType]);
  }
	else {
    cardTypeIcon = client.emojis.get(cardTypeIcons[cardType.toLowerCase()]);
    cardModIcon = client.emojis.get(cardModIcons[cardType.toLowerCase()]);
  }



  if(verbose) {
  const verboseMessage = new Discord.RichEmbed()
  .setAuthor(`Calculating ${inputedCardType} damage for ${properName} using:`, "https://cdn.discordapp.com/emojis/"+classIconURL+".png")
  .setColor(3447003)
  .setURL("http://fate-go.cirnopedia.org/servant_profile.php?servant="+iconID)
  .addField("Base Attack:", parseFloat(baseAttack),true)
  .addField("Fou Attack:", parseFloat(fouAttack),true)
  .addField("Level:", parseFloat(dataFromUser["level"]),true)
  .addField("Strengthen:", strengthenIcon+strengthen,true)
  .addField("CE Attack:", parseFloat(ceAttack),true)
  .addField("Damage %:", cardTypeIcon+"  "+Math.floor(npMultiplier*100) + "%",true)
  .addField("Cardtype Mod:", cardTypeIcon+"  "+cardDamageValue+"x",true)
  .addField("Cardmod:", cardModIcon+"  " +Math.floor(cardmod*100-100)+"%",true)
  .addField("Class Multiplier:", classIcon+"  "+classMultiplier+"x",true)
  .addField("Attribute Advantage:", attributeAdvantage+"x",true)
  .addField("Class Advantage:", classAdvantage+"x",true)
  .addField("ATKMod:", "<:charisma:530646502163349504>  "+Math.floor(ATKMod*100)+"%",true)
  .addField("DEFMod:", "<:def:530648131361177600>  "+Math.floor(DEFMod*100)+"%",true)
  .addField("PowerMod:", "<:special:530646892648988682><:crit:530646642567675914>  "+powerMod*100+"%",true)
  .addField("NPMod:", "<:npdmg:530647308703105025>  "+Math.floor(NPMod*100)+"%",true)
  .addField("Supereffective Mod:", "<:overcharge:557318381456588821>  "+superEffectiveMod+"x",true)
  .addField("Flat Damage:", "<:divinity:557318163168231435>  "+flatDamage,true)
  .addField("NP Gain:", "<:npgen:530647914163470347>  "+Math.floor(npGainMod*100-100)+"%",true) 

message.channel.send(verboseMessage);


          }


  answer = (totalAttack * npMultiplier * specialDefenseMod * cardMultiplier * classMultiplier * attributeAdvantage * classAdvantage * 0.23 * ATKDEFMod * powerNpMod * superEffectiveMod);
   


    min = Math.floor(answer * 0.9 + flatDamage);
    med = Math.floor(answer + flatDamage);
    max = Math.floor(answer * 1.1 + flatDamage);

    mincrit = Math.floor(answer * 0.9 * 2 + flatDamage);
    medcrit = Math.floor(answer*2 + flatDamage);
    maxcrit = Math.floor(answer * 1.1*2 + flatDamage);

    minString = min.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    medString = med.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    maxString = max.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


    mincritString = mincrit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    medcritString = medcrit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    maxcritString = maxcrit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   
 if(inputedCardType != 'np' && isCrit) {

const damageMessage = new Discord.RichEmbed()
  .setAuthor(inputedCardType+" crit damage for "+properName, "https://cdn.discordapp.com/emojis/"+classIconURL+".png")
  .setColor(3447003)
  .setURL("http://fate-go.cirnopedia.org/servant_profile.php?servant="+iconID)
  .setThumbnail("http://fate-go.cirnopedia.org/icons/servant/servant_"+iconID+"1.png")
  .setDescription(medcritString+" damage ("+mincritString+" to "+maxcritString+")")

message.channel.send(damageMessage);

}
 else{
const damageMessage = new Discord.RichEmbed()
  .setAuthor(inputedCardType+" damage for "+properName, "https://cdn.discordapp.com/emojis/"+classIconURL+".png")
  .setColor(3447003)
  .setURL("http://fate-go.cirnopedia.org/servant_profile.php?servant="+iconID)
  .setThumbnail("http://fate-go.cirnopedia.org/icons/servant/servant_"+iconID+"1.png")
  .setDescription(medString+" damage ("+minString+" to "+maxString+")")

message.channel.send(damageMessage);

}

if(enemyHP > -1){
  npSimOutput = '';
  if(inputedCardType == 'np') { //double check stuff that doesn't work on np's
    artsFirst = 0;
    quickFirst = 0;
    cardNPValue = cardNPValueTable[cardType.toLowerCase()]*cardNPValueTable["np"];
    hits = servant["npHitPercentages"].length;
    hitsArray = servant["npHitPercentages"];
  }
  else { //not an np
  cardNPValue = cardNPValueTable[inputedCardType]*cardNPValueTable[inputedCardPosition];
  hits = servant["cardHitPercentages"][inputedCardType].length;
  hitsArray = servant["cardHitPercentages"][inputedCardType];
    }
  if(enemyServerMod == 1 && enemyServerModDefaults[dataFromUser["enemyclass"]]) enemyServerMod = enemyServerModDefaults[dataFromUser["enemyclass"]];

  if(isCrit && inputedCardType != 'np') critNPModifier = 2;
  else critNPModifier = 1;

  overkillMin = false;
  overkillMax = false;
  npRefundMin = 0;
  npRefundMax = 0;
  overkillHitsMin = 0;
  overkillHitsMax = 0;
  halfStartingHP = enemyHP/2;
  maxRollHP = enemyHP;
  minRollHP = enemyHP;
  for(i=0; i<hits; i++) {
   resultMin = (Math.floor(npGen * (artsFirst +(cardNPValue*cardmod)) * enemyServerMod * npGainMod * critNPModifier * 100)/100);
   resultMax = (Math.floor(npGen * (artsFirst +(cardNPValue*cardmod)) * enemyServerMod * npGainMod * critNPModifier * 100)/100);
 

   if(isCrit){
    damageForMinHit = Math.round(mincrit * hitsArray[i]/100);
    damageForMaxHit =Math.round(maxcrit * hitsArray[i]/100);
}
   else {
   	damageForMinHit = Math.round(min * hitsArray[i]/100);
   	damageForMaxHit = Math.round(max * hitsArray[i]/100);
}
   if(inputedCardType == 'np' && damageForMinHit >= minRollHP) overkillMin = true;
   if(inputedCardType == 'np' && damageForMaxHit >= maxRollHP) overkillMax = true;
   if(inputedCardType != 'np' && minRollHP <= halfStartingHP) overkillMin = true;
   if(inputedCardType != 'np' && maxRollHP <= halfStartingHP) overkillMax = true;
   if(minRollHP < 1) overkillMin = true;
   if(maxRollHP < 1) overkillMax = true;

   if(overkillMin) {
   	resultMin = Math.floor(resultMin*1.5*100)/100
   	overkillHitsMin++;
   }
   npRefundMin = Math.floor((npRefundMin+resultMin)*100)/100;

   if(overkillMax){
    resultMax = Math.floor(resultMax*1.5*100)/100
   	overkillHitsMax++;
   }

   npRefundMax = Math.floor((npRefundMax+resultMax)*100)/100;
  
   minRollHP = Math.round((minRollHP - damageForMinHit)*100)/100;
   maxRollHP = Math.round((maxRollHP - damageForMaxHit)*100)/100;

    npSimOutput+=('\n**hit '+(i+1)+'=** ' + damageForMinHit + '('+ hitsArray[i] +'%) | enemyHP = ' + minRollHP + ' | total refund = **' +npRefundMin+'%**');
    npSimVariables=('np gain = '+npGen + ' | artsFirst =' + artsFirst + ' | cardNPValue = ' + cardNPValue + ' | cardmod = ' + cardmod + ' | enemyServerMod = ' + enemyServerMod + ' | npGainMod = ' + npGainMod + ' | critNPModifier = ' + critNPModifier+'\n');


  }

  message.channel.send({embed: {
       color: 3447003,
       title: `NP gain sim for ${properName}`,
       description: npSimVariables+npSimOutput+'\nmin damage roll total = **'+npRefundMin+'%** <:npcharge:557660454655361026> ('+overkillHitsMin+' overkill hits)\nmax damage roll total = **'+npRefundMax+'%** <:npcharge:557660454655361026> ('+overkillHitsMax+' overkill hits)',
      
    }
    });

};

} //contains entire operation end
	else {
	message.channel.send({embed: {
    color: 3447003,
    title: `${properName} NP does not deal damage`,
    }
    });
}


}
})  

}
client.on('error', (err) => {
   console.log(err.message)
});

function calcNP() { //really gross chaining because of async -- getid/str is too slow because of sql, have to complete those first
getId()
.then(setId)
.then(getStr)
.then(setStr)
.then(readData);
}
 try {
 	calcNP();
  } catch (err) {
    console.error(err);
  }

}