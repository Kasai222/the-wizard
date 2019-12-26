const cheerio = require('cheerio'),
      snekfetch = require('snekfetch'),
      querystring = require('querystring');
exports.run = (client, message, args) => {

  allowed = true;
  if(message.guild != null) {
	 if(message.guild.id == 274980577545945090) {
      message.react("387659429568577548");
      allowed = false;
    }
  }
	if(allowed) {
    args.shift;
   var searchUrl = `https://www.bing.com/search?q=site%3Ahttps://classic.wowhead.com+${encodeURIComponent(args.join(" "))}`;

   return snekfetch.get(searchUrl).then((result) => {

      var $ = cheerio.load(result.text);

      var googleData = $('li.b_algo').first().find('a').first().attr('href');

      message.channel.send(`Result found!\n${googleData.replace(')', '%29').replace('(', '%28')}`).catch(console.error);

  }).catch((err) => {
    console.log(err);
    message.channel.send(`Error finding result for ${searchUrl}`);
  });
}
}