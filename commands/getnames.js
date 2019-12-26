const sql = require("sqlite");
sql.open("./servants.sqlite");
var fs = require('fs');

exports.run = (client, message, args) => {
  input = args.shift().toLowerCase();
  propername = input.charAt(0).toUpperCase() + input.slice(1);
  nicknames = '';
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

function setId(arg) {
  return new Promise (function (resolve) {
  servantId = arg;
  resolve(servantId);
  }
  );
}

function getNames() {
    if (input.match(/[^a-z0-9]/g) == null) {
    sql.all(`SELECT * FROM names WHERE servantId ="${servantId}"`).then(rows => {
    rows.forEach(function (row) {
        nicknames += `${row.name}\n`
        })
    if (nicknames == '') {
      return message.channel.send(`no names for ${servantId}, use !addname alias servantId`);
    }
    else {    message.channel.send({embed: {
    color: 3447003,
    title: `names for ${input}`,
    description: `${nicknames}`,
    }
    });
    } }); } 
}


getId()
.then(setId)
.then(getNames);
}