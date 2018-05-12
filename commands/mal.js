const cheerio = require('cheerio'),
      snekfetch = require('snekfetch'),
      querystring = require('querystring');
exports.run = (client, message, args) => {

   var searchUrl = `https://www.google.com/search?q=site:https://myanimelist.net+${encodeURIComponent(message.content)}`;

   return snekfetch.get(searchUrl).then((result) => {

      var $ = cheerio.load(result.text);

      var googleData = $('.r').first().find('a').first().attr('href');

      googleData = querystring.parse(googleData.replace('/url?', ''));
      message.channel.send(`Result found!\n<${googleData.q}>`).catch(console.error);

  }).catch((err) => {
    message.channel.send(`No results found for ${encodeURIComponent(args.content)}`);
  });
}