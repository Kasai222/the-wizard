const sql = require("sqlite");
sql.open("./servants.sqlite");


exports.run = (client, message, args) => {

	function splitArg(arg) {
 	 return arg.match(/([a-z]+)([^a-z]*)/i);
	}
	function handleAttack(vars, strValue) {
	  return parseFloat(strValue, 10);
	}
	function handleCardMod(vars, strValue) {
	  return parseFloat(strValue, 10);
	}
	function handleFlatDamage(vars, strValue) {
	  return parseFloat(strValue, 10);
	}
   var vars = {
    servant: args.shift().toLowerCase(),
    class: "potato",
    attribute: "potato",
    attack: 0,
    cardtype: "potato",
    cardmod: 0,
    flatdamage: 0,
    np1: 0,
    np2: 0,
    np3: 0,
    np4: 0,
    np5: 0
  };


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
  attack: "attack",
  atk: "attack",
  a: "attack",
  cardmod: "cardmod",
  mod: "cardmod",
  m : "cardmod",
  passive : "cardmod",
  p : "cardmod",
  flatdamage : "flatdamage",
  damage : "flatdamage",
  divinity : "flatdamage",
  flat : "flatdamage",
  f : "flatdamage",
  div : "flatdamage",
  d : "flatdamage",
  };

  var field_handlers = {
  attack : handleAttack,
  cardmod : handleCardMod,
  flatdamage : handleFlatDamage,
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
    	if (classes.indexOf(arg[1]) > -1) vars["class"] = arg[1];
    	else if (attributes.indexOf(arg[1]) > -1) vars["attribute"] = arg[1];
    	else if (arg[1] == "buster" || arg[1] == "arts" || arg[1] == "quick") vars["cardtype"] = arg[1];
    	else if (arg[1] == "np") {
    			for(i=1; i<6; i++) {
    				if(args[0].match(/^[0-9\.]+$/) != null) {
    					vars["np"+i] = parseFloat(args[0]);
    					args.shift();
    				}
    			}

    	}
    	else message.channel.send('invalid argument \"'+arg[1]+'\"')
    	
    }
     
}



if (vars["servant"].match(/[^a-z0-9]/g) == null) {
  sql.get(`SELECT * FROM servants WHERE servant ="${encodeURIComponent(vars["servant"])}"`).then(row => {
    if (!row) {
      message.channel.send(`no entry exists for ${encodeURIComponent(propername)}, use addservant`);
    } else {
    vars["class"] = row.class;
    vars["attribute"] = row.attribute;
    vars["attack"] = row.attack;
    vars["cardtype"] = row.cardtype;
    vars["cardmod"] = row.cardmod;
    vars["flatdamage"] = row.flatdamage;
    vars["np1"] = row.np1;
    vars["np2"] = row.np2;
    vars["np3"] = row.np3;
    vars["np4"] = row.np4; 
    vars["np5"] = row.np5;
    counter = args.length;
    while(counter > 0) {  
      evaluateArg(vars, splitArg(args.shift().toLowerCase()));
      counter = args.length;
    }
    sql.run(`UPDATE servants SET class = "${vars["class"]}", attribute = "${vars["attribute"]}", attack = "${vars["attack"]}", cardtype = "${vars["cardtype"]}", cardmod = "${vars["cardmod"]}", flatdamage = "${vars["flatdamage"]}", np1 = "${vars["np1"]}", np2 = "${vars["np2"]}", np3 = "${vars["np3"]}", np4 = "${vars["np4"]}", np5 = "${vars["np5"]}" WHERE servant = "${vars["servant"]}"`);
    sql.get(`SELECT * FROM servants WHERE servant ="${encodeURIComponent(vars["servant"])}"`).then(row => {
    message.channel.send({embed: {
    color: 3447003,
    title: `Servant: ${propername} Current Stats:`,
    description: `Class=${row.class}     Attribute=${row.attribute}     Attack=${row.attack}
    \nCardType=${row.cardtype}     CardMod=${row.cardmod}     FlatDamage=${row.flatdamage}
    \nNP 1-5 Damage= ${row.np1}, ${row.np2}, ${row.np3}, ${row.np4}, ${row.np5}`,
      
    }
    });
  });
    }
  });
}
else message.channel.send(' \"'+vars["servant"].match(/[^a-z0-9]/g)+'\" cannot be used');
}