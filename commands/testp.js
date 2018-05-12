const sql = require("sqlite");
sql.open("./servants.sqlite");

exports.run = (client, message, args) => {
input = args.shift().toLowerCase();
var getId = new Promise(
  function (resolve, reject) {
    if (!input.match(/^[0-9]*$/g)) { //if input contains non numbers(not a valid servant ID)
    if (input.match(/[^a-z0-9]/g) == null) { //if input contains only legal characters check sql table
    sql.get(`SELECT * FROM names WHERE name ="${input}"`).then(row => {
    if (!row) { //reject nickname not in table
      var reason = new Error(`no servantId mapped to ${input}, use !addname alias servantId`);
      reject(reason);
    }
    resolve(row.servantId); //return servant ID
     }); }
    else { //reject invalid input
    var reason = new Error(' \"'+input.match(/[^a-z0-9]/g)+'\" cannot be used'); 
    reject(reason);
    }
  }
  else resolve(parseInt(input)); //if input is only numbers(valid servant ID)
  });


var getServantObject = function() {
  getId
  .then(function (fulfilled) {
    message.channel.send(fulfilled);
  })
  .catch(function (error) {
    message.channel.send(error.message);
    });
  };

getServantObject();
}