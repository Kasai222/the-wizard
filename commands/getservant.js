const sql = require("sqlite");
sql.open("./servants.sqlite");

exports.run = (client, message, args) => {
  servant = args.shift().toLowerCase();
  if (servant.match(/[^a-z0-9]/g) == null) {
  	propername = servant.charAt(0).toUpperCase() + servant.slice(1);
  sql.get(`SELECT * FROM servants WHERE servant ="${servant}"`).then(row => {
    if (!row) return message.channel.send(`no servant named ${servant}, use addservant`);
    else {
    message.channel.send({embed: {
    color: 3447003,
    title: `Servant: ${propername} Current Stats:`,
    description: `Class=${row.class}     Attribute=${row.attribute}     Attack=${row.attack}
    \nCardType=${row.cardtype}     CardMod=${row.cardmod}     FlatDamage=${row.flatdamage}
    \nNP 1-5 Damage= ${row.np1}, ${row.np2}, ${row.np3}, ${row.np4}, ${row.np5}`,
      
    }
		});
 }
});
}
else message.channel.send(' \"'+servant.match(/[^a-z0-9]/g)+'\" cannot be used');
}