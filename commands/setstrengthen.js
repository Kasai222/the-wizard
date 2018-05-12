const sql = require("sqlite");
sql.open("./servants.sqlite");


exports.run = (client, message, args) => {
input = args.shift().toLowerCase();
interludeInput = args.shift().toLowerCase();
propername = input.charAt(0).toUpperCase() + input.slice(1);
servantId = 1;
interlude = 0;
if (interludeInput == "true" || interludeInput == "yes" || interludeInput == 1) interlude = 1;
if (interludeInput == "false" || interludeInput == "no" || interludeInput == 0) interlude = 0;
var getId = new Promise(
  function (resolve, reject) {
    if (!input.match(/^[0-9]*$/g)) { //if input contains non numbers(not a valid servant ID)
    if (input.match(/[^a-z0-9]/g) == null) { //if input contains only legal characters check sql table
    sql.get(`SELECT * FROM names WHERE name ="${input}"`).then(row => {
    if (!row) { //reject nickname not in table
      var reason = new Error(`no servantId mapped to ${input}, use !addname alias servantId`);
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
function setStr() {
getId
.then(function (fulfilled) {
  servantId = fulfilled;
  sql.get(`SELECT * FROM strengthens WHERE servant ="${encodeURIComponent(servantId)}"`).then(row => {
    if (!row) {
      message.channel.send(`no entry exists for ${encodeURIComponent(propername)}`);
    } else {
    sql.run(`UPDATE strengthens SET interlude = "${interlude}"WHERE servant = "${servantId}"`);
    message.channel.send({embed: {
    color: 3447003,
    title: `Strengthen: ${propername} = ${interlude}`,
    }
    });
    }
  });
})
}
setStr();
}