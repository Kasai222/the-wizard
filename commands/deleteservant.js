const sql = require("sqlite");
sql.open("./servants.sqlite");


exports.run = (client, message, args) => {
  servant = args.shift().toLowerCase();
  if (servant.match(/[^a-z0-9]/g) == null) {
  sql.get(`SELECT * FROM servants WHERE servant = "${servant}"`).then(row => {
    if (!row) {
      message.channel.send(`no entry exists for ${encodeURIComponent(servant)}`);
    } else {
      sql.run(`DELETE FROM servants WHERE servant = "${servant}"`);
      message.channel.send(`deleted entry for ${encodeURIComponent(servant)}`);
    }
  });
}
else message.channel.send(' \"'+servant.match(/[^a-z0-9]/g)+'\" cannot be used');
}