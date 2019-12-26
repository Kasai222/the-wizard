exports.run = (client, message, args) => {
	  allowed = true;
  if(message.guild != null) {
	 if(message.guild.id == 274980577545945090) {
      message.react("387659429568577548");
      allowed = false;
    }
  }
	if(allowed) message.channel.send('https://i.imgur.com/XtAbocS.png');
};