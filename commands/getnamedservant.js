const sql = require("sqlite");
sql.open("./servants.sqlite");
var fs = require('fs');

exports.run = (client, message, args) => {
  servantInput = args.shift().toLowerCase();
  propername = servantInput.charAt(0).toUpperCase() + servantInput.slice(1);
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

if (!servantInput.match(/^[0-9]*$/g)) {
    if (servantInput.match(/[^a-z0-9]/g) == null) {
    sql.get(`SELECT * FROM names WHERE name ="${servantInput}"`).then(row => {
    if (!row) {
      return message.channel.send(`no servantId mapped to ${servantInput}, use !addname alias servantId`);
    }
    else {
      servantInput = row.servantId;
    } }); } }
    else return message.channel.send(' \"'+servantInput.match(/[^a-z0-9]/g)+'\" cannot be used'); 

  fs.readFile('data.json', (err, data) => {
  if (err) throw err;
  var database = JSON.parse(data);
  var servants = new Map(JSON.parse(data).servants.map(s => [s.id, s]))
  var servant = servants.get(parseInt(servantInput));
  

    message.channel.send({embed: {
    color: 3447003,
    title: `Servant: ${propername} Current Stats:`,
    description: `Class=${classes[servant["classId"]]}     Attribute=${attributes[servant["attributeId"]]}     Attack=${servant["atkPerLevel"][servant["defaultLevelCap"]-1]}
    \nCardType=${servant["cardType"]}     CardMod=${servant["cardMod"]}     FlatDamage=${servant["flatdamage"]}`,
 //   \nNP 1-5 Damage= ${row.np1}, ${row.np2}, ${row.np3}, ${row.np4}, ${row.np5}`,
      
    }
		});

});
}