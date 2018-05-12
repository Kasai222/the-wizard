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
		counter = args.length;
  		while(counter > 0) {	
			evaluateArg(vars, splitArg(args.shift().toLowerCase()));
  			counter = args.length;
		}


  	propername = vars["servant"].charAt(0).toUpperCase() + vars["servant"].slice(1);
if (vars["servant"].match(/[^a-z0-9]/g) == null) {
  sql.get(`SELECT * FROM servants WHERE servant ="${encodeURIComponent(vars["servant"])}"`).then(row => {
    if (!row) {
      sql.run(`INSERT INTO servants (servant, class, attribute, attack, cardtype, cardmod, flatdamage, np1, np2, np3, np4, np5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [vars["servant"], vars["class"], vars["attribute"], vars["attack"], vars["cardtype"], vars["cardmod"], vars["flatdamage"], vars["np1"], vars["np2"], vars["np3"], vars["np4"], vars["np5"]]);
    message.channel.send({embed: {
    color: 3447003,
    title: `New Entry: ${propername} Current Stats:`,
    description: `Class=${vars["class"]}     Attribute=${vars["attribute"]}     Attack=${vars["attack"]}
    \nCardType=${vars["cardtype"]}     CardMod=${vars["cardmod"]}     FlatDamage=${vars["flatdamage"]}
    \nNP 1-5 Damage= ${vars["np1"]}, ${vars["np2"]}, ${vars["np3"]}, ${vars["np4"]}, ${vars["np5"]}`,
      
    }
		});

    } else {
      message.channel.send(`Entry already exists for ${encodeURIComponent(propername)}, use edit or delete`);
    }
  }).catch(() => {
    sql.run(`CREATE TABLE IF NOT EXISTS servants (servant TEXT,  class TEXT, attribute TEXT, attack INTEGER, cardtype TEXT, cardmod INTEGER, flatdamage INTEGER, np1 INTEGER, np2 INTEGER, np3 INTEGER, np4 INTEGER, np5 INTEGER)`).then(() => {
      sql.run(`INSERT INTO servants (servant, class, attribute, attack, cardtype, cardmod, flatdamage, np1, np2, np3, np4, np5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [vars["servant"], vars["class"], vars["attribute"], vars["attack"], vars["cardtype"], vars["cardmod"], vars["flatdamage"], vars["np1"], vars["np2"], vars["np3"], vars["np4"], vars["np5"]]);
    message.channel.send({embed: {
    color: 3447003,
    title: `New Entry: ${propername} Current Stats:`,
    description: `Class=${vars["class"]}     Attribute=${vars["attribute"]}     Attack=${vars["attack"]}
    \nCardType=${vars["cardtype"]}     CardMod=${vars["cardmod"]}     FlatDamage=${vars["flatdamage"]}
    \nNP 1-5 Damage= ${vars["np1"]}, ${vars["np2"]}, ${vars["np3"]}, ${vars["np4"]}, ${vars["np5"]}`,
      
    }
		}); });
  });
}
else message.channel.send(' \"'+vars["servant"].match(/[^a-z0-9]/g)+'\" cannot be used');
}