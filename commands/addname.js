const sql = require("sqlite");
sql.open("./servants.sqlite");


exports.run = (client, message, args) => {
  name = args.shift().toLowerCase();
  servantId = parseInt(args.shift());

if (name.match(/[^a-z0-9]/g) == null) {
  sql.get(`SELECT * FROM names WHERE name ="${encodeURIComponent(name)}"`).then(row => {
    if (!row) {
      sql.run(`INSERT INTO names (name, servantId) VALUES (?, ?)`, [name, servantId]);
    message.channel.send({embed: {
    color: 3447003,
    title: `New Entry: ${name} = ${servantId}`,
    }
		});

    } else {
      message.channel.send(`Entry already exists for ${encodeURIComponent(name)}, use edit or delete`);
    }
  }).catch(() => {
    sql.run(`CREATE TABLE IF NOT EXISTS names (name TEXT,  servantId INTEGER)`).then(() => {
    sql.run(`INSERT INTO names (names, servantId) VALUES (?, ?)`, [name, servantId]);
    message.channel.send({embed: {
    color: 3447003,
    title: `New Entry: ${name} = ${servantId}`,
    }
		}); });
  });
}
else message.channel.send(' \"'+name.match(/[^a-z0-9]/g)+'\" cannot be used');
}