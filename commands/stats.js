const sql = require("sqlite");
sql.open("./servants.sqlite");
var fs = require('fs');
var Discord = require('discord.js');
const client = new Discord.Client();

exports.run = (client, message, args) => {
  input = args.shift().toLowerCase();
  propername = input.charAt(0).toUpperCase() + input.slice(1);

	servantID = 0;
	interlude = 0;
	traits = ' ';
	strInput = "not entered";

  var classes = {
    1 : "saber",
    2 : "archer",
    3 : "lancer",
    4 : "rider",
    5 : "caster",
    6 : "assassin",
    7 : "berserker",
    8 : "shielder",
    9 : "ruler",
    10 : "alterego",
    11 : "avenger",
    23 : "mooncancer",
    25 : "foreigner"
  };
  var attributes = {
    1 : "man",
    2 : "sky",
    3 : "earth",
    4 : "star",
    5 : "beast"
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

function splitArg(arg) {
  return arg.match(/([a-z]+)([^a-z]*)/i);
  }

function evaluateArg(arg) {  //looks at an argument and figures out if it's str
  if(arg) {
  if (arg[2]) {
    if(arg[1] == 'str') strInput = arg[2];
  }}} 

function getId() {
  return new Promise(
  function (resolve, reject) {
    if (!input.match(/^[0-9]*$/g)) { //if input contains non numbers(not a valid servant ID)
    if (input.match(/[^a-z0-9]/g) == null) { //if input contains only legal characters check sql table
    sql.get(`SELECT * FROM names WHERE name ="${input}"`).then(row => {
    if (!row) { //reject nickname not in table
      var reason = new Error(`no servantID mapped to ${input}, use !addname alias servantID`);
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
    resolve(parseInt(row.interlude)); //return strengthen
     }); 
  });
}

function getTraits(arg) {
  return new Promise(
  function (resolve, reject) {
    sql.get(`SELECT * FROM traits WHERE servant ="${arg}"`).then(row => {
    if (!row) { //reject nickname not in table
      resolve("not available")
    }
    resolve(row.traits); //return traits
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
  resolve(servantID);
  }
  );
}
function setTraits(arg) {
  return new Promise (function (resolve) {
    traits = arg;
  resolve(traits);
  }
  );
}

    counter = args.length;
      for(i=0; i<counter; i++) {    
      evaluateArg(splitArg(args.shift().toLowerCase()));
    }

function readData() {

  fs.readFile('data.json', (err, data) => {
  if (err) throw err;
  var database = JSON.parse(data);
  var servants = new Map(JSON.parse(data).servants.map(s => [s.id, s]))
  var servant = servants.get(parseInt(servantID));
if(servant) {
  if(servant["npStrengthen"]) npGen = servant["npStrengthen"]["npGen"]/100;
  else npGen = servant["np"]["npGen"]/100;

//prepare output images, etc
	classIconURL = classIcons[servant["classId"]];
	classIcon = client.emojis.get(classIcons[servant["classId"]]);
	if (servantID < 100 && servantID > 9) iconID = "0" + servantID;
  else if (servantID < 10) iconID = "00" + servantID;
	else iconID = servantID;


    cardTypeIcon = client.emojis.get(cardTypeIcons[servant["npCardType"].toLowerCase()]);
    cardModIcon = client.emojis.get(cardModIcons[servant["npCardType"].toLowerCase()]);
  
    if(servant["hasDamagingNP"]) {
		 if(strInput != "not entered") interlude = strInput;
   		 if(servant["npStrengthen"] && interlude == 1) {
			strengthenIcon = "<:NPInterlude:557297262376779806>"; 
    		var nptable = {
    		np1 : servant["npStrengthen"]["mods"][0]/database["scaleFactor"],
   			np2 : servant["npStrengthen"]["mods"][1]/database["scaleFactor"],
    		np3 : servant["npStrengthen"]["mods"][2]/database["scaleFactor"],
    		np4 : servant["npStrengthen"]["mods"][3]/database["scaleFactor"],
    		np5 : servant["npStrengthen"]["mods"][4]/database["scaleFactor"]
          };
    }
    		else {
   			strengthenIcon = "<:nolewd:557676710821101568>";
    		var nptable = {
    		np1 : servant["np"]["mods"][0]/database["scaleFactor"],
    		np2 : servant["np"]["mods"][1]/database["scaleFactor"],
    		np3 : servant["np"]["mods"][2]/database["scaleFactor"],
    		np4 : servant["np"]["mods"][3]/database["scaleFactor"],
    		np5 : servant["np"]["mods"][4]/database["scaleFactor"]
          };
   			 }
		npStats = " {"+nptable["np1"]*100+"%"+","+nptable["np2"]*100+"%"+","+nptable["np3"]*100+"%"+","+nptable["np4"]*100+"%"+","+nptable["np5"]*100+"%"+"}"		
				}
	else {
		var npStats = "Nondamaging"
		strengthen = "";
	}
		

const statsMessage = new Discord.RichEmbed()
  .setAuthor(`Servant: ${propername} (ID:${servant["id"]}) Current Stats:`, "https://cdn.discordapp.com/emojis/"+classIconURL+".png")
  .setColor(3447003)
  .setThumbnail("http://fate-go.cirnopedia.org/icons/servant/servant_"+iconID+"1.png")
  .setURL("http://fate-go.cirnopedia.org/servant_profile.php?servant="+iconID)
  .addField("Attribute:", attributes[servant["attributeId"]],true)
  .addField("Attack at "+servant["defaultLevelCap"]+":", servant["atkPerLevel"][servant["defaultLevelCap"]-1] ,true)
  .addField("NP:", cardTypeIcon+strengthenIcon+npStats,true)
  .addField("Buster up:", "<:passiveBuster:557680055481008138> "+servant["passives"]["cardMods"]["buster"]/10+"%",true)
  .addField("Arts up:", "<:passiveArts:557680054973235215> "+servant["passives"]["cardMods"]["arts"]/10+"%",true)
  .addField("Quick up:", "<:passiveQuick:557680055422287902> "+servant["passives"]["cardMods"]["quick"]/10+"%",true)
  .addField("Crit up:", "<:passiveCrit:557680055699111946> "+servant["passives"]["critDamageMod"]/10+"%",true)
  .addField("Star rate:", servant['starRate']/1000+"%",true)
  .addField("NP Gain:", npGen+"%",true)
  .addField("Hits:", "{hit percentages}")
  .addField("Buster:", servant["cardHitPercentages"]["buster"].length+" hits  {"+ servant["cardHitPercentages"]["buster"]+"}",true)
  .addField("Arts:", servant["cardHitPercentages"]["arts"].length+" hits  {"+ servant["cardHitPercentages"]["arts"]+"}",true)
  .addField("Quick:", servant["cardHitPercentages"]["quick"].length+" hits  {"+ servant["cardHitPercentages"]["quick"]+"}",true)
  .addField("Extra:", servant["cardHitPercentages"]["extra"].length+" hits  {"+ servant["cardHitPercentages"]["extra"]+"}",true)
  .addField("NP:", servant["npHitPercentages"].length+" hits  {"+ servant["npHitPercentages"]+"}",true)
  .addField("Traits:", traits, true)

message.channel.send(statsMessage);



}
else message.channel.send("servant not found");
});
}
getId()
.then(setId)
.then(getStr)
.then(setStr)
.then(getTraits)
.then(setTraits)
.then(readData);
}